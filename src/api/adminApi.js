const BASE_URL = "http://localhost:5000/api/admin";

export const getPendingDrivers = async () => {
  const res = await fetch(`${BASE_URL}/drivers/pending`);
  return res.json();
};

export const approveDriver = async (id) => {
  return fetch(`${BASE_URL}/drivers/approve/${id}`, {
    method: "PUT",
  });
};

export const rejectDriver = async (id) => {
  return fetch(`${BASE_URL}/drivers/reject/${id}`, {
    method: "PUT",
  });
};
