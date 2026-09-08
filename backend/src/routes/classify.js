import express from "express";
import { classifyProblem } from "../services/claudeService.js";

const router = express.Router();
router.post("/", async (req, res) => {
  const { description } = req.body;
  if (!description || description.trim().length < 8) {
    return res
      .status(400)
      .json({ error: "الوصف قصير جدًا، يرجى كتابة تفاصيل أوضح" });
  }

  try {
    const result = await classifyProblem(description);
    if (result.error) {
      return res.status(422).json({ error: result.error });
    }
    res.json(result);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "فشل التصنيف", details: err.message });
  }
});
export default router;
