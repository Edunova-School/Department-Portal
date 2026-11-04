import { useMemo, useState } from "react";
import {
  Search,
  FileText,
  Clock,
  CheckCircle2,
  RotateCcw,
  Eye,
  X,
  ChevronDown,
  AlertCircle,
} from "lucide-react";

type ResultStatus = "Pending Review" | "Approved" | "Returned";

interface StudentScore {
  matricNumber: string;
  studentName: string;
  caScore: number;
  examScore: number;
  total: number;
  grade: string;
}

interface ResultSubmission {
  id: number;
  courseCode: string;
  courseTitle: string;
  programme: string;
  level: string;
  semester: string;
  session: string;
  lecturer: string;
  submissionDate: string;
  status: ResultStatus;
  students: StudentScore[];
  feedback?: string;
}

const initialResults: ResultSubmission[] = [
  {
    id: 1,
    courseCode: "SEN 101",
    courseTitle: "Introduction to Software Engineering",
    programme: "Software Engineering",
    level: "100",
    semester: "First Semester",
    session: "2026/2027",
    lecturer: "Dr. Samuel Adeyemi",
    submissionDate: "2026-10-20",
    status: "Pending Review",
    students: [
      {
        matricNumber: "EDU/SE/2026/001",
        studentName: "David Akinola",
        caScore: 25,
        examScore: 60,
        total: 85,
        grade: "A",
      },
      {
        matricNumber: "EDU/SE/2026/002",
        studentName: "Esther Oladipo",
        caScore: 22,
        examScore: 55,
        total: 77,
        grade: "A",
      },
      {
        matricNumber: "EDU/SE/2026/003",
        studentName: "Daniel Okafor",
        caScore: 18,
        examScore: 48,
        total: 66,
        grade: "B",
      },
      {
        matricNumber: "EDU/SE/2026/004",
        studentName: "Mary Johnson",
        caScore: 15,
        examScore: 42,
        total: 57,
        grade: "C",
      },
    ],
  },
  {
    id: 2,
    courseCode: "CSC 201",
    courseTitle: "Data Structures and Algorithms",
    programme: "Computer Science",
    level: "200",
    semester: "First Semester",
    session: "2026/2027",
    lecturer: "Dr. Grace Oladipo",
    submissionDate: "2026-10-21",
    status: "Pending Review",
    students: [
      {
        matricNumber: "EDU/CS/2025/014",
        studentName: "Michael Adewale",
        caScore: 20,
        examScore: 54,
        total: 74,
        grade: "A",
      },
      {
        matricNumber: "EDU/CS/2025/015",
        studentName: "Samuel Ojo",
        caScore: 17,
        examScore: 45,
        total: 62,
        grade: "B",
      },
      {
        matricNumber: "EDU/CS/2025/016",
        studentName: "Faith Adebayo",
        caScore: 12,
        examScore: 38,
        total: 50,
        grade: "C",
      },
    ],
  },
  {
    id: 3,
    courseCode: "IFT 301",
    courseTitle: "Database Management Systems",
    programme: "Information Technology",
    level: "300",
    semester: "First Semester",
    session: "2026/2027",
    lecturer: "Mr. Michael Akinyemi",
    submissionDate: "2026-10-18",
    status: "Approved",
    students: [
      {
        matricNumber: "EDU/IT/2024/008",
        studentName: "Grace Adebayo",
        caScore: 24,
        examScore: 58,
        total: 82,
        grade: "A",
      },
      {
        matricNumber: "EDU/IT/2024/009",
        studentName: "Peter James",
        caScore: 19,
        examScore: 43,
        total: 62,
        grade: "B",
      },
      {
        matricNumber: "EDU/IT/2024/010",
        studentName: "Esther Ojo",
        caScore: 16,
        examScore: 40,
        total: 56,
        grade: "C",
      },
    ],
  },
  {
    id: 4,
    courseCode: "SEN 302",
    courseTitle: "Software Requirements Engineering",
    programme: "Software Engineering",
    level: "300",
    semester: "First Semester",
    session: "2026/2027",
    lecturer: "Mr. Joseph Ojo",
    submissionDate: "2026-10-22",
    status: "Returned",
    feedback: "Please verify the scores for two students before resubmission.",
    students: [
      {
        matricNumber: "EDU/SE/2024/009",
        studentName: "Joseph Ojo",
        caScore: 20,
        examScore: 55,
        total: 75,
        grade: "A",
      },
      {
        matricNumber: "EDU/SE/2024/010",
        studentName: "Deborah James",
        caScore: 14,
        examScore: 41,
        total: 55,
        grade: "C",
      },
    ],
  },
  {
    id: 5,
    courseCode: "CSC 401",
    courseTitle: "Artificial Intelligence",
    programme: "Computer Science",
    level: "400",
    semester: "Second Semester",
    session: "2026/2027",
    lecturer: "Mr. Joseph Ojo",
    submissionDate: "2026-10-23",
    status: "Pending Review",
    students: [
      {
        matricNumber: "EDU/CS/2023/011",
        studentName: "Daniel Olawale",
        caScore: 23,
        examScore: 57,
        total: 80,
        grade: "A",
      },
      {
        matricNumber: "EDU/CS/2023/012",
        studentName: "Deborah Johnson",
        caScore: 18,
        examScore: 46,
        total: 64,
        grade: "B",
      },
    ],
  },
];

