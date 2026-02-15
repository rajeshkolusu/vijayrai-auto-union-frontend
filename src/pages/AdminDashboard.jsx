import { useNavigate } from "react-router-dom";

const AdminDashboard = () => {
  const navigate = useNavigate();

  const logout = () => {
    localStorage.removeItem("adminToken");
    navigate("/");
  };

  return (
    <div
      style={{
        minHeight: "100vh",
        backgroundColor: "#0f172a",
        padding: "40px 20px",
        boxSizing: "border-box",
        color: "#fff",
      }}
    >
      {/* HERO CARD */}
      <div
        style={{
          maxWidth: "900px",
          margin: "0 auto",
          backgroundColor: "#ffffff",
          borderRadius: "16px",
          padding: "30px",
          boxShadow: "0 15px 40px rgba(0,0,0,0.3)",
        }}
      >
        {/* Scrolling Banner */}
        <div
          style={{
            overflow: "hidden",
            borderRadius: "12px",
            border: "2px solid #000",
            backgroundColor: "#6ff2ee",
            padding: "12px",
            marginBottom: "25px",
          }}
        >
          <div
            style={{
              display: "inline-flex",
              gap: "80px",
              whiteSpace: "nowrap",
              animation: "marqueeMove 10s linear infinite",
            }}
            onMouseEnter={(e) =>
              (e.currentTarget.style.animationPlayState = "paused")
            }
            onMouseLeave={(e) =>
              (e.currentTarget.style.animationPlayState = "running")
            }
          >
            <span style={heroTextStyle}>ADMIN CONTROL PANEL</span>
            <span style={heroTextStyle}>VIJAYARAI AUTO UNION</span>
            <span style={heroTextStyle}>ADMIN DASHBOARD</span>
          </div>
        </div>

        {/* Title */}
        <h2
          style={{
            textAlign: "center",
            marginBottom: "30px",
            color: "#0f172a",
          }}
        >
          Welcome, Admin 
        </h2>

        {/* Action Cards */}
        <div
          style={{
            display: "flex",
            gap: "20px",
            flexWrap: "wrap",
            justifyContent: "center",
          }}
        >
          {/* Approve Drivers Card */}
          <div
            onClick={() => navigate("/admin/approve")}
            style={cardStyle("#6ff2ee")}
            onMouseEnter={(e) => (e.currentTarget.style.transform = "scale(1.05)")}
            onMouseLeave={(e) => (e.currentTarget.style.transform = "scale(1)")}
          >
            <h3 style={{ color: "#3d340c" }}>Approve Drivers</h3>
            <p style={{ fontSize: "14px", color: "#3d340c" }}>
              Review and approve or reject driver registrations.
            </p>
          </div>

          {/* Logout Card */}
          <div
            onClick={logout}
            style={cardStyle("#ff4d4d")}
            onMouseEnter={(e) => (e.currentTarget.style.transform = "scale(1.05)")}
            onMouseLeave={(e) => (e.currentTarget.style.transform = "scale(1)")}
          >
            <h3 style={{ color: "#ffffff" }}>Logout</h3>
            <p style={{ fontSize: "14px", color: "#ffffff" }}>
              Securely logout from admin panel.
            </p>
          </div>
        </div>
      </div>

      {/* Keyframes */}
      <style>{`
        @keyframes marqueeMove {
          0% { transform: translateX(0%); }
          100% { transform: translateX(-55%); }
        }
      `}</style>
    </div>
  );
};

const heroTextStyle = {
  fontSize: "22px",
  fontWeight: 900,
  letterSpacing: "2px",
  color: "#3d340c",
  textTransform: "uppercase",
};

const cardStyle = (bgColor) => ({
  width: "250px",
  padding: "25px",
  borderRadius: "14px",
  backgroundColor: bgColor,
  cursor: "pointer",
  transition: "transform 0.3s ease",
  boxShadow: "0 10px 25px rgba(0,0,0,0.2)",
  textAlign: "center",
});

export default AdminDashboard;
