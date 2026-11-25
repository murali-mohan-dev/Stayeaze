export interface User {
  id: string;
  name: string;
  email: string;
  phone?: string | null;
  role: 'CUSTOMER' | 'ADMIN';
  avatar?: string | null;
  createdAt: string;
}

export interface RoomCategory {
  id: string;
  hotelId: string;
  name: string;
  description: string;
  basePrice: number;
  capacityAdults: number;
  capacityChildren: number;
  bedType: string;
  sizeSqFt: number;
  images: string[];
  amenities: string[];
  totalRooms: number;
  availableRoomCount?: number;
}

export interface Room {
  id: string;
  hotelId: string;
  categoryId: string;
  roomNumber: string;
  floor: number;
  status: 'AVAILABLE' | 'OCCUPIED' | 'MAINTENANCE';
}

export interface Hotel {
  id: string;
  name: string;
  tagline?: string | null;
  description: string;
  address: string;
  city: string;
  state: string;
  country: string;
  postalCode?: string | null;
  latitude?: number | null;
  longitude?: number | null;
  starRating: number;
  ratingScore: number;
  reviewCount: number;
  startingPrice: number;
  featured: boolean;
  images: string[];
  amenities: string[];
  checkInTime: string;
  checkOutTime: string;
  contactEmail: string;
  contactPhone: string;
  roomCategories?: RoomCategory[];
  reviews?: Review[];
}

export interface Booking {
  id: string;
  bookingReference: string;
  userId: string;
  hotelId: string;
  categoryId: string;
  checkInDate: string;
  checkOutDate: string;
  nights: number;
  numRooms: number;
  numGuests: number;
  guestName: string;
  guestEmail: string;
  guestPhone: string;
  specialRequests?: string | null;
  selectedRoomNumbers?: string | null;
  roomPrice: number;
  extraServicesPrice: number;
  taxes: number;
  discountAmount: number;
  totalAmount: number;
  status: 'CONFIRMED' | 'CHECKED_IN' | 'CHECKED_OUT' | 'CANCELLED';
  couponCode?: string | null;
  createdAt: string;
  updatedAt: string;
  hotel?: Hotel;
  category?: RoomCategory;
  payment?: Payment;
  serviceRequests?: ServiceRequest[];
  user?: Partial<User>;
}

export interface Payment {
  id: string;
  bookingId: string;
  amount: number;
  currency: string;
  method: 'UPI' | 'CREDIT_CARD' | 'DEBIT_CARD' | 'PAY_AT_HOTEL';
  transactionId: string;
  status: 'SUCCESS' | 'PENDING' | 'FAILED' | 'REFUNDED';
  paymentDate: string;
}

export interface Review {
  id: string;
  userId: string;
  hotelId: string;
  rating: number;
  title: string;
  comment: string;
  createdAt: string;
  user?: {
    id: string;
    name: string;
    avatar?: string | null;
  };
  hotel?: {
    id: string;
    name: string;
    city: string;
  };
}

export interface WishlistItem {
  id: string;
  userId: string;
  hotelId: string;
  createdAt: string;
  hotel: Hotel;
}

export interface Coupon {
  id: string;
  code: string;
  description: string;
  discountType: 'PERCENTAGE' | 'FIXED';
  discountValue: number;
  minBookingAmount: number;
  maxDiscount?: number | null;
  validUntil: string;
  isActive: boolean;
}

export interface ServiceRequest {
  id: string;
  bookingId: string;
  hotelId: string;
  userId: string;
  roomNumber: string;
  serviceType: 'ROOM_CLEANING' | 'FOOD_BEVERAGE' | 'LAUNDRY' | 'EXTRA_TOWELS' | 'MAINTENANCE' | 'AIRPORT_PICKUP';
  details?: string | null;
  status: 'PENDING' | 'ACCEPTED' | 'IN_PROGRESS' | 'COMPLETED';
  requestedAt: string;
  completedAt?: string | null;
  hotel?: {
    name: string;
    city: string;
  };
  booking?: {
    bookingReference: string;
    guestName?: string;
    guestPhone?: string;
  };
  user?: {
    name: string;
    email: string;
  };
}

export interface Destination {
  city: string;
  hotelCount: number;
  startingPrice: number;
  image: string;
}

export interface DashboardStats {
  totalCustomers: number;
  totalHotels: number;
  totalRooms: number;
  totalReservations: number;
  availableRooms: number;
  occupiedRooms: number;
  totalRevenue: number;
}

export interface DashboardCharts {
  monthlyData: Array<{ month: string; bookings: number; revenue: number }>;
  roomOccupancyChart: Array<{ hotelName: string; occupancyRate: number; totalRooms: number; occupiedRooms: number }>;
  bookingStatusChart: Array<{ name: string; value: number }>;
}
