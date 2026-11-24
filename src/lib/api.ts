const BASE_URL =
  import.meta.env.VITE_API_BASE_URL ||
  "https://edunova-backend-stn1.onrender.com/api/v1";

const TOKEN_KEY = "edunova_department_token";
const REFRESH_TOKEN_KEY = "edunova_department_refresh_token";
const ROLE_KEY = "edunova_department_role";
export const getToken = () => {
  return sessionStorage.getItem(TOKEN_KEY);
};
export const getRefreshToken = () => {
  return sessionStorage.getItem(REFRESH_TOKEN_KEY);
};
export const setSession = (
  accessToken: string,
  role?: string,
  refreshToken?: string
) => {
  sessionStorage.setItem(TOKEN_KEY, accessToken);

  if (refreshToken) {
    sessionStorage.setItem(REFRESH_TOKEN_KEY, refreshToken);
  }

  if (role) {
    sessionStorage.setItem(ROLE_KEY, role);
  }
};
export const clearSession = () => {
  sessionStorage.removeItem(TOKEN_KEY);
  sessionStorage.removeItem(REFRESH_TOKEN_KEY);
  sessionStorage.removeItem(ROLE_KEY);
};
export const getRole = () => {
  return sessionStorage.getItem(ROLE_KEY);
};

interface ApiOptions extends RequestInit {
  auth?: boolean;
}

let refreshPromise: Promise<string> | null = null;

const refreshAccessToken = async (): Promise<string> => {
  const refreshToken = getRefreshToken();

  if (!refreshToken) {
    throw new Error("No refresh token available.");
  }

  const response = await fetch(`${BASE_URL}/auth/refresh`, {
    method: "POST",
    headers: {
      Authorization: `Bearer ${refreshToken}`,
    },
  });

  const data = await response.json();

  if (!response.ok || !data?.success || !data?.data?.access_token) {
    throw new Error(
      data?.message || "Unable to refresh your session."
    );
  }

  const newAccessToken = data.data.access_token;

  setSession(newAccessToken, getRole() ?? undefined, refreshToken);

  return newAccessToken;
};

export const apiFetch = async (
  path: string,
  options: ApiOptions = {}
): Promise<any> => {
  const { auth = true, headers, ...rest } = options;

  const sendRequest = async (token?: string) => {
    const finalHeaders = new Headers(headers);

    if (rest.body && !(rest.body instanceof FormData)) {
      finalHeaders.set("Content-Type", "application/json");
    }

    if (auth && token) {
      finalHeaders.set("Authorization", `Bearer ${token}`);
    }

    return fetch(`${BASE_URL}${path}`, {
      ...rest,
      headers: finalHeaders,
    });
  };

  let response = await sendRequest(getToken() ?? undefined);

  if (response.status === 401 && auth && path !== "/auth/refresh") {
    try {
      if (!refreshPromise) {
        refreshPromise = refreshAccessToken().finally(() => {
          refreshPromise = null;
        });
      }

      const newAccessToken = await refreshPromise;

      response = await sendRequest(newAccessToken);

      if (response.status === 401) {
        throw new Error("Your session has expired. Please log in again.");
      }
    } catch (error) {
      console.error("SESSION REFRESH FAILED:", error);

      clearSession();

      if (window.location.pathname !== "/") {
        window.location.assign("/");
      }

      throw error;
    }
  }

  let data: any = null;

  try {
    data = await response.json();
  } catch {
    data = null;
  }

  if (!response.ok) {
    console.error("API ERROR DETAILS:", {
      status: response.status,
      url: response.url,
      response: data,
    });

    throw new Error(
      data?.message ||
      data?.error ||
      data?.msg ||
      `Request failed (${response.status})`
    );
  }

  return data;
};

export interface HODLoginPayload {
  email: string;
  password: string;
}

export const hodLogin = (payload: HODLoginPayload) =>
  apiFetch("/hod/login", {
    method: "POST",
    auth: false,
    body: JSON.stringify(payload),
  });

export const getHodResultsOverview = (academicYear: string) =>
  apiFetch(
    `/hod/results/overview?academic_year=${encodeURIComponent(academicYear)}`
  );
export const getHodResultFilterOptions = (academicYear: string) =>
  apiFetch(
    `/hod/results/filter-options?academic_year=${encodeURIComponent(academicYear)}`
  );

export interface HODResultsParams {
  academic_year?: string;
  status?: string;
  programme_id?: string;
  semester_id?: string;
  page?: number;
  per_page?: number;
}
export const getHodResults = (params: HODResultsParams = {}) => {
  const query = new URLSearchParams();

  Object.entries(params).forEach(([key, value]) => {
    if (value !== undefined && value !== "") {
      query.append(key, String(value));
    }
  });

  const queryString = query.toString();

  return apiFetch(
    `/hod/results${queryString ? `?${queryString}` : ""}`
  );
};

// Retrieve an individual result submission
export const getHodResultDetails = (submissionId: string | number) =>
  apiFetch(`/hod/results/${submissionId}`);

// Start reviewing a course result
export const startHodResultReview = (
  courseOfferingId: string,
  academicYear: string
) =>
  apiFetch(
    `/hod/results/courses/${courseOfferingId}/start-review?academic_year=${encodeURIComponent(academicYear)}`,
    {
      method: "POST",
    }
  );

