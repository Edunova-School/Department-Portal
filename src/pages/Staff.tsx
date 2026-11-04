
import { useMemo, useState } from "react";
import {
  Users,
  UserCheck,
  UserX,
  BookOpen,
  Search,
  RotateCcw,
  ChevronDown,
  ArrowUpRight,
} from "lucide-react";
import { Link } from "react-router-dom";

type StaffStatus = "Active" | "On Leave" | "Inactive";

interface StaffMember {
  id: string;
  name: string;
  staffId: string;
  email: string;
  designation: string;
  specialization: string;
  assignedCourses: number;
  status: StaffStatus;
}

const mockStaff: StaffMember[] = [
  {
    id: "1",
    name: "Dr. Samuel Adeyemi",
    staffId: "EDU/STAFF/001",
    email: "samuel.adeyemi@example.com",
    designation: "Senior Lecturer",
    specialization: "Software Engineering",
    assignedCourses: 4,
    status: "Active",
  },
  {
    id: "2",
    name: "Dr. Grace Oladipo",
    staffId: "EDU/STAFF/002",
    email: "grace.oladipo@example.com",
    designation: "Associate Professor",
    specialization: "Computer Networks",
    assignedCourses: 3,
    status: "Active",
  },
  {
    id: "3",
    name: "Mr. Michael Akinyemi",
    staffId: "EDU/STAFF/003",
    email: "michael.akinyemi@example.com",
    designation: "Lecturer I",
    specialization: "Database Systems",
    assignedCourses: 3,
    status: "Active",
  },
  {
    id: "4",
    name: "Mrs. Deborah Johnson",
    staffId: "EDU/STAFF/004",
    email: "deborah.johnson@example.com",
    designation: "Lecturer II",
    specialization: "Information Technology",
    assignedCourses: 0,
    status: "Active",
  },
  {
    id: "5",
    name: "Mr. Joseph Ojo",
    staffId: "EDU/STAFF/005",
    email: "joseph.ojo@example.com",
    designation: "Assistant Lecturer",
    specialization: "Artificial Intelligence",
    assignedCourses: 2,
    status: "Active",
  },
  {
    id: "6",
    name: "Dr. Esther Adebayo",
    staffId: "EDU/STAFF/006",
    email: "esther.adebayo@example.com",
    designation: "Senior Lecturer",
    specialization: "Software Architecture",
    assignedCourses: 0,
    status: "On Leave",
  },
  {
    id: "7",
    name: "Mr. Daniel Olawale",
    staffId: "EDU/STAFF/007",
    email: "daniel.olawale@example.com",
    designation: "Lecturer I",
    specialization: "Computer Security",
    assignedCourses: 2,
    status: "Inactive",
  },
];

const designations = [
  "Professor",
  "Associate Professor",
  "Senior Lecturer",
  "Lecturer I",
  "Lecturer II",
  "Assistant Lecturer",
];

const statusStyles: Record<StaffStatus, string> = {
  Active: "bg-green-50 text-green-700",
  "On Leave": "bg-amber-50 text-amber-700",
  Inactive: "bg-slate-100 text-slate-600",
};

