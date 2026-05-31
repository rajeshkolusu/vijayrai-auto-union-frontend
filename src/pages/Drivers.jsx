import { useEffect, useMemo, useState } from "react";
import { Link } from "react-router-dom";
import { toast } from "react-toastify";

export default function Drivers() {
  const [drivers, setDrivers] = useState([]);
  const [loading, setLoading] = useState(true);

  // 🔎 search
  const [search, setSearch] = useState("");

  // 📄 pagination
  const perPage = 9;
  const [page, setPage] = useState(1);

  useEffect(() => {
    fetchApprovedDrivers();
  }, []);

  const fetchApprovedDrivers = async () => {
    try {
      setLoading(true);
      // 🔴 FIXED: Updated native fetch to use your live production Choreo cloud instance path instead of localhost
      const res = await fetch("https://d5816076-422e-4156-8125-98bade78084f-dev.e1-us-east-azure.choreoapis.dev/default/vijayrai-auto-union-backe/v1.0/api/drivers");
      const data = await res.json();
      setDrivers(Array.isArray(data) ? data : []);
    } catch (error) {
      console.error("Error fetching drivers:", error);
      setDrivers([]);
    } finally {
      setLoading(false);
    }
  };

  // ✅ copy UPI
  const copyUpi = async (upiId) => {
    if (!upiId || upiId === "-") {
      toast.warning("No UPI ID to copy");
      return;
    }
    try {
      await navigator.clipboard.writeText(upiId);
      toast.success("✅ UPI copied");
    } catch (err) {
      toast.error("❌ Copy failed (browser blocked)");
    }
  };

  // ✅ filter drivers by name
  const filteredDrivers = useMemo(() => {
    return drivers.filter((driver) =>
      (driver.name || "").toLowerCase().includes(search.toLowerCase().trim())
    );
  }, [drivers, search]);

  // ✅ pagination values
  const totalPages = Math.max(1, Math.ceil(filteredDrivers.length / perPage));

  // if search changes, go to page 1
  useEffect(() => {
    setPage(1);
  }, [search]);

  // if page becomes invalid after filtering
  useEffect(() => {
    if (page > totalPages) setPage(totalPages);
  }, [page, totalPages]);

  const paginatedDrivers = useMemo(() => {
    const start = (page - 1) * perPage;
    return filteredDrivers.slice(start, start + perPage);
  }, [filteredDrivers, page]);

  return (
    <div className="min-h-screen bg-indigo-50">
      <main className="min-h-screen bg-blue-600 pt-20 px-3 sm:px-4 pb-10">
        <div className="mx-auto w-full max-w-5xl">
          {/* HERO CARD */}
          <div className="rounded-3xl border-2 border-black bg-white p-4 sm:p-6 shadow-xl">
            {/* Top row */}
            <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
              <div className="text-sm font-black text-black">Approved Drivers</div>

              <div className="flex flex-wrap items-center gap-2">
                <Link
                  to="/"
                  className="rounded-2xl border-2 border-black bg-white px-4 py-2 text-sm font-black text-black shadow-md transition-transform hover:-translate-y-0.5"
                  title="Back to Home"
                >
                  ⬅ Back
                </Link>

                <div className="flex items-center gap-2 rounded-full border-2 border-black bg-white px-3 py-2 text-xs font-black text-black">
                  <span className="relative flex h-2.5 w-2.5">
                    <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-green-500 opacity-75" />
                    <span className="relative inline-flex h-2.5 w-2.5 rounded-full bg-green-500" />
                  </span>
                  Public View
                </div>
              </div>
            </div>

            {/* Marquee */}
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
                Only Approved Drivers
              </span>
              <span className="rounded-full border-2 border-black bg-[#6ff2ee] px-3 py-2 text-xs font-black text-[#3d340c]">
                Tap Mobile to Call
              </span>
              <span className="rounded-full border-2 border-black bg-[#6ff2ee] px-3 py-2 text-xs font-black text-[#3d340c]">
                Verified by Admin
              </span>
            </div>

            {/* SEARCH BAR */}
            <div className="mt-4 flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
              <label className="text-xs font-black text-black">
                Search by Driver Name
              </label>

              <input
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                placeholder="Type driver name..."
                className="w-full sm:w-[320px] rounded-2xl border-2 border-black bg-white px-4 py-3 text-sm font-bold text-black outline-none focus:ring-4 focus:ring-black/10"
              />
            </div>
          </div>

          {/* CONTENT */}
          <div className="mt-5">
            {loading ? (
              <div className="rounded-3xl border-2 border-black bg-white p-6 font-black text-black shadow-xl">
                Loading drivers...
              </div>
            ) : filteredDrivers.length === 0 ? (
              <div className="rounded-3xl border-2 border-black bg-white p-6 font-black text-black shadow-xl">
                No approved drivers available
              </div>
            ) : (
              <>
                {/* GRID */}
                <div className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-3">
                  {paginatedDrivers.map((driver) => (
                    <div
                      key={driver._id}
                      className="rounded-3xl border-2 border-black bg-white p-5 shadow-xl transition-transform hover:-translate-y-1"
                    >
                      <div className="flex items-center justify-between gap-3">
                        <div className="min-w-0">
                          <div className="text-lg font-black text-black truncate">
                            {driver.name || "Driver"}
                          </div>
                          <div className="mt-1 text-xs font-bold text-black">
                            Vehicle:{" "}
                            <span className="font-black">
                              {driver.vehicleNumber || "-"}
                            </span>
                          </div>
                          
                          {/* ✅ CORRECTED VEHICLE CATEGORY BADGE DESIGN COLORS */}
                          <div className="mt-1.5">
                            <span className={`inline-block px-2 py-0.5 text-[10px] font-black rounded-md border-2 border-black shadow-[1px_1px_0px_0px_rgba(0,0,0,1)] ${
                              driver.vehicleCategory === "Goods Carrier" 
                                ? "bg-yellow-300 text-black" 
                                : "bg-blue-300 text-black"
                            }`}>
                              {driver.vehicleCategory === "Goods Carrier" ? "📦 Goods Carrier" : "🚕 Passenger"}
                            </span>
                          </div>
                        </div>

                        {/* avatar */}
                        <div className="h-14 w-14 shrink-0 overflow-hidden rounded-2xl border-2 border-black bg-[#6ff2ee]">
                          {driver.imageUrl ? (
                            <img
                              src={driver.imageUrl}
                              alt="driver"
                              className="h-full w-full object-cover"
                              onError={(e) =>
                                (e.currentTarget.style.display = "none")
                              }
                            />
                          ) : (
                            <div className="flex h-full w-full items-center justify-center text-xl">
                              👤
                            </div>
                          )}
                        </div>
                      </div>

                      {/* info rows */}
                      <div className="mt-4 space-y-2">
                        <div className="flex items-center justify-between gap-2 rounded-2xl border-2 border-black bg-white px-3 py-2">
                          <span className="text-xs font-black text-black">
                            Mobile
                          </span>
                          <a
                            href={`tel:${driver.mobile}`}
                            className="text-xs font-black text-green-600"
                          >
                            {driver.mobile || "-"}
                          </a>
                        </div>

                        <div className="flex items-center justify-between gap-2 rounded-2xl border-2 border-black bg-white px-3 py-2">
                          <span className="text-xs font-black text-black">
                            Email
                          </span>
                          <span className="text-xs font-bold text-black break-all text-right">
                            {driver.email || "-"}
                          </span>
                        </div>

                        {/* UPI + Copy */}
                        <div className="flex items-center justify-between gap-2 rounded-2xl border-2 border-black bg-white px-3 py-2">
                          <span className="text-xs font-black text-black">UPI</span>

                          <div className="flex items-center gap-2">
                            <span className="text-xs font-bold text-black break-all text-right max-w-[160px]">
                              {driver.upiId || "-"}
                            </span>

                            <button
                              type="button"
                              onClick={() => copyUpi(driver.upiId)}
                              className="shrink-0 rounded-lg border-2 border-black bg-[#6ff2ee] px-2 py-1 text-[11px] font-black text-[#3d340c] transition-transform hover:-translate-y-0.5"
                              title="Copy UPI ID"
                            >
                              Copy
                            </button>
                          </div>
                        </div>
                      </div>

                      {/* Call Now */}
                      <div className="mt-4 flex justify-end">
                        <a
                          href={`tel:${driver.mobile}`}
                          className="rounded-xl border-2 border-green-700 bg-green-500 px-4 py-2 text-sm font-black text-white transition-transform hover:-translate-y-0.5"
                        >
                          Call Now
                        </a>
                      </div>
                    </div>
                  ))}
                </div>

                {/* PAGINATION */}
                <div className="mt-6 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
                  <div className="text-sm font-black text-white">
                    Showing{" "}
                    <span className="text-[#6ff2ee]">
                      {paginatedDrivers.length}
                    </span>{" "}
                    of{" "}
                    <span className="text-[#6ff2ee]">
                      {filteredDrivers.length}
                    </span>{" "}
                    drivers
                  </div>

                  <div className="flex flex-col gap-2 sm:flex-row sm:gap-3">
                    <button
                      onClick={() => setPage((p) => Math.max(1, p - 1))}
                      disabled={page === 1}
                      className={[
                        "rounded-2xl border-2 border-black bg-white px-4 py-3 text-sm font-black text-black shadow-md transition-transform",
                        page === 1
                          ? "opacity-60 cursor-not-allowed"
                          : "hover:-translate-y-0.5",
                      ].join(" ")}
                    >
                      ⬅ Prev
                    </button>

                    <div className="rounded-2xl border-2 border-black bg-white px-4 py-3 text-sm font-black text-black shadow-md text-center">
                      Page {page} / {totalPages}
                    </div>

                    <button
                      onClick={() => setPage((p) => Math.min(totalPages, p + 1))}
                      disabled={page === totalPages}
                      className={[
                        "rounded-2xl border-2 border-black bg-white px-4 py-3 text-sm font-black text-black shadow-md transition-transform",
                        page === totalPages
                          ? "opacity-60 cursor-not-allowed"
                          : "hover:-translate-y-0.5",
                      ].join(" ")}
                    >
                      Next ➡
                    </button>
                  </div>
                </div>
              </>
            )}
          </div>
        </div>
      </main>
    </div>
  );
}