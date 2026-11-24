
import { useEffect, useState } from "react";
import {
  Users,
  UserRound,
  BookOpen,
  FileCheck2,
  ArrowUpRight,
  ClipboardList,
  ChevronRight,
  Activity,
} from "lucide-react";
import { Link } from "react-router-dom";
import { getHodDashboard } from "../lib/api";
interface DashboardProgramme {
  programme_id: string;
  programme_code: string;
  programme_name: string;
  student_count: number;
}

interface DashboardData {
  department: {
    id: string;
    name: string;
    code: string;
  };

  statistics: {
    total_students: number;
    academic_staff: number;
    department_courses: number;
    pending_results: number;
  };

  pending_actions: {
    departmental_requests: number;
    results_awaiting_review: number;
  };

  student_distribution: {
    total_students: number;
    programmes: DashboardProgramme[];
  };

  recent_activities: unknown[];
}
const quickLinks = [
  {
    title: "Manage Students",
    description: "View and manage departmental students.",
    icon: Users,
    path: "/students",
  },
  {
    title: "Manage Staff",
    description: "View academic staff and assignments.",
    icon: UserRound,
    path: "/staff",
  },
  {
    title: "Manage Courses",
    description: "Review and assign departmental courses.",
    icon: BookOpen,
    path: "/courses",
  },
  {
    title: "Manage Results",
    description: "Review and process result submissions.",
    icon: FileCheck2,
    path: "/results",
  },
];

