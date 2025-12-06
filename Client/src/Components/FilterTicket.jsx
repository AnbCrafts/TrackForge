import React, { useContext, useState } from "react";
import { TrackForgeContextAPI } from "../ContextAPI/TrackForgeContextAPI";

const TicketFilter = () => {
  const [filterSearchForm, setFilterSearchForm] = useState({
    name: "",
    projectId: "",
    assignedTo: "",
    assignedOn: "",
    validFor: "",
    status: "",
    priority: "",
    createdBy: "",
  });

  const { getFilteredTickets } = useContext(TrackForgeContextAPI);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFilterSearchForm((prev) => ({ ...prev, [name]: value }));
  };

  const handleSearch = (e) => {
    e.preventDefault();
    const filters = Object.fromEntries(
      Object.entries(filterSearchForm).filter(([_, v]) => v !== "")
    );
    getFilteredTickets(filters);
  };

  return (
    <form
      onSubmit={handleSearch}
      className="w-full flex flex-wrap items-center gap-3 p-4 bg-gray-50 rounded-lg shadow-md"
    >
      <input
        type="text"
        name="name"
        placeholder="Ticket Name"
        value={filterSearchForm.name}
        onChange={handleChange}
        className="border border-gray-300 rounded px-3 py-2 w-full sm:w-48 bg-white outline-none focus:ring-2 focus:ring-blue-400"
      />

      <input
        type="text"
        name="projectId"
        placeholder="Project ID"
        value={filterSearchForm.projectId}
        onChange={handleChange}
        className="border border-gray-300 rounded px-3 py-2 w-full sm:w-48 bg-white outline-none focus:ring-2 focus:ring-blue-400"
      />

      <select
        name="status"
        value={filterSearchForm.status}
        onChange={handleChange}
        className="border border-gray-300 rounded px-3 py-2 w-full sm:w-48 bg-white outline-none focus:ring-2 focus:ring-blue-400"
      >
        <option value="">Select Status</option>
        <option value="Active">Active</option>
        <option value="InProgress">In Progress</option>
        <option value="Closed">Closed</option>
      </select>

      <select
        name="priority"
        value={filterSearchForm.priority}
        onChange={handleChange}
        className="border border-gray-300 rounded px-3 py-2 w-full sm:w-48 bg-white outline-none focus:ring-2 focus:ring-blue-400"
      >
        <option value="">Select Priority</option>
        <option value="Low">Low</option>
        <option value="Medium">Medium</option>
        <option value="Critical">Critical</option>
      </select>

      <input
        type="date"
        name="assignedOn"
        value={filterSearchForm.assignedOn}
        onChange={handleChange}
        className="border border-gray-300 rounded px-3 py-2 w-full sm:w-48 bg-white outline-none focus:ring-2 focus:ring-blue-400"
      />

      <button
        type="submit"
        className="bg-blue-600 text-white px-5 py-2 rounded w-full sm:w-auto hover:bg-blue-700 transition"
      >
        Search
      </button>
    </form>
  );
};

export default TicketFilter;
