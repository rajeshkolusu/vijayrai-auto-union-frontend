import { useEffect, useState } from "react";
import { NavLink, useNavigate } from "react-router-dom";
import { toast } from "react-toastify";

export default function Home() {
  const navigate = useNavigate();

  const role = localStorage.getItem("role");
  const adminToken = localStorage.getItem("adminToken");
  const driverId = localStorage.getItem("driverId");

  const isLoggedIn =
    (role === "admin" && !!adminToken) || (role === "driver" && !!driverId);

  const [isSidebarOpen, setIsSidebarOpen] = useState(true);

  useEffect(() => {
    const mq = window.matchMedia("(max-width: 900px)");
    const apply = () => setIsSidebarOpen(!mq.matches);
    apply();
    mq.addEventListener("change", apply);
    return () => mq.removeEventListener("change", apply);
  }, []);

  const closeOnMobile = () => {
    if (window.matchMedia("(max-width: 900px)").matches) setIsSidebarOpen(false);
  };

  const handleLogout = () => {
    localStorage.removeItem("adminToken");
    localStorage.removeItem("driverId");
    localStorage.removeItem("role");
    toast.info("Logged out");
    navigate("/");
  };

  const linkClass = ({ isActive }) =>
    [
      "block w-full rounded-2xl border-2 border-slate-200 bg-white px-4 py-5 text-center text-xl font-black text-slate-900 shadow-lg",
      "transition-transform hover:-translate-y-1 hover:bg-green-500 hover:text-white hover:border-green-700",
      isActive ? "outline outline-2 outline-green-400" : "",
    ].join(" ");

  return (
    <div className="min-h-screen bg-indigo-50">
      {/* TOP BAR */}
      <header className="fixed inset-x-0 top-0 z-50 flex h-14 items-center justify-between border-b-2 border-blue-100 bg-white px-3 sm:px-4">
        <button
          onClick={() => setIsSidebarOpen((v) => !v)}
          className="h-11 w-11 rounded-2xl border-2 border-slate-200 bg-white text-2xl font-black shadow-md transition-transform hover:-translate-y-0.5 active:translate-y-0"
          aria-label="Toggle sidebar"
          title="Menu"
        >
          ☰
        </button>

        <div className="text-xs sm:text-sm font-black text-slate-900 text-center px-2 truncate max-w-[55vw] sm:max-w-none">
          Vijayarai Auto Union Portal
        </div>

        <span className="rounded-full border-2 border-green-200 bg-green-100 px-3 py-2 text-[10px] sm:text-xs font-black text-green-800">
          {isLoggedIn ? `Role: ${role}` : "Guest"}
        </span>
      </header>

      {/* OVERLAY (mobile) */}
      <div
        onClick={() => setIsSidebarOpen(false)}
        className={[
          "fixed inset-0 z-40 bg-black/40 transition-opacity",
          "top-14",
          isSidebarOpen ? "opacity-100 md:hidden" : "pointer-events-none opacity-0",
        ].join(" ")}
      />

      {/* SIDEBAR */}
      <aside
        className={[
          "fixed left-0 top-14 z-50 h-[calc(100vh-56px)] overflow-hidden border-r-2 border-slate-900 bg-slate-500 text-white",
          "transition-all duration-200",
          isSidebarOpen
            ? "w-[85vw] max-w-[320px] md:w-80"
            : "w-0",
        ].join(" ")}
      >
        <div className="flex h-full flex-col gap-3 p-4">
          {/* brand */}
          <div className="flex items-center gap-3 rounded-2xl border-2 border-slate-800 bg-slate-900 p-3">
            <div className="h-3 w-3 rounded-full bg-green-500 shadow-[0_0_0_6px_rgba(34,197,94,0.15)]" />
            <div>
              <div className="text-sm font-black">Auto Union</div>
              <div className="text-xs font-bold text-slate-300">
                Vijayarai Auto Drivers Network
              </div>
            </div>
          </div>

          {/* links */}
          <NavLink to="/drivers" onClick={closeOnMobile} className={linkClass}>
            Drivers
          </NavLink>

          {!isLoggedIn ? (
            <>
              <NavLink to="/login" onClick={closeOnMobile} className={linkClass}>
                Login
              </NavLink>

              <NavLink
                to="/create"
                onClick={closeOnMobile}
                className={linkClass}
              >
                Register as <br /> Driver
              </NavLink>
            </>
          ) : (
            <>
              {role === "admin" && (
                <NavLink
                  to="/admin/approve"
                  onClick={closeOnMobile}
                  className={linkClass}
                >
                  Admin Panel
                </NavLink>
              )}
              {role === "driver" && (
                <NavLink
                  to="/driver/profile"
                  onClick={closeOnMobile}
                  className={linkClass}
                >
                  My Profile
                </NavLink>
              )}
            </>
          )}

          {/* logout */}
          <div className="mt-auto sticky bottom-0 bg-slate-950 pt-2 pb-2">
            <button
              onClick={() => {
                handleLogout();
                closeOnMobile();
              }}
              disabled={!isLoggedIn}
              className={[
                "w-full rounded-2xl border-2 border-red-200 bg-red-500 px-4 py-5 text-xl font-black text-white shadow-lg",
                "transition-transform hover:-translate-y-1 hover:brightness-105",
                !isLoggedIn ? "opacity-60 cursor-not-allowed" : "",
              ].join(" ")}
            >
              Logout
            </button>
          </div>
        </div>
      </aside>

      {/* MAIN */}
      <main
        className={[
          "min-h-screen pt-20 px-3 sm:px-4 pb-10",
          "bg-blue-600",
          isSidebarOpen ? "md:ml-80" : "md:ml-0",
        ].join(" ")}
      >
        <div className="mx-auto w-full max-w-5xl rounded-3xl border-2 border-black bg-white p-4 sm:p-6 shadow-xl">
          <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
            <div className="text-sm font-black text-black">Welcome</div>

            <div className="flex w-fit items-center gap-2 rounded-full border-2 border-black bg-white px-3 py-2 text-xs font-black text-black">
              <span className="relative flex h-2.5 w-2.5">
                <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-green-500 opacity-75" />
                <span className="relative inline-flex h-2.5 w-2.5 rounded-full bg-green-500" />
              </span>
              Live Portal
            </div>
          </div>

          {/* marquee */}
          <div className="mt-4 overflow-hidden rounded-2xl border-2 border-[#6ff2ee] bg-[#6ff2ee] px-3 py-3">
            <div className="flex min-w-max items-center gap-16 sm:gap-24 whitespace-nowrap animate-marquee">
              <span className="text-3xl sm:text-4xl md:text-5xl font-black tracking-widest text-[#3d340c]">
                VIJAYARAI AUTO UNION
              </span>
              <span className="text-3xl sm:text-4xl md:text-5xl font-black tracking-widest text-[#3d340c]">
                VIJAYARAI AUTO UNION
              </span>
              <span className="text-3xl sm:text-4xl md:text-5xl font-black tracking-widest text-[#3d340c]">
                VIJAYARAI AUTO UNION
              </span>
            </div>
          </div>

          <div className="mt-4 h-1 w-full rounded-full bg-black" />

          {/* chips */}
          <div className="mt-4 flex flex-wrap gap-2">
            <span className="rounded-full border-2 border-black bg-[#6ff2ee] px-3 py-2 text-xs font-black text-[#3d340c]">
              Approved Drivers Only Visible Publicly
            </span>
            <span className="rounded-full border-2 border-black bg-[#6ff2ee] px-3 py-2 text-xs font-black text-[#3d340c]">
              Drivers Self Register
            </span>
            <span className="rounded-full border-2 border-black bg-[#6ff2ee] px-3 py-2 text-xs font-black text-[#3d340c]">
              Admin Approves / Rejects
            </span>
          </div>

          {/* info cards */}
          <div className="mt-4 grid grid-cols-1 gap-3 md:grid-cols-2">
            <div className="rounded-2xl border-2 border-black bg-[#6ff2ee] p-4">
              <div className="text-sm font-black text-[#3d340c]">Quick Tip</div>
              <div className="mt-2 text-xs font-bold text-[#3d340c] leading-relaxed">
                Click <span className="font-black">Drivers</span> to view approved
                drivers. Drivers can register and update profile after approval.
              </div>
            </div>

            
          </div>
        </div>
      </main>
    </div>
  );
}
