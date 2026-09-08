import Anthropic from "@anthropic-ai/sdk";

const anthropic = new Anthropic({ apiKey: process.env.ANTHROPIC_API_KEY });

export const CATEGORIES = [
  "plumbing",
  "electrical",
  "carpentry",
  "ac",
  "insulation",
  "flooring",
  "other",
];
export async function classifyProblem(description) {
  const prompt = `أنت نظام تصنيف طلبات صيانة. المستخدم كتب وصف مشكلة (ممكن يحتوي أكثر من مشكلة منفصلة).

أولاً: تحقق هل الوصف يشرح فعلاً مشكلة صيانة مفهومة (سباكة، كهرباء، نجارة، تكييف، عزل، أرضيات، أو غيرها).
- لو الوصف غامض، عشوائي، حروف بدون معنى، أو لا يوصف أي مشكلة واضحة → رجّعي فقط:
{"error":"الوصف غير واضح، يرجى كتابة تفاصيل أوضح عن المشكلة"}

لو الوصف واضح، كملي:
1. افصل الوصف لمشاكل مستقلة لو فيه أكثر من مشكلة واحدة
2. لكل مشكلة حدد category من هذي القائمة فقط: ${CATEGORIES.join(", ")}
3. لكل مشكلة حدد priority: "urgent" (خطر فوري، تسريب، حريق، انقطاع كهرباء كامل...) أو "normal"

رجّع JSON فقط بدون أي نص إضافي، بهذا الشكل بالضبط:
{"requests":[{"description":"...","category":"...","priority":"..."}]}

وصف المستخدم: "${description}"`;

  const response = await anthropic.messages.create({
    model: "claude-sonnet-4-5",
    max_tokens: 1000,
    messages: [{ role: "user", content: prompt }],
  });

  const text = response.content[0].text.trim();
  const cleaned = text.replace(/```json|```/g, "").trim();
  return JSON.parse(cleaned);
}
