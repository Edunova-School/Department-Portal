import { useMemo, useState } from "react";
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

type AttendanceStatus = "Good" | "Warning" | "Critical";

interface StudentAttendance {
  matricNumber: string;
  name: string;
  classesHeld: number;
  classesAttended: number;
  percentage: number;
}

interface CourseAttendance {
  id: number;
  courseCode: string;
  courseTitle: string;
  lecturer: string;
  programme: string;
  level: string;
  semester: string;
  classesHeld: number;
  totalStudents: number;
  averageAttendance: number;
  students: StudentAttendance[];
}

const initialAttendance: CourseAttendance[] = [
  {
    id: 1,
    courseCode: "SEN 101",
    courseTitle: "Introduction to Software Engineering",
    lecturer: "Dr. Samuel Adeyemi",
    programme: "Software Engineering",
    level: "100",
    semester: "First Semester",
    classesHeld: 12,
    totalStudents: 4,
    averageAttendance: 87.5,
    students: [
      {
        matricNumber: "EDU/SE/2026/001",
        name: "David Akinola",
        classesHeld: 12,
        classesAttended: 12,
        percentage: 100,
      },
      {
        matricNumber: "EDU/SE/2026/002",
        name: "Esther Oladipo",
        classesHeld: 12,
        classesAttended: 10,
        percentage: 83.3,
      },
      {
        matricNumber: "EDU/SE/2026/003",
        name: "Daniel Okafor",
        classesHeld: 12,
        classesAttended: 9,
        percentage: 75,
      },
      {
        matricNumber: "EDU/SE/2026/004",
        name: "Mary Johnson",
        classesHeld: 12,
        classesAttended: 11,
        percentage: 91.7,
      },
    ],
  },
  {
    id: 2,
    courseCode: "CSC 201",
    courseTitle: "Data Structures and Algorithms",
    lecturer: "Dr. Grace Oladipo",
    programme: "Computer Science",
    level: "200",
    semester: "First Semester",
    classesHeld: 10,
    totalStudents: 4,
    averageAttendance: 65,
    students: [
      {
        matricNumber: "EDU/CS/2025/014",
        name: "Michael Adewale",
        classesHeld: 10,
        classesAttended: 9,
        percentage: 90,
      },
      {
        matricNumber: "EDU/CS/2025/015",
        name: "Samuel Ojo",
        classesHeld: 10,
        classesAttended: 7,
        percentage: 70,
      },
      {
        matricNumber: "EDU/CS/2025/016",
        name: "Faith Adebayo",
        classesHeld: 10,
        classesAttended: 5,
        percentage: 50,
      },
      {
        matricNumber: "EDU/CS/2025/017",
        name: "Peter James",
        classesHeld: 10,
        classesAttended: 5,
        percentage: 50,
      },
    ],
  },
  {
    id: 3,
    courseCode: "IFT 301",
    courseTitle: "Database Management Systems",
    lecturer: "Mr. Michael Akinyemi",
    programme: "Information Technology",
    level: "300",
    semester: "First Semester",
    classesHeld: 14,
    totalStudents: 4,
    averageAttendance: 82.1,
    students: [
      {
        matricNumber: "EDU/IT/2024/008",
        name: "Grace Adebayo",
        classesHeld: 14,
        classesAttended: 13,
        percentage: 92.9,
      },
      {
        matricNumber: "EDU/IT/2024/009",
        name: "Peter James",
        classesHeld: 14,
        classesAttended: 12,
        percentage: 85.7,
      },
      {
        matricNumber: "EDU/IT/2024/010",
        name: "Esther Ojo",
        classesHeld: 14,
        classesAttended: 10,
        percentage: 71.4,
      },
      {
        matricNumber: "EDU/IT/2024/011",
        name: "Daniel James",
        classesHeld: 14,
        classesAttended: 11,
        percentage: 78.6,
      },
    ],
  },
  {
    id: 4,
    courseCode: "SEN 302",
    courseTitle: "Software Requirements Engineering",
    lecturer: "Mr. Joseph Ojo",
    programme: "Software Engineering",
    level: "300",
    semester: "First Semester",
    classesHeld: 11,
    totalStudents: 4,
    averageAttendance: 56.8,
    students: [
      {
        matricNumber: "EDU/SE/2024/009",
        name: "Joseph Ojo",
        classesHeld: 11,
        classesAttended: 10,
        percentage: 90.9,
      },
      {
        matricNumber: "EDU/SE/2024/010",
        name: "Deborah James",
        classesHeld: 11,
        classesAttended: 5,
        percentage: 45.5,
      },
      {
        matricNumber: "EDU/SE/2024/011",
        name: "Samuel Okafor",
        classesHeld: 11,
        classesAttended: 6,
        percentage: 54.5,
      },
      {
        matricNumber: "EDU/SE/2024/012",
        name: "Grace Johnson",
        classesHeld: 11,
        classesAttended: 4,
        percentage: 36.4,
      },
    ],
  },
  {
    id: 5,
    courseCode: "CSC 401",
    courseTitle: "Artificial Intelligence",
    lecturer: "Mr. Joseph Ojo",
    programme: "Computer Science",
    level: "400",
    semester: "Second Semester",
    classesHeld: 9,
    totalStudents: 4,
    averageAttendance: 88.9,
    students: [
      {
        matricNumber: "EDU/CS/2023/011",
        name: "Daniel Olawale",
        classesHeld: 9,
        classesAttended: 9,
        percentage: 100,
      },
      {
        matricNumber: "EDU/CS/2023/012",
        name: "Deborah Johnson",
        classesHeld: 9,
        classesAttended: 8,
        percentage: 88.9,
      },
      {
        matricNumber: "EDU/CS/2023/013",
        name: "Michael James",
        classesHeld: 9,
        classesAttended: 7,
        percentage: 77.8,
      },
      {
        matricNumber: "EDU/CS/2023/014",
        name: "Esther Samuel",
        classesHeld: 9,
        classesAttended: 8,
        percentage: 88.9,
      },
    ],
  },
];