export default function Dashboard() {
  const [dashboard, setDashboard] = useState<DashboardData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  // ------------------------------------------
  // FETCH DASHBOARD DATA
  // ------------------------------------------

  useEffect(() => {
    const fetchDashboard = async () => {
      try {
        setLoading(true);
        setError("");

        const response = await getHodDashboard();

        if (response.success) {
          setDashboard(response.data);
        } else {
          throw new Error(
            response.message || "Unable to retrieve dashboard data."
          );
        }
      } catch (err) {
        console.error("HOD DASHBOARD ERROR:", err);

        setError(
          err instanceof Error
            ? err.message
            : "Something went wrong while loading the dashboard."
        );
      } finally {
        setLoading(false);
      }
    };

    fetchDashboard();
  }, []);

  // ------------------------------------------
  // LOADING STATE
  // ------------------------------------------

  if (loading) {
    return (
      <div className="flex min-h-[300px] items-center justify-center">
        <div className="text-center">
          <div className="mx-auto h-8 w-8 animate-spin rounded-full border-4 border-gray-200 border-t-[#14263F]" />
          <p className="mt-3 text-sm text-gray-500">
            Loading dashboard...
          </p>
        </div>
      </div>
    );
  }

  // ------------------------------------------
  // ERROR STATE
  // ------------------------------------------

  if (error || !dashboard) {
    return (
      <div className="rounded-xl border border-red-100 bg-white p-8 text-center">
        <p className="font-semibold text-red-600">
          Unable to load dashboard
        </p>

        <p className="mt-2 text-sm text-gray-500">
          {error || "Dashboard data is unavailable."}
        </p>
      </div>
    );
  }
  const stats = [
    {
      title: "Total Students",
      value: dashboard.statistics.total_students,
      description: "Across all academic levels",
      icon: Users,
      iconBg: "bg-blue-50",
      iconColor: "text-blue-700",
    },
    {
      title: "Academic Staff",
      value: dashboard.statistics.academic_staff,
      description: "Assigned to this department",
      icon: UserRound,
      iconBg: "bg-purple-50",
      iconColor: "text-purple-700",
    },
    {
      title: "Department Courses",
      value: dashboard.statistics.department_courses,
      description: "Across all programmes",
      icon: BookOpen,
      iconBg: "bg-amber-50",
      iconColor: "text-amber-700",
    },
    {
      title: "Pending Results",
      value: dashboard.statistics.pending_results,
      description: "Awaiting departmental review",
      icon: FileCheck2,
      iconBg: "bg-red-50",
      iconColor: "text-red-600",
    },
  ];
  const pendingActions = [
    {
      title: "Results awaiting review",
      description: "Result submissions require your attention.",
      count: dashboard.pending_actions.results_awaiting_review,
      icon: FileCheck2,
      color: "text-amber-700",
      bg: "bg-amber-50",
      path: "/results",
    },
    {
      title: "Departmental requests",
      description: "Requests are awaiting your approval.",
      count: dashboard.pending_actions.departmental_requests,
      icon: ClipboardList,
      color: "text-blue-700",
      bg: "bg-blue-50",
      path: "/requests",
    },
  ];
  const programmes = dashboard.student_distribution.programmes ?? [];
  const totalStudents = dashboard.student_distribution.total_students;
  return (
    <div className="space-y-7 pb-8">
      <section>
        <div className="mb-4 flex items-center justify-between">
          <div>
            <h2 className="text-base font-semibold text-slate-800">
              Department Statistics
            </h2>

            <p className="mt-1 text-xs text-slate-400">
              {dashboard.department.name} ({dashboard.department.code})
            </p>
          </div>

          <span className="text-xs text-slate-400">
            Overview
          </span>
        </div>

        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-4">
          {stats.map((stat) => {
            const Icon = stat.icon;

            return (
              <div
                key={stat.title}
                className="rounded-xl border border-slate-200 bg-white p-5 shadow-sm"
              >
                <div className="flex items-start justify-between">
                  <div>
                    <p className="text-sm text-slate-500">
                      {stat.title}
                    </p>

                    <h3 className="mt-3 text-3xl font-semibold tracking-tight text-[#14263F]">
                      {stat.value.toLocaleString()}
                    </h3>
                  </div>

                  <div
                    className={`flex h-11 w-11 items-center justify-center rounded-xl ${stat.iconBg}`}
                  >
                    <Icon size={21} className={stat.iconColor} />
                  </div>
                </div>

                <p className="mt-4 text-xs text-slate-400">
                  {stat.description}
                </p>
              </div>
            );
          })}
        </div>
      </section>
      <section className="grid grid-cols-1 gap-5 xl:grid-cols-5">
        <div className="rounded-xl border border-slate-200 bg-white p-5 xl:col-span-3">
          <div className="mb-5 flex items-center justify-between">
            <div>
              <h2 className="font-semibold text-slate-800">
                Pending Actions
              </h2>

              <p className="mt-1 text-xs text-slate-400">
                Items that require your attention
              </p>
            </div>

            <span className="rounded-full bg-amber-50 px-3 py-1 text-xs font-medium text-amber-700">
              Action Required
            </span>
          </div>

          <div className="space-y-3">
            {pendingActions.map((item) => {
              const Icon = item.icon;

              return (
                <Link
                  key={item.title}
                  to={item.path}
                  className="flex items-center gap-3 rounded-lg border border-slate-100 p-3 transition hover:border-slate-300 hover:bg-slate-50"
                >
                  <div
                    className={`flex h-10 w-10 shrink-0 items-center justify-center rounded-lg ${item.bg}`}
                  >
                    <Icon size={19} className={item.color} />
                  </div>

                  <div className="min-w-0 flex-1">
                    <p className="text-sm font-medium text-slate-800">
                      {item.title}
                    </p>

                    <p className="mt-1 text-xs text-slate-500">
                      {item.description}
                    </p>
                  </div>

                  <div className="flex items-center gap-2">
                    <span className="text-sm font-semibold text-[#14263F]">
                      {String(item.count).padStart(2, "0")}
                    </span>

                    <ChevronRight
                      size={17}
                      className="text-slate-400"
                    />
                  </div>
                </Link>
              );
            })}
          </div>
        </div>
        <div className="rounded-xl border border-slate-200 bg-white p-5 xl:col-span-2">
          <div className="mb-6">
            <h2 className="font-semibold text-slate-800">
              Student Distribution
            </h2>

            <p className="mt-1 text-xs text-slate-400">
              Students across departmental programmes
            </p>
          </div>

          <div className="mb-5">
            <p className="text-3xl font-semibold text-[#14263F]">
              {totalStudents.toLocaleString()}
            </p>

            <p className="mt-1 text-xs text-slate-400">
              Total enrolled students
            </p>
          </div>

          <div className="space-y-5">
            {programmes.length > 0 ? (
              programmes.map((programme) => {
                const percentage =
                  totalStudents > 0
                    ? (programme.student_count / totalStudents) * 100
                    : 0;

                return (
                  <div key={programme.programme_id}>
                    <div className="mb-2 flex items-center justify-between gap-3">
                      <p className="text-xs font-medium text-slate-600">
                        {programme.programme_name}
                      </p>

                      <span className="shrink-0 text-xs font-semibold text-slate-700">
                        {programme.student_count.toLocaleString()}
                      </span>
                    </div>

                    <div className="h-2 overflow-hidden rounded-full bg-slate-100">
                      <div
                        className="h-full rounded-full bg-[#B8901F]"
                        style={{ width: `${percentage}%` }}
                      />
                    </div>
                  </div>
                );
              })
            ) : (
              <p className="py-6 text-center text-sm text-gray-400">
                No programme distribution available.
              </p>
            )}
          </div>

          <Link
            to="/students"
            className="mt-6 flex items-center gap-1 text-xs font-semibold text-[#14263F] hover:text-[#B8901F]"
          >
            View student records
            <ArrowUpRight size={15} />
          </Link>
        </div>
      </section>
      <section className="rounded-xl border border-slate-200 bg-white p-5">
        <div className="mb-5 flex items-center justify-between">
          <div>
            <div className="flex items-center gap-2">
              <Activity size={18} className="text-[#14263F]" />

              <h2 className="font-semibold text-slate-800">
                Recent Activities
              </h2>
            </div>

            <p className="mt-1 text-xs text-slate-400">
              Latest activities within your department
            </p>
          </div>

          <Link
            to="/reports"
            className="flex items-center gap-1 text-xs font-medium text-[#14263F] hover:text-[#B8901F]"
          >
            View all
            <ArrowUpRight size={15} />
          </Link>
        </div>

        {dashboard.recent_activities.length === 0 ? (
          <div className="py-10 text-center">
            <Activity
              size={25}
              className="mx-auto text-slate-300"
            />

            <p className="mt-3 text-sm font-medium text-slate-600">
              No recent activities
            </p>

            <p className="mt-1 text-xs text-slate-400">
              Department activities will appear here.
            </p>
          </div>
        ) : (
          <div className="py-6 text-center text-sm text-slate-500">
            {dashboard.recent_activities.length} recent activity record(s) retrieved.
            Activity details will be displayed once their response structure is confirmed.
          </div>
        )}
      </section>
      <section>
        <div className="mb-4">
          <h2 className="font-semibold text-slate-800">
            Quick Access
          </h2>

          <p className="mt-1 text-xs text-slate-400">
            Frequently used departmental resources
          </p>
        </div>

        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-4">
          {quickLinks.map((item) => {
            const Icon = item.icon;
            return (
              <Link
                key={item.title}
                to={item.path}
                className="group rounded-xl border border-slate-200 bg-white p-5 transition hover:-translate-y-0.5 hover:border-[#B8901F]/50 hover:shadow-md"
              >
                <div className="flex items-center justify-between">
                  <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-[#14263F]/5 text-[#14263F]">
                    <Icon size={20} />
                  </div>

                  <ArrowUpRight
                    size={17}
                    className="text-slate-300 transition group-hover:text-[#B8901F]"
                  />
                </div>

                <h3 className="mt-4 text-sm font-semibold text-slate-800">
                  {item.title}
                </h3>

                <p className="mt-1 text-xs leading-5 text-slate-500">
                  {item.description}
                </p>
              </Link>
            );
          })}
        </div>
      </section>
    </div>
  );
}
