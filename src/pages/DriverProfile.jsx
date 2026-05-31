import { useEffect, useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { toast } from "react-toastify";

export default function DriverProfile() {
  const navigate = useNavigate();
  const driverId = localStorage.getItem("driverId");

  const [formData, setFormData] = useState({
    name: "",
    mobile: "",
    email: "",
    vehicleNumber: "",
    imageUrl: "",
    upiId: "",
    vehicleCategory: "Passenger", // ✅ Dynamic state value included
  });

  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  // ✅ new image upload states
  const [imageFile, setImageFile] = useState(null);
  const [preview, setPreview] = useState("");

  // 🔐 LOGOUT
  const handleLogout = () => {
    localStorage.removeItem("role");
    localStorage.removeItem("driverId");
    localStorage.removeItem("token");
    toast.info("Logged out");
    navigate("/");
  };

  // ✅ fetch profile
  useEffect(() => {
    if (!driverId) {
      navigate("/login");
      return;
    }

    const load = async () => {
      try {
        setLoading(true);
        // 🔴 FIXED: Converted hardcoded localhost to relative api endpoint
        const res = await fetch(`/drivers/${driverId}`);
        const data = await res.json();

        setFormData({
          name: data.name || "",
          mobile: data.mobile || "",
          email: data.email || "",
          vehicleNumber: data.vehicleNumber || "",
          imageUrl: data.imageUrl || "",
          upiId: data.upiId || "",
          vehicleCategory: data.vehicleCategory || "Passenger", // ✅ Fallback default matching
        });
      } catch (err) {
        console.error(err);
        toast.error("Failed to load profile");
      } finally {
        setLoading(false);
      }
    };

    load();
  }, [driverId, navigate]);

  // cleanup preview
  useEffect(() => {
    return () => {
      if (preview) URL.revokeObjectURL(preview);
    };
  }, [preview]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((p) => ({ ...p, [name]: value }));
  };

  const handleFileChange = (e) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (!file.type.startsWith("image/")) {
      toast.error("Please select an image file");
      return;
    }
    if (file.size > 2 * 1024 * 1024) {
      toast.error("Image must be under 2MB");
      return;
    }

    setImageFile(file);
    setPreview(URL.createObjectURL(file));
  };

  const uploadImage = async () => {
    if (!imageFile) return formData.imageUrl || "";

    const fd = new FormData();
    fd.append("image", imageFile);

    // 🔴 FIXED: Converted hardcoded localhost to relative api endpoint
    const res = await fetch("/drivers/upload", {
      method: "POST",
      body: fd,
    });

    const data = await res.json();
    if (!res.ok) throw new Error(data?.message || "Image upload failed");

    return data.imageUrl;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!formData.mobile || !formData.vehicleNumber) {
      toast.warning("Please fill required fields (Mobile, Vehicle)");
      return;
    }

    setSaving(true);

    try {
      // 1) upload new image if selected
      const imageUrl = await uploadImage();

      // 2) update profile
      // 🔴 FIXED: Converted hardcoded localhost to relative api endpoint
      const res = await fetch(`/drivers/${driverId}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ ...formData, imageUrl }),
      });

      const data = await res.json();
      if (!res.ok) {
        toast.error(data?.message || "Update failed");
        return;
      }

      // ✅ update local state with new imageUrl
      setFormData((p) => ({ ...p, imageUrl }));
      setImageFile(null);
      setPreview("");

      toast.success("✅ Profile updated successfully");
    } catch (err) {
      console.error(err);
      toast.error(err?.message || "Server error");
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-blue-600 pt-20 px-4">
        <div className="mx-auto w-full max-w-5xl rounded-3xl border-2 border-black bg-white p-6 font-black text-black shadow-xl">
          Loading profile...
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-blue-600 pt-20 px-4 pb-10">
      <div className="mx-auto w-full max-w-5xl">
        {/* HERO CARD */}
        <div className="rounded-3xl border-2 border-black bg-white p-6 shadow-xl">
          <div className="flex items-center justify-between gap-3">
            <div className="text-sm font-black text-black">My Profile</div>

            <div className="flex items-center gap-2">
              <Link
                to="/"
                className="rounded-2xl border-2 border-black bg-white px-4 py-2 text-sm font-black text-black shadow-md transition-transform hover:-translate-y-0.5"
              >
                ⬅ Home
              </Link>

              <button
                onClick={handleLogout}
                className="rounded-2xl border-2 border-red-200 bg-red-500 px-4 py-2 text-sm font-black text-white shadow-md transition-transform hover:-translate-y-0.5 hover:brightness-105"
              >
                Logout
              </button>
            </div>
          </div>

          {/* marquee */}
          <div className="mt-4 overflow-hidden rounded-2xl border-2 border-[#6ff2ee] bg-[#6ff2ee] px-3 py-3">
            <div className="flex min-w-max items-center gap-24 whitespace-nowrap animate-marquee">
              <span className="text-4xl md:text-5xl font-black tracking-widest text-[#3d340c]">
                VIJAYARAI AUTO UNION
              </span>
              <span className="text-4xl md:text-5xl font-black tracking-widest text-[#3d340c]">
                VIJAYARAI AUTO UNION
              </span>
              <span className="text-4xl md:text-5xl font-black tracking-widest text-[#3d340c]">
                VIJAYARAI AUTO UNION
              </span>
            </div>
          </div>

          <div className="mt-4 h-1 w-full rounded-full bg-black" />
        </div>

        {/* FORM */}
        <div className="mt-5 rounded-3xl border-2 border-black bg-white p-6 shadow-xl">
          <form onSubmit={handleSubmit} className="grid grid-cols-1 gap-4 md:grid-cols-2">
            <div className="md:col-span-2">
              <label className="text-xs font-black text-black">Name</label>
              <input
                name="name"
                value={formData.name}
                disabled
                className="mt-1 w-full rounded-2xl border-2 border-black bg-slate-100 px-4 py-3 font-bold text-black"
              />
            </div>

            <div>
              <label className="text-xs font-black text-black">Mobile *</label>
              <input
                name="mobile"
                value={formData.mobile}
                onChange={handleChange}
                className="mt-1 w-full rounded-2xl border-2 border-black px-4 py-3 font-bold text-black outline-none focus:ring-2 focus:ring-green-500"
              />
            </div>

            <div>
              <label className="text-xs font-black text-black">Vehicle Number *</label>
              <input
                name="vehicleNumber"
                value={formData.vehicleNumber}
                onChange={handleChange}
                className="mt-1 w-full rounded-2xl border-2 border-black px-4 py-3 font-bold text-black outline-none focus:ring-2 focus:ring-green-500"
              />
            </div>

            {/* ✅ CONNECTED DRIVER DROPDOWN BOX INTERFACE LINK */}
            <div>
              <label className="text-xs font-black text-black">Vehicle Category *</label>
              <select
                name="vehicleCategory"
                value={formData.vehicleCategory}
                onChange={handleChange}
                className="mt-1 w-full rounded-2xl border-2 border-black bg-white px-4 py-3 font-bold text-black outline-none focus:ring-2 focus:ring-green-500"
              >
                <option value="Passenger">Passenger Service (🚕)</option>
                <option value="Goods Carrier">Goods Carrier (📦)</option>
              </select>
            </div>

            <div>
              <label className="text-xs font-black text-black">Email</label>
              <input
                name="email"
                value={formData.email}
                onChange={handleChange}
                className="mt-1 w-full rounded-2xl border-2 border-black px-4 py-3 font-bold text-black outline-none focus:ring-2 focus:ring-green-500"
              />
            </div>

            <div className="md:col-span-2">
              <label className="text-xs font-black text-black">UPI ID</label>
              <input
                name="upiId"
                value={formData.upiId}
                onChange={handleChange}
                className="mt-1 w-full rounded-2xl border-2 border-black px-4 py-3 font-bold text-black outline-none focus:ring-2 focus:ring-green-500"
              />
            </div>

            {/* ✅ Image upload */}
            <div className="md:col-span-2">
              <label className="text-xs font-black text-black">
                Update Profile Image (optional, max 2MB)
              </label>

              <input
                type="file"
                accept="image/*"
                onChange={handleFileChange}
                className="mt-2 block w-full rounded-2xl border-2 border-black bg-white px-4 py-3 font-bold text-black"
              />

              <div className="mt-3 grid grid-cols-1 gap-3 md:grid-cols-2">
                <div className="rounded-2xl border-2 border-black p-3">
                  <div className="text-xs font-black text-black">Current Image</div>
                  <div className="mt-2">
                    {formData.imageUrl ? (
                      <img
                        src={formData.imageUrl}
                        alt="current"
                        className="h-40 w-full rounded-2xl border-2 border-black object-cover"
                      />
                    ) : (
                      <div className="flex h-40 items-center justify-center rounded-2xl border-2 border-black bg-[#6ff2ee] text-3xl">
                        👤
                      </div>
                    )}
                  </div>
                </div>

                <div className="rounded-2xl border-2 border-black p-3">
                  <div className="text-xs font-black text-black">New Preview</div>
                  <div className="mt-2">
                    {preview ? (
                      <img
                        src={preview}
                        alt="preview"
                        className="h-40 w-full rounded-2xl border-2 border-black object-cover"
                      />
                    ) : (
                      <div className="flex h-40 items-center justify-center rounded-2xl border-2 border-black bg-white text-xs font-bold text-black">
                        Select a file to preview ✅
                      </div>
                    )}
                  </div>
                </div>
              </div>
            </div>

            <div className="md:col-span-2 flex justify-end">
              <button
                type="submit"
                disabled={saving}
                className={[
                  "rounded-2xl border-2 border-green-700 bg-green-500 px-6 py-3 text-sm font-black text-white shadow-md transition-transform",
                  saving ? "opacity-60 cursor-not-allowed" : "hover:-translate-y-0.5",
                ].join(" ")}
              >
                {saving ? "Saving..." : "Save Changes"}
              </button>
            </div>
          </form>
        </div>

        {/* NOTE */}
        <div className="mt-4 rounded-3xl border-2 border-black bg-white p-5 shadow-xl">
          <p className="text-xs font-bold text-black">
            Tip: If you select a new image, it will be uploaded first and then your profile will be updated.
          </p>
        </div>
      </div>
    </div>
  );
}