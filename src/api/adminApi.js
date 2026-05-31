import axios from "axios";

// 🔴 FIXED: Removed hardcoded localhost. Axios will now automatically prepend your Choreo cloud URL!
export const getPendingDrivers = async () => {
  const res = await axios.get("/admin/drivers/pending");
  return res.data;
};

export const approveDriver = async (id) => {
  const res = await axios.put(`/admin/drivers/approve/${id}`);
  return res.data;
};

export const rejectDriver = async (id) => {
  const res = await axios.put(`/admin/drivers/reject/${id}`);
  return res.data;
};
