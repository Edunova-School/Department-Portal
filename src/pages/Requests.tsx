
import { useMemo, useState } from "react";
import {
  Search,
  Eye,
  CheckCircle2,
  XCircle,
  Clock3,
  FileText,
  UserRound,
  X,
  CalendarDays,
  MessageSquare,
  AlertCircle,
} from "lucide-react";

type RequesterType = "Student" | "Staff";
type RequestStatus =
  | "Pending"
  | "Approved"
  | "Declined"
  | "More Information Required";
type RequestPriority = "Normal" | "High";

interface DepartmentRequest {
  id: string;
  reference: string;
  requester: string;
  requesterType: RequesterType;
  identifier: string;
  email: string;
  requestType: string;
  subject: string;
  description: string;
  programme?: string;
  level?: string;
  courseCode?: string;
  submittedAt: string;
  priority: RequestPriority;
  status: RequestStatus;
  reviewerComment?: string;
  reviewedAt?: string;
}

const initialRequests: DepartmentRequest[] = [
  {
    id: "1",
    reference: "REQ-2026-001",
    requester: "Daniel Olawale",
    requesterType: "Student",
    identifier: "SE/2023/001",
    email: "daniel.olawale@example.com",
    requestType: "Late Course Registration",
    subject: "Request for late registration of SEN 302",
    description:
      "I was unable to complete my course registration within the stipulated period due to an issue with my student portal. I kindly request permission to register SEN 302 for the current semester.",
    programme: "Software Engineering",
    level: "300 Level",
    courseCode: "SEN 302",
    submittedAt: "2026-10-28",
    priority: "High",
    status: "Pending",
  },
  {
    id: "2",
    reference: "REQ-2026-002",
    requester: "Grace Oladipo",
    requesterType: "Staff",
    identifier: "EDU/ST/014",
    email: "grace.oladipo@example.com",
    requestType: "Leave Request",
    subject: "Request for three days leave",
    description:
      "I would like to request three working days of leave for a personal commitment. I have made arrangements to ensure my scheduled academic responsibilities are covered.",
    submittedAt: "2026-10-27",
    priority: "Normal",
    status: "Pending",
  },
  {
    id: "3",
    reference: "REQ-2026-003",
    requester: "Michael Akinyemi",
    requesterType: "Staff",
    identifier: "EDU/ST/021",
    email: "michael.akinyemi@example.com",
    requestType: "Course-Related Request",
    subject: "Request for additional teaching materials",
    description:
      "I am requesting approval to obtain additional teaching materials for the Database Management Systems course.",
    submittedAt: "2026-10-25",
    priority: "Normal",
    status: "Approved",
    reviewerComment: "Approved. Please proceed through the appropriate departmental process.",
    reviewedAt: "2026-10-26",
  },
  {
    id: "4",
    reference: "REQ-2026-004",
    requester: "Esther Adebayo",
    requesterType: "Student",
    identifier: "SE/2022/014",
    email: "esther.adebayo@example.com",
    requestType: "Result Correction",
    subject: "Request for review of SEN 201 result",
    description:
      "My result for SEN 201 appears to be inconsistent with the score communicated during the course. I would appreciate a review of the submitted result.",
    programme: "Software Engineering",
    level: "400 Level",
    courseCode: "SEN 201",
    submittedAt: "2026-10-23",
    priority: "High",
    status: "More Information Required",
    reviewerComment: "Please provide the relevant examination details or supporting evidence.",
    reviewedAt: "2026-10-24",
  },
  {
    id: "5",
    reference: "REQ-2026-005",
    requester: "Joseph Ojo",
    requesterType: "Staff",
    identifier: "EDU/ST/030",
    email: "joseph.ojo@example.com",
    requestType: "Permission Request",
    subject: "Permission to attend an academic conference",
    description:
      "I am requesting permission to attend an academic conference relevant to my area of specialization.",
    submittedAt: "2026-10-20",
    priority: "Normal",
    status: "Declined",
    reviewerComment: "The request cannot be approved for the proposed dates due to departmental scheduling commitments.",
    reviewedAt: "2026-10-21",
  },
  {
    id: "6",
    reference: "REQ-2026-006",
    requester: "Samuel Adeyemi",
    requesterType: "Student",
    identifier: "SE/2024/008",
    email: "samuel.adeyemi@example.com",
    requestType: "Course Add/Drop",
    subject: "Request to add CSC 201",
    description:
      "I would like to request permission to add CSC 201 to my registered courses for this semester.",
    programme: "Computer Science",
    level: "200 Level",
    courseCode: "CSC 201",
    submittedAt: "2026-10-18",
    priority: "Normal",
    status: "Pending",
  },
];

