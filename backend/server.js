const express = require("express");
const app = express();
const cors = require("cors");
const mysql = require("mysql");

app.use(cors());
app.use(express.json());

const db = mysql.createConnection({
    host: "localhost",
    user: "root",
    password: "",
    database: "studentdb"
});

app.get("/courses", (req, res) => {
    const sql = "SELECT * FROM courses";
    db.query(sql, (err, data) => {
        if (err) return res.status(500).json({ error: "Error fetching courses" });
        return res.json(data);
    });
});

app.post("/courses", (req, res) => {
    const { course_name, professor, start_date, end_date } = req.body;
    const sql = "INSERT INTO courses (course_name, professor, start_date, end_date) VALUES (?, ?, ?, ?)";
    db.query(sql, [course_name, professor, start_date, end_date], (err, result) => {
        if (err) return res.status(500).json({ error: "Error creating course" });
        return res.json({ message: "Course added successfully", id: result.insertId });
    });
});


app.get("/assignments", (req, res) => {
    const sql = "SELECT * FROM assignments";
    db.query(sql, (err, data) => {
        if (err) return res.status(500).json({ error: "Error fetching assignments" });
        return res.json(data);
    });
});

app.post("/assignments", (req, res) => {
    const { title, course, due_date, status } = req.body;
    const sql = "INSERT INTO assignments (title, course, due_date, status) VALUES (?, ?, ?, ?)";
    db.query(sql, [title, course, due_date, status], (err, result) => {
        if (err) return res.status(500).json({ error: "Error creating assignment" });
        return res.json({ message: "Assignment added successfully", id: result.insertId });
    });
});

app.put("/assignments/:id", (req, res) => {
    const { id } = req.params;
    const { title, course, due_date, status } = req.body;
    const sql = "UPDATE assignments SET title = ?, course = ?, due_date = ?, status = ? WHERE id = ?";
    db.query(sql, [title, course, due_date, status, id], (err, result) => {
        if (err) return res.status(500).json({ error: "Error updating assignment" });
        if (result.affectedRows === 0) return res.status(404).json({ error: "Assignment not found" });
        return res.json({ message: "Assignment updated successfully" });
    });
});

app.delete("/assignments/:id", (req, res) => {
    const { id } = req.params;
    const sql = "DELETE FROM assignments WHERE id = ?";
    db.query(sql, [id], (err, result) => {
        if (err) return res.status(500).json({ error: "Error deleting assignment" });
        if (result.affectedRows === 0) return res.status(404).json({ error: "Assignment not found" });
        return res.json({ message: "Assignment deleted successfully" });
    });
});


app.listen(8081, () => {
    console.log("Server is listening on port 8081");
});
