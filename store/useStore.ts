import { create } from "zustand";

export const useStore = create<StoreState>((set) => ({
  providers: [],
  setProviders: (providers) => set({ providers }),

  selectedProvider: null,
  setSelectedProvider: (provider) => set({ selectedProvider: provider }),

  bookings: [],
  setBookings: (bookings: Booking[]) => set({ bookings }),
  addBooking: (booking) =>
    set((state) => ({
      bookings: [...state.bookings, booking],
    })),
}));