const statusStyles: Record<RequestStatus, string> = {
  Pending: "bg-amber-50 text-amber-700 border-amber-200",
  Approved: "bg-green-50 text-green-700 border-green-200",
  Declined: "bg-red-50 text-red-700 border-red-200",
  "More Information Required":
    "bg-blue-50 text-blue-700 border-blue-200",
};

const priorityStyles: Record<RequestPriority, string> = {
  Normal: "bg-gray-100 text-gray-600",
  High: "bg-red-50 text-red-700",
};

const Requests = () => {
  const [requests, setRequests] =
    useState<DepartmentRequest[]>(initialRequests);

  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState("All");
  const [typeFilter, setTypeFilter] = useState("All");
  const [categoryFilter, setCategoryFilter] = useState("All");
  const [selectedRequest, setSelectedRequest] =
    useState<DepartmentRequest | null>(null);

  const [decisionComment, setDecisionComment] = useState("");
  const [actionType, setActionType] = useState<
    "Approved" | "Declined" | "More Information Required" | null
  >(null);

  const [actionError, setActionError] = useState("");

  const filteredRequests = useMemo(() => {
    const query = search.toLowerCase().trim();

    return requests.filter((request) => {
      const matchesSearch =
        !query ||
        request.requester.toLowerCase().includes(query) ||
        request.identifier.toLowerCase().includes(query) ||
        request.reference.toLowerCase().includes(query) ||
        request.subject.toLowerCase().includes(query) ||
        request.requestType.toLowerCase().includes(query);

      const matchesStatus =
        statusFilter === "All" || request.status === statusFilter;

      const matchesType =
        typeFilter === "All" || request.requesterType === typeFilter;

      const matchesCategory =
        categoryFilter === "All" ||
        request.requestType === categoryFilter;

      return (
        matchesSearch &&
        matchesStatus &&
        matchesType &&
        matchesCategory
      );
    });
  }, [requests, search, statusFilter, typeFilter, categoryFilter]);

  const stats = useMemo(
    () => ({
      total: requests.length,
      pending: requests.filter((r) => r.status === "Pending").length,
      approved: requests.filter((r) => r.status === "Approved").length,
      declined: requests.filter((r) => r.status === "Declined").length,
      needsInformation: requests.filter(
        (r) => r.status === "More Information Required"
      ).length,
    }),
    [requests]
  );

  const closeDetails = () => {
    setSelectedRequest(null);
    setActionType(null);
    setDecisionComment("");
    setActionError("");
  };

  const beginAction = (
    action: "Approved" | "Declined" | "More Information Required"
  ) => {
    setActionType(action);
    setDecisionComment("");
    setActionError("");
  };

  const submitDecision = () => {
    if (!selectedRequest || !actionType) return;

    if (
      (actionType === "Declined" ||
        actionType === "More Information Required") &&
      !decisionComment.trim()
    ) {
      setActionError(
        "Please provide a comment explaining this decision."
      );
      return;
    }

    const updatedRequest: DepartmentRequest = {
      ...selectedRequest,
      status: actionType,
      reviewerComment: decisionComment.trim() || undefined,
      reviewedAt: new Date().toISOString().slice(0, 10),
    };

    setRequests((previous) =>
      previous.map((request) =>
        request.id === selectedRequest.id ? updatedRequest : request
      )
    );

    closeDetails();
  };

  const resetFilters = () => {
    setSearch("");
    setStatusFilter("All");
    setTypeFilter("All");
    setCategoryFilter("All");
  };

  const categories = Array.from(
    new Set(requests.map((request) => request.requestType))
  );

  return (
    <div className="space-y-6">
      {/* Page Heading */}
      <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-2xl font-bold text-[#0B1524]">
            Requests & Approvals
          </h1>
          <p className="mt-1 text-sm text-gray-500">
            Review and manage requests submitted by departmental students and staff.
          </p>
        </div>

        <div className="flex items-center gap-2 rounded-lg border border-gray-200 bg-white px-3 py-2 text-sm text-gray-600">
          <FileText size={17} />
          <span>{stats.pending} requests awaiting review</span>
        </div>
      </div>

      {/* Statistics */}
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-4">
        <StatCard
          label="Total Requests"
          value={stats.total}
          icon={<FileText size={20} />}
          iconBg="bg-blue-50"
          iconColor="text-blue-700"
        />
        <StatCard
          label="Pending Review"
          value={stats.pending}
          icon={<Clock3 size={20} />}
          iconBg="bg-amber-50"
          iconColor="text-amber-700"
        />
        <StatCard
          label="Approved"
          value={stats.approved}
          icon={<CheckCircle2 size={20} />}
          iconBg="bg-green-50"
          iconColor="text-green-700"
        />
        <StatCard
          label="Declined"
          value={stats.declined}
          icon={<XCircle size={20} />}
          iconBg="bg-red-50"
          iconColor="text-red-700"
        />
      </div>

      {/* Additional status information */}
      {stats.needsInformation > 0 && (
        <div className="flex items-start gap-3 rounded-lg border border-blue-200 bg-blue-50 p-4">
          <AlertCircle className="mt-0.5 text-blue-700" size={19} />
          <div>
            <p className="text-sm font-semibold text-blue-900">
              Requests requiring additional information
            </p>
            <p className="mt-1 text-sm text-blue-800">
              {stats.needsInformation} request(s) have been returned to their
              submitters for further information.
            </p>
          </div>
        </div>
      )}

      {/* Filters */}
      <div className="rounded-xl border border-gray-200 bg-white p-4">
        <div className="mb-4 flex flex-col gap-3 lg:flex-row lg:items-center lg:justify-between">
          <h2 className="font-semibold text-[#0B1524]">
            All Requests
          </h2>

          <div className="relative w-full lg:max-w-sm">
            <Search
              size={18}
              className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400"
            />
            <input
              type="text"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Search requester, reference or subject..."
              className="w-full rounded-lg border border-gray-200 py-2.5 pl-10 pr-3 text-sm outline-none focus:border-blue-700"
            />
          </div>
        </div>

        <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 xl:grid-cols-4">
          <FilterSelect
            label="Requester"
            value={typeFilter}
            onChange={setTypeFilter}
            options={["All", "Student", "Staff"]}
          />

          <FilterSelect
            label="Status"
            value={statusFilter}
            onChange={setStatusFilter}
            options={[
              "All",
              "Pending",
              "Approved",
              "Declined",
              "More Information Required",
            ]}
          />

          <div>
            <label className="mb-1.5 block text-xs font-medium text-gray-500">
              Request Category
            </label>
            <select
              value={categoryFilter}
              onChange={(e) => setCategoryFilter(e.target.value)}
              className="w-full rounded-lg border border-gray-200 bg-white px-3 py-2.5 text-sm outline-none focus:border-blue-700"
            >
              <option value="All">All Categories</option>
              {categories.map((category) => (
                <option key={category} value={category}>
                  {category}
                </option>
              ))}
            </select>
          </div>

          <div className="flex items-end">
            <button
              onClick={resetFilters}
              className="w-full rounded-lg border border-gray-200 px-3 py-2.5 text-sm font-medium text-gray-600 transition hover:bg-gray-50"
            >
              Clear Filters
            </button>
          </div>
        </div>
      </div>

      {/* Requests Table */}
      <div className="overflow-hidden rounded-xl border border-gray-200 bg-white">
        <div className="flex items-center justify-between border-b border-gray-100 px-5 py-4">
          <div>
            <h2 className="font-semibold text-[#0B1524]">
              Request Records
            </h2>
            <p className="mt-1 text-xs text-gray-500">
              Showing {filteredRequests.length} of {requests.length} requests
            </p>
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full min-w-[1050px] text-left text-sm">
            <thead className="bg-gray-50 text-xs uppercase tracking-wide text-gray-500">
              <tr>
                <th className="px-5 py-4 font-semibold">Requester</th>
                <th className="px-5 py-4 font-semibold">Request</th>
                <th className="px-5 py-4 font-semibold">Submitted</th>
                <th className="px-5 py-4 font-semibold">Priority</th>
                <th className="px-5 py-4 font-semibold">Status</th>
                <th className="px-5 py-4 text-right font-semibold">Action</th>
              </tr>
            </thead>

            <tbody className="divide-y divide-gray-100">
              {filteredRequests.map((request) => (
                <tr
                  key={request.id}
                  className="transition hover:bg-gray-50"
                >
                  <td className="px-5 py-4">
                    <p className="font-medium text-gray-800">
                      {request.requester}
                    </p>
                    <p className="mt-1 text-xs text-gray-500">
                      {request.identifier}
                    </p>
                    <span className="mt-1 inline-block rounded bg-gray-100 px-2 py-0.5 text-[11px] text-gray-600">
                      {request.requesterType}
                    </span>
                  </td>

                  <td className="px-5 py-4">
                    <p className="font-medium text-gray-800">
                      {request.subject}
                    </p>
                    <p className="mt-1 text-xs text-gray-500">
                      {request.requestType} · {request.reference}
                    </p>
                  </td>

                  <td className="px-5 py-4 text-gray-600">
                    {formatDate(request.submittedAt)}
                  </td>

                  <td className="px-5 py-4">
                    <span
                      className={`rounded-full px-2.5 py-1 text-xs font-medium ${priorityStyles[request.priority]}`}
                    >
                      {request.priority}
                    </span>
                  </td>

                  <td className="px-5 py-4">
                    <StatusBadge status={request.status} />
                  </td>

                  <td className="px-5 py-4 text-right">
                    <button
                      onClick={() => {
                        setSelectedRequest(request);
                        setActionType(null);
                        setDecisionComment("");
                        setActionError("");
                      }}
                      className="inline-flex items-center gap-2 rounded-lg border border-gray-200 px-3 py-2 text-xs font-medium text-[#14263F] transition hover:border-[#14263F] hover:bg-gray-50"
                    >
                      <Eye size={15} />
                      View Details
                    </button>
                  </td>
                </tr>
              ))}

              {filteredRequests.length === 0 && (
                <tr>
                  <td
                    colSpan={6}
                    className="px-5 py-12 text-center text-sm text-gray-500"
                  >
                    No requests match your search or selected filters.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Request Details Modal */}
      {selectedRequest && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4">
          <div className="max-h-[90vh] w-full max-w-2xl overflow-y-auto rounded-xl bg-white shadow-xl">
            <div className="sticky top-0 z-10 flex items-start justify-between border-b border-gray-100 bg-white px-5 py-4">
              <div>
                <p className="text-xs font-medium text-gray-500">
                  {selectedRequest.reference}
                </p>
                <h2 className="mt-1 text-lg font-bold text-[#0B1524]">
                  Request Details
                </h2>
              </div>

              <button
                onClick={closeDetails}
                className="rounded-lg p-2 text-gray-500 hover:bg-gray-100"
                aria-label="Close request details"
              >
                <X size={20} />
              </button>
            </div>

            <div className="space-y-5 p-5">
              {/* Requester */}
              <div className="rounded-lg bg-gray-50 p-4">
                <div className="flex items-center gap-3">
                  <div className="flex h-11 w-11 items-center justify-center rounded-full bg-blue-100 text-blue-700">
                    <UserRound size={21} />
                  </div>
                  <div className="min-w-0 flex-1">
                    <p className="font-semibold text-gray-800">
                      {selectedRequest.requester}
                    </p>
                    <p className="mt-0.5 text-xs text-gray-500">
                      {selectedRequest.requesterType} · {selectedRequest.identifier}
                    </p>
                    <p className="mt-1 break-all text-xs text-gray-500">
                      {selectedRequest.email}
                    </p>
                  </div>
                  <StatusBadge status={selectedRequest.status} />
                </div>
              </div>

              {/* Request information */}
              <div>
                <h3 className="mb-3 text-sm font-semibold text-[#0B1524]">
                  Request Information
                </h3>

                <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                  <DetailField
                    label="Request Type"
                    value={selectedRequest.requestType}
                  />
                  <DetailField
                    label="Date Submitted"
                    value={formatDate(selectedRequest.submittedAt)}
                  />
                  <DetailField
                    label="Priority"
                    value={selectedRequest.priority}
                  />
                  <DetailField
                    label="Course"
                    value={selectedRequest.courseCode || "Not applicable"}
                  />
                  {selectedRequest.programme && (
                    <DetailField
                      label="Programme"
                      value={selectedRequest.programme}
                    />
                  )}
                  {selectedRequest.level && (
                    <DetailField
                      label="Level"
                      value={selectedRequest.level}
                    />
                  )}
                </div>
              </div>

              {/* Description */}
              <div>
                <h3 className="mb-2 text-sm font-semibold text-[#0B1524]">
                  Subject
                </h3>
                <p className="text-sm text-gray-700">
                  {selectedRequest.subject}
                </p>

                <h3 className="mb-2 mt-4 text-sm font-semibold text-[#0B1524]">
                  Description
                </h3>
                <p className="whitespace-pre-wrap rounded-lg border border-gray-100 bg-gray-50 p-4 text-sm leading-6 text-gray-600">
                  {selectedRequest.description}
                </p>
              </div>

              {/* Previous decision */}
              {selectedRequest.reviewerComment && (
                <div className="rounded-lg border border-blue-100 bg-blue-50 p-4">
                  <div className="flex items-center gap-2 text-sm font-semibold text-blue-900">
                    <MessageSquare size={16} />
                    Previous Review Comment
                  </div>
                  <p className="mt-2 text-sm leading-6 text-blue-800">
                    {selectedRequest.reviewerComment}
                  </p>
                  {selectedRequest.reviewedAt && (
                    <p className="mt-2 text-xs text-blue-700">
                      Reviewed on {formatDate(selectedRequest.reviewedAt)}
                    </p>
                  )}
                </div>
              )}

              {/* Decision actions */}
              {selectedRequest.status === "Pending" && (
                <div className="border-t border-gray-100 pt-5">
                  <h3 className="mb-3 text-sm font-semibold text-[#0B1524]">
                    Review Request
                  </h3>

                  {!actionType ? (
                    <div className="flex flex-col gap-2 sm:flex-row">
                      <button
                        onClick={() => beginAction("Approved")}
                        className="flex flex-1 items-center justify-center gap-2 rounded-lg bg-green-600 px-4 py-2.5 text-sm font-medium text-white hover:bg-green-700"
                      >
                        <CheckCircle2 size={17} />
                        Approve Request
                      </button>

                      <button
                        onClick={() => beginAction("More Information Required")}
                        className="flex flex-1 items-center justify-center gap-2 rounded-lg border border-blue-200 px-4 py-2.5 text-sm font-medium text-blue-700 hover:bg-blue-50"
                      >
                        <MessageSquare size={17} />
                        Request Information
                      </button>

                      <button
                        onClick={() => beginAction("Declined")}
                        className="flex flex-1 items-center justify-center gap-2 rounded-lg border border-red-200 px-4 py-2.5 text-sm font-medium text-red-700 hover:bg-red-50"
                      >
                        <XCircle size={17} />
                        Decline
                      </button>
                    </div>
                  ) : (
                    <div className="space-y-3">
                      <div className="rounded-lg bg-gray-50 p-3">
                        <p className="text-sm font-semibold text-gray-800">
                          {actionType === "Approved"
                            ? "Approve this request"
                            : actionType === "Declined"
                              ? "Decline this request"
                              : "Request additional information"}
                        </p>
                        <p className="mt-1 text-xs text-gray-500">
                          {actionType === "Approved"
                            ? "You may include an optional comment."
                            : "Please provide a comment explaining your decision."}
                        </p>
                      </div>

                      <textarea
                        value={decisionComment}
                        onChange={(e) => {
                          setDecisionComment(e.target.value);
                          setActionError("");
                        }}
                        rows={3}
                        placeholder={
                          actionType === "Approved"
                            ? "Optional review comment..."
                            : "Enter your comment..."
                        }
                        className="w-full rounded-lg border border-gray-200 p-3 text-sm outline-none focus:border-blue-700"
                      />

                      {actionError && (
                        <p className="text-xs text-red-600">{actionError}</p>
                      )}

                      <div className="flex flex-col-reverse gap-2 sm:flex-row sm:justify-end">
                        <button
                          onClick={() => {
                            setActionType(null);
                            setDecisionComment("");
                            setActionError("");
                          }}
                          className="rounded-lg border border-gray-200 px-4 py-2.5 text-sm font-medium text-gray-600 hover:bg-gray-50"
                        >
                          Back
                        </button>

                        <button
                          onClick={submitDecision}
                          className={`rounded-lg px-4 py-2.5 text-sm font-medium text-white ${
                            actionType === "Approved"
                              ? "bg-green-600 hover:bg-green-700"
                              : actionType === "Declined"
                                ? "bg-red-600 hover:bg-red-700"
                                : "bg-blue-700 hover:bg-blue-800"
                          }`}
                        >
                          Confirm Decision
                        </button>
                      </div>
                    </div>
                  )}
                </div>
              )}

              {selectedRequest.status !== "Pending" && (
                <div className="rounded-lg border border-gray-200 p-4 text-sm text-gray-600">
                  This request has already been reviewed. Its current status is{" "}
                  <span className="font-semibold">
                    {selectedRequest.status}
                  </span>
                  .
                </div>
              )}

              <div className="flex items-center gap-2 border-t border-gray-100 pt-4 text-xs text-gray-400">
                <CalendarDays size={14} />
                Reference: {selectedRequest.reference}
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

interface StatCardProps {
  label: string;
  value: number;
  icon: React.ReactNode;
  iconBg: string;
  iconColor: string;
}

function StatCard({
  label,
  value,
  icon,
  iconBg,
  iconColor,
}: StatCardProps) {
  return (
    <div className="rounded-xl border border-gray-200 bg-white p-5">
      <div className="flex items-center justify-between">
        <p className="text-sm text-gray-500">{label}</p>
        <div className={`rounded-lg p-2.5 ${iconBg} ${iconColor}`}>
          {icon}
        </div>
      </div>
      <p className="mt-3 text-2xl font-bold text-[#0B1524]">{value}</p>
    </div>
  );
}

interface FilterSelectProps {
  label: string;
  value: string;
  onChange: (value: string) => void;
  options: string[];
}

function FilterSelect({
  label,
  value,
  onChange,
  options,
}: FilterSelectProps) {
  return (
    <div>
      <label className="mb-1.5 block text-xs font-medium text-gray-500">
        {label}
      </label>
      <select
        value={value}
        onChange={(e) => onChange(e.target.value)}
        className="w-full rounded-lg border border-gray-200 bg-white px-3 py-2.5 text-sm outline-none focus:border-blue-700"
      >
        {options.map((option) => (
          <option key={option} value={option}>
            {option === "All" ? `All ${label}s` : option}
          </option>
        ))}
      </select>
    </div>
  );
}

function StatusBadge({ status }: { status: RequestStatus }) {
  return (
    <span
      className={`inline-flex whitespace-nowrap rounded-full border px-2.5 py-1 text-xs font-medium ${statusStyles[status]}`}
    >
      {status}
    </span>
  );
}

function DetailField({
  label,
  value,
}: {
  label: string;
  value: string;
}) {
  return (
    <div>
      <p className="text-xs text-gray-400">{label}</p>
      <p className="mt-1 text-sm font-medium text-gray-700">{value}</p>
    </div>
  );
}

function formatDate(date: string) {
  return new Date(`${date}T00:00:00`).toLocaleDateString("en-GB", {
    day: "2-digit",
    month: "short",
    year: "numeric",
  });
}

export default Requests;
