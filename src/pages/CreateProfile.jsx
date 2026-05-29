import { useEffect, useState } from "react";
import axios from "axios";
import { toast } from "react-toastify";
import { Link } from "react-router-dom";

export default function CreateProfile() {
  const [formData, setFormData] = useState({
    name: "",
    mobile: "",
    email: "",
    vehicleNumber: "",
    upiId: "",
    vehicleCategory: "Passenger", // ✅ Added default state value
  });

  const [imageFile, setImageFile] = useState(null); // ✅ file
  const [preview, setPreview] = useState(""); // ✅ preview url
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    // cleanup preview url
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

    // ✅ basic validation
    if (!file.type.startsWith("image/")) {
      toast.error("Please select an image file");
      return;
    }
    if (file.size > 2 * 1024 * 1024) {
      toast.error("Image must be under 2MB");
      return;
    }

    setImageFile(file);
    const url = URL.createObjectURL(file);
    setPreview(url);
  };

  const uploadImage = async () => {
    if (!imageFile) return ""; // optional

    const fd = new FormData();
    fd.append("image", imageFile);

    const res = await axios.post("http://localhost:5000/api/drivers/upload", fd, {
      headers: { "Content-Type": "multipart/form-data" },
    });

    return res.data?.imageUrl || "";
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    // ✅ required fields
    if (!formData.name || !formData.mobile || !formData.vehicleNumber) {
      toast.warning("Please fill all required fields");
      return;
    }

    setLoading(true);

    try {
      // 1) upload image (if selected)
      const imageUrl = await uploadImage();

      // 2) register driver with imageUrl
      await axios.post("http://localhost:5000/api/drivers/register", {
        ...formData,
        imageUrl,
      });

      toast.success("✅ Registration successful (Waiting for admin approval)");

      // clear form
      setFormData({
        name: "",
        mobile: "",
        email: "",
        vehicleNumber: "",
        upiId: "",
        vehicleCategory: "Passenger", // ✅ Added clear handler fallback
      });
      setImageFile(null);
      setPreview("");
      e.target.reset(); // ✅ clears file input also
    } catch (error) {
      const errMsg = error.response?.data?.message || "Registration failed";
      toast.error(`❌ ${errMsg}`);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-blue-600 pt-20 px-4 pb-10">
      <div className="mx-auto w-full max-w-5xl">
        {/* ✅ HERO CARD (same style as Home/Drivers) */}
        <div className="rounded-3xl border-2 border-black bg-white p-6 shadow-xl">
          <div className="flex items-center justify-between gap-3">
            <div className="text-sm font-black text-black">Driver Registration</div>

            <div className="flex items-center gap-2">
              <Link
                to="/"
                className="rounded-2xl border-2 border-black bg-white px-4 py-2 text-sm font-black text-black shadow-md transition-transform hover:-translate-y-0.5"
              >
                ⬅ Back
              </Link>

              <div className="flex items-center gap-2 rounded-full border-2 border-black bg-white px-3 py-2 text-xs font-black text-black">
                <span className="relative flex h-2.5 w-2.5">
                  <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-green-500 opacity-75" />
                  <span className="relative inline-flex h-2.5 w-2.5 rounded-full bg-green-500" />
                </span>
                Self Register
              </div>
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

        {/* ✅ FORM CARD */}
        <div className="mt-5 rounded-3xl border-2 border-black bg-white p-6 shadow-xl">
          <form onSubmit={handleSubmit} className="grid grid-cols-1 gap-4 md:grid-cols-2">
            <div className="md:col-span-2">
              <label className="text-xs font-black text-black">Driver Name *</label>
              <input
                name="name"
                value={formData.name}
                onChange={handleChange}
                className="mt-1 w-full rounded-2xl border-2 border-black px-4 py-3 font-bold text-black outline-none focus:ring-2 focus:ring-green-500"
                placeholder="Enter driver name"
              />
            </div>

            <div>
              <label className="text-xs font-black text-black">Mobile *</label>
              <input
                name="mobile"
                value={formData.mobile}
                onChange={handleChange}
                className="mt-1 w-full rounded-2xl border-2 border-black px-4 py-3 font-bold text-black outline-none focus:ring-2 focus:ring-green-500"
                placeholder="Enter mobile number"
              />
            </div>

            <div>
              <label className="text-xs font-black text-black">Vehicle Number *</label>
              <input
                name="vehicleNumber"
                value={formData.vehicleNumber}
                onChange={handleChange}
                className="mt-1 w-full rounded-2xl border-2 border-black px-4 py-3 font-bold text-black outline-none focus:ring-2 focus:ring-green-500"
                placeholder="AP XX XXXX"
              />
            </div>

            {/* ✅ NEW VEHICLE CATEGORY DROPDOWN BOX */}
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
                placeholder="Enter email"
              />
            </div>

            <div className="md:col-span-2">
              <label className="text-xs font-black text-black">UPI ID</label>
              <input
                name="upiId"
                value={formData.upiId}
                onChange={handleChange}
                className="mt-1 w-full rounded-2xl border-2 border-black px-4 py-3 font-bold text-black outline-none focus:ring-2 focus:ring-green-500"
                placeholder="example@upi"
              />
            </div>

            {/* ✅ Image upload */}
            <div className="md:col-span-2">
              <label className="text-xs font-black text-black">
                Profile Image (Upload from device) (optional, max 2MB)
              </label>

              <input
                type="file"
                accept="image/*"
                onChange={handleFileChange}
                className="mt-2 block w-full rounded-2xl border-2 border-black bg-white px-4 py-3 font-bold text-black"
              />

              {preview && (
                <div className="mt-3 flex items-center gap-3 rounded-2xl border-2 border-black bg-white p-3">
                  <img
                    src={preview}
                    alt="preview"
                    className="h-20 w-20 rounded-2xl border-2 border-black object-cover"
                  />
                  <div className="text-xs font-black text-black">
                    Preview selected ✅
                  </div>
                </div>
              )}
            </div>

            <div className="md:col-span-2 flex justify-end">
              <button
                type="submit"
                disabled={loading}
                className={[
                  "rounded-2xl border-2 border-green-700 bg-green-500 px-6 py-3 text-sm font-black text-white shadow-md transition-transform",
                  loading ? "opacity-60 cursor-not-allowed" : "hover:-translate-y-0.5",
                ].join(" ")}
              >
                {loading ? "Submitting..." : "Register"}
              </button>
            </div>
          </form>
        </div>

        {/* ✅ NOTE */}
        <div className="mt-4 rounded-3xl border-2 border-black bg-white p-5 shadow-xl">
          <p className="text-xs font-bold text-black">
            After registration, your status will be <b>Pending</b>. Admin will approve you.
          </p>
        </div>
      </div>
    </div>
  );
}