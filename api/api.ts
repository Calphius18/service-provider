import axios from "axios";

// Automatically switch between local and live API
export const API_BASE =
  __DEV__
    ? "http://10.206.128.164:3000"
    : "https://service-provider-api-iean.onrender.com"; 

// Create axios instance
export const api = axios.create({
  baseURL: API_BASE,
  timeout: 5000,
});

console.log("Using API Base:", API_BASE);

// API methods
export const getProviders = () => api.get<Provider[]>("/providers");
export const getProvider = (id: number) => api.get<Provider>(`/providers/${id}`);
export const getCategories = () => api.get<Category[]>("/categories");
export const postBooking = (booking: Booking) => api.post("/bookings", booking);
export const getBookings = () => api.get<Booking[]>("/bookings");
