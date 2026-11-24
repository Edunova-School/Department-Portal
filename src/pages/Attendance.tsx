import { useEffect, useState } from "react";
import {
  getHodAttendanceFilterOptions,
  getHodAttendanceOverview,
  getHodCourseAttendance,
  getHodCourseAttendanceDetails,
} from "../lib/api";
import {
  Search,
  CalendarCheck,
  Users,
  AlertTriangle,
  TrendingUp,
  Eye,
  X,
  ChevronDown,
} from "lucide-react";
interface AttendanceFilterOptions {
  academic_sessions: {
    id: string;
    name: string;
    is_current: boolean;
  }[];
  levels: number[];
  programmes: {
    id: string;
    name: string;
    code: string;
  }[];
  semesters: {
    id: string;
    name: string;
  }[];
}
interface AttendanceOverview {
  academic_session: {
    id: string;
    name: string;
  };
  statistics: {
    attendance_threshold: number;
    average_attendance: number | null;
    low_attendance_records: number;
    total_class_sessions: number;
    total_courses: number;
    total_student_records: number;
  };
}
interface AttendanceCourse {
  course_id: string;
  course_offering_id: string;
  course_code: string;
  course_title: string;
  lecturer: {
    id: string;
    first_name: string;
    last_name: string;
    full_name: string;
  } | null;
  level: number;
  programme: {
    id: string;
    name: string;
    code: string;
  };
  semester: {
    id: string;
    name: string;
  };
  average_attendance: number | null;
  low_attendance_count: number;
  status: string;
  total_sessions: number;
  total_students: number;
}
interface AttendanceCourseDetails {
  course: {
    academic_session: string;
    attendance_threshold: number;
    average_attendance: number | null;
    course_code: string;
    course_offering_id: string;
    course_title: string;
    lecturer: string;
    level: number;
    low_attendance_count: number;
    programme: string;
    semester: string;
    total_sessions: number;
    total_students: number;
  };
  sessions: any[];
  students: any[];
}
const Attendance = () => {
  const [filterOptions, setFilterOptions] =
  useState<AttendanceFilterOptions | null>(null);
  const [selectedSession, setSelectedSession] = useState("");
  const [overview, setOverview] = useState<AttendanceOverview | null>(null);
  const [courses, setCourses] = useState<AttendanceCourse[]>([]);

    useEffect(() => {
  const fetchFilterOptions = async () => {
    try {
      const response = await getHodAttendanceFilterOptions();
      const options = response.data;
      setFilterOptions(options);
      const currentSession = options.academic_sessions.find(
        (session: AttendanceFilterOptions["academic_sessions"][number]) =>
          session.is_current
      );

      if (currentSession) {
        setSelectedSession(currentSession.id);
      }
    } catch (error) {
      console.error(
        "FAILED TO FETCH ATTENDANCE FILTER OPTIONS:",
        error
      );
    }
  };

  fetchFilterOptions();
}, []);
useEffect(() => {
  if (!selectedSession) return;

  const fetchAttendanceOverview = async () => {
    try {
      const response = await getHodAttendanceOverview({
        academic_session_id: selectedSession,
        threshold: 60,
      });
      setOverview(response.data);
    } catch (error) {
      console.error(
        "FAILED TO FETCH ATTENDANCE OVERVIEW:",
        error
      );
    }
  };

  fetchAttendanceOverview();
}, [selectedSession]);
useEffect(() => {
  if (!selectedSession) return;

  const fetchCourseAttendance = async () => {
    try {
      const response = await getHodCourseAttendance({
        academic_session_id: selectedSession,
        threshold: 60,
      });
      setCourses(response.data.courses);
    } catch (error) {
      console.error(
        "FAILED TO FETCH COURSE ATTENDANCE:",
        error
      );
    }
  };

  fetchCourseAttendance();
}, [selectedSession]);

  const [searchTerm, setSearchTerm] = useState("");
  const [programmeFilter, setProgrammeFilter] = useState("All Programmes");
  const [levelFilter, setLevelFilter] = useState("All Levels");
  const [semesterFilter, setSemesterFilter] = useState("All Semesters");
  const [selectedCourse, setSelectedCourse] =
  useState<AttendanceCourse | null>(null);
  const [courseDetails, setCourseDetails] =
  useState<AttendanceCourseDetails | null>(null);
  const [loadingCourseDetails, setLoadingCourseDetails] =
  useState(false);
  const [studentSearch, setStudentSearch] = useState("");
  useEffect(() => {
  if (!selectedCourse || !selectedSession) {
    setCourseDetails(null);
    return;
  }

  const fetchCourseDetails = async () => {
    try {
      setLoadingCourseDetails(true);
      setCourseDetails(null);

      const response = await getHodCourseAttendanceDetails(
        selectedCourse.course_offering_id,
        {
          academic_session_id: selectedSession,
          threshold: 60,
        }
      );
      setCourseDetails(response.data);
    } catch (error) {
      console.error(
        "FAILED TO FETCH INDIVIDUAL COURSE ATTENDANCE:",
        error
      );
    } finally {
      setLoadingCourseDetails(false);
    }
  };

  fetchCourseDetails();
}, [selectedCourse, selectedSession]);
  const filteredAttendance = courses.filter((course) => {
  const matchesSearch =
    course.course_code
      .toLowerCase()
      .includes(searchTerm.toLowerCase()) ||
    course.course_title
      .toLowerCase()
      .includes(searchTerm.toLowerCase()) ||
    course.lecturer?.full_name
      .toLowerCase()
      .includes(searchTerm.toLowerCase());

  const matchesProgramme =
    programmeFilter === "All Programmes" ||
    course.programme.id === programmeFilter;

  const matchesLevel =
    levelFilter === "All Levels" ||
    String(course.level) === levelFilter;

  const matchesSemester =
    semesterFilter === "All Semesters" ||
    course.semester.id === semesterFilter;

  return (
    matchesSearch &&
    matchesProgramme &&
    matchesLevel &&
    matchesSemester
  );
});

  const clearFilters = () => {
    setSearchTerm("");
    setProgrammeFilter("All Programmes");
    setLevelFilter("All Levels");
    setSemesterFilter("All Semesters");
  };

  const hasActiveFilters =
    searchTerm !== "" ||
    programmeFilter !== "All Programmes" ||
    levelFilter !== "All Levels" ||
    semesterFilter !== "All Semesters";

  return (
    <div className="space-y-6">
      {/* Page Heading */}
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-2xl font-bold text-[#0B1524]">
            Attendance Management
          </h1>
          <p className="mt-1 text-sm text-gray-500">
            Monitor class attendance and identify students who may need
            attention.
          </p>
        </div>

        <div className="flex items-center gap-2 rounded-lg border border-gray-200 bg-white px-4 py-2.5 text-sm text-gray-600">
          <CalendarCheck size={17} className="shrink-0 text-[#B8901F]" />

          <select
            value={selectedSession}
            onChange={(e) => setSelectedSession(e.target.value)}
            className="bg-transparent text-sm outline-none"
          >
            {filterOptions?.academic_sessions.map((session) => (
              <option key={session.id} value={session.id}>
                {session.name} Academic Session
              </option>
            ))}
          </select>
        </div>
      </div>

      {/* Statistics */}
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-4">
        <div className="rounded-xl border border-gray-200 bg-white p-5">
          <div className="flex items-center justify-between">
            <div className="rounded-lg bg-blue-50 p-2.5 text-blue-700">
              <Users size={21} />
            </div>
            <span className="text-xs text-gray-400">Across sample records</span>
          </div>
          <p className="mt-4 text-2xl font-bold text-[#0B1524]">
            {overview?.statistics.total_student_records ?? 0}
          </p>
          <p className="mt-1 text-sm text-gray-500">Student Records</p>
        </div>

        <div className="rounded-xl border border-gray-200 bg-white p-5">
          <div className="flex items-center justify-between">
            <div className="rounded-lg bg-green-50 p-2.5 text-green-700">
              <TrendingUp size={21} />
            </div>
            <span className="text-xs text-gray-400">Average across records</span>
          </div>
          <p className="mt-4 text-2xl font-bold text-[#0B1524]">
            {overview?.statistics.average_attendance != null
  ? `${overview.statistics.average_attendance.toFixed(1)}%`
  : "—"}
          </p>
          <p className="mt-1 text-sm text-gray-500">Average Attendance</p>
        </div>

        <div className="rounded-xl border border-gray-200 bg-white p-5">
          <div className="flex items-center justify-between">
            <div className="rounded-lg bg-purple-50 p-2.5 text-purple-700">
              <CalendarCheck size={21} />
            </div>
            <span className="text-xs text-gray-400">Across listed courses</span>
          </div>
          <p className="mt-4 text-2xl font-bold text-[#0B1524]">
            {overview?.statistics.total_class_sessions ?? 0}
          </p>
          <p className="mt-1 text-sm text-gray-500">Class Sessions Recorded</p>
        </div>

        <div className="rounded-xl border border-gray-200 bg-white p-5">
          <div className="flex items-center justify-between">
            <div className="rounded-lg bg-red-50 p-2.5 text-red-700">
              <AlertTriangle size={21} />
            </div>
            <span className="text-xs text-gray-400">Below {overview?.statistics.attendance_threshold ?? 60}%</span>
          </div>
          <p className="mt-4 text-2xl font-bold text-[#0B1524]">
            {overview?.statistics.low_attendance_records ?? 0}
          </p>
          <p className="mt-1 text-sm text-gray-500">Low Attendance Records</p>
        </div>
      </div>

      {/* Attendance Notice */}
      <div className="flex items-start gap-3 rounded-xl border border-amber-200 bg-amber-50 p-4">
        <AlertTriangle size={19} className="mt-0.5 shrink-0 text-amber-600" />
        <div>
          <p className="text-sm font-semibold text-amber-800">
            Attendance Monitoring
          </p>
          <p className="mt-1 text-sm leading-6 text-amber-700">
            Students with attendance below 60% are flagged for attention in
            this demonstration. Actual warning and eligibility thresholds
            should follow the institution's approved academic regulations.
          </p>
        </div>
      </div>

      {/* Course Attendance */}
      <div className="overflow-hidden rounded-xl border border-gray-200 bg-white">
        <div className="border-b border-gray-100 p-5">
          <div className="flex flex-col gap-3 lg:flex-row lg:items-center lg:justify-between">
            <div>
              <h2 className="font-semibold text-[#0B1524]">
                Course Attendance Overview
              </h2>
              <p className="mt-1 text-sm text-gray-500">
                Attendance summaries submitted by course lecturers.
              </p>
            </div>

            <div className="relative w-full lg:max-w-xs">
              <Search
                size={18}
                className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400"
              />
              <input
                type="text"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                placeholder="Search course or lecturer..."
                className="w-full rounded-lg border border-gray-200 py-2.5 pl-10 pr-4 text-sm outline-none transition focus:border-[#1E3A8A]"
              />
            </div>
          </div>

          <div className="mt-5 flex flex-wrap items-center gap-3">
            {[
  {
    value: programmeFilter,
    setValue: setProgrammeFilter,
    options: [
      { value: "All Programmes", label: "All Programmes" },
      ...(filterOptions?.programmes.map((programme) => ({
        value: programme.id,
        label: programme.name,
      })) ?? []),
    ],
  },
  {
    value: levelFilter,
    setValue: setLevelFilter,
    options: [
      { value: "All Levels", label: "All Levels" },
      ...(filterOptions?.levels.map((level) => ({
        value: String(level),
        label: `${level} Level`,
      })) ?? []),
    ],
  },
  {
    value: semesterFilter,
    setValue: setSemesterFilter,
    options: [
      { value: "All Semesters", label: "All Semesters" },
      ...(filterOptions?.semesters.map((semester) => ({
        value: semester.id,
        label: semester.name,
      })) ?? []),
    ],
  },
].map((filter, index) => (
              <div key={index} className="relative">
                <select
                  value={filter.value}
                  onChange={(e) => filter.setValue(e.target.value)}
                  className="appearance-none rounded-lg border border-gray-200 bg-white py-2 pl-3 pr-9 text-sm text-gray-600 outline-none focus:border-[#1E3A8A]"
                >
                  {filter.options.map((option) => (
                    <option key={option.value} value={option.value}>
                      {option.label}
                    </option>
                  ))}
                </select>
                <ChevronDown
                  size={15}
                  className="pointer-events-none absolute right-3 top-1/2 -translate-y-1/2 text-gray-400"
                />
              </div>
            ))}

            {hasActiveFilters && (
              <button
                type="button"
                onClick={clearFilters}
                className="text-sm font-medium text-[#1E3A8A] hover:underline"
              >
                Clear filters
              </button>
            )}
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full min-w-[900px] text-left">
            <thead className="bg-gray-50">
              <tr className="text-xs font-semibold uppercase tracking-wide text-gray-500">
                <th className="px-5 py-4">Course</th>
                <th className="px-5 py-4">Programme / Level</th>
                <th className="px-5 py-4">Lecturer</th>
                <th className="px-5 py-4">Classes Held</th>
                <th className="px-5 py-4">Students</th>
                <th className="px-5 py-4">Average Attendance</th>
                <th className="px-5 py-4 text-right">Action</th>
              </tr>
            </thead>

            <tbody className="divide-y divide-gray-100">
              {filteredAttendance.length > 0 ? (
                filteredAttendance.map((course) => (
                  <tr key={course.course_offering_id} className="transition hover:bg-gray-50/70">
                    <td className="px-5 py-4">
                      <p className="font-semibold text-[#0B1524]">
                        {course.course_code}
                      </p>
                      <p className="mt-1 text-sm text-gray-500">
                        {course.course_title}
                      </p>
                    </td>

                    <td className="px-5 py-4">
                      <p className="text-sm font-medium text-gray-700">
                        {course.programme.name}
                      </p>
                      <p className="mt-1 text-xs text-gray-500">
                        {course.level} Level
                      </p>
                    </td>

                    <td className="px-5 py-4 text-sm text-gray-600">
                      {course.lecturer?.full_name ?? "Not assigned"}
                    </td>

                    <td className="px-5 py-4 text-sm text-gray-600">
                      {course.total_sessions}
                    </td>

                    <td className="px-5 py-4 text-sm text-gray-600">
                      {course.total_students}
                    </td>

                    <td className="px-5 py-4">
                      <div className="flex items-center gap-3">
                        <div className="h-2 w-20 overflow-hidden rounded-full bg-gray-100">
                          <div
                            className="h-full rounded-full bg-[#B8901F]"
                            style={{
                              width: `${
                                course.average_attendance !== null
                                  ? Math.min(course.average_attendance, 100)
                                  : 0
                              }%`,
                            }}
                          />
                        </div>

                        <span className="text-sm font-medium text-gray-700">
                          {course.average_attendance !== null
                            ? `${course.average_attendance.toFixed(1)}%`
                            : "—"}
                        </span>
                      </div>
                    </td>

                    <td className="px-5 py-4 text-right">
                      <button
                        type="button"
                        onClick={() => {
  setSelectedCourse(course);
  setStudentSearch("");
}}
                        className="inline-flex items-center gap-2 rounded-lg border border-gray-200 px-3 py-2 text-sm font-medium text-[#1E3A8A] transition hover:border-[#1E3A8A] hover:bg-blue-50"
                      >
                        <Eye size={15} />
                        View
                      </button>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td
                    colSpan={7}
                    className="px-5 py-12 text-center text-sm text-gray-500"
                  >
                    No attendance records match your search or selected filters.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>

        <div className="flex flex-col gap-2 border-t border-gray-100 px-5 py-4 text-sm text-gray-500 sm:flex-row sm:items-center sm:justify-between">
          <p>
          Showing {filteredAttendance.length} of {courses.length} courses
        </p>
        <p>Attendance records for the selected academic session</p>
        </div>
      </div>

      {/* Course Attendance Details */}
      {selectedCourse && (
        <div className="fixed inset-0 z-50 flex items-center justify-center overflow-y-auto bg-black/50 p-4">
          <div className="my-auto w-full max-w-3xl overflow-hidden rounded-xl bg-white shadow-xl">
            <div className="flex items-start justify-between border-b border-gray-100 p-5">
              <div>
                <h2 className="text-lg font-semibold text-[#0B1524]">
                  Attendance Details
                </h2>
                <p className="mt-1 text-sm text-gray-500">
                  {courseDetails?.course.course_code ?? selectedCourse.course_code} — {courseDetails?.course.course_title ?? selectedCourse.course_title}
                </p>
              </div>

              <button
                type="button"
                onClick={() => setSelectedCourse(null)}
                className="rounded-lg p-1.5 text-gray-400 transition hover:bg-gray-100 hover:text-gray-700"
                aria-label="Close modal"
              >
                <X size={20} />
              </button>
            </div>

            <div className="max-h-[75vh] space-y-5 overflow-y-auto p-5">
              <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
                <div>
                  <p className="text-xs text-gray-500">Programme</p>
                  <p className="mt-1 text-sm font-medium text-[#0B1524]">
                    {courseDetails?.course.programme ?? selectedCourse.programme.name}
                  </p>
                </div>

                <div>
                  <p className="text-xs text-gray-500">Level</p>
                  <p className="mt-1 text-sm font-medium text-[#0B1524]">
                    {courseDetails?.course.level ?? selectedCourse.level} Level
                  </p>
                </div>

                <div>
                  <p className="text-xs text-gray-500">Lecturer</p>
                  <p className="mt-1 text-sm font-medium text-[#0B1524]">
                    {courseDetails?.course.lecturer ?? selectedCourse.lecturer?.full_name ?? "Not assigned"}
                  </p>
                </div>

                <div>
                  <p className="text-xs text-gray-500">Classes Held</p>
                  <p className="mt-1 text-sm font-medium text-[#0B1524]">
                    {courseDetails?.course.total_sessions ?? selectedCourse.total_sessions}
                  </p>
                </div>
              </div>

              <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
                <h3 className="font-semibold text-[#0B1524]">
                  Student Attendance Records
                </h3>

                <div className="relative w-full sm:max-w-xs">
                  <Search
                    size={16}
                    className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400"
                  />
                  <input
                    type="text"
                    value={studentSearch}
                    onChange={(e) => setStudentSearch(e.target.value)}
                    placeholder="Search student..."
                    className="w-full rounded-lg border border-gray-200 py-2 pl-9 pr-3 text-sm outline-none focus:border-[#1E3A8A]"
                  />
                </div>
              </div>

              {loadingCourseDetails ? (
                  <div className="py-10 text-center text-sm text-gray-500">
                    Loading student attendance records...
                  </div>
                ) : courseDetails?.students.length ? (
                  <div className="py-10 text-center text-sm text-gray-500">
                    Student records are available.
                  </div>
                ) : (
                  <div className="rounded-lg border border-gray-200 px-4 py-10 text-center">
                    <Users size={28} className="mx-auto text-gray-300" />

                    <p className="mt-3 text-sm font-medium text-gray-700">
                      No student attendance records
                    </p>

                    <p className="mt-1 text-sm text-gray-500">
                      Attendance records will appear here once lecturers begin recording
                      attendance for this course.
                    </p>
                  </div>
                )}

              <div className="flex justify-end border-t border-gray-100 pt-4">
                <button
                  type="button"
                  onClick={() => setSelectedCourse(null)}
                  className="rounded-lg border border-gray-200 px-4 py-2.5 text-sm font-medium text-gray-600 transition hover:bg-gray-50"
                >
                  Close
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
export default Attendance;