// Submit a result review
export const submitHodResultReview = (
  courseOfferingId: string,
  payload: {
    [key: string]: any;
  },
  academicYear: string
) =>
  apiFetch(
    `/hod/results/courses/${courseOfferingId}/review?academic_year=${encodeURIComponent(academicYear)}`,
    {
      method: "POST",
      body: JSON.stringify(payload),
    }
  );
  
// HOD Dashboard
export const getHodDashboard = () =>
  apiFetch("/hod/dashboard");

export interface HODStudentsParams {
  programme_id?: string;
  level?: string | number;
  status?: string;
}

export const getHodStudents = (
  params: HODStudentsParams = {}
) => {
  const query = new URLSearchParams();

  Object.entries(params).forEach(([key, value]) => {
    if (value !== undefined && value !== "") {
      query.append(key, String(value));
    }
  });

  const queryString = query.toString();

  return apiFetch(
    `/hod/students${queryString ? `?${queryString}` : ""}`,
    {
      method: "GET",
    }
  );
};
export const getHodStudentsOverview = () =>
  apiFetch("/hod/students/overview", {
    method: "GET",
  });
export interface HODAttendanceOverviewParams {
  academic_session_id?: string;
  threshold?: number;
}

export const getHodAttendanceOverview = (
  params: HODAttendanceOverviewParams = {}
) => {
  const query = new URLSearchParams();

  Object.entries(params).forEach(([key, value]) => {
    if (value !== undefined && value !== "") {
      query.append(key, String(value));
    }
  });

  const queryString = query.toString();

  return apiFetch(
    `/hod/attendance/overview${queryString ? `?${queryString}` : ""}`
  );
};

export interface HODCourseAttendanceParams {
  academic_session_id?: string;
  programme_id?: string;
  level?: string | number;
  semester_id?: string;
  threshold?: number;
  page?: number;
  per_page?: number;
}

export const getHodCourseAttendance = (
  params: HODCourseAttendanceParams = {}
) => {
  const query = new URLSearchParams();

  Object.entries(params).forEach(([key, value]) => {
    if (value !== undefined && value !== "") {
      query.append(key, String(value));
    }
  });

  const queryString = query.toString();

  return apiFetch(
    `/hod/attendance/courses${queryString ? `?${queryString}` : ""}`
  );
};

export const getHodCourseAttendanceDetails = (
  courseOfferingId: string,
  params: HODAttendanceOverviewParams = {}
) => {
  const query = new URLSearchParams();

  Object.entries(params).forEach(([key, value]) => {
    if (value !== undefined && value !== "") {
      query.append(key, String(value));
    }
  });

  const queryString = query.toString();

  return apiFetch(
    `/hod/attendance/courses/${courseOfferingId}${queryString ? `?${queryString}` : ""
    }`
  );
};

export const getHodAttendanceFilterOptions = async () => {
  return apiFetch("/hod/attendance/filter-options", {
    method: "GET",
  });
};
export const getHodRequestsOverview = async (
  academicSessionId: string
) => {
  return apiFetch(
    `/hod/requests/overview?academic_session_id=${encodeURIComponent(academicSessionId)}`,
    {
      method: "GET",
    }
  );
};
export const getHodRequests = async (
  academicSessionId: string
) => {
  return apiFetch(
    `/hod/requests?academic_session_id=${encodeURIComponent(academicSessionId)}`,
    {
      method: "GET",
    }
  );
};

export const getHodStaffOverview = () =>
  apiFetch("/hod/staff/overview", {
    method: "GET",
  });

export interface HODStaffParams {
  status?: string;
  designation?: string;
}

export const getHodStaff = (params: HODStaffParams = {}) => {
  const query = new URLSearchParams();

  Object.entries(params).forEach(([key, value]) => {
    if (value !== undefined && value !== "") {
      query.append(key, value);
    }
  });

  const queryString = query.toString();

  return apiFetch(
    `/hod/staff${queryString ? `?${queryString}` : ""}`,
    {
      method: "GET",
    }
  );
};
// HOD Course Management

export interface HODCoursesParams {
  academic_session_id: string;
  level?: string | number;
  status?: string;
  semester_id?: string;
}

export const getHodCoursesOverview = (
  academicSessionId: string
) =>
  apiFetch(
    `/hod/courses/overview?academic_session_id=${encodeURIComponent(academicSessionId)}`
  );

export const getHodCourses = (
  params: HODCoursesParams
) => {
  const query = new URLSearchParams();

  Object.entries(params).forEach(([key, value]) => {
    if (value !== undefined && value !== "") {
      query.append(key, String(value));
    }
  });

  return apiFetch(`/hod/courses?${query.toString()}`);
};

export const getHodCourseDetails = (
  offeringId: string,
  academicSessionId: string
) =>
  apiFetch(
    `/hod/courses/${offeringId}?academic_session_id=${encodeURIComponent(academicSessionId)}`
  );

export const getHodLecturers = () =>
  apiFetch("/hod/courses/lecturers");

export const assignHodCourseLecturer = (
  offeringId: string,
  payload: {
    academic_session_id: string;
    lecturer_user_id: string;
  }
) =>
  apiFetch(`/hod/courses/${offeringId}/lecturer`, {
    method: "PATCH",
    body: JSON.stringify(payload),
  });

export const removeHodCourseLecturer = (
  offeringId: string,
  academicSessionId: string
) =>
  apiFetch(`/hod/courses/${offeringId}/lecturer`, {
    method: "DELETE",
    body: JSON.stringify({
      academic_session_id: academicSessionId,
    }),
  });