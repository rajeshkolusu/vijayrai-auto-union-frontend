export const logout = (navigate) => {
  localStorage.removeItem("role");
  localStorage.removeItem("token");
  localStorage.removeItem("driverId");

  navigate("/");
};
