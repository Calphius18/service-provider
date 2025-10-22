declare interface Provider {
  id: number;
  name: string;
  categoryId: number;
  rating: number;
  pricePerHour: number;
  experienceYears: number;
  description: string;
  image: string;
  gallery?: string[];
  location: {
    lat: number;
    lng: number;
    city: string;
  };
}


declare interface Booking {
  id?: number;
  providerId: number;
  userId: number;
  date: string; // YYYY-MM-DD
  time: string; // HH:mm
  hours: number;
  totalCost: number;
  status: "pending" | "confirmed" | "cancelled";
}

declare interface Category {
  id: number;
  name: string;
  icon: string;
}

declare interface StoreState {
  providers: Provider[];
  setProviders: (providers: Provider[]) => void;

  selectedProvider: Provider | null;
  setSelectedProvider: (provider: Provider | null) => void;

  bookings: Booking[];
  addBooking: (booking: Booking) => void;
}

declare type RootStackParamList = {
  Providers: undefined;
  ProviderDetails: { id: number };
  Bookings?: undefined;
};

// Card that appears in provider list
declare interface ProviderCardProps {
  provider: Provider;
  onPress: () => void;
  category: Category;
}

// Booking modal for selecting date, time, and hours
declare interface BookingModalProps {
  provider: Provider;
  onClose: () => void;
  onConfirm: (booking: Booking) => void;
}

declare interface RatingProps {
  value: number;
  max?: number;
  size?: number;
  color?: string;
}

declare interface ProvidersListProps {
  navigation: any;
}

declare interface ProviderDetailsProps {
  route: { params: { id: number } };
  navigation: any;
}

// User
