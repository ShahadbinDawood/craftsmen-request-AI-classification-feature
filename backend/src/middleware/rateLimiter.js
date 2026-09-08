import rateLimit from "express-rate-limit";

export const classifyLimiter = rateLimit({
  windowMs: 60 * 1000, // دقيقة وحدة
  max: 10, // ١٠ طلبات كحد أقصى بالدقيقة لكل IP
  message: { error: "عدد كبير من الطلبات، حاولي بعد قليل" },
  standardHeaders: true,
  legacyHeaders: false,
});
