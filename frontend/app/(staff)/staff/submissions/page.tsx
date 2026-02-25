import React from "react";

const staffSubmissions = [
  {
    id: 1,
    name: "Jane Doe",
    date: "2026-02-20",
    form: "Leave Request",
    status: "Approved",
  },
  {
    id: 2,
    name: "John Smith",
    date: "2026-02-18",
    form: "Sick Leave",
    status: "Pending",
  },
  {
    id: 3,
    name: "Alice Johnson",
    date: "2026-02-15",
    form: "Remote Work",
    status: "Rejected",
  },
];

export default function StaffSubmissionsPage() {
  return (
    <main className="p-8">
      <h1 className="text-2xl font-bold mb-6">Staff Submissions</h1>
      <div className="overflow-x-auto">
        <table className="min-w-full bg-white border border-gray-200 rounded-lg">
          <thead>
            <tr>
              <th className="py-2 px-4 border-b">Name</th>
              <th className="py-2 px-4 border-b">Date</th>
              <th className="py-2 px-4 border-b">Form</th>
              <th className="py-2 px-4 border-b">Status</th>
            </tr>
          </thead>
          <tbody>
            {staffSubmissions.map((submission) => (
              <tr key={submission.id}>
                <td className="py-2 px-4 border-b">{submission.name}</td>
                <td className="py-2 px-4 border-b">{submission.date}</td>
                <td className="py-2 px-4 border-b">{submission.form}</td>
                <td className="py-2 px-4 border-b">{submission.status}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </main>
  );
}
