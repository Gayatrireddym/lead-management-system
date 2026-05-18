import { useEffect, useState } from "react";
import axios from "axios";
import "./App.css";

function App() {
  const [name, setName] = useState("");
  const [phone, setPhone] = useState("");
  const [source, setSource] = useState("Call");
  const [leads, setLeads] = useState([]);
  const [search, setSearch] = useState("");

  const API = "http://localhost:5000/leads";

  // Fetch Leads
  const fetchLeads = async () => {
    try {
      const res = await axios.get(API);
      setLeads(res.data);
    } catch (err) {
      console.log(err);
    }
  };

  useEffect(() => {
    fetchLeads();
  }, []);

  // Add Lead
  const addLead = async (e) => {
    e.preventDefault();

    if (!name || !phone || !source) {
      alert("Please fill all fields");
      return;
    }

    try {
      await axios.post(API, {
        name,
        phone,
        source,
      });

      setName("");
      setPhone("");
      setSource("Call");

      fetchLeads();
    } catch (err) {
      console.log(err);
    }
  };

  // Update Status
  const updateStatus = async (id, status) => {
    try {
      await axios.put(`${API}/${id}`, {
        status,
      });

      fetchLeads();
    } catch (err) {
      console.log(err);
    }
  };

  // Delete Lead
  const deleteLead = async (id) => {
    try {
      await axios.delete(`${API}/${id}`);
      fetchLeads();
    } catch (err) {
      console.log(err);
    }
  };

  // Dashboard Counts
  const totalLeads = leads.length;
  const convertedLeads = leads.filter(
    (lead) => lead.status === "Converted",
  ).length;

  const interestedLeads = leads.filter(
    (lead) => lead.status === "Interested",
  ).length;

  // Search Filter
  const filteredLeads = leads.filter((lead) =>
    lead.name.toLowerCase().includes(search.toLowerCase()),
  );

  return (
    <div className="container">
      <h1>Lead Management System</h1>

      {/* Dashboard */}
      <div className="dashboard">
        <div className="card">
          <h3>Total Leads</h3>
          <p>{totalLeads}</p>
        </div>

        <div className="card">
          <h3>Interested</h3>
          <p>{interestedLeads}</p>
        </div>

        <div className="card">
          <h3>Converted</h3>
          <p>{convertedLeads}</p>
        </div>
      </div>
      {/* Form */}
      <form onSubmit={addLead} className="form">
        <input
          type="text"
          placeholder="Enter Name"
          value={name}
          onChange={(e) => setName(e.target.value)}
        />

        <input
          type="text"
          placeholder="Enter Phone"
          value={phone}
          onChange={(e) => setPhone(e.target.value)}
        />

        <select value={source} onChange={(e) => setSource(e.target.value)}>
          <option>Call</option>
          <option>WhatsApp</option>
          <option>Field</option>
        </select>

        <button type="submit">Add Lead</button>
      </form>

      {/* Search */}
      <input
        type="text"
        className="search"
        placeholder="Search Lead"
        value={search}
        onChange={(e) => setSearch(e.target.value)}
      />

      {/* Lead List */}
      <div className="lead-list">
        {filteredLeads.map((lead) => (
          <div key={lead.id} className="lead-card">
            <h3>{lead.name}</h3>
            <p>{lead.phone}</p>
            <p>Source: {lead.source}</p>
            <p>Status: {lead.status}</p>

            <select
              value={lead.status}
              onChange={(e) => updateStatus(lead.id, e.target.value)}
            >
              <option>Interested</option>
              <option>Not Interested</option>
              <option>Converted</option>
            </select>

            <button className="delete-btn" onClick={() => deleteLead(lead.id)}>
              Delete
            </button>
          </div>
        ))}
      </div>
    </div>
  );
}

export default App;
