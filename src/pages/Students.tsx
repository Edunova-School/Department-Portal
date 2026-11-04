
import { useMemo, useState } from "react";
import {
  Users,
  UserCheck,
  GraduationCap,
  Search,
  SlidersHorizontal,
  RotateCcw,
  ChevronDown,
} from "lucide-react";

type StudentStatus = "Active" | "Deferred" | "Graduated";

interface Student {
  id: string;
  name: string;
  matricNumber: string;
  email: string;
  programme: string;
  level: string;
  status: StudentStatus;
}

const mockStudents: Student[] = [
  {
    id: "1",
    name: "Daniel Adewale",
    matricNumber: "SE/2023/001",
    email: "daniel.adewale@example.com",
    programme: "B.Sc. Software Engineering",
    level: "300",
    status: "Active",
  },
  {
    id: "2",
    name: "Esther Oladipo",
    matricNumber: "SE/2023/002",
    email: "esther.oladipo@example.com",
    programme: "B.Sc. Software Engineering",
    level: "300",
    status: "Active",
  },
  {
    id: "3",
    name: "Michael Akinyemi",
    matricNumber: "CS/2022/014",
    email: "michael.akinyemi@example.com",
    programme: "B.Sc. Computer Science",
    level: "400",
    status: "Active",
  },
  {
    id: "4",
    name: "Deborah Johnson",
    matricNumber: "IT/2024/008",
    email: "deborah.johnson@example.com",
    programme: "B.Sc. Information Technology",
    level: "200",
    status: "Active",
  },
  {
    id: "5",
    name: "Samuel Adekunle",
    matricNumber: "SE/2025/011",
    email: "samuel.adekunle@example.com",
    programme: "B.Sc. Software Engineering",
    level: "100",
    status: "Active",
  },
  {
    id: "6",
    name: "Grace Olawale",
    matricNumber: "CS/2021/019",
    email: "grace.olawale@example.com",
    programme: "B.Sc. Computer Science",
    level: "500",
    status: "Graduated",
  },
  {
    id: "7",
    name: "Joseph Ojo",
    matricNumber: "IT/2023/023",
    email: "joseph.ojo@example.com",
    programme: "B.Sc. Information Technology",
    level: "300",
    status: "Deferred",
  },
  {
    id: "8",
    name: "Precious Adebayo",
    matricNumber: "SE/2022/018",
    email: "precious.adebayo@example.com",
    programme: "B.Sc. Software Engineering",
    level: "400",
    status: "Active",
  },
];

const programmes = [
  "B.Sc. Software Engineering",
  "B.Sc. Computer Science",
  "B.Sc. Information Technology",
];

const levels = ["100", "200", "300", "400", "500"];

const statusStyles: Record<StudentStatus, string> = {
  Active: "bg-green-50 text-green-700",
  Deferred: "bg-amber-50 text-amber-700",
  Graduated: "bg-blue-50 text-blue-700",
};

