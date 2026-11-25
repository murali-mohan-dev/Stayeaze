import { Response } from 'express';
import prisma from '../utils/prisma.js';
import { AuthRequest } from '../middleware/auth.js';

export const calculatePrice = async (req: AuthRequest, res: Response) => {
  try {
    const { categoryId, checkInDate, checkOutDate, numRooms = 1, couponCode, extraServices = [] } = req.body;

    if (!categoryId || !checkInDate || !checkOutDate) {
      return res.status(400).json({ success: false, message: 'Missing required booking calculation parameters.' });
    }

    const category = await prisma.roomCategory.findUnique({
      where: { id: categoryId },
      include: { hotel: true },
    });

    if (!category) {
      return res.status(404).json({ success: false, message: 'Room category not found.' });
    }

    const checkIn = new Date(checkInDate);
    const checkOut = new Date(checkOutDate);

    if (isNaN(checkIn.getTime()) || isNaN(checkOut.getTime())) {
      return res.status(400).json({ success: false, message: 'Invalid dates.' });
    }

    const diffTime = checkOut.getTime() - checkIn.getTime();
    const nights = Math.max(1, Math.ceil(diffTime / (1000 * 60 * 60 * 24)));

    if (nights <= 0) {
      return res.status(400).json({ success: false, message: 'Check-out date must be after check-in date.' });
    }

    const roomPrice = category.basePrice;
    const roomSubtotal = roomPrice * nights * Number(numRooms);

    // Calculate extra services
    let extraServicesPrice = 0;
    if (Array.isArray(extraServices)) {
      extraServices.forEach((service: { price: number }) => {
        if (service && typeof service.price === 'number') {
          extraServicesPrice += service.price;
        }
      });
    }

    // GST Tax calculation (12% for <= 7500, 18% for > 7500)
    const taxRate = roomPrice > 7500 ? 0.18 : 0.12;
    const taxes = Math.round((roomSubtotal + extraServicesPrice) * taxRate);

    // Coupon discount calculation
    let discountAmount = 0;
    let couponDetails = null;

    if (couponCode) {
      const coupon = await prisma.coupon.findUnique({
        where: { code: couponCode.trim().toUpperCase() },
      });

      if (coupon && coupon.isActive && new Date(coupon.validUntil) > new Date()) {
        const subtotal = roomSubtotal + extraServicesPrice;
        if (subtotal >= coupon.minBookingAmount) {
          if (coupon.discountType === 'PERCENTAGE') {
            discountAmount = (subtotal * coupon.discountValue) / 100;
            if (coupon.maxDiscount && discountAmount > coupon.maxDiscount) {
              discountAmount = coupon.maxDiscount;
            }
          } else {
            discountAmount = coupon.discountValue;
          }
          discountAmount = Math.min(discountAmount, subtotal);
          couponDetails = {
            code: coupon.code,
            description: coupon.description,
            discountAmount: Math.round(discountAmount),
          };
        }
      }
    }

    const totalAmount = Math.round(roomSubtotal + extraServicesPrice + taxes - discountAmount);

    res.json({
      success: true,
      calculation: {
        nights,
        numRooms: Number(numRooms),
        roomPrice,
        roomSubtotal,
        extraServicesPrice,
        taxRate: taxRate * 100,
        taxes,
        discountAmount: Math.round(discountAmount),
        couponDetails,
        totalAmount,
      },
    });
  } catch (err: any) {
    res.status(500).json({ success: false, message: err.message || 'Error calculating price.' });
  }
};

