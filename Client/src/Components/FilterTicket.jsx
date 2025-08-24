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

  const {getFilteredTickets} = useContext(TrackForgeContextAPI);

  // handle field change
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFilterSearchForm((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  // handle search
  const handleSearch = (e) => {
    e.preventDefault();
    // remove empty fields before sending
    const filters = Object.fromEntries(
      Object.entries(filterSearchForm).filter(([_, v]) => v !== "")
    );
    getFilteredTickets(filters);
  };

  return (
    <form
      onSubmit={handleSearch}
      className="flex flex-wrap gap-3 p-4 bg-gray-50 rounded-lg shadow"
    >
      {/* Example Inputs */}
      <input
        type="text"
        name="name"
        placeholder="Ticket Name"
        value={filterSearchForm.name}
        onChange={handleChange}
        className="border rounded px-2 py-1"
      />

      <input
        type="text"
        name="projectId"
        placeholder="Project ID"
        value={filterSearchForm.projectId}
        onChange={handleChange}
        className="border rounded px-2 py-1"
      />

      <select
        name="status"
        value={filterSearchForm.status}
        onChange={handleChange}
        className="border rounded px-2 py-1"
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
        className="border rounded px-2 py-1"
      >
        <option value="">Select Priority</option>
        <option value="Low">Low</option>
        <option value="Medium">Medium</option>
        <option value="Critical">Critical</option>
      </select>

      {/* Assigned On */}
      <input
        type="date"
        name="assignedOn"
        value={filterSearchForm.assignedOn}
        onChange={handleChange}
        className="border rounded px-2 py-1"
      />

      {/* Search Button */}
      <button
        type="submit"
        className="bg-blue-500 text-white rounded px-4 py-1"
      >
        Search
      </button>
    </form>
  );
};

export default TicketFilter;
