import { useMemo, useState } from "react";
import {
  BookOpen,
  Search,
  Users,
  UserCheck,
  GraduationCap,
  X,
  ChevronDown,
  Pencil,
} from "lucide-react";

type CourseStatus = "Active" | "Inactive";

interface Course {
  id: number;
  code: string;
  title: string;
  programme: string;
  level: string;
  semester: string;
  creditUnits: number;
  lecturer: string | null;
  status: CourseStatus;
}

const initialCourses: Course[] = [
  {
    id: 1,
    code: "SEN 101",
    title: "Introduction to Software Engineering",
    programme: "Software Engineering",
    level: "100",
    semester: "First Semester",
    creditUnits: 3,
    lecturer: "Dr. Samuel Adeyemi",
    status: "Active",
  },
  {
    id: 2,
    code: "SEN 102",
    title: "Introduction to Programming",
    programme: "Software Engineering",
    level: "100",
    semester: "First Semester",
    creditUnits: 3,
    lecturer: "Mr. Michael Akinyemi",
    status: "Active",
  },
  {
    id: 3,
    code: "CSC 201",
    title: "Data Structures and Algorithms",
    programme: "Computer Science",
    level: "200",
    semester: "First Semester",
    creditUnits: 3,
    lecturer: "Dr. Grace Oladipo",
    status: "Active",
  },
  {
    id: 4,
    code: "SEN 202",
    title: "Object-Oriented Programming",
    programme: "Software Engineering",
    level: "200",
    semester: "Second Semester",
    creditUnits: 3,
    lecturer: "Mr. Joseph Ojo",
    status: "Active",
  },
  {
    id: 5,
    code: "IFT 301",
    title: "Database Management Systems",
    programme: "Information Technology",
    level: "300",
    semester: "First Semester",
    creditUnits: 3,
    lecturer: "Mr. Michael Akinyemi",
    status: "Active",
  },
  {
    id: 6,
    code: "SEN 302",
    title: "Software Requirements Engineering",
    programme: "Software Engineering",
    level: "300",
    semester: "First Semester",
    creditUnits: 2,
    lecturer: null,
    status: "Active",
  },
  {
    id: 7,
    code: "CSC 401",
    title: "Artificial Intelligence",
    programme: "Computer Science",
    level: "400",
    semester: "Second Semester",
    creditUnits: 3,
    lecturer: "Mr. Joseph Ojo",
    status: "Active",
  },
  {
    id: 8,
    code: "SEN 402",
    title: "Software Project Management",
    programme: "Software Engineering",
    level: "400",
    semester: "Second Semester",
    creditUnits: 2,
    lecturer: null,
    status: "Active",
  },
  {
    id: 9,
    code: "IFT 202",
    title: "Computer Networks",
    programme: "Information Technology",
    level: "200",
    semester: "Second Semester",
    creditUnits: 3,
    lecturer: "Dr. Esther Adebayo",
    status: "Active",
  },
  {
    id: 10,
    code: "CSC 302",
    title: "Operating Systems",
    programme: "Computer Science",
    level: "300",
    semester: "Second Semester",
    creditUnits: 3,
    lecturer: null,
    status: "Inactive",
  },
];

const lecturers = [
  "Dr. Samuel Adeyemi",
  "Dr. Grace Oladipo",
  "Mr. Michael Akinyemi",
  "Mrs. Deborah Johnson",
  "Mr. Joseph Ojo",
  "Dr. Esther Adebayo",
  "Mr. Daniel Olawale",
];

const programmeOptions = [
  "Software Engineering",
  "Computer Science",
  "Information Technology",
];

