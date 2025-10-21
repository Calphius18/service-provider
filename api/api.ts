import axios from "axios";
import Constants from "expo-constants";

// Detect your machine's IP automatically in Expo dev mode
const localhost =
  Constants.expoConfig?.hostUri?.split(":")[0] ??
  "10.206.128.164"; // fallback to your LAN IP

// Construct base URL dynamically
export const API_BASE =
  process.env.NODE_ENV === "development"
    ? `http://${localhost}:3000`
    : "https://your-production-api.com"; // replace with live URL later

// Create axios instance
export const api = axios.create({
  baseURL: API_BASE,
  timeout: 5000,
});

// API methods
export const getProviders = () => api.get<Provider[]>("/providers");
export const getProvider = (id: number) => api.get<Provider>(`/providers/${id}`);
export const getCategories = () => api.get<Category[]>("/categories");
export const postBooking = (booking: Booking) =>
  api.post<Booking>("/bookings", booking);
export const getBookings = () => api.get<Booking[]>("/bookings");
