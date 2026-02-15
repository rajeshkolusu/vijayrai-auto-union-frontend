function DriverCard({ driver }) {
  return (
    <div
      style={{
        width: "250px",
        border: "1px solid #ddd",
        borderRadius: "10px",
        padding: "15px",
        boxShadow: "0 4px 8px rgba(0,0,0,0.1)",
      }}
    >
      <img
        src={driver.imageUrl}
        alt={driver.name}
        style={{
          width: "100%",
          height: "150px",
          objectFit: "cover",
          borderRadius: "10px",
        }}
      />

      <h3>{driver.name}</h3>
      <p>🚗 {driver.vehicleNumber}</p>
      <p>💰 {driver.upiId}</p>

      <a href={`tel:${driver.mobile}`}>
        <button
          style={{
            width: "100%",
            padding: "10px",
            background: "#28a745",
            color: "white",
            border: "none",
            borderRadius: "5px",
            cursor: "pointer",
          }}
        >
          📞 Call Driver
        </button>
      </a>
    </div>
  );
}

export default DriverCard;