export const createBooking = async (req: AuthRequest, res: Response) => {
  try {
    if (!req.user) {
      return res.status(401).json({ success: false, message: 'Authentication required.' });
    }

    const {
      hotelId,
      categoryId,
      checkInDate,
      checkOutDate,
      numRooms = 1,
      numGuests = 2,
      guestName,
      guestEmail,
      guestPhone,
      specialRequests,
      extraServices = [],
      couponCode,
      paymentMethod = 'CREDIT_CARD',
    } = req.body;

    if (!hotelId || !categoryId || !checkInDate || !checkOutDate || !guestName || !guestEmail || !guestPhone) {
      return res.status(400).json({ success: false, message: 'All booking fields are required.' });
    }

    const checkIn = new Date(checkInDate);
    const checkOut = new Date(checkOutDate);

    if (checkOut <= checkIn) {
      return res.status(400).json({ success: false, message: 'Check-out date must be after check-in date.' });
    }

    const nights = Math.max(1, Math.ceil((checkOut.getTime() - checkIn.getTime()) / (1000 * 60 * 60 * 24)));

    // Fetch room category
    const category = await prisma.roomCategory.findUnique({
      where: { id: categoryId },
      include: {
        hotel: true,
        rooms: true,
      },
    });

    if (!category || category.hotelId !== hotelId) {
      return res.status(404).json({ success: false, message: 'Selected room category is not valid for this hotel.' });
    }

    // PREVENT DOUBLE BOOKING: Check existing bookings overlapping the date range
    const overlappingBookings = await prisma.booking.findMany({
      where: {
        categoryId,
        status: { in: ['CONFIRMED', 'CHECKED_IN'] },
        AND: [
          { checkInDate: { lt: checkOut } },
          { checkOutDate: { gt: checkIn } },
        ],
      },
      select: {
        numRooms: true,
        selectedRoomNumbers: true,
      },
    });

    const currentlyBookedRooms = overlappingBookings.reduce((sum, b) => sum + b.numRooms, 0);
    const availableRoomCount = category.totalRooms - currentlyBookedRooms;

    if (availableRoomCount < Number(numRooms)) {
      return res.status(409).json({
        success: false,
        message: `Reservation conflict: Only ${Math.max(0, availableRoomCount)} room(s) available in '${category.name}' for the requested dates. Please choose different dates or select another room category.`,
      });
    }

    // Determine room numbers to assign
    const bookedRoomNumbers = new Set<string>();
    overlappingBookings.forEach((b) => {
      if (b.selectedRoomNumbers) {
        b.selectedRoomNumbers.split(',').forEach((num) => bookedRoomNumbers.add(num.trim()));
      }
    });

    const availablePhysicalRooms = category.rooms.filter(
      (r) => r.status !== 'MAINTENANCE' && !bookedRoomNumbers.has(r.roomNumber)
    );

    const assignedRoomNumbers = availablePhysicalRooms
      .slice(0, Number(numRooms))
      .map((r) => r.roomNumber);

    const assignedRoomsStr = assignedRoomNumbers.length > 0
      ? assignedRoomNumbers.join(', ')
      : Array.from({ length: Number(numRooms) }, (_, i) => `${category.name.slice(0, 3).toUpperCase()}-${100 + currentlyBookedRooms + i + 1}`).join(', ');

    // Calculate Financials Server-Side
    const roomPrice = category.basePrice;
    const roomSubtotal = roomPrice * nights * Number(numRooms);

    let extraServicesPrice = 0;
    if (Array.isArray(extraServices)) {
      extraServices.forEach((s: { price: number }) => {
        if (s && typeof s.price === 'number') extraServicesPrice += s.price;
      });
    }

    const taxRate = roomPrice > 7500 ? 0.18 : 0.12;
    const taxes = Math.round((roomSubtotal + extraServicesPrice) * taxRate);

    let discountAmount = 0;
    if (couponCode) {
      const coupon = await prisma.coupon.findUnique({
        where: { code: couponCode.trim().toUpperCase() },
      });
      if (coupon && coupon.isActive && new Date(coupon.validUntil) > new Date()) {
        const subtotal = roomSubtotal + extraServicesPrice;
        if (subtotal >= coupon.minBookingAmount) {
          if (coupon.discountType === 'PERCENTAGE') {
            discountAmount = (subtotal * coupon.discountValue) / 100;
            if (coupon.maxDiscount && discountAmount > coupon.maxDiscount) {
              discountAmount = coupon.maxDiscount;
            }
          } else {
            discountAmount = coupon.discountValue;
          }
          discountAmount = Math.min(discountAmount, subtotal);
        }
      }
    }

    const totalAmount = Math.round(roomSubtotal + extraServicesPrice + taxes - discountAmount);

    // Generate unique reference & transaction
    const bookingReference = `SE-${new Date().getFullYear()}-${Math.floor(100000 + Math.random() * 900000)}`;
    const transactionId = `TXN-STAY-${Date.now()}-${Math.floor(1000 + Math.random() * 9000)}`;

    // Create Booking and simulated Payment atomically in Prisma transaction
    const result = await prisma.$transaction(async (tx) => {
      const newBooking = await tx.booking.create({
        data: {
          bookingReference,
          userId: req.user!.userId,
          hotelId,
          categoryId,
          checkInDate: checkIn,
          checkOutDate: checkOut,
          nights,
          numRooms: Number(numRooms),
          numGuests: Number(numGuests),
          guestName,
          guestEmail,
          guestPhone,
          specialRequests: specialRequests || null,
          selectedRoomNumbers: assignedRoomsStr,
          roomPrice,
          extraServicesPrice,
          taxes,
          discountAmount: Math.round(discountAmount),
          totalAmount,
          status: 'CONFIRMED',
          couponCode: couponCode ? couponCode.toUpperCase() : null,
        },
        include: {
          hotel: true,
          category: true,
        },
      });

      const newPayment = await tx.payment.create({
        data: {
          bookingId: newBooking.id,
          amount: totalAmount,
          currency: 'INR',
          method: paymentMethod,
          transactionId,
          status: paymentMethod === 'PAY_AT_HOTEL' ? 'PENDING' : 'SUCCESS',
        },
      });

      return { booking: newBooking, payment: newPayment };
    });

    res.status(201).json({
      success: true,
      message: 'Booking confirmed successfully!',
      booking: result.booking,
      payment: result.payment,
    });
  } catch (err: any) {
    res.status(500).json({ success: false, message: err.message || 'Error processing reservation.' });
  }
};

