import { BrowserRouter, Routes, Route, NavLink } from "react-router-dom";
import { ClipboardList, Send, Menu } from "lucide-react";
import logo from "./assets/logo.png";
import SubmitRequest from "./pages/SubmitRequest";
import RequestsList from "./pages/RequestsList";

function App() {
  return (
    <BrowserRouter>
      <div
        className="min-h-screen bg-gradient-to-b from-orange-50/40 to-slate-100"
        dir="rtl"
      >
        <nav className="bg-white/90 backdrop-blur-md shadow-sm sticky top-0 z-10 border-b border-slate-200">
          <div className="max-w-3xl mx-auto px-4 py-3 flex items-center justify-between">
            <img src={logo} alt="أبعاد الهندسة للمقاولات" className="h-9" />
            <div className="flex gap-1 bg-slate-100 rounded-full p-1">
              <NavLink
                to="/"
                end
                className={({ isActive }) =>
                  `flex items-center gap-1.5 px-4 py-1.5 rounded-full text-sm font-medium transition ${
                    isActive
                      ? "bg-white shadow text-orange-600"
                      : "text-slate-500"
                  }`
                }
              >
                <Send size={16} /> إرسال طلب
              </NavLink>
              <NavLink
                to="/requests"
                className={({ isActive }) =>
                  `flex items-center gap-1.5 px-4 py-1.5 rounded-full text-sm font-medium transition ${
                    isActive
                      ? "bg-white shadow text-orange-600"
                      : "text-slate-500"
                  }`
                }
              >
                <ClipboardList size={16} /> الطلبات
              </NavLink>
            </div>
          </div>
        </nav>
        <main className="max-w-3xl mx-auto px-4 py-8">
          <Routes>
            <Route path="/" element={<SubmitRequest />} />
            <Route path="/requests" element={<RequestsList />} />
          </Routes>
        </main>
      </div>
    </BrowserRouter>
  );
}

export default App;