const Courses = () => {
  const [courses, setCourses] = useState<Course[]>(initialCourses);
  const [searchTerm, setSearchTerm] = useState("");
  const [programmeFilter, setProgrammeFilter] = useState("All Programmes");
  const [levelFilter, setLevelFilter] = useState("All Levels");
  const [semesterFilter, setSemesterFilter] = useState("All Semesters");
  const [statusFilter, setStatusFilter] = useState("All Statuses");

  const [selectedCourse, setSelectedCourse] = useState<Course | null>(null);
  const [selectedLecturer, setSelectedLecturer] = useState("");
  const [showAssignmentModal, setShowAssignmentModal] = useState(false);

  const totalCourses = courses.length;
  const activeCourses = courses.filter(
    (course) => course.status === "Active"
  ).length;
  const assignedCourses = courses.filter(
    (course) => course.lecturer !== null
  ).length;
  const unassignedCourses = courses.filter(
    (course) => course.status === "Active" && course.lecturer === null
  ).length;

  const filteredCourses = useMemo(() => {
    return courses.filter((course) => {
      const matchesSearch =
        course.code.toLowerCase().includes(searchTerm.toLowerCase()) ||
        course.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
        course.lecturer?.toLowerCase().includes(searchTerm.toLowerCase());

      const matchesProgramme =
        programmeFilter === "All Programmes" ||
        course.programme === programmeFilter;

      const matchesLevel =
        levelFilter === "All Levels" || course.level === levelFilter;

      const matchesSemester =
        semesterFilter === "All Semesters" ||
        course.semester === semesterFilter;

      const matchesStatus =
        statusFilter === "All Statuses" ||
        course.status === statusFilter;

      return (
        matchesSearch &&
        matchesProgramme &&
        matchesLevel &&
        matchesSemester &&
        matchesStatus
      );
    });
  }, [
    courses,
    searchTerm,
    programmeFilter,
    levelFilter,
    semesterFilter,
    statusFilter,
  ]);

  const openAssignmentModal = (course: Course) => {
    setSelectedCourse(course);
    setSelectedLecturer(course.lecturer ?? "");
    setShowAssignmentModal(true);
  };

  const closeAssignmentModal = () => {
    setShowAssignmentModal(false);
    setSelectedCourse(null);
    setSelectedLecturer("");
  };

  const saveAssignment = () => {
    if (!selectedCourse) return;

    setCourses((currentCourses) =>
      currentCourses.map((course) =>
        course.id === selectedCourse.id
          ? { ...course, lecturer: selectedLecturer || null }
          : course
      )
    );

    closeAssignmentModal();
  };

  const clearFilters = () => {
    setSearchTerm("");
    setProgrammeFilter("All Programmes");
    setLevelFilter("All Levels");
    setSemesterFilter("All Semesters");
    setStatusFilter("All Statuses");
  };

  const hasActiveFilters =
    searchTerm !== "" ||
    programmeFilter !== "All Programmes" ||
    levelFilter !== "All Levels" ||
    semesterFilter !== "All Semesters" ||
    statusFilter !== "All Statuses";

  return (
    <div className="space-y-6">
      {/* Page Heading */}
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-2xl font-bold text-[#0B1524]">
            Course Management
          </h1>
          <p className="mt-1 text-sm text-gray-500">
            View departmental courses and manage lecturer assignments.
          </p>
        </div>

        <div className="flex items-center gap-2 rounded-lg border border-gray-200 bg-white px-4 py-2.5 text-sm text-gray-600">
          <BookOpen size={17} className="text-[#B8901F]" />
          <span>2026/2027 Academic Session</span>
        </div>
      </div>

      {/* Statistics */}
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-4">
        <div className="rounded-xl border border-gray-200 bg-white p-5">
          <div className="flex items-center justify-between">
            <div className="rounded-lg bg-blue-50 p-2.5 text-blue-700">
              <BookOpen size={21} />
            </div>
            <span className="text-xs font-medium text-gray-400">
              All courses
            </span>
          </div>
          <p className="mt-4 text-2xl font-bold text-[#0B1524]">
            {totalCourses}
          </p>
          <p className="mt-1 text-sm text-gray-500">Total Department Courses</p>
        </div>

        <div className="rounded-xl border border-gray-200 bg-white p-5">
          <div className="flex items-center justify-between">
            <div className="rounded-lg bg-green-50 p-2.5 text-green-700">
              <GraduationCap size={21} />
            </div>
            <span className="text-xs font-medium text-gray-400">
              Currently active
            </span>
          </div>
          <p className="mt-4 text-2xl font-bold text-[#0B1524]">
            {activeCourses}
          </p>
          <p className="mt-1 text-sm text-gray-500">Active Courses</p>
        </div>

        <div className="rounded-xl border border-gray-200 bg-white p-5">
          <div className="flex items-center justify-between">
            <div className="rounded-lg bg-purple-50 p-2.5 text-purple-700">
              <UserCheck size={21} />
            </div>
            <span className="text-xs font-medium text-gray-400">
              Lecturer assigned
            </span>
          </div>
          <p className="mt-4 text-2xl font-bold text-[#0B1524]">
            {assignedCourses}
          </p>
          <p className="mt-1 text-sm text-gray-500">Assigned Courses</p>
        </div>

        <div className="rounded-xl border border-gray-200 bg-white p-5">
          <div className="flex items-center justify-between">
            <div className="rounded-lg bg-amber-50 p-2.5 text-amber-700">
              <Users size={21} />
            </div>
            <span className="text-xs font-medium text-gray-400">
              Requires attention
            </span>
          </div>
          <p className="mt-4 text-2xl font-bold text-[#0B1524]">
            {unassignedCourses}
          </p>
          <p className="mt-1 text-sm text-gray-500">Unassigned Active Courses</p>
        </div>
      </div>

      {/* Course List */}
      <div className="overflow-hidden rounded-xl border border-gray-200 bg-white">
        <div className="border-b border-gray-100 p-5">
          <div className="flex flex-col gap-3 lg:flex-row lg:items-center lg:justify-between">
            <div>
              <h2 className="font-semibold text-[#0B1524]">
                Departmental Courses
              </h2>
              <p className="mt-1 text-sm text-gray-500">
                Browse courses and update their lecturer assignments.
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

          {/* Filters */}
          <div className="mt-5 flex flex-wrap items-center gap-3">
            <div className="relative">
              <select
                value={programmeFilter}
                onChange={(e) => setProgrammeFilter(e.target.value)}
                className="appearance-none rounded-lg border border-gray-200 bg-white py-2 pl-3 pr-9 text-sm text-gray-600 outline-none focus:border-[#1E3A8A]"
              >
                <option>All Programmes</option>
                {programmeOptions.map((programme) => (
                  <option key={programme}>{programme}</option>
                ))}
              </select>
              <ChevronDown
                size={15}
                className="pointer-events-none absolute right-3 top-1/2 -translate-y-1/2 text-gray-400"
              />
            </div>

            <div className="relative">
              <select
                value={levelFilter}
                onChange={(e) => setLevelFilter(e.target.value)}
                className="appearance-none rounded-lg border border-gray-200 bg-white py-2 pl-3 pr-9 text-sm text-gray-600 outline-none focus:border-[#1E3A8A]"
              >
                <option>All Levels</option>
                {["100", "200", "300", "400", "500"].map((level) => (
                  <option key={level} value={level}>
                    {level} Level
                  </option>
                ))}
              </select>
              <ChevronDown
                size={15}
                className="pointer-events-none absolute right-3 top-1/2 -translate-y-1/2 text-gray-400"
              />
            </div>

            <div className="relative">
              <select
                value={semesterFilter}
                onChange={(e) => setSemesterFilter(e.target.value)}
                className="appearance-none rounded-lg border border-gray-200 bg-white py-2 pl-3 pr-9 text-sm text-gray-600 outline-none focus:border-[#1E3A8A]"
              >
                <option>All Semesters</option>
                <option>First Semester</option>
                <option>Second Semester</option>
              </select>
              <ChevronDown
                size={15}
                className="pointer-events-none absolute right-3 top-1/2 -translate-y-1/2 text-gray-400"
              />
            </div>

            <div className="relative">
              <select
                value={statusFilter}
                onChange={(e) => setStatusFilter(e.target.value)}
                className="appearance-none rounded-lg border border-gray-200 bg-white py-2 pl-3 pr-9 text-sm text-gray-600 outline-none focus:border-[#1E3A8A]"
              >
                <option>All Statuses</option>
                <option>Active</option>
                <option>Inactive</option>
              </select>
              <ChevronDown
                size={15}
                className="pointer-events-none absolute right-3 top-1/2 -translate-y-1/2 text-gray-400"
              />
            </div>

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

        {/* Table */}
        <div className="overflow-x-auto">
          <table className="w-full min-w-[1000px] text-left">
            <thead className="bg-gray-50">
              <tr className="text-xs font-semibold uppercase tracking-wide text-gray-500">
                <th className="px-5 py-4">Course</th>
                <th className="px-5 py-4">Programme / Level</th>
                <th className="px-5 py-4">Semester</th>
                <th className="px-5 py-4">Units</th>
                <th className="px-5 py-4">Assigned Lecturer</th>
                <th className="px-5 py-4">Status</th>
                <th className="px-5 py-4 text-right">Action</th>
              </tr>
            </thead>

            <tbody className="divide-y divide-gray-100">
              {filteredCourses.length > 0 ? (
                filteredCourses.map((course) => (
                  <tr key={course.id} className="transition hover:bg-gray-50/70">
                    <td className="px-5 py-4">
                      <p className="font-semibold text-[#0B1524]">
                        {course.code}
                      </p>
                      <p className="mt-1 text-sm text-gray-500">
                        {course.title}
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
                      {course.semester}
                    </td>

                    <td className="px-5 py-4 text-sm text-gray-600">
                      {course.creditUnits} Units
                    </td>

                    <td className="px-5 py-4">
                      {course.lecturer ? (
                        <div className="flex items-center gap-2">
                          <div className="flex h-8 w-8 items-center justify-center rounded-full bg-blue-50 text-xs font-semibold text-[#1E3A8A]">
                            {course.lecturer
                              .split(" ")
                              .slice(-2)
                              .map((part) => part[0])
                              .join("")}
                          </div>
                          <span className="text-sm text-gray-700">
                            {course.lecturer}
                          </span>
                        </div>
                      ) : (
                        <span className="inline-flex rounded-full bg-amber-50 px-2.5 py-1 text-xs font-medium text-amber-700">
                          Not assigned
                        </span>
                      )}
                    </td>

                    <td className="px-5 py-4">
                      <span
                        className={`inline-flex rounded-full px-2.5 py-1 text-xs font-medium ${
                          course.status === "Active"
                            ? "bg-green-50 text-green-700"
                            : "bg-gray-100 text-gray-600"
                        }`}
                      >
                        {course.status}
                      </span>
                    </td>

                    <td className="px-5 py-4 text-right">
                      <button
                        type="button"
                        onClick={() => openAssignmentModal(course)}
                        disabled={course.status !== "Active"}
                        className="inline-flex items-center gap-2 rounded-lg border border-gray-200 px-3 py-2 text-sm font-medium text-[#1E3A8A] transition hover:border-[#1E3A8A] hover:bg-blue-50 disabled:cursor-not-allowed disabled:opacity-40"
                      >
                        <Pencil size={14} />
                        {course.lecturer ? "Manage" : "Assign"}
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
                    No courses match your search or selected filters.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>

        <div className="flex flex-col gap-2 border-t border-gray-100 px-5 py-4 text-sm text-gray-500 sm:flex-row sm:items-center sm:justify-between">
          <p>
            Showing {filteredCourses.length} of {totalCourses} courses
          </p>
          <p>Course information is currently sample data.</p>
        </div>
      </div>

      {/* Lecturer Assignment Modal */}
      {showAssignmentModal && selectedCourse && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4">
          <div className="w-full max-w-md rounded-xl bg-white shadow-xl">
            <div className="flex items-start justify-between border-b border-gray-100 p-5">
              <div>
                <h2 className="text-lg font-semibold text-[#0B1524]">
                  Manage Lecturer Assignment
                </h2>
                <p className="mt-1 text-sm text-gray-500">
                  {selectedCourse.code} — {selectedCourse.title}
                </p>
              </div>

              <button
                type="button"
                onClick={closeAssignmentModal}
                className="rounded-lg p-1.5 text-gray-400 transition hover:bg-gray-100 hover:text-gray-700"
                aria-label="Close modal"
              >
                <X size={20} />
              </button>
            </div>

            <div className="space-y-4 p-5">
              <div>
                <label
                  htmlFor="lecturer"
                  className="mb-2 block text-sm font-medium text-gray-700"
                >
                  Select Lecturer
                </label>

                <select
                  id="lecturer"
                  value={selectedLecturer}
                  onChange={(e) => setSelectedLecturer(e.target.value)}
                  className="w-full rounded-lg border border-gray-200 bg-white px-3 py-3 text-sm text-gray-700 outline-none focus:border-[#1E3A8A]"
                >
                  <option value="">No lecturer assigned</option>
                  {lecturers.map((lecturer) => (
                    <option key={lecturer} value={lecturer}>
                      {lecturer}
                    </option>
                  ))}
                </select>
              </div>

              <p className="text-xs leading-5 text-gray-500">
                This is a sample assignment workflow. Changes are only saved
                locally in this demonstration and are not sent to the backend.
              </p>
            </div>

            <div className="flex justify-end gap-3 border-t border-gray-100 p-5">
              <button
                type="button"
                onClick={closeAssignmentModal}
                className="rounded-lg border border-gray-200 px-4 py-2.5 text-sm font-medium text-gray-600 transition hover:bg-gray-50"
              >
                Cancel
              </button>

              <button
                type="button"
                onClick={saveAssignment}
                className="rounded-lg bg-[#1E3A8A] px-4 py-2.5 text-sm font-medium text-white transition hover:bg-[#14263F]"
              >
                Save Assignment
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Courses;