export default function Students() {
  const [students] = useState<Student[]>(mockStudents);
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedProgramme, setSelectedProgramme] = useState("All Programmes");
  const [selectedLevel, setSelectedLevel] = useState("All Levels");
  const [selectedStatus, setSelectedStatus] = useState("All Statuses");

  const filteredStudents = useMemo(() => {
    return students.filter((student) => {
      const search = searchTerm.toLowerCase().trim();

      const matchesSearch =
        !search ||
        student.name.toLowerCase().includes(search) ||
        student.matricNumber.toLowerCase().includes(search) ||
        student.email.toLowerCase().includes(search);

      const matchesProgramme =
        selectedProgramme === "All Programmes" ||
        student.programme === selectedProgramme;

      const matchesLevel =
        selectedLevel === "All Levels" ||
        student.level === selectedLevel;

      const matchesStatus =
        selectedStatus === "All Statuses" ||
        student.status === selectedStatus;

      return (
        matchesSearch &&
        matchesProgramme &&
        matchesLevel &&
        matchesStatus
      );
    });
  }, [
    students,
    searchTerm,
    selectedProgramme,
    selectedLevel,
    selectedStatus,
  ]);

  const activeCount = students.filter(
    (student) => student.status === "Active"
  ).length;

  const graduatedCount = students.filter(
    (student) => student.status === "Graduated"
  ).length;

  const deferredCount = students.filter(
    (student) => student.status === "Deferred"
  ).length;

  const resetFilters = () => {
    setSearchTerm("");
    setSelectedProgramme("All Programmes");
    setSelectedLevel("All Levels");
    setSelectedStatus("All Statuses");
  };

  const hasActiveFilters =
    searchTerm !== "" ||
    selectedProgramme !== "All Programmes" ||
    selectedLevel !== "All Levels" ||
    selectedStatus !== "All Statuses";

  return (
    <div className="space-y-7 pb-8">
      {/* Page Heading */}
      <section className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-2xl font-semibold text-[#14263F]">
            Student Management
          </h1>
          <p className="mt-1 text-sm text-slate-500">
            View and manage students within your department.
          </p>
        </div>

        <div className="flex items-center gap-2 text-sm text-slate-500">
          <Users size={17} />
          <span>Student Directory</span>
        </div>
      </section>

      {/* Statistics */}
      <section className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-4">
        <div className="rounded-xl border border-slate-200 bg-white p-5 shadow-sm">
          <div className="flex items-center justify-between">
            <p className="text-sm text-slate-500">Total Students</p>
            <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-blue-50 text-blue-700">
              <Users size={20} />
            </div>
          </div>
          <h2 className="mt-3 text-3xl font-semibold text-[#14263F]">
            {students.length}
          </h2>
          <p className="mt-2 text-xs text-slate-400">
            All departmental records
          </p>
        </div>

        <div className="rounded-xl border border-slate-200 bg-white p-5 shadow-sm">
          <div className="flex items-center justify-between">
            <p className="text-sm text-slate-500">Active Students</p>
            <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-green-50 text-green-700">
              <UserCheck size={20} />
            </div>
          </div>
          <h2 className="mt-3 text-3xl font-semibold text-[#14263F]">
            {activeCount}
          </h2>
          <p className="mt-2 text-xs text-slate-400">
            Currently active
          </p>
        </div>

        <div className="rounded-xl border border-slate-200 bg-white p-5 shadow-sm">
          <div className="flex items-center justify-between">
            <p className="text-sm text-slate-500">Graduated</p>
            <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-purple-50 text-purple-700">
              <GraduationCap size={20} />
            </div>
          </div>
          <h2 className="mt-3 text-3xl font-semibold text-[#14263F]">
            {graduatedCount}
          </h2>
          <p className="mt-2 text-xs text-slate-400">
            Completed their programmes
          </p>
        </div>

        <div className="rounded-xl border border-slate-200 bg-white p-5 shadow-sm">
          <div className="flex items-center justify-between">
            <p className="text-sm text-slate-500">Deferred</p>
            <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-amber-50 text-amber-700">
              <GraduationCap size={20} />
            </div>
          </div>
          <h2 className="mt-3 text-3xl font-semibold text-[#14263F]">
            {deferredCount}
          </h2>
          <p className="mt-2 text-xs text-slate-400">
            Currently deferred
          </p>
        </div>
      </section>

      {/* Student Records */}
      <section className="overflow-hidden rounded-xl border border-slate-200 bg-white shadow-sm">
        {/* Table Heading */}
        <div className="border-b border-slate-100 p-5">
          <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
            <div>
              <h2 className="font-semibold text-slate-800">
                Student Records
              </h2>
              <p className="mt-1 text-xs text-slate-400">
                Browse and search departmental student records.
              </p>
            </div>

            <span className="text-xs text-slate-500">
              Showing {filteredStudents.length} of {students.length} students
            </span>
          </div>

          {/* Search and Filters */}
          <div className="mt-5 flex flex-col gap-3 xl:flex-row">
            <div className="relative flex-1">
              <Search
                size={18}
                className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400"
              />
              <input
                type="text"
                value={searchTerm}
                onChange={(event) => setSearchTerm(event.target.value)}
                placeholder="Search name, matric number or email..."
                className="w-full rounded-lg border border-slate-200 bg-white py-2.5 pl-10 pr-4 text-sm outline-none transition focus:border-[#14263F] focus:ring-2 focus:ring-[#14263F]/10"
              />
            </div>

            <div className="grid grid-cols-1 gap-3 sm:grid-cols-3 xl:w-auto">
              <div className="relative">
                <select
                  value={selectedProgramme}
                  onChange={(event) =>
                    setSelectedProgramme(event.target.value)
                  }
                  className="w-full appearance-none rounded-lg border border-slate-200 bg-white py-2.5 pl-3 pr-9 text-sm text-slate-600 outline-none focus:border-[#14263F]"
                >
                  <option>All Programmes</option>
                  {programmes.map((programme) => (
                    <option key={programme} value={programme}>
                      {programme}
                    </option>
                  ))}
                </select>
                <ChevronDown
                  size={15}
                  className="pointer-events-none absolute right-3 top-1/2 -translate-y-1/2 text-slate-400"
                />
              </div>

              <div className="relative">
                <select
                  value={selectedLevel}
                  onChange={(event) =>
                    setSelectedLevel(event.target.value)
                  }
                  className="w-full appearance-none rounded-lg border border-slate-200 bg-white py-2.5 pl-3 pr-9 text-sm text-slate-600 outline-none focus:border-[#14263F]"
                >
                  <option>All Levels</option>
                  {levels.map((level) => (
                    <option key={level} value={level}>
                      {level} Level
                    </option>
                  ))}
                </select>
                <ChevronDown
                  size={15}
                  className="pointer-events-none absolute right-3 top-1/2 -translate-y-1/2 text-slate-400"
                />
              </div>

              <div className="relative">
                <select
                  value={selectedStatus}
                  onChange={(event) =>
                    setSelectedStatus(event.target.value)
                  }
                  className="w-full appearance-none rounded-lg border border-slate-200 bg-white py-2.5 pl-3 pr-9 text-sm text-slate-600 outline-none focus:border-[#14263F]"
                >
                  <option>All Statuses</option>
                  <option value="Active">Active</option>
                  <option value="Deferred">Deferred</option>
                  <option value="Graduated">Graduated</option>
                </select>
                <ChevronDown
                  size={15}
                  className="pointer-events-none absolute right-3 top-1/2 -translate-y-1/2 text-slate-400"
                />
              </div>
            </div>
          </div>

          {hasActiveFilters && (
            <button
              onClick={resetFilters}
              className="mt-3 flex items-center gap-2 text-xs font-medium text-[#14263F] hover:text-[#B8901F]"
            >
              <RotateCcw size={13} />
              Clear filters
            </button>
          )}
        </div>

        {/* Table */}
        <div className="overflow-x-auto">
          <table className="w-full min-w-[850px] text-left">
            <thead className="bg-slate-50">
              <tr className="text-xs font-medium uppercase tracking-wide text-slate-500">
                <th className="px-5 py-4">Student</th>
                <th className="px-5 py-4">Matric Number</th>
                <th className="px-5 py-4">Programme</th>
                <th className="px-5 py-4">Level</th>
                <th className="px-5 py-4">Status</th>
              </tr>
            </thead>

            <tbody className="divide-y divide-slate-100">
              {filteredStudents.length > 0 ? (
                filteredStudents.map((student) => (
                  <tr
                    key={student.id}
                    className="transition hover:bg-slate-50/70"
                  >
                    <td className="px-5 py-4">
                      <div>
                        <p className="text-sm font-medium text-slate-800">
                          {student.name}
                        </p>
                        <p className="mt-1 text-xs text-slate-400">
                          {student.email}
                        </p>
                      </div>
                    </td>

                    <td className="px-5 py-4 text-sm text-slate-600">
                      {student.matricNumber}
                    </td>

                    <td className="px-5 py-4 text-sm text-slate-600">
                      {student.programme}
                    </td>

                    <td className="px-5 py-4 text-sm text-slate-600">
                      {student.level} Level
                    </td>

                    <td className="px-5 py-4">
                      <span
                        className={`inline-flex rounded-full px-3 py-1 text-xs font-medium ${statusStyles[student.status]}`}
                      >
                        {student.status}
                      </span>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan={5} className="px-5 py-14 text-center">
                    <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-full bg-slate-100 text-slate-400">
                      <Search size={21} />
                    </div>
                    <p className="mt-3 text-sm font-medium text-slate-700">
                      No students found
                    </p>
                    <p className="mt-1 text-xs text-slate-400">
                      Try changing your search or filter criteria.
                    </p>
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
        <div className="flex flex-col gap-2 border-t border-slate-100 px-5 py-4 sm:flex-row sm:items-center sm:justify-between">
          <p className="text-xs text-slate-400">
            Showing {filteredStudents.length} student records
          </p>

          <div className="flex items-center gap-2 text-xs text-slate-400">
            <SlidersHorizontal size={14} />
            <span>Filters apply to the current student list</span>
          </div>
        </div>
      </section>
    </div>
  );
}
