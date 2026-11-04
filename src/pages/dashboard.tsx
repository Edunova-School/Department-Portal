
import {
  Users,
  UserRound,
  BookOpen,
  FileCheck2,
  ArrowUpRight,
  ClipboardList,
  GraduationCap,
  Megaphone,
  ChevronRight,
  Activity,
} from "lucide-react";
import { Link } from "react-router-dom";

const stats = [
  {
    title: "Total Students",
    value: "1,248",
    description: "Across all academic levels",
    icon: Users,
    iconBg: "bg-blue-50",
    iconColor: "text-blue-700",
  },
  {
    title: "Academic Staff",
    value: "32",
    description: "Assigned to this department",
    icon: UserRound,
    iconBg: "bg-purple-50",
    iconColor: "text-purple-700",
  },
  {
    title: "Department Courses",
    value: "46",
    description: "Across all programmes",
    icon: BookOpen,
    iconBg: "bg-amber-50",
    iconColor: "text-amber-700",
  },
  {
    title: "Pending Results",
    value: "08",
    description: "Awaiting departmental review",
    icon: FileCheck2,
    iconBg: "bg-red-50",
    iconColor: "text-red-600",
  },
];

const pendingActions = [
  {
    title: "Results awaiting review",
    description: "8 result submissions require your attention.",
    count: "08",
    icon: FileCheck2,
    color: "text-amber-700",
    bg: "bg-amber-50",
    path: "/results",
  },
  {
    title: "Departmental requests",
    description: "3 requests are awaiting your approval.",
    count: "03",
    icon: ClipboardList,
    color: "text-blue-700",
    bg: "bg-blue-50",
    path: "/requests",
  },
  {
    title: "Course registration",
    description: "12 registrations require attention.",
    count: "12",
    icon: GraduationCap,
    color: "text-purple-700",
    bg: "bg-purple-50",
    path: "/registrations",
  },
];

const activities = [
  {
    title: "Result submission received",
    description: "A lecturer submitted results for SWE 201.",
    time: "Today, 10:42 AM",
    icon: FileCheck2,
    color: "text-blue-700",
    bg: "bg-blue-50",
  },
  {
    title: "New student registration",
    description: "A student completed departmental registration.",
    time: "Today, 9:15 AM",
    icon: Users,
    color: "text-green-700",
    bg: "bg-green-50",
  },
  {
    title: "Course assignment updated",
    description: "A course was assigned to an academic staff member.",
    time: "Yesterday, 3:30 PM",
    icon: BookOpen,
    color: "text-purple-700",
    bg: "bg-purple-50",
  },
  {
    title: "Departmental announcement",
    description: "A new announcement was published.",
    time: "Yesterday, 11:20 AM",
    icon: Megaphone,
    color: "text-amber-700",
    bg: "bg-amber-50",
  },
];

const programmes = [
  { name: "B.Sc. Software Engineering", students: 520, percentage: 100 },
  { name: "B.Sc. Computer Science", students: 438, percentage: 84 },
  { name: "B.Sc. Information Technology", students: 290, percentage: 56 },
];

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
  // const currentDate = new Date().toLocaleDateString("en-US", {
  //   weekday: "long",
  //   day: "numeric",
  //   month: "long",
  //   year: "numeric",
  // });

  return (
    <div className="space-y-7 pb-8">
      <section>
        <div className="mb-4 flex items-center justify-between">
          <h2 className="text-base font-semibold text-slate-800">
            Department Statistics
          </h2>
          <span className="text-xs text-slate-400">
            Overview
          </span>
        </div>
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-4">
          {stats.map((stat) => {
            const Icon = stat.icon;
            return (
              <div key={stat.title} className="rounded-xl border border-slate-200 bg-white p-5 shadow-sm">
                <div className="flex items-start justify-between">
                  <div>
                    <p className="text-sm text-slate-500">
                      {stat.title}
                    </p>
                    <h3 className="mt-3 text-3xl font-semibold tracking-tight text-[#14263F]">
                      {stat.value}
                    </h3>
                  </div>
                  <div className={`flex h-11 w-11 items-center justify-center rounded-xl ${stat.iconBg}`}>
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
                      {item.count}
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

        {/* Programme Overview */}
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
              1,248
            </p>
            <p className="mt-1 text-xs text-slate-400">
              Total enrolled students
            </p>
          </div>

          <div className="space-y-5">
            {programmes.map((programme) => (
              <div key={programme.name}>
                <div className="mb-2 flex items-center justify-between gap-3">
                  <p className="text-xs font-medium text-slate-600">
                    {programme.name}
                  </p>
                  <span className="shrink-0 text-xs font-semibold text-slate-700">
                    {programme.students}
                  </span>
                </div>

                <div className="h-2 overflow-hidden rounded-full bg-slate-100">
                  <div
                    className="h-full rounded-full bg-[#B8901F]"
                    style={{ width: `${programme.percentage}%` }}
                  />
                </div>
              </div>
            ))}
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

      {/* Recent Activities */}
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

        <div className="divide-y divide-slate-100">
          {activities.map((activity) => {
            const Icon = activity.icon;

            return (
              <div
                key={activity.title}
                className="flex items-center gap-3 py-4 first:pt-0 last:pb-0"
              >
                <div
                  className={`flex h-10 w-10 shrink-0 items-center justify-center rounded-full ${activity.bg}`}
                >
                  <Icon size={18} className={activity.color} />
                </div>

                <div className="min-w-0 flex-1">
                  <p className="text-sm font-medium text-slate-800">
                    {activity.title}
                  </p>
                  <p className="mt-1 text-xs text-slate-500">
                    {activity.description}
                  </p>
                </div>

                <p className="hidden shrink-0 text-xs text-slate-400 sm:block">
                  {activity.time}
                </p>
              </div>
            );
          })}
        </div>
      </section>

      {/* Quick Access */}
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
