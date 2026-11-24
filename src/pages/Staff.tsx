
import { useMemo, useState, useEffect } from "react";
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
import {
  getHodStaffOverview,
  getHodStaff,
} from "../lib/api";

type StaffStatus = "Active" | "On Leave" | "Inactive";

interface StaffMember {
  id: string;
  name: string;
  staffId: string;
  email: string;
  designation: string;
  specialization: string | null;
  assignedCourses: number;
  status: StaffStatus;
}

interface StaffStatistics {
  total_staff: number;
  active_staff: number;
  inactive_staff: number;
  staff_on_leave: number;
  unassigned_staff: number;
  total_assigned_courses: number;
}



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

const statusFromApi: Record<string, StaffStatus> = {
  ACTIVE: "Active",
  ON_LEAVE: "On Leave",
  INACTIVE: "Inactive",
};
const statusToApiValue: Record<string, string> = {
  Active: "ACTIVE",
  "On Leave": "ON_LEAVE",
  Inactive: "INACTIVE",
};
export default function Staff() {
  const [staff, setStaff] = useState<StaffMember[]>([]);

const [statistics, setStatistics] = useState<StaffStatistics>({
  total_staff: 0,
  active_staff: 0,
  inactive_staff: 0,
  staff_on_leave: 0,
  unassigned_staff: 0,
  total_assigned_courses: 0,
});
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedDesignation, setSelectedDesignation] =
    useState("All Designations");
  const [selectedStatus, setSelectedStatus] =
    useState("All Statuses");
    useEffect(() => {
  const fetchStaffOverview = async () => {
    try {
      const response = await getHodStaffOverview();

      console.log("HOD STAFF OVERVIEW:", response);

      if (response.success) {
        setStatistics(response.data.statistics);
      }
    } catch (error) {
      console.error("FAILED TO FETCH STAFF OVERVIEW:", error);
    }
  };

  fetchStaffOverview();
}, []);

useEffect(() => {
  const fetchStaffDirectory = async () => {
    try {
      const response = await getHodStaff({
        status:
          selectedStatus === "All Statuses"
            ? undefined
            : statusToApiValue[selectedStatus],

        designation:
          selectedDesignation === "All Designations"
            ? undefined
            : selectedDesignation,
      });

      console.log("FILTERED HOD STAFF DIRECTORY:", response);

      if (response.success) {
        const mappedStaff: StaffMember[] = response.data.staff.map(
          (member: any) => ({
            id: member.id,
            name: member.full_name,
            staffId: member.staff_number,
            email: member.email,
            designation: member.designation,
            specialization: member.specialization,
            assignedCourses: member.course_count,
            status: statusFromApi[member.status] ?? "Inactive",
          })
        );

        setStaff(mappedStaff);
      }
    } catch (error) {
      console.error("FAILED TO FETCH STAFF DIRECTORY:", error);
    }
  };

  fetchStaffDirectory();
}, [selectedStatus, selectedDesignation]);
  const filteredStaff = useMemo(() => {
  const search = searchTerm.toLowerCase().trim();

  return staff.filter((member) => {
    return (
      !search ||
      member.name.toLowerCase().includes(search) ||
      member.staffId.toLowerCase().includes(search) ||
      member.email.toLowerCase().includes(search)
    );
  });
}, [staff, searchTerm]);
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
            {statistics.total_staff}
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
            {statistics.active_staff}
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
            {statistics.staff_on_leave}
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
            {statistics.unassigned_staff}
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
              {statistics.total_assigned_courses}
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