export default function Staff() {
  const [staff] = useState<StaffMember[]>(mockStaff);
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedDesignation, setSelectedDesignation] =
    useState("All Designations");
  const [selectedStatus, setSelectedStatus] =
    useState("All Statuses");

  const filteredStaff = useMemo(() => {
    return staff.filter((member) => {
      const search = searchTerm.toLowerCase().trim();

      const matchesSearch =
        !search ||
        member.name.toLowerCase().includes(search) ||
        member.staffId.toLowerCase().includes(search) ||
        member.email.toLowerCase().includes(search);

      const matchesDesignation =
        selectedDesignation === "All Designations" ||
        member.designation === selectedDesignation;

      const matchesStatus =
        selectedStatus === "All Statuses" ||
        member.status === selectedStatus;

      return (
        matchesSearch &&
        matchesDesignation &&
        matchesStatus
      );
    });
  }, [staff, searchTerm, selectedDesignation, selectedStatus]);

  const activeCount = staff.filter(
    (member) => member.status === "Active"
  ).length;

  const leaveCount = staff.filter(
    (member) => member.status === "On Leave"
  ).length;

  const unassignedCount = staff.filter(
    (member) =>
      member.status === "Active" &&
      member.assignedCourses === 0
  ).length;

  const totalAssignments = staff.reduce(
    (total, member) => total + member.assignedCourses,
    0
  );

  const resetFilters = () => {
    setSearchTerm("");
    setSelectedDesignation("All Designations");
    setSelectedStatus("All Statuses");
  };

  const hasActiveFilters =
    searchTerm !== "" ||
    selectedDesignation !== "All Designations" ||
    selectedStatus !== "All Statuses";

  return (
    <div className="space-y-7 pb-8">
      {/* Page Heading */}
      <section className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-2xl font-semibold text-[#14263F]">
            Staff Management
          </h1>
          <p className="mt-1 text-sm text-slate-500">
            View departmental academic staff and manage their
            academic responsibilities.
          </p>
        </div>

        <Link
          to="/courses"
          className="inline-flex items-center justify-center gap-2 rounded-lg bg-[#14263F] px-4 py-2.5 text-sm font-medium text-white transition hover:bg-[#1E3A8A]"
        >
          <BookOpen size={17} />
          Course Assignments
          <ArrowUpRight size={15} />
        </Link>
      </section>

      {/* Statistics */}
      <section className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-4">
        <div className="rounded-xl border border-slate-200 bg-white p-5 shadow-sm">
          <div className="flex items-center justify-between">
            <p className="text-sm text-slate-500">Total Staff</p>
            <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-blue-50 text-blue-700">
              <Users size={20} />
            </div>
          </div>
          <h2 className="mt-3 text-3xl font-semibold text-[#14263F]">
            {staff.length}
          </h2>
          <p className="mt-2 text-xs text-slate-400">
            Departmental staff records
          </p>
        </div>

        <div className="rounded-xl border border-slate-200 bg-white p-5 shadow-sm">
          <div className="flex items-center justify-between">
            <p className="text-sm text-slate-500">Active Staff</p>
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
            <p className="text-sm text-slate-500">On Leave</p>
            <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-amber-50 text-amber-700">
              <UserX size={20} />
            </div>
          </div>
          <h2 className="mt-3 text-3xl font-semibold text-[#14263F]">
            {leaveCount}
          </h2>
          <p className="mt-2 text-xs text-slate-400">
            Currently on leave
          </p>
        </div>

        <div className="rounded-xl border border-slate-200 bg-white p-5 shadow-sm">
          <div className="flex items-center justify-between">
            <p className="text-sm text-slate-500">Unassigned Staff</p>
            <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-purple-50 text-purple-700">
              <BookOpen size={20} />
            </div>
          </div>
          <h2 className="mt-3 text-3xl font-semibold text-[#14263F]">
            {unassignedCount}
          </h2>
          <p className="mt-2 text-xs text-slate-400">
            Active staff without course assignments
          </p>
        </div>
      </section>

      {/* Course Assignment Summary */}
      <section className="flex flex-col gap-4 rounded-xl border border-slate-200 bg-white p-5 sm:flex-row sm:items-center sm:justify-between">
        <div className="flex items-center gap-3">
          <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-[#14263F]/5 text-[#14263F]">
            <BookOpen size={21} />
          </div>

          <div>
            <h2 className="text-sm font-semibold text-slate-800">
              Academic Course Assignments
            </h2>
            <p className="mt-1 text-xs text-slate-500">
              Course allocation across departmental academic staff
            </p>
          </div>
        </div>

        <div className="flex items-center gap-5">
          <div>
            <p className="text-2xl font-semibold text-[#14263F]">
              {totalAssignments}
            </p>
            <p className="text-xs text-slate-400">
              Assigned courses
            </p>
          </div>

          <Link
            to="/courses"
            className="flex items-center gap-1 text-xs font-semibold text-[#14263F] hover:text-[#B8901F]"
          >
            Manage assignments
            <ArrowUpRight size={15} />
          </Link>
        </div>
      </section>

      {/* Staff Directory */}
      <section className="overflow-hidden rounded-xl border border-slate-200 bg-white shadow-sm">
        <div className="border-b border-slate-100 p-5">
          <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
            <div>
              <h2 className="font-semibold text-slate-800">
                Academic Staff Directory
              </h2>
              <p className="mt-1 text-xs text-slate-400">
                Browse departmental staff records.
              </p>
            </div>

            <span className="text-xs text-slate-500">
              Showing {filteredStaff.length} of {staff.length} staff
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
                placeholder="Search name, staff ID or email..."
                className="w-full rounded-lg border border-slate-200 bg-white py-2.5 pl-10 pr-4 text-sm outline-none transition focus:border-[#14263F] focus:ring-2 focus:ring-[#14263F]/10"
              />
            </div>

            <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 xl:w-[420px]">
              <div className="relative">
                <select
                  value={selectedDesignation}
                  onChange={(event) =>
                    setSelectedDesignation(event.target.value)
                  }
                  className="w-full appearance-none rounded-lg border border-slate-200 bg-white py-2.5 pl-3 pr-9 text-sm text-slate-600 outline-none focus:border-[#14263F]"
                >
                  <option>All Designations</option>
                  {designations.map((designation) => (
                    <option key={designation} value={designation}>
                      {designation}
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
                  <option value="On Leave">On Leave</option>
                  <option value="Inactive">Inactive</option>
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

        {/* Staff Table */}
        <div className="overflow-x-auto">
          <table className="w-full min-w-[950px] text-left">
            <thead className="bg-slate-50">
              <tr className="text-xs font-medium uppercase tracking-wide text-slate-500">
                <th className="px-5 py-4">Staff Member</th>
                <th className="px-5 py-4">Staff ID</th>
                <th className="px-5 py-4">Designation</th>
                <th className="px-5 py-4">Specialization</th>
                <th className="px-5 py-4">Courses</th>
                <th className="px-5 py-4">Status</th>
              </tr>
            </thead>

            <tbody className="divide-y divide-slate-100">
              {filteredStaff.length > 0 ? (
                filteredStaff.map((member) => (
                  <tr
                    key={member.id}
                    className="transition hover:bg-slate-50/70"
                  >
                    <td className="px-5 py-4">
                      <p className="text-sm font-medium text-slate-800">
                        {member.name}
                      </p>
                      <p className="mt-1 text-xs text-slate-400">
                        {member.email}
                      </p>
                    </td>

                    <td className="px-5 py-4 text-sm text-slate-600">
                      {member.staffId}
                    </td>

                    <td className="px-5 py-4 text-sm text-slate-600">
                      {member.designation}
                    </td>

                    <td className="px-5 py-4 text-sm text-slate-600">
                      {member.specialization}
                    </td>

                    <td className="px-5 py-4">
                      <span
                        className={`text-sm font-medium ${
                          member.assignedCourses === 0
                            ? "text-amber-700"
                            : "text-slate-700"
                        }`}
                      >
                        {member.assignedCourses}
                      </span>
                      <span className="ml-1 text-xs text-slate-400">
                        assigned
                      </span>
                    </td>

                    <td className="px-5 py-4">
                      <span
                        className={`inline-flex rounded-full px-3 py-1 text-xs font-medium ${statusStyles[member.status]}`}
                      >
                        {member.status}
                      </span>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan={6} className="px-5 py-14 text-center">
                    <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-full bg-slate-100 text-slate-400">
                      <Search size={21} />
                    </div>
                    <p className="mt-3 text-sm font-medium text-slate-700">
                      No staff members found
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

        <div className="border-t border-slate-100 px-5 py-4">
          <p className="text-xs text-slate-400">
            Showing {filteredStaff.length} staff records
          </p>
        </div>
      </section>
    </div>
  );
}