const express = require("express");
const cors = require("cors");
const pool = require("./db");
require("dotenv").config();

const app = express();

app.use(cors());
app.use(express.json());

// Add Lead
app.post("/leads", async (req, res) => {
  try {
    const { name, phone, source } = req.body;

    if (!name || !phone || !source) {
      return res.status(400).json({
        message: "All fields are required",
      });
    }

    const newLead = await pool.query(
      "INSERT INTO leads (name, phone, source) VALUES ($1, $2, $3) RETURNING *",
      [name, phone, source],
    );

    res.json(newLead.rows[0]);
  } catch (err) {
    console.error(err.message);
  }
});

// Get All Leads
app.get("/leads", async (req, res) => {
  try {
    const allLeads = await pool.query("SELECT * FROM leads ORDER BY id DESC");

    res.json(allLeads.rows);
  } catch (err) {
    console.error(err.message);
  }
});

// Update Lead Status
app.put("/leads/:id", async (req, res) => {
  try {
    const { id } = req.params;
    const { status } = req.body;

    await pool.query("UPDATE leads SET status=$1 WHERE id=$2", [status, id]);

    res.json("Lead Updated");
  } catch (err) {
    console.error(err.message);
  }
});

// Delete Lead
app.delete("/leads/:id", async (req, res) => {
  try {
    const { id } = req.params;

    await pool.query("DELETE FROM leads WHERE id=$1", [id]);

    res.json("Lead Deleted");
  } catch (err) {
    console.error(err.message);
  }
});

app.listen(process.env.PORT, () => {
  console.log(`Server running on port ${process.env.PORT}`);
});
