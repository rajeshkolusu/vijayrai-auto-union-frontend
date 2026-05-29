import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { toast } from "react-toastify";

export default function AdminApprove() {
  const navigate = useNavigate();
  const token = localStorage.getItem("adminToken");

  const [pending, setPending] = useState([]);
  const [approved, setApproved] = useState([]);
  const [loading, setLoading] = useState(true);

  // ✅ Animation states
  const [animatingId, setAnimatingId] = useState(null);
  const [actionLoadingId, setActionLoadingId] = useState(null);

  const logout = () => {
    localStorage.removeItem("adminToken");
    localStorage.removeItem("role");
    navigate("/");
  };

  const formatDateTime = (iso) => {
    if (!iso) return "—";
    return new Date(iso).toLocaleString();
  };

  const isToday = (iso) => {
    if (!iso) return false;
    const d = new Date(iso);
    const now = new Date();
    return (
      d.getDate() === now.getDate() &&
      d.getMonth() === now.getMonth() &&
      d.getFullYear() === now.getFullYear()
    );
  };

  const fetchAll = async () => {
    try {
      if (!token) {
        toast.error("Admin not logged in");
        navigate("/");
        return;
      }

      setLoading(true);

      const [pendingRes, approvedRes] = await Promise.all([
        axios.get("http://localhost:5000/api/admin/drivers/pending", {
          headers: { Authorization: `Bearer ${token}` },
        }),
        axios.get("http://localhost:5000/api/admin/drivers/approved", {
          headers: { Authorization: `Bearer ${token}` },
        }),
      ]);

      setPending(pendingRes.data || []);
      setApproved(approvedRes.data || []);
    } catch (err) {
      toast.error("Failed to load drivers");
      if (err?.response?.status === 401) logout();
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchAll();
    // eslint-disable-next-line
  }, []);

  // ✅ Animation wrapper
  const animateAndThen = async (id, fn) => {
    setActionLoadingId(id);
    setAnimatingId(id);

    setTimeout(async () => {
      try {
        await fn();
        await fetchAll();
      } finally {
        setAnimatingId(null);
        setActionLoadingId(null);
      }
    }, 300);
  };

  const approveDriver = (id) => {
    animateAndThen(id, async () => {
      await axios.put(
        `http://localhost:5000/api/admin/drivers/approve/${id}`,
        {},
        { headers: { Authorization: `Bearer ${token}` } }
      );
      toast.success("✅ Driver approved");
    });
  };

  const rejectDriver = (id) => {
    animateAndThen(id, async () => {
      await axios.put(
        `http://localhost:5000/api/admin/drivers/reject/${id}`,
        {},
        { headers: { Authorization: `Bearer ${token}` } }
      );
      toast.info("❌ Driver rejected");
    });
  };

 const deleteDriver = (id) => {
    if (!window.confirm("Are you sure you want to permanently delete this driver?"))
      return;

    animateAndThen(id, async () => {
      // 1. Fixed the URL route by removing the extra "/delete" match string
      await axios.delete(
        `http://localhost:5000/api/admin/drivers/${id}`,
        { headers: { Authorization: `Bearer ${token}` } }
      );
      
      // 2. Optimistic local state update to ensure it vanishes instantly from the screen
      setApproved((prevApproved) => prevApproved.filter((d) => d._id !== id));
      
      toast.success("🗑 Driver permanently deleted");
    });
  };

  const DriverCard = ({ d, showActions, showApprovedTime }) => (
    <div
      className={[
        "rounded-3xl border-2 border-black bg-white p-5 shadow-xl transition-all duration-300",
        "hover:-translate-y-1",
        animatingId === d._id
          ? "scale-95 opacity-0 -translate-y-2"
          : "scale-100 opacity-100",
      ].join(" ")}
    >
      <div className="flex gap-4 items-start">
        <img
          src={d.imageUrl}
          alt="driver"
          className="h-20 w-20 rounded-2xl border-2 border-black object-cover"
        />

        <div className="flex-1">
          <div className="flex items-center gap-2">
            <h3 className="text-lg font-black">{d.name}</h3>

            {showApprovedTime &&
              isToday(d.approvedAt || d.updatedAt) && (
                <span className="rounded-full bg-green-500 px-3 py-1 text-xs font-bold text-white">
                  ✅ Approved Today
                </span>
              )}
          </div>

          <p className="text-sm mt-1"><b>Mobile:</b> {d.mobile}</p>
          <p className="text-sm"><b>Email:</b> {d.email || "—"}</p>
          <p className="text-sm"><b>Vehicle:</b> {d.vehicleNumber}</p>
          <p className="text-sm"><b>UPI:</b> {d.upiId || "—"}</p>

          <p className="text-xs mt-2 opacity-70">
            <b>Registered:</b> {formatDateTime(d.createdAt)}
          </p>

          {showApprovedTime && (
            <p className="text-xs opacity-80">
              <b>Approved:</b>{" "}
              {formatDateTime(d.approvedAt || d.updatedAt)}
            </p>
          )}
        </div>
      </div>

      {showActions && (
        <div className="mt-4 flex gap-2">
          <button
            disabled={actionLoadingId === d._id}
            onClick={() => approveDriver(d._id)}
            className={[
              "rounded-xl bg-green-500 px-4 py-2 text-sm font-bold text-white hover:bg-green-600",
              actionLoadingId === d._id ? "opacity-60 cursor-not-allowed" : "",
            ].join(" ")}
          >
            {actionLoadingId === d._id ? "Processing..." : "✅ Approve"}
          </button>

          <button
            disabled={actionLoadingId === d._id}
            onClick={() => rejectDriver(d._id)}
            className={[
              "rounded-xl bg-yellow-500 px-4 py-2 text-sm font-bold text-white hover:bg-yellow-600",
              actionLoadingId === d._id ? "opacity-60 cursor-not-allowed" : "",
            ].join(" ")}
          >
            {actionLoadingId === d._id ? "Processing..." : "❌ Reject"}
          </button>
        </div>
      )}

      {showApprovedTime && (
        <div className="mt-4 flex justify-end">
          <button
            disabled={actionLoadingId === d._id}
            onClick={() => deleteDriver(d._id)}
            className={[
              "rounded-xl bg-black px-4 py-2 text-sm font-bold text-white hover:bg-red-600",
              actionLoadingId === d._id ? "opacity-60 cursor-not-allowed" : "",
            ].join(" ")}
          >
            {actionLoadingId === d._id ? "Deleting..." : "🗑 Delete"}
          </button>
        </div>
      )}
    </div>
  );

  return (
    <div className="min-h-screen bg-blue-600 pt-20 px-4 pb-8">
      <div className="mx-auto max-w-5xl space-y-6">

        {/* HERO CARD */}
        <div className="rounded-3xl border-2 border-black bg-white p-6 shadow-xl">
          <div className="flex justify-between items-center">
            <h2 className="text-lg font-black">
              Admin – Driver Management
            </h2>

            <div className="flex gap-2">
              <button
                onClick={fetchAll}
                className="rounded-xl bg-green-500 px-4 py-2 text-sm font-bold text-white hover:bg-green-600"
              >
                🔄 Refresh
              </button>

              <button
                onClick={logout}
                className="rounded-xl bg-red-500 px-4 py-2 text-sm font-bold text-white hover:bg-red-600"
              >
                Logout
              </button>
            </div>
          </div>

          <div className="mt-4 overflow-hidden rounded-2xl border-2 border-[#6ff2ee] bg-[#6ff2ee] px-3 py-3">
            <div className="flex min-w-max gap-24 whitespace-nowrap animate-marquee">
              <span className="text-4xl font-black tracking-widest text-[#3d340c]">
                VIJAYARAI AUTO UNION
              </span>
              <span className="text-4xl font-black tracking-widest text-[#3d340c]">
                VIJAYARAI AUTO UNION
              </span>
              <span className="text-4xl font-black tracking-widest text-[#3d340c]">
                VIJAYARAI AUTO UNION
              </span>
            </div>
          </div>
        </div>

        {loading ? (
          <div className="rounded-3xl bg-white p-6 text-center font-black shadow-xl">
            Loading drivers...
          </div>
        ) : (
          <>
            {/* PENDING */}
            <div>
              <h3 className="mb-3 text-lg font-black text-white">
                ⏳ Pending Drivers
              </h3>

              {pending.length === 0 ? (
                <div className="rounded-3xl bg-white p-6 font-bold shadow-xl">
                  No pending drivers
                </div>
              ) : (
                <div className="space-y-4">
                  {pending.map((d) => (
                    <DriverCard
                      key={d._id}
                      d={d}
                      showActions={true}
                      showApprovedTime={false}
                    />
                  ))}
                </div>
              )}
            </div>

            {/* APPROVED */}
            <div>
              <h3 className="mb-3 text-lg font-black text-white">
                ✅ Approved Drivers
              </h3>

              {approved.length === 0 ? (
                <div className="rounded-3xl bg-white p-6 font-bold shadow-xl">
                  No approved drivers
                </div>
              ) : (
                <div className="space-y-4">
                  {approved.map((d) => (
                    <DriverCard
                      key={d._id}
                      d={d}
                      showActions={false}
                      showApprovedTime={true}
                    />
                  ))}
                </div>
              )}
            </div>
          </>
        )}
      </div>
    </div>
  );
}
