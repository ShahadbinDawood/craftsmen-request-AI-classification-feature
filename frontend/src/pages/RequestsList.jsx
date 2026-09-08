import { useEffect, useState } from "react";
import { ClipboardList, Loader2 } from "lucide-react";
import { getRequests } from "../api/client";

const CATEGORY_LABELS = {
  plumbing: "سباكة",
  electrical: "كهرباء",
  carpentry: "نجارة",
  ac: "تكييف",
  insulation: "عزل",
  flooring: "أرضيات",
  other: "أخرى",
};

export default function RequestsList() {
  const [requests, setRequests] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    getRequests()
      .then(setRequests)
      .finally(() => setLoading(false));
  }, []);

  return (
    <div className="space-y-5">
      <div className="flex items-center gap-2">
        <div className="bg-orange-100 text-orange-600 p-2 rounded-xl">
          <ClipboardList size={20} />
        </div>
        <h1 className="text-xl font-bold text-slate-800">الطلبات</h1>
      </div>

      {loading && (
        <div className="flex items-center gap-2 text-slate-500 text-sm">
          <Loader2 size={16} className="animate-spin" /> جاري التحميل...
        </div>
      )}

      {!loading && requests.length === 0 && (
        <div className="bg-white rounded-2xl border border-dashed border-slate-300 p-10 text-center text-slate-400">
          لا توجد طلبات بعد
        </div>
      )}

      <div className="space-y-3">
        {requests.map((r) => (
          <div
            key={r.id}
            className="bg-white rounded-2xl shadow-sm border border-slate-200 p-4 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3"
          >
            <div className="flex-1">
              <p className="text-slate-700 text-sm leading-relaxed">
                {r.description}
              </p>
              <p className="text-xs text-slate-400 mt-1.5">
                {new Date(r.createdAt).toLocaleString("ar-SA")}
              </p>
            </div>
            <div className="flex gap-2 shrink-0">
              <span className="text-xs px-3 py-1 bg-orange-50 text-orange-700 rounded-full font-medium">
                {CATEGORY_LABELS[r.category] || r.category}
              </span>
              <span
                className={`text-xs px-3 py-1 rounded-full font-medium ${
                  r.priority === "urgent"
                    ? "bg-red-50 text-red-700"
                    : "bg-slate-100 text-slate-600"
                }`}
              >
                {r.priority === "urgent" ? "عاجل" : "عادي"}
              </span>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
