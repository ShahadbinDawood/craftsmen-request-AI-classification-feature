import { useState } from "react";
import { Sparkles, Loader2, CheckCircle2, AlertCircle, X } from "lucide-react";
import { classifyProblem, saveRequests } from "../api/client";

const CATEGORIES = [
  "plumbing",
  "electrical",
  "carpentry",
  "ac",
  "insulation",
  "flooring",
  "other",
];
const CATEGORY_LABELS = {
  plumbing: "سباكة",
  electrical: "كهرباء",
  carpentry: "نجارة",
  ac: "تكييف",
  insulation: "عزل",
  flooring: "أرضيات",
  other: "أخرى",
};

const EXAMPLES = [
  { icon: "💧", text: "تسريب مياه يغمر الحمام والكهرباء قاطعة" },
  { icon: "❄️", text: "المكيف ينزل ماء ولا يبرد" },
  { icon: "🔨", text: "باب الغرفة مخلوع من المفصلة" },
];

const MAX_CHARS = 500;

export default function SubmitRequest() {
  const [description, setDescription] = useState("");
  const [suggestions, setSuggestions] = useState(null);
  const [loading, setLoading] = useState(false);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState(false);

  const handleClassify = async () => {
    const trimmed = description.trim();
    if (trimmed.length < 8) {
      setError("اكتب وصف أوضح للمشكلة (٨ أحرف على الأقل)");
      return;
    }
    setLoading(true);
    setError("");
    setSuccess(false);
    try {
      const result = await classifyProblem(trimmed);
      setSuggestions(result.requests);
    } catch (err) {
      const msg =
        err.response?.data?.error || "فشل في تصنيف الطلب، حاول مرة ثانية";
      setError(msg);
    } finally {
      setLoading(false);
    }
  };

  const handleCancel = () => {
    setSuggestions(null);
    setError("");
    setSuccess(false);
  };

  const updateSuggestion = (index, field, value) => {
    setSuggestions((prev) =>
      prev.map((r, i) => (i === index ? { ...r, [field]: value } : r)),
    );
  };

  const removeSuggestion = (index) => {
    setSuggestions((prev) => {
      const updated = prev.filter((_, i) => i !== index);
      return updated.length > 0 ? updated : null;
    });
  };

  const handleSave = async () => {
    setSaving(true);
    setError("");
    try {
      await saveRequests(suggestions);
      setSuccess(true);
      setDescription("");
      setSuggestions(null);
    } catch (err) {
      setError("فشل الحفظ، حاول مرة ثانية");
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="space-y-6">
      {/* بطاقة ترحيبية */}
      <div className="text-center space-y-2 py-2">
        <span className="inline-flex items-center gap-1.5 bg-orange-100 text-orange-700 text-xs font-medium px-3 py-1 rounded-full">
          <Sparkles size={13} /> المساعد الذكي لفحص وصيانة المنشآت
        </span>
        <h1 className="text-2xl font-bold text-slate-800">
          صف مشكلتك وسيقوم الذكاء الاصطناعي بتصنيفها تلقائيًا
        </h1>
      </div>

      {/* أمثلة سريعة */}
      <div className="space-y-2">
        <p className="text-xs text-slate-400 px-1">أمثلة سريعة شائعة:</p>
        <div className="flex flex-wrap gap-2">
          {EXAMPLES.map((ex, i) => (
            <button
              key={i}
              onClick={() => setDescription(ex.text)}
              className="flex items-center gap-1.5 text-sm bg-white border border-slate-200 hover:border-orange-300 hover:bg-orange-50 rounded-full px-3 py-1.5 transition text-slate-600"
            >
              <span>{ex.icon}</span> {ex.text}
            </button>
          ))}
        </div>
      </div>

      {/* حقل الإدخال */}
      <div className="bg-white rounded-2xl shadow-sm border border-slate-200 p-5 space-y-3">
        <textarea
          className="w-full border-none p-2 min-h-[110px] text-slate-700 outline-none transition resize-none"
          placeholder="اكتب ما لاحظته بحرية، أو اذكر أكثر من عطل في رسالة واحدة..."
          value={description}
          maxLength={MAX_CHARS}
          onChange={(e) => setDescription(e.target.value)}
        />

        <div className="flex items-center justify-between border-t border-slate-100 pt-3">
          <span className="text-xs text-slate-400">
            {description.length} / {MAX_CHARS} حرف
          </span>
          <button
            onClick={handleClassify}
            disabled={loading || !description.trim()}
            className="bg-orange-500 hover:bg-orange-600 text-white px-6 py-2.5 rounded-xl font-medium disabled:opacity-40 disabled:hover:bg-orange-500 transition flex items-center justify-center gap-2"
          >
            {loading ? (
              <Loader2 size={18} className="animate-spin" />
            ) : (
              <Sparkles size={16} />
            )}
            {loading ? "جاري التصنيف..." : "تصنيف وتحليل البلاغ"}
          </button>
        </div>
      </div>

      {error && (
        <p className="text-red-600 text-sm flex items-center gap-1.5 px-1">
          <AlertCircle size={16} /> {error}
        </p>
      )}
      {success && (
        <p className="text-green-600 text-sm flex items-center gap-1.5 px-1">
          <CheckCircle2 size={16} /> تم حفظ الطلب بنجاح
        </p>
      )}

      {suggestions && (
        <div className="space-y-3">
          <p className="text-sm text-slate-500 px-1">
            راجع التصنيف وعدله لو تحتاج قبل الحفظ النهائي:
          </p>
          {suggestions.map((req, i) => (
            <div
              key={i}
              className="bg-white rounded-2xl shadow-sm border border-slate-200 p-4 space-y-3 relative"
            >
              <button
                onClick={() => removeSuggestion(i)}
                className="absolute top-3 left-3 text-slate-400 hover:text-red-500 hover:bg-red-50 rounded-full p-1 transition"
                aria-label="حذف هذا الطلب"
              >
                <X size={18} />
              </button>

              <textarea
                className="w-full text-slate-700 text-sm leading-relaxed pl-8 border border-transparent hover:border-slate-200 focus:border-orange-400 focus:ring-2 focus:ring-orange-100 rounded-lg p-2 outline-none transition resize-none bg-transparent"
                value={req.description}
                onChange={(e) =>
                  updateSuggestion(i, "description", e.target.value)
                }
                rows={2}
              />

              <div className="flex flex-col sm:flex-row gap-2">
                <select
                  className="border border-slate-200 rounded-lg px-3 py-2 flex-1 text-sm text-slate-700 bg-slate-50 focus:ring-2 focus:ring-orange-400 outline-none"
                  value={req.category}
                  onChange={(e) =>
                    updateSuggestion(i, "category", e.target.value)
                  }
                >
                  {CATEGORIES.map((c) => (
                    <option key={c} value={c}>
                      {CATEGORY_LABELS[c]}
                    </option>
                  ))}
                </select>
                <select
                  className={`border rounded-lg px-3 py-2 flex-1 text-sm font-medium outline-none focus:ring-2 focus:ring-orange-400 ${
                    req.priority === "urgent"
                      ? "bg-red-50 text-red-700 border-red-200"
                      : "bg-slate-50 text-slate-700 border-slate-200"
                  }`}
                  value={req.priority}
                  onChange={(e) =>
                    updateSuggestion(i, "priority", e.target.value)
                  }
                >
                  <option value="normal">عادي</option>
                  <option value="urgent">عاجل</option>
                </select>
              </div>
            </div>
          ))}

          <div className="flex gap-2">
            <button
              onClick={handleSave}
              disabled={saving}
              className="flex-1 sm:flex-none bg-emerald-600 hover:bg-emerald-700 text-white px-6 py-2.5 rounded-xl font-medium disabled:opacity-40 transition flex items-center justify-center gap-2"
            >
              {saving ? <Loader2 size={18} className="animate-spin" /> : null}
              {saving ? "جاري الحفظ..." : "تأكيد وحفظ"}
            </button>
            <button
              onClick={handleCancel}
              disabled={saving}
              className="flex-1 sm:flex-none bg-white border border-slate-300 text-slate-600 hover:bg-slate-50 px-6 py-2.5 rounded-xl font-medium transition"
            >
              إلغاء
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
