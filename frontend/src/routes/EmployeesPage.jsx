import { useEffect, useState } from "react";
import { useEmployeeStore } from "../stores/useEmployeeStore";

const EmployeesPage = () => {
  const {
    employees,
    fetchEmployees,
    addEmployee,
    updateEmployee,
    deleteEmployee,
    addAttendance,
    loading,
    error,
  } = useEmployeeStore();

  const [form, setForm] = useState({ name: "", position: "", phone: "" });
  const [editingId, setEditingId] = useState(null);
  const [attendanceStatus, setAttendanceStatus] = useState({});
  const [modal, setModal] = useState({ action: null, employee: null });

  useEffect(() => {
    fetchEmployees();
  }, [fetchEmployees]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (editingId) {
      await updateEmployee(editingId, form);
      setEditingId(null);
    } else {
      await addEmployee(form);
    }
    setForm({ name: "", position: "", phone: "" });
  };

  const handleEdit = (emp) => {
    setModal({ action: "edit", employee: emp });
  };

  const handleDelete = (emp) => {
    setModal({ action: "delete", employee: emp });
  };

  const handleAttendance = async (id, status) => {
    await addAttendance(id, status);
    setAttendanceStatus((prev) => ({ ...prev, [id]: "" })); // Reset select after marking
  };

  const isToday = (date) => {
    const d = new Date(date);
    const now = new Date();
    return (
      d.getFullYear() === now.getFullYear() &&
      d.getMonth() === now.getMonth() &&
      d.getDate() === now.getDate()
    );
  };

  const getTodayAttendance = (emp) =>
    emp.attendance?.find((a) => isToday(a.date));

  // Modal handlers
  const handleModalConfirm = async () => {
    if (modal.action === "edit") {
      setEditingId(modal.employee._id);
      setForm({
        name: modal.employee.name,
        position: modal.employee.position,
        phone: modal.employee.phone,
      });
    } else if (modal.action === "delete") {
      await deleteEmployee(modal.employee._id);
    }
    setModal({ action: null, employee: null });
  };

  const handleModalCancel = () => {
    setModal({ action: null, employee: null });
  };

  return (
    <div className="fixed inset-0 bg-gradient-to-br from-indigo-900 via-gray-900 to-indigo-900 text-gray-100 overflow-hidden">
      <div className="flex items-start justify-center h-full w-full overflow-auto">
        <div
          className={`max-w-6xl mx-auto mt-20 px-6 py-10 bg-gray-900 bg-opacity-50 backdrop-blur-md rounded-3xl shadow-2xl w-full transition-all ${
            modal.action ? "blur-sm pointer-events-none select-none" : ""
          }`}
        >
          <h2 className="text-3xl font-bold mb-6 text-white">Employees</h2>
          {error && <div className="text-red-400 mb-4">{error}</div>}
          <form onSubmit={handleSubmit} className="mb-8 space-y-4">
            <div className="flex flex-wrap gap-4">
              <input
                type="text"
                placeholder="Name"
                value={form.name}
                required
                onChange={(e) =>
                  setForm((f) => ({ ...f, name: e.target.value }))
                }
                className="bg-gray-800 text-white border border-gray-600 px-4 py-2 rounded-lg w-full sm:w-auto"
              />
              <input
                type="text"
                placeholder="Position"
                value={form.position}
                onChange={(e) =>
                  setForm((f) => ({ ...f, position: e.target.value }))
                }
                className="bg-gray-800 text-white border border-gray-600 px-4 py-2 rounded-lg w-full sm:w-auto"
              />
              <input
                type="text"
                placeholder="Phone"
                value={form.phone}
                onChange={(e) =>
                  setForm((f) => ({ ...f, phone: e.target.value }))
                }
                className="bg-gray-800 text-white border border-gray-600 px-4 py-2 rounded-lg w-full sm:w-auto"
              />
              <button
                type="submit"
                className="bg-emerald-500 hover:bg-emerald-600 text-white px-4 py-2 rounded-lg transition"
              >
                {editingId ? "Update" : "Add"}
              </button>
              {editingId && (
                <button
                  type="button"
                  onClick={() => {
                    setEditingId(null);
                    setForm({ name: "", position: "", phone: "" });
                  }}
                  className="ml-2 bg-gray-700 hover:bg-gray-600 text-white px-4 py-2 rounded-lg transition"
                >
                  Cancel
                </button>
              )}
            </div>
          </form>
          {loading && <div className="text-white">Loading...</div>}
          <div className="overflow-x-auto rounded-2xl shadow-2xl bg-gray-900 bg-opacity-30 backdrop-blur-md">
            <table className="min-w-full table-auto divide-y divide-gray-700">
              <thead className="sticky top-0 bg-gray-800">
                <tr>
                  {["Name", "Position", "Phone", "Attendance", "Actions"].map(
                    (col) => (
                      <th
                        key={col}
                        className="px-6 py-3 text-left text-xs font-semibold text-gray-200 uppercase tracking-wide"
                      >
                        {col}
                      </th>
                    )
                  )}
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-700">
                {employees.map((emp) => {
                  const todayAtt = getTodayAttendance(emp);
                  return (
                    <tr key={emp._id}>
                      <td className="px-6 py-4 text-sm text-white">
                        {emp.name}
                      </td>
                      <td className="px-6 py-4 text-sm text-white">
                        {emp.position}
                      </td>
                      <td className="px-6 py-4 text-sm text-white">
                        {emp.phone}
                      </td>
                      <td className="px-6 py-4 text-sm text-white">
                        {todayAtt ? (
                          <span
                            className={`inline-block px-3 py-1 rounded-full text-xs font-semibold ${
                              todayAtt.status === "present"
                                ? "bg-emerald-500 text-white"
                                : "bg-red-500 text-white"
                            }`}
                          >
                            {todayAtt.status.charAt(0).toUpperCase() +
                              todayAtt.status.slice(1)}
                          </span>
                        ) : (
                          <div className="flex items-center gap-2">
                            <select
                              value={attendanceStatus[emp._id] || ""}
                              onChange={(e) =>
                                setAttendanceStatus((prev) => ({
                                  ...prev,
                                  [emp._id]: e.target.value,
                                }))
                              }
                              className="bg-gray-800 border border-gray-600 text-white px-2 py-1 rounded"
                            >
                              <option value="">Mark</option>
                              <option value="present">Present</option>
                              <option value="absent">Absent</option>
                            </select>
                            <button
                              className="bg-emerald-500 hover:bg-emerald-600 text-white px-3 py-1 rounded transition disabled:opacity-50"
                              onClick={() =>
                                attendanceStatus[emp._id] &&
                                handleAttendance(
                                  emp._id,
                                  attendanceStatus[emp._id]
                                )
                              }
                              disabled={!attendanceStatus[emp._id]}
                            >
                              Save
                            </button>
                          </div>
                        )}
                      </td>
                      <td className="px-6 py-4 text-sm text-white">
                        <div className="flex space-x-2">
                          <button
                            className="inline-flex items-center bg-blue-500 hover:bg-blue-600 text-white px-3 py-1 rounded-full transition"
                            onClick={() => handleEdit(emp)}
                          >
                            Edit
                          </button>
                          <button
                            className="inline-flex items-center bg-red-500 hover:bg-red-600 text-white px-3 py-1 rounded-full transition"
                            onClick={() => handleDelete(emp)}
                          >
                            Delete
                          </button>
                        </div>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>
        {/* Confirmation Modal */}
        {modal.action && (
          <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50">
            <div className="bg-gray-800 p-6 rounded-2xl shadow-xl w-full max-w-sm">
              <h3 className="text-lg font-semibold mb-4 text-white">
                {modal.action === "edit"
                  ? "Are you sure you want to edit this employee?"
                  : "Are you sure you want to delete this employee?"}
              </h3>
              <div className="flex justify-end gap-4">
                <button
                  onClick={handleModalCancel}
                  className="px-4 py-2 bg-gray-700 text-gray-200 rounded hover:bg-gray-600 transition"
                >
                  Cancel
                </button>
                <button
                  onClick={handleModalConfirm}
                  className={`px-4 py-2 text-white rounded ${
                    modal.action === "edit"
                      ? "bg-blue-600 hover:bg-blue-700"
                      : "bg-red-600 hover:bg-red-700"
                  } transition`}
                >
                  Confirm
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default EmployeesPage;