export const getMyBookings = async (req: AuthRequest, res: Response) => {
  try {
    if (!req.user) {
      return res.status(401).json({ success: false, message: 'Unauthorized' });
    }

    const bookings = await prisma.booking.findMany({
      where: { userId: req.user.userId },
      include: {
        hotel: {
          select: {
            id: true,
            name: true,
            city: true,
            state: true,
            address: true,
            images: true,
            starRating: true,
            contactPhone: true,
            contactEmail: true,
          },
        },
        category: {
          select: {
            id: true,
            name: true,
            bedType: true,
            images: true,
          },
        },
        payment: true,
        serviceRequests: true,
      },
      orderBy: { createdAt: 'desc' },
    });

    const parsedBookings = bookings.map((b) => ({
      ...b,
      hotel: {
        ...b.hotel,
        images: JSON.parse(b.hotel.images || '[]'),
      },
      category: {
        ...b.category,
        images: JSON.parse(b.category.images || '[]'),
      },
    }));

    res.json({ success: true, count: parsedBookings.length, bookings: parsedBookings });
  } catch (err: any) {
    res.status(500).json({ success: false, message: err.message || 'Failed to fetch bookings.' });
  }
};

export const getBookingById = async (req: AuthRequest, res: Response) => {
  try {
    const { id } = req.params;

    const booking = await prisma.booking.findUnique({
      where: { id },
      include: {
        hotel: true,
        category: true,
        payment: true,
        serviceRequests: {
          orderBy: { requestedAt: 'desc' },
        },
        user: {
          select: {
            id: true,
            name: true,
            email: true,
            phone: true,
          },
        },
      },
    });

    if (!booking) {
      return res.status(404).json({ success: false, message: 'Booking not found.' });
    }

    // Check ownership if not admin
    if (req.user && req.user.role !== 'ADMIN' && booking.userId !== req.user.userId) {
      return res.status(403).json({ success: false, message: 'Unauthorized to view this booking.' });
    }

    const parsed = {
      ...booking,
      hotel: {
        ...booking.hotel,
        images: JSON.parse(booking.hotel.images || '[]'),
        amenities: JSON.parse(booking.hotel.amenities || '[]'),
      },
      category: {
        ...booking.category,
        images: JSON.parse(booking.category.images || '[]'),
        amenities: JSON.parse(booking.category.amenities || '[]'),
      },
    };

    res.json({ success: true, booking: parsed });
  } catch (err: any) {
    res.status(500).json({ success: false, message: err.message || 'Failed to fetch booking.' });
  }
};

export const cancelBooking = async (req: AuthRequest, res: Response) => {
  try {
    const { id } = req.params;

    const booking = await prisma.booking.findUnique({
      where: { id },
      include: { payment: true },
    });

    if (!booking) {
      return res.status(404).json({ success: false, message: 'Booking not found.' });
    }

    if (req.user?.role !== 'ADMIN' && booking.userId !== req.user?.userId) {
      return res.status(403).json({ success: false, message: 'Unauthorized to cancel this booking.' });
    }

    if (booking.status === 'CANCELLED') {
      return res.status(400).json({ success: false, message: 'Booking is already cancelled.' });
    }

    const updatedBooking = await prisma.booking.update({
      where: { id },
      data: { status: 'CANCELLED' },
    });

    if (booking.payment && booking.payment.status === 'SUCCESS') {
      await prisma.payment.update({
        where: { bookingId: booking.id },
        data: { status: 'REFUNDED' },
      });
    }

    res.json({
      success: true,
      message: 'Booking cancelled successfully. Any simulated payment has been marked as refunded.',
      booking: updatedBooking,
    });
  } catch (err: any) {
    res.status(500).json({ success: false, message: err.message || 'Failed to cancel booking.' });
  }
};
