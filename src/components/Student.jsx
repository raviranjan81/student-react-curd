import axios from "axios";
import React, { useState } from "react";
import { toast } from "react-toastify";
import useSWR, { mutate } from "swr";
import { FaSpinner } from "react-icons/fa";
import fetcher from "../utils/fetcher";

axios.defaults.baseURL = "http://localhost:8080/api/v1/students";

const Student = () => {
  const {
    data: studentData,
    error: studentError,
    isLoading: studentLoading,
  } = useSWR("/", fetcher);

  const [formSubmitting, setFormSubmitting] = useState(false);
  const [showForm, setShowForm] = useState(false);
  const model = { name: "", email: "", age: "" };
  const [studentForm, setStudentForm] = useState(model);
  const [editId, setEditId] = useState(null);
  const [editForm, setEditForm] = useState(model);

  const handleStudentForm = (e) => {
    const { name, value } = e.target;
    setStudentForm({ ...studentForm, [name]: value });
  };

  const handleEditForm = (e) => {
    const { name, value } = e.target;
    setEditForm({ ...editForm, [name]: value });
  };

  const handleStudentSubmit = async (e) => {
    e.preventDefault();
    try {
      setFormSubmitting(true);
      const { data } = await axios.post("/", studentForm);
      toast.success(data.message);
      setShowForm(false);
      setStudentForm(model);
      mutate("/");
    } catch (err) {
      toast.error(err.response?.data.message || err.message);
    } finally {
      setFormSubmitting(false);
    }
  };

  const handleDelete = async (id) => {
    try {
      const { data } = await axios.delete(`/${id}`);
      toast.success(data.message);
      mutate("/");
    } catch (err) {
      toast.error(err.response?.data.message || err.message);
    }
  };

  const handleEditClick = (student) => {
    setEditId(student._id);
    setEditForm({
      name: student.name,
      email: student.email,
      age: student.age,
    });
  };

  const handleCancelEdit = () => {
    setEditId(null);
    setEditForm(model);
  };

  const handleUpdateSubmit = async (id) => {
    try {
      const { data } = await axios.put(`/${id}`, editForm);
      toast.success(data.message);
      mutate("/");
      setEditId(null);
    } catch (err) {
      toast.error(err.response?.data.message || err.message);
    }
  };

  if (studentError) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-red-50 p-4">
        <div className="bg-white border border-red-300 rounded-md p-6 shadow-md text-center max-w-md w-full">
          <h1 className="text-xl font-semibold text-red-600">Error</h1>
          <p className="mt-2 text-gray-700">
            {studentError.message || "Failed to load students"}
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-tr from-blue-50 to-white p-4 md:p-8">
      <div className="max-w-7xl mx-auto">
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-6 gap-4">
          <h1 className="text-2xl sm:text-3xl font-bold text-gray-800">
            🎓 Students
          </h1>
          <button
            onClick={() => setShowForm(true)}
            className="bg-blue-600 hover:cursor-pointer hover:bg-blue-700 text-white px-4 py-2 rounded-lg shadow transition w-full sm:w-auto"
          >
            + Add Student
          </button>
        </div>

        <div className="bg-white shadow-xl rounded-lg overflow-x-auto">
          <table className="min-w-full text-sm text-left text-gray-600">
            <thead className="bg-gray-100 text-gray-700 uppercase text-xs sm:text-sm">
              <tr>
                <th className="px-4 py-3">Name</th>
                <th className="px-4 py-3">Email</th>
                <th className="px-4 py-3">Age</th>
                <th className="px-4 py-3 text-center">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200">
              {studentData?.students?.length > 0 ? (
                studentData.students.map((student) => (
                  <tr
                    key={student._id}
                    className="hover:bg-gray-50 transition"
                  >
                    <td className="px-4 py-3">
                      {editId === student._id ? (
                        <input
                          type="text"
                          name="name"
                          value={editForm.name}
                          onChange={handleEditForm}
                          className="border px-2 py-1 rounded w-full"
                        />
                      ) : (
                        <span className="capitalize font-medium">
                          {student.name}
                        </span>
                      )}
                    </td>
                    <td className="px-4 py-3">
                      {editId === student._id ? (
                        <input
                          type="email"
                          name="email"
                          value={editForm.email}
                          onChange={handleEditForm}
                          className="border px-2 py-1 rounded w-full"
                        />
                      ) : (
                        student.email
                      )}
                    </td>
                    <td className="px-4 py-3">
                      {editId === student._id ? (
                        <input
                          type="number"
                          name="age"
                          value={editForm.age}
                          onChange={handleEditForm}
                          className="border px-2 py-1 rounded w-full"
                        />
                      ) : (
                        student.age
                      )}
                    </td>
                    <td className="px-4 py-3 text-center space-x-2 whitespace-nowrap">
                      {editId === student._id ? (
                        <>
                          <button
                            onClick={() => handleUpdateSubmit(student._id)}
                            className="bg-green-600 hover:cursor-pointer text-white px-3 py-1 rounded hover:bg-green-700"
                          >
                            Update
                          </button>
                          <button
                            onClick={handleCancelEdit}
                            className="bg-gray-400 hover:cursor-pointer text-white px-3 py-1 rounded hover:bg-gray-500"
                          >
                            Cancel
                          </button>
                        </>
                      ) : (
                        <>
                          <button
                            onClick={() => handleEditClick(student)}
                            className="bg-yellow-500 hover:cursor-pointer text-white px-3 py-1 rounded hover:bg-yellow-600"
                          >
                            Edit
                          </button>
                          <button
                            onClick={() => handleDelete(student._id)}
                            className="bg-red-500 hover:cursor-pointer text-white px-3 py-1 rounded hover:bg-red-600"
                          >
                            Delete
                          </button>
                        </>
                      )}
                    </td>
                  </tr>
                ))
              ) : studentLoading ? (
                <tr>
                  <td colSpan="4" className="text-center py-6">
                    Loading...
                  </td>
                </tr>
              ) : (
                <tr>
                  <td colSpan="4" className="text-center py-6">
                    No students found.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Modal Form */}
      {showForm && (
        <div className="fixed inset-0 bg-black bg-opacity-40 flex justify-center items-center px-4 z-50">
          <div className="bg-white w-full max-w-md p-6 rounded-lg shadow-lg relative">
            <h3 className="text-xl font-bold mb-4 text-gray-800">
              Add Student
            </h3>
            <form onSubmit={handleStudentSubmit} className="space-y-4">
              <div>
                <label className="block mb-1 text-sm font-medium">Name</label>
                <input
                  type="text"
                  name="name"
                  value={studentForm.name}
                  onChange={handleStudentForm}
                  className="w-full px-4 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  placeholder="Enter name"
                />
              </div>
              <div>
                <label className="block mb-1 text-sm font-medium">Email</label>
                <input
                  type="email"
                  name="email"
                  value={studentForm.email}
                  onChange={handleStudentForm}
                  className="w-full px-4 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  placeholder="Enter email"
                />
              </div>
              <div>
                <label className="block mb-1 text-sm font-medium">Age</label>
                <input
                  type="number"
                  name="age"
                  value={studentForm.age}
                  onChange={handleStudentForm}
                  className="w-full px-4 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  placeholder="Enter age"
                />
              </div>
              <div className="flex justify-end space-x-3 pt-3">
                <button
                  type="button"
                  onClick={() => setShowForm(false)}
                  className="px-4 py-2 hover:cursor-pointer rounded-md bg-gray-300 hover:bg-gray-400"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 hover:cursor-pointer rounded-md bg-green-600 text-white hover:bg-green-700 flex items-center gap-2"
                  disabled={formSubmitting}
                >
                  {formSubmitting ? (
                    <>
                      <FaSpinner className="animate-spin" />
                      Saving...
                    </>
                  ) : (
                    "Submit"
                  )}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default Student;
