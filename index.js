const express = require("express");
const { PrismaClient } = require("@prisma/client");

const app = express();
app.use(express.json());

const prisma = new PrismaClient();

// ─── Health Check ────────────────────────────────────────────────────────────
app.get("/", (req, res) => {
  res.send("Server is running...");
});

// ─── Get All Students ─────────────────────────────────────────────────────────
app.get("/students", async (req, res) => {
  try {
    const students = await prisma.students.findMany();
    res.status(200).json(students);
  } catch (error) {
    res.status(500).json({ error: "Failed to fetch students" });
  }
});

// ─── Get One Student ──────────────────────────────────────────────────────────
app.get("/students/:roll_no", async (req, res) => {
  try {
    const { roll_no } = req.params;

    const student = await prisma.students.findUnique({
      where: { roll_no },
    });

    if (!student) {
      return res.status(404).json({ error: "Student not found" });
    }

    res.status(200).json(student);
  } catch (error) {
    res.status(500).json({ error: "Failed to fetch student" });
  }
});

// ─── Add New Student ──────────────────────────────────────────────────────────
app.post("/students", async (req, res) => {
  try {
    const { roll_no, name, gender } = req.body;

    const newStudent = await prisma.students.create({
      data: { roll_no, name, gender },
    });

    res.status(201).json(newStudent);
  } catch (error) {
    res.status(500).json({ error: "Failed to add student" });
  }
});

// ─── Update Existing Student ──────────────────────────────────────────────────
app.put("/students", async (req, res) => {
  try {
    const { roll_no, name, gender } = req.body;

    const updatedStudent = await prisma.students.update({
      where: { roll_no },
      data: { name, gender },
    });

    res.status(200).json(updatedStudent);
  } catch (error) {
    res.status(500).json({ error: "Failed to update student" });
  }
});

// ─── Delete Existing Student ──────────────────────────────────────────────────
app.delete("/students", async (req, res) => {
  try {
    const { roll_no } = req.body;

    const deletedStudent = await prisma.students.delete({
      where: { roll_no },
    });

    res.status(200).json(deletedStudent);
  } catch (error) {
    res.status(500).json({ error: "Failed to delete student" });
  }
});

// ─── Start Server ─────────────────────────────────────────────────────────────
app.listen(3000, () => {
  console.log("Server started on http://localhost:3000");
});