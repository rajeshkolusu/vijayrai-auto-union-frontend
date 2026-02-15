import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { toast } from "react-toastify";

const Login = () => {
  const navigate = useNavigate();

  const [role, setRole] = useState(""); // admin | driver
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [mobile, setMobile] = useState("");
  const [fadeIn, setFadeIn] = useState(false); // for fade-in animation

  useEffect(() => {
    setFadeIn(true); // trigger fade-in on mount
  }, []);

  // ---------- ADMIN LOGIN ----------
  const adminLogin = async () => {
    if (!email || !password) {
      toast.warning("Please enter email and password");
      return;
    }

    try {
      const res = await axios.post("http://localhost:5000/api/admin/login", {
        email,
        password,
      });

      localStorage.setItem("adminToken", res.data.token);
      localStorage.setItem("role", "admin");

      toast.success("✅ Admin login successful");

      setTimeout(() => {
        navigate("/admin");
      }, 1500);
    } catch (err) {
      toast.error("❌ Invalid admin credentials");
    }
  };

  // ---------- DRIVER LOGIN ----------
  const driverLogin = async () => {
    if (!mobile) {
      toast.warning("Please enter mobile number");
      return;
    }

    try {
      const res = await axios.post("http://localhost:5000/api/drivers/login", {
        mobile,
      });

      localStorage.setItem("driverId", res.data.driverId);
      localStorage.setItem("role", "driver");

      toast.success("🚗 Driver login successful");

      setTimeout(() => {
        navigate("/driver/profile");
      }, 1500);
    } catch (err) {
      toast.error("❌ Driver not found or not approved");
    }
  };

  const buttonStyle = (bg) => ({
    padding: "12px",
    width: role === "" ? "100px" : "100%",
    border: "none",
    borderRadius: "6px",
    backgroundColor: bg,
    color: "#ffffff",
    fontWeight: "bold",
    cursor: "pointer",
    transition: "all 0.3s",
    transform: "scale(1)",
    display: "inline-block",
  });

  return (
    <div
      style={{
        minHeight: "100vh",
        width: "100vw",
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        backgroundColor: "#5f03ff",
        padding: "20px",
        boxSizing: "border-box",
      }}
    >
      <div
        style={{
          backgroundColor: "#ffffff",
          padding: "40px 30px",
          borderRadius: "12px",
          boxShadow: "0 10px 25px rgba(0,0,0,0.1)",
          width: "350px",
          maxWidth: "100%",
          textAlign: "center",
          opacity: fadeIn ? 1 : 0,
          transform: fadeIn ? "translateY(0)" : "translateY(20px)",
          transition: "opacity 0.6s ease, transform 0.6s ease",
        }}
      >
        {/* ✅ HERO SCROLL CARD (MATCHING YOUR CURRENT HERO COLORS) */}
        <div
          style={{
            marginBottom: "18px",
            overflow: "hidden",
            borderRadius: "12px",
            border: "2px solid #000",
            backgroundColor: "#5f03ff",
            padding: "10px 10px",
          }}
        >
          <div
            style={{
              display: "inline-flex",
              gap: "70px",
              whiteSpace: "nowrap",
              alignItems: "center",
              animation: "marqueeMove 11s linear infinite",
            }}
            onMouseEnter={(e) => (e.currentTarget.style.animationPlayState = "paused")}
            onMouseLeave={(e) => (e.currentTarget.style.animationPlayState = "running")}
          >
            <span
              style={{
                fontSize: "22px",
                fontWeight: 900,
                letterSpacing: "2px",
                color: "#ffffff",
                textTransform: "uppercase",
              }}
            >
              VIJAYARAI AUTO UNION
            </span>
            <span
              style={{
                fontSize: "22px",
                fontWeight: 900,
                letterSpacing: "2px",
                color: "#ffffff",
                textTransform: "uppercase",
              }}
            >
              VIJAYARAI AUTO UNION
            </span>
            <span
              style={{
                fontSize: "22px",
                fontWeight: 900,
                letterSpacing: "2px",
                color: "#ffffff",
                textTransform: "uppercase",
              }}
            >
              VIJAYARAI AUTO UNION
            </span>
          </div>
        </div>

        {/* ✅ KEYFRAMES FOR HERO MARQUEE */}
        <style>{`
          @keyframes marqueeMove {
            0% { transform: translateX(0%); }
            100% { transform: translateX(-55%); }
          }
        `}</style>

        <h2 style={{ marginBottom: "20px", color: "#333" }}>Login</h2>

        {/* Role Selection */}
        <div style={{ marginBottom: "20px" }}>
          <button
            onClick={() => setRole("admin")}
            style={buttonStyle("#0e01fd")}
            onMouseOver={(e) => (e.target.style.transform = "scale(1.1)")}
            onMouseOut={(e) => (e.target.style.transform = "scale(1)")}
          >
            Admin
          </button>

          <button
            onClick={() => setRole("driver")}
            style={{ ...buttonStyle("#15d40b"), marginLeft: "10px" }}
            onMouseOver={(e) => (e.target.style.transform = "scale(1.1)")}
            onMouseOut={(e) => (e.target.style.transform = "scale(1)")}
          >
            Driver
          </button>
        </div>

        {/* Admin Form */}
        {role === "admin" && (
          <>
            <input
              type="email"
              placeholder="Admin Email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              style={{
                width: "100%",
                padding: "10px",
                marginBottom: "15px",
                borderRadius: "6px",
                border: "1px solid #a9a3a3",
              }}
            />

            <input
              type="password"
              placeholder="Admin Password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              style={{
                width: "100%",
                padding: "10px",
                marginBottom: "20px",
                borderRadius: "6px",
                border: "1px solid #ccc",
              }}
            />

            <button
              onClick={adminLogin}
              style={buttonStyle("#119b25")}
              onMouseOver={(e) => (e.target.style.transform = "scale(1.05)")}
              onMouseOut={(e) => (e.target.style.transform = "scale(1)")}
            >
              Login as Admin
            </button>
          </>
        )}

        {/* Driver Form */}
        {role === "driver" && (
          <>
            <input
              type="text"
              placeholder="Mobile Number"
              value={mobile}
              onChange={(e) => setMobile(e.target.value)}
              style={{
                width: "100%",
                padding: "10px",
                marginBottom: "20px",
                borderRadius: "6px",
                border: "1px solid #ccc",
              }}
            />

            <button
              onClick={driverLogin}
              style={buttonStyle("#b94310")}
              onMouseOver={(e) => (e.target.style.transform = "scale(1.05)")}
              onMouseOut={(e) => (e.target.style.transform = "scale(1)")}
            >
              Login as Driver
            </button>
          </>
        )}
      </div>
    </div>
  );
};

export default Login;
