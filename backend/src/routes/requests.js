import express from "express";
import db from "../db/db.js";

const router = express.Router();

router.post("/", (req, res) => {
  const { requests } = req.body;
  if (!Array.isArray(requests) || requests.length === 0) {
    return res.status(400).json({ error: "requests array مطلوب" });
  }

  const insert = db.prepare(
    "INSERT INTO requests (description, category, priority, createdAt) VALUES (?, ?, ?, ?)",
  );

  const saved = requests.map((r) => {
    const createdAt = new Date().toISOString();
    const info = insert.run(r.description, r.category, r.priority, createdAt);
    return { id: info.lastInsertRowid, ...r, createdAt };
  });

  res.status(201).json(saved);
});

router.get("/", (req, res) => {
  const all = db.prepare("SELECT * FROM requests ORDER BY id DESC").all();
  res.json(all);
});

export default router;
