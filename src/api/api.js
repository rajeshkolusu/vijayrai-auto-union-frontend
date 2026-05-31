import axios from "axios";

const API = axios.create({
  // 🔴 FIXED: Swapped out localhost for your live Choreo API endpoint base path
  baseURL:
    "https://d5816076-422e-4156-8125-98bade78084f-dev.e1-us-east-azure.choreoapis.dev/default/vijayrai-auto-union-backe/v1.0/api",
});

export default API;