const statusStyles: Record<ResultStatus, string> = {
  "Pending Review": "bg-amber-50 text-amber-700",
  Approved: "bg-green-50 text-green-700",
  Returned: "bg-red-50 text-red-700",
};

const gradeStyles: Record<string, string> = {
  A: "bg-green-50 text-green-700",
  B: "bg-blue-50 text-blue-700",
  C: "bg-amber-50 text-amber-700",
  D: "bg-orange-50 text-orange-700",
  E: "bg-orange-50 text-orange-700",
  F: "bg-red-50 text-red-700",
};

const Results = () => {
  const [results, setResults] = useState<ResultSubmission[]>(initialResults);
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState("All Statuses");
  const [programmeFilter, setProgrammeFilter] = useState("All Programmes");
  const [semesterFilter, setSemesterFilter] = useState("All Semesters");

  const [selectedResult, setSelectedResult] =
    useState<ResultSubmission | null>(null);
  const [showReturnForm, setShowReturnForm] = useState(false);
  const [feedback, setFeedback] = useState("");

  const pendingCount = results.filter(
    (result) => result.status === "Pending Review"
  ).length;

  const approvedCount = results.filter(
    (result) => result.status === "Approved"
  ).length;

  const returnedCount = results.filter(
    (result) => result.status === "Returned"
  ).length;

  const totalStudents = results.reduce(
    (total, result) => total + result.students.length,
    0
  );

  const filteredResults = useMemo(() => {
    return results.filter((result) => {
      const search = searchTerm.toLowerCase();

      const matchesSearch =
        result.courseCode.toLowerCase().includes(search) ||
        result.courseTitle.toLowerCase().includes(search) ||
        result.lecturer.toLowerCase().includes(search);

      const matchesStatus =
        statusFilter === "All Statuses" || result.status === statusFilter;

      const matchesProgramme =
        programmeFilter === "All Programmes" ||
        result.programme === programmeFilter;

      const matchesSemester =
        semesterFilter === "All Semesters" ||
        result.semester === semesterFilter;

      return (
        matchesSearch && matchesStatus && matchesProgramme && matchesSemester
      );
    });
  }, [results, searchTerm, statusFilter, programmeFilter, semesterFilter]);

  const updateResultStatus = (
    resultId: number,
    status: ResultStatus,
    comment?: string
  ) => {
    setResults((current) =>
      current.map((result) =>
        result.id === resultId
          ? { ...result, status, feedback: comment }
          : result
      )
    );

    setSelectedResult((current) =>
      current?.id === resultId
        ? { ...current, status, feedback: comment }
        : current
    );
  };

  const approveResult = () => {
    if (!selectedResult) return;

    updateResultStatus(selectedResult.id, "Approved");
    setShowReturnForm(false);
  };

  const returnResult = () => {
    if (!selectedResult || !feedback.trim()) return;

    updateResultStatus(selectedResult.id, "Returned", feedback.trim());
    setFeedback("");
    setShowReturnForm(false);
  };

  const closeReview = () => {
    setSelectedResult(null);
    setShowReturnForm(false);
    setFeedback("");
  };

  const clearFilters = () => {
    setSearchTerm("");
    setStatusFilter("All Statuses");
    setProgrammeFilter("All Programmes");
    setSemesterFilter("All Semesters");
  };

  const hasActiveFilters =
    searchTerm !== "" ||
    statusFilter !== "All Statuses" ||
    programmeFilter !== "All Programmes" ||
    semesterFilter !== "All Semesters";

  return (
    <div className="space-y-6">
      {/* Page Heading */}
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-2xl font-bold text-[#0B1524]">
            Result Management
          </h1>
          <p className="mt-1 text-sm text-gray-500">
            Review, verify and manage departmental result submissions.
          </p>
        </div>

        <div className="flex items-center gap-2 rounded-lg border border-gray-200 bg-white px-4 py-2.5 text-sm text-gray-600">
          <FileText size={17} className="text-[#B8901F]" />
          2026/2027 Academic Session
        </div>
      </div>

      {/* Statistics */}
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-4">
        <div className="rounded-xl border border-gray-200 bg-white p-5">
          <div className="flex items-center justify-between">
            <div className="rounded-lg bg-blue-50 p-2.5 text-blue-700">
              <FileText size={21} />
            </div>
            <span className="text-xs text-gray-400">All submissions</span>
          </div>
          <p className="mt-4 text-2xl font-bold text-[#0B1524]">
            {results.length}
          </p>
          <p className="mt-1 text-sm text-gray-500">Result Submissions</p>
        </div>

        <div className="rounded-xl border border-gray-200 bg-white p-5">
          <div className="flex items-center justify-between">
            <div className="rounded-lg bg-amber-50 p-2.5 text-amber-700">
              <Clock size={21} />
            </div>
            <span className="text-xs text-gray-400">Requires review</span>
          </div>
          <p className="mt-4 text-2xl font-bold text-[#0B1524]">
            {pendingCount}
          </p>
          <p className="mt-1 text-sm text-gray-500">Pending Review</p>
        </div>

        <div className="rounded-xl border border-gray-200 bg-white p-5">
          <div className="flex items-center justify-between">
            <div className="rounded-lg bg-green-50 p-2.5 text-green-700">
              <CheckCircle2 size={21} />
            </div>
            <span className="text-xs text-gray-400">Successfully reviewed</span>
          </div>
          <p className="mt-4 text-2xl font-bold text-[#0B1524]">
            {approvedCount}
          </p>
          <p className="mt-1 text-sm text-gray-500">Approved Results</p>
        </div>

        <div className="rounded-xl border border-gray-200 bg-white p-5">
          <div className="flex items-center justify-between">
            <div className="rounded-lg bg-red-50 p-2.5 text-red-700">
              <RotateCcw size={21} />
            </div>
            <span className="text-xs text-gray-400">Sent back to lecturers</span>
          </div>
          <p className="mt-4 text-2xl font-bold text-[#0B1524]">
            {returnedCount}
          </p>
          <p className="mt-1 text-sm text-gray-500">Returned Results</p>
        </div>
      </div>

      {/* Results Table */}
      <div className="overflow-hidden rounded-xl border border-gray-200 bg-white">
        <div className="border-b border-gray-100 p-5">
          <div className="flex flex-col gap-3 lg:flex-row lg:items-center lg:justify-between">
            <div>
              <h2 className="font-semibold text-[#0B1524]">
                Submitted Results
              </h2>
              <p className="mt-1 text-sm text-gray-500">
                Review course results submitted by departmental lecturers.
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
                value: statusFilter,
                setValue: setStatusFilter,
                options: [
                  "All Statuses",
                  "Pending Review",
                  "Approved",
                  "Returned",
                ],
              },
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
          <table className="w-full min-w-[950px] text-left">
            <thead className="bg-gray-50">
              <tr className="text-xs font-semibold uppercase tracking-wide text-gray-500">
                <th className="px-5 py-4">Course</th>
                <th className="px-5 py-4">Programme / Level</th>
                <th className="px-5 py-4">Lecturer</th>
                <th className="px-5 py-4">Students</th>
                <th className="px-5 py-4">Submission Date</th>
                <th className="px-5 py-4">Status</th>
                <th className="px-5 py-4 text-right">Action</th>
              </tr>
            </thead>

            <tbody className="divide-y divide-gray-100">
              {filteredResults.length > 0 ? (
                filteredResults.map((result) => (
                  <tr key={result.id} className="transition hover:bg-gray-50/70">
                    <td className="px-5 py-4">
                      <p className="font-semibold text-[#0B1524]">
                        {result.courseCode}
                      </p>
                      <p className="mt-1 text-sm text-gray-500">
                        {result.courseTitle}
                      </p>
                    </td>

                    <td className="px-5 py-4">
                      <p className="text-sm font-medium text-gray-700">
                        {result.programme}
                      </p>
                      <p className="mt-1 text-xs text-gray-500">
                        {result.level} Level
                      </p>
                    </td>

                    <td className="px-5 py-4 text-sm text-gray-600">
                      {result.lecturer}
                    </td>

                    <td className="px-5 py-4 text-sm text-gray-600">
                      {result.students.length}
                    </td>

                    <td className="px-5 py-4 text-sm text-gray-600">
                      {new Date(
                        `${result.submissionDate}T00:00:00`
                      ).toLocaleDateString("en-GB", {
                        day: "2-digit",
                        month: "short",
                        year: "numeric",
                      })}
                    </td>

                    <td className="px-5 py-4">
                      <span
                        className={`inline-flex rounded-full px-2.5 py-1 text-xs font-medium ${statusStyles[result.status]}`}
                      >
                        {result.status}
                      </span>
                    </td>

                    <td className="px-5 py-4 text-right">
                      <button
                        type="button"
                        onClick={() => {
                          setSelectedResult(result);
                          setShowReturnForm(false);
                          setFeedback("");
                        }}
                        className="inline-flex items-center gap-2 rounded-lg border border-gray-200 px-3 py-2 text-sm font-medium text-[#1E3A8A] transition hover:border-[#1E3A8A] hover:bg-blue-50"
                      >
                        <Eye size={15} />
                        Review
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
                    No result submissions match your search or filters.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>

        <div className="flex flex-col gap-2 border-t border-gray-100 px-5 py-4 text-sm text-gray-500 sm:flex-row sm:items-center sm:justify-between">
          <p>
            Showing {filteredResults.length} of {results.length} submissions
          </p>
          <p>{totalStudents} student score records in sample data</p>
        </div>
      </div>

      {/* Result Review Modal */}
      {selectedResult && (
        <div className="fixed inset-0 z-50 flex items-center justify-center overflow-y-auto bg-black/50 p-4">
          <div className="my-auto w-full max-w-4xl overflow-hidden rounded-xl bg-white shadow-xl">
            <div className="flex items-start justify-between border-b border-gray-100 p-5">
              <div>
                <h2 className="text-lg font-semibold text-[#0B1524]">
                  Review Course Results
                </h2>
                <p className="mt-1 text-sm text-gray-500">
                  {selectedResult.courseCode} — {selectedResult.courseTitle}
                </p>
              </div>

              <button
                type="button"
                onClick={closeReview}
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
                    {selectedResult.programme}
                  </p>
                </div>

                <div>
                  <p className="text-xs text-gray-500">Level</p>
                  <p className="mt-1 text-sm font-medium text-[#0B1524]">
                    {selectedResult.level} Level
                  </p>
                </div>

                <div>
                  <p className="text-xs text-gray-500">Semester</p>
                  <p className="mt-1 text-sm font-medium text-[#0B1524]">
                    {selectedResult.semester}
                  </p>
                </div>

                <div>
                  <p className="text-xs text-gray-500">Lecturer</p>
                  <p className="mt-1 text-sm font-medium text-[#0B1524]">
                    {selectedResult.lecturer}
                  </p>
                </div>
              </div>

              <div>
                <div className="mb-3 flex flex-wrap items-center justify-between gap-2">
                  <h3 className="font-semibold text-[#0B1524]">
                    Student Scores
                  </h3>
                  <span className="text-sm text-gray-500">
                    {selectedResult.students.length} students
                  </span>
                </div>

                <div className="overflow-x-auto rounded-lg border border-gray-200">
                  <table className="w-full min-w-[650px] text-left">
                    <thead className="bg-gray-50">
                      <tr className="text-xs font-semibold uppercase text-gray-500">
                        <th className="px-4 py-3">Student</th>
                        <th className="px-4 py-3">CA / 30</th>
                        <th className="px-4 py-3">Exam / 70</th>
                        <th className="px-4 py-3">Total / 100</th>
                        <th className="px-4 py-3">Grade</th>
                      </tr>
                    </thead>

                    <tbody className="divide-y divide-gray-100">
                      {selectedResult.students.map((student) => (
                        <tr key={student.matricNumber}>
                          <td className="px-4 py-3">
                            <p className="text-sm font-medium text-[#0B1524]">
                              {student.studentName}
                            </p>
                            <p className="mt-1 text-xs text-gray-500">
                              {student.matricNumber}
                            </p>
                          </td>

                          <td className="px-4 py-3 text-sm text-gray-600">
                            {student.caScore}
                          </td>

                          <td className="px-4 py-3 text-sm text-gray-600">
                            {student.examScore}
                          </td>

                          <td className="px-4 py-3 text-sm font-semibold text-[#0B1524]">
                            {student.total}
                          </td>

                          <td className="px-4 py-3">
                            <span
                              className={`rounded-full px-2.5 py-1 text-xs font-semibold ${gradeStyles[student.grade] ?? "bg-gray-100 text-gray-600"}`}
                            >
                              {student.grade}
                            </span>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>

              <div className="flex items-center justify-between">
                <span className="text-sm text-gray-500">Submission status</span>
                <span
                  className={`rounded-full px-3 py-1 text-xs font-medium ${statusStyles[selectedResult.status]}`}
                >
                  {selectedResult.status}
                </span>
              </div>

              {selectedResult.feedback && (
                <div className="rounded-lg border border-red-100 bg-red-50 p-4">
                  <p className="flex items-center gap-2 text-sm font-semibold text-red-700">
                    <AlertCircle size={16} />
                    Previous Review Feedback
                  </p>
                  <p className="mt-2 text-sm text-red-700">
                    {selectedResult.feedback}
                  </p>
                </div>
              )}

              {showReturnForm && (
                <div className="space-y-3 rounded-lg border border-gray-200 p-4">
                  <label
                    htmlFor="result-feedback"
                    className="block text-sm font-medium text-gray-700"
                  >
                    Reason for returning this result
                  </label>
                  <textarea
                    id="result-feedback"
                    value={feedback}
                    onChange={(e) => setFeedback(e.target.value)}
                    rows={3}
                    placeholder="Explain what the lecturer needs to correct..."
                    className="w-full resize-none rounded-lg border border-gray-200 px-3 py-2.5 text-sm outline-none focus:border-[#1E3A8A]"
                  />

                  <div className="flex justify-end gap-3">
                    <button
                      type="button"
                      onClick={() => {
                        setShowReturnForm(false);
                        setFeedback("");
                      }}
                      className="rounded-lg border border-gray-200 px-4 py-2 text-sm text-gray-600 hover:bg-gray-50"
                    >
                      Cancel
                    </button>

                    <button
                      type="button"
                      onClick={returnResult}
                      disabled={!feedback.trim()}
                      className="rounded-lg bg-red-600 px-4 py-2 text-sm font-medium text-white transition hover:bg-red-700 disabled:cursor-not-allowed disabled:opacity-50"
                    >
                      Return to Lecturer
                    </button>
                  </div>
                </div>
              )}

              {selectedResult.status === "Pending Review" &&
                !showReturnForm && (
                  <div className="flex flex-col gap-3 border-t border-gray-100 pt-5 sm:flex-row sm:justify-end">
                    <button
                      type="button"
                      onClick={() => setShowReturnForm(true)}
                      className="inline-flex items-center justify-center gap-2 rounded-lg border border-red-200 px-4 py-2.5 text-sm font-medium text-red-600 transition hover:bg-red-50"
                    >
                      <RotateCcw size={16} />
                      Return for Correction
                    </button>

                    <button
                      type="button"
                      onClick={approveResult}
                      className="inline-flex items-center justify-center gap-2 rounded-lg bg-[#1E3A8A] px-4 py-2.5 text-sm font-medium text-white transition hover:bg-[#14263F]"
                    >
                      <CheckCircle2 size={16} />
                      Approve Results
                    </button>
                  </div>
                )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Results;