const getAttendanceStatus = (percentage: number): AttendanceStatus => {
  if (percentage >= 75) return "Good";
  if (percentage >= 60) return "Warning";
  return "Critical";
};

const attendanceStyles: Record<AttendanceStatus, string> = {
  Good: "bg-green-50 text-green-700",
  Warning: "bg-amber-50 text-amber-700",
  Critical: "bg-red-50 text-red-700",
};

const Attendance = () => {
  const [attendance] = useState<CourseAttendance[]>(initialAttendance);
  const [searchTerm, setSearchTerm] = useState("");
  const [programmeFilter, setProgrammeFilter] = useState("All Programmes");
  const [levelFilter, setLevelFilter] = useState("All Levels");
  const [semesterFilter, setSemesterFilter] = useState("All Semesters");
  const [selectedCourse, setSelectedCourse] =
    useState<CourseAttendance | null>(null);
  const [studentSearch, setStudentSearch] = useState("");

  const allStudents = attendance.flatMap((course) => course.students);

  const totalClasses = attendance.reduce(
    (total, course) => total + course.classesHeld,
    0
  );

  const totalStudentRecords = allStudents.length;

  const overallAttendance =
    totalStudentRecords > 0
      ? allStudents.reduce((total, student) => total + student.percentage, 0) /
        totalStudentRecords
      : 0;

  const lowAttendanceCount = allStudents.filter(
    (student) => student.percentage < 60
  ).length;

  const filteredAttendance = useMemo(() => {
    return attendance.filter((course) => {
      const search = searchTerm.toLowerCase();

      const matchesSearch =
        course.courseCode.toLowerCase().includes(search) ||
        course.courseTitle.toLowerCase().includes(search) ||
        course.lecturer.toLowerCase().includes(search);

      const matchesProgramme =
        programmeFilter === "All Programmes" ||
        course.programme === programmeFilter;

      const matchesLevel =
        levelFilter === "All Levels" || course.level === levelFilter;

      const matchesSemester =
        semesterFilter === "All Semesters" ||
        course.semester === semesterFilter;

      return (
        matchesSearch &&
        matchesProgramme &&
        matchesLevel &&
        matchesSemester
      );
    });
  }, [
    attendance,
    searchTerm,
    programmeFilter,
    levelFilter,
    semesterFilter,
  ]);

  const filteredStudents =
    selectedCourse?.students.filter((student) => {
      const search = studentSearch.toLowerCase();

      return (
        student.name.toLowerCase().includes(search) ||
        student.matricNumber.toLowerCase().includes(search)
      );
    }) ?? [];

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
          <CalendarCheck size={17} className="text-[#B8901F]" />
          2026/2027 Academic Session
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
            {totalStudentRecords}
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
            {overallAttendance.toFixed(1)}%
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
            {totalClasses}
          </p>
          <p className="mt-1 text-sm text-gray-500">Class Sessions Recorded</p>
        </div>

        <div className="rounded-xl border border-gray-200 bg-white p-5">
          <div className="flex items-center justify-between">
            <div className="rounded-lg bg-red-50 p-2.5 text-red-700">
              <AlertTriangle size={21} />
            </div>
            <span className="text-xs text-gray-400">Below 60%</span>
          </div>
          <p className="mt-4 text-2xl font-bold text-[#0B1524]">
            {lowAttendanceCount}
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
                  "All Programmes",
                  "Software Engineering",
                  "Computer Science",
                  "Information Technology",
                ],
              },
              {
                value: levelFilter,
                setValue: setLevelFilter,
                options: ["All Levels", "100", "200", "300", "400", "500"],
              },
              {
                value: semesterFilter,
                setValue: setSemesterFilter,
                options: [
                  "All Semesters",
                  "First Semester",
                  "Second Semester",
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
                    <option key={option} value={option}>
                      {option}
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
                  <tr key={course.id} className="transition hover:bg-gray-50/70">
                    <td className="px-5 py-4">
                      <p className="font-semibold text-[#0B1524]">
                        {course.courseCode}
                      </p>
                      <p className="mt-1 text-sm text-gray-500">
                        {course.courseTitle}
                      </p>
                    </td>

                    <td className="px-5 py-4">
                      <p className="text-sm font-medium text-gray-700">
                        {course.programme}
                      </p>
                      <p className="mt-1 text-xs text-gray-500">
                        {course.level} Level
                      </p>
                    </td>

                    <td className="px-5 py-4 text-sm text-gray-600">
                      {course.lecturer}
                    </td>

                    <td className="px-5 py-4 text-sm text-gray-600">
                      {course.classesHeld}
                    </td>

                    <td className="px-5 py-4 text-sm text-gray-600">
                      {course.totalStudents}
                    </td>

                    <td className="px-5 py-4">
                      <div className="flex items-center gap-3">
                        <div className="h-2 w-20 overflow-hidden rounded-full bg-gray-100">
                          <div
                            className={`h-full rounded-full ${
                              course.averageAttendance >= 75
                                ? "bg-green-500"
                                : course.averageAttendance >= 60
                                  ? "bg-amber-500"
                                  : "bg-red-500"
                            }`}
                            style={{
                              width: `${course.averageAttendance}%`,
                            }}
                          />
                        </div>
                        <span className="text-sm font-medium text-gray-700">
                          {course.averageAttendance}%
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
            Showing {filteredAttendance.length} of {attendance.length} courses
          </p>
          <p>Sample attendance records</p>
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
                  {selectedCourse.courseCode} — {selectedCourse.courseTitle}
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
                    {selectedCourse.programme}
                  </p>
                </div>

                <div>
                  <p className="text-xs text-gray-500">Level</p>
                  <p className="mt-1 text-sm font-medium text-[#0B1524]">
                    {selectedCourse.level} Level
                  </p>
                </div>

                <div>
                  <p className="text-xs text-gray-500">Lecturer</p>
                  <p className="mt-1 text-sm font-medium text-[#0B1524]">
                    {selectedCourse.lecturer}
                  </p>
                </div>

                <div>
                  <p className="text-xs text-gray-500">Classes Held</p>
                  <p className="mt-1 text-sm font-medium text-[#0B1524]">
                    {selectedCourse.classesHeld}
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

              <div className="overflow-x-auto rounded-lg border border-gray-200">
                <table className="w-full min-w-[650px] text-left">
                  <thead className="bg-gray-50">
                    <tr className="text-xs font-semibold uppercase text-gray-500">
                      <th className="px-4 py-3">Student</th>
                      <th className="px-4 py-3">Classes Held</th>
                      <th className="px-4 py-3">Attended</th>
                      <th className="px-4 py-3">Attendance</th>
                      <th className="px-4 py-3">Status</th>
                    </tr>
                  </thead>

                  <tbody className="divide-y divide-gray-100">
                    {filteredStudents.length > 0 ? (
                      filteredStudents.map((student) => {
                        const status = getAttendanceStatus(
                          student.percentage
                        );

                        return (
                          <tr key={student.matricNumber}>
                            <td className="px-4 py-3">
                              <p className="text-sm font-medium text-[#0B1524]">
                                {student.name}
                              </p>
                              <p className="mt-1 text-xs text-gray-500">
                                {student.matricNumber}
                              </p>
                            </td>

                            <td className="px-4 py-3 text-sm text-gray-600">
                              {student.classesHeld}
                            </td>

                            <td className="px-4 py-3 text-sm text-gray-600">
                              {student.classesAttended}
                            </td>

                            <td className="px-4 py-3 text-sm font-medium text-gray-700">
                              {student.percentage}%
                            </td>

                            <td className="px-4 py-3">
                              <span
                                className={`rounded-full px-2.5 py-1 text-xs font-medium ${attendanceStyles[status]}`}
                              >
                                {status}
                              </span>
                            </td>
                          </tr>
                        );
                      })
                    ) : (
                      <tr>
                        <td
                          colSpan={5}
                          className="px-4 py-8 text-center text-sm text-gray-500"
                        >
                          No student records found.
                        </td>
                      </tr>
                    )}
                  </tbody>
                </table>
              </div>

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