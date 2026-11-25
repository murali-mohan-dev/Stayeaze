import { Request, Response } from 'express';
import prisma from '../utils/prisma.js';

export const getDashboardStats = async (_req: Request, res: Response) => {
  try {
    const totalCustomers = await prisma.user.count({ where: { role: 'CUSTOMER' } });
    const totalHotels = await prisma.hotel.count();
    const totalRooms = await prisma.room.count();
    const totalReservations = await prisma.booking.count();

    const availableRooms = await prisma.room.count({ where: { status: 'AVAILABLE' } });
    const occupiedRooms = await prisma.room.count({ where: { status: 'OCCUPIED' } });

    // Total Revenue from CONFIRMED or CHECKED_IN or CHECKED_OUT bookings
    const successfulPayments = await prisma.payment.findMany({
      where: { status: 'SUCCESS' },
      select: { amount: true },
    });
    const totalRevenue = successfulPayments.reduce((sum, p) => sum + p.amount, 0);

    // Booking Status Distribution
    const statusGroups = await prisma.booking.groupBy({
      by: ['status'],
      _count: { status: true },
    });

    const statusMap: Record<string, number> = {
      CONFIRMED: 0,
      CHECKED_IN: 0,
      CHECKED_OUT: 0,
      CANCELLED: 0,
    };
    statusGroups.forEach((g) => {
      statusMap[g.status] = g._count.status;
    });

    const bookingStatusChart = Object.keys(statusMap).map((status) => ({
      name: status.replace('_', ' '),
      value: statusMap[status],
    }));

    // Monthly Analytics (Generate last 6 months metrics)
    const monthNames = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
    const now = new Date();
    const monthlyData = [];

    for (let i = 5; i >= 0; i--) {
      const d = new Date(now.getFullYear(), now.getMonth() - i, 1);
      const nextD = new Date(now.getFullYear(), now.getMonth() - i + 1, 1);
      const label = `${monthNames[d.getMonth()]} ${d.getFullYear()}`;

      const bookingsInMonth = await prisma.booking.findMany({
        where: {
          createdAt: {
            gte: d,
            lt: nextD,
          },
        },
        include: { payment: true },
      });

      const count = bookingsInMonth.length;
      const revenue = bookingsInMonth.reduce((sum, b) => {
        if (b.status !== 'CANCELLED' && b.payment?.status === 'SUCCESS') {
          return sum + b.totalAmount;
        }
        return sum;
      }, 0);

      monthlyData.push({
        month: label,
        bookings: count,
        revenue,
      });
    }

    // Room Occupancy Breakdown by Hotel
    const hotels = await prisma.hotel.findMany({
      select: {
        id: true,
        name: true,
        rooms: { select: { status: true } },
      },
      take: 6,
    });

    const roomOccupancyChart = hotels.map((h) => {
      const total = h.rooms.length;
      const occupied = h.rooms.filter((r) => r.status === 'OCCUPIED').length;
      const rate = total > 0 ? Math.round((occupied / total) * 100) : 0;
      return {
        hotelName: h.name.length > 15 ? h.name.slice(0, 15) + '...' : h.name,
        occupancyRate: rate,
        totalRooms: total,
        occupiedRooms: occupied,
      };
    });

    res.json({
      success: true,
      stats: {
        totalCustomers,
        totalHotels,
        totalRooms,
        totalReservations,
        availableRooms,
        occupiedRooms,
        totalRevenue,
      },
      charts: {
        monthlyData,
        roomOccupancyChart,
        bookingStatusChart,
      },
    });
  } catch (err: any) {
    res.status(500).json({ success: false, message: err.message || 'Failed to fetch dashboard statistics.' });
  }
};

// Hotel CRUD
export const createHotel = async (req: Request, res: Response) => {
  try {
    const {
      name,
      tagline,
      description,
      address,
      city,
      state,
      country = 'India',
      starRating = 5,
      startingPrice = 4000,
      featured = false,
      images = [],
      amenities = [],
      contactEmail,
      contactPhone,
      checkInTime = '14:00',
      checkOutTime = '11:00',
    } = req.body;

    if (!name || !description || !address || !city || !state || !contactEmail || !contactPhone) {
      return res.status(400).json({ success: false, message: 'Please provide all required hotel fields.' });
    }

    const hotel = await prisma.hotel.create({
      data: {
        name,
        tagline: tagline || null,
        description,
        address,
        city,
        state,
        country,
        starRating: Number(starRating),
        startingPrice: Number(startingPrice),
        featured: Boolean(featured),
        images: JSON.stringify(images),
        amenities: JSON.stringify(amenities),
        contactEmail,
        contactPhone,
        checkInTime,
        checkOutTime,
      },
    });

    res.status(201).json({ success: true, message: 'Hotel created successfully!', hotel });
  } catch (err: any) {
    res.status(500).json({ success: false, message: err.message || 'Failed to create hotel.' });
  }
};

export const updateHotel = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const {
      name,
      tagline,
      description,
      address,
      city,
      state,
      country,
      starRating,
      startingPrice,
      featured,
      images,
      amenities,
      contactEmail,
      contactPhone,
      checkInTime,
      checkOutTime,
    } = req.body;

    const data: any = {};
    if (name) data.name = name;
    if (tagline !== undefined) data.tagline = tagline;
    if (description) data.description = description;
    if (address) data.address = address;
    if (city) data.city = city;
    if (state) data.state = state;
    if (country) data.country = country;
    if (starRating !== undefined) data.starRating = Number(starRating);
    if (startingPrice !== undefined) data.startingPrice = Number(startingPrice);
    if (featured !== undefined) data.featured = Boolean(featured);
    if (images) data.images = JSON.stringify(images);
    if (amenities) data.amenities = JSON.stringify(amenities);
    if (contactEmail) data.contactEmail = contactEmail;
    if (contactPhone) data.contactPhone = contactPhone;
    if (checkInTime) data.checkInTime = checkInTime;
    if (checkOutTime) data.checkOutTime = checkOutTime;

    const hotel = await prisma.hotel.update({
      where: { id },
      data,
    });

    res.json({ success: true, message: 'Hotel updated successfully!', hotel });
  } catch (err: any) {
    res.status(500).json({ success: false, message: err.message || 'Failed to update hotel.' });
  }
};

export const deleteHotel = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    await prisma.hotel.delete({ where: { id } });
    res.json({ success: true, message: 'Hotel and associated records deleted.' });
  } catch (err: any) {
    res.status(500).json({ success: false, message: err.message || 'Failed to delete hotel.' });
  }
};

// Room Category CRUD
export const createRoomCategory = async (req: Request, res: Response) => {
  try {
    const {
      hotelId,
      name,
      description,
      basePrice,
      capacityAdults = 2,
      capacityChildren = 1,
      bedType = 'King Bed',
      sizeSqFt = 400,
      images = [],
      amenities = [],
      totalRooms = 10,
    } = req.body;

    if (!hotelId || !name || !description || !basePrice) {
      return res.status(400).json({ success: false, message: 'Please provide all required room category fields.' });
    }

    const category = await prisma.roomCategory.create({
      data: {
        hotelId,
        name,
        description,
        basePrice: Number(basePrice),
        capacityAdults: Number(capacityAdults),
        capacityChildren: Number(capacityChildren),
        bedType,
        sizeSqFt: Number(sizeSqFt),
        images: JSON.stringify(images),
        amenities: JSON.stringify(amenities),
        totalRooms: Number(totalRooms),
      },
    });

    // Auto-create room instances for this category
    const roomsToCreate = [];
    for (let i = 1; i <= Math.min(Number(totalRooms), 20); i++) {
      roomsToCreate.push({
        hotelId,
        categoryId: category.id,
        roomNumber: `${category.name.substring(0, 3).toUpperCase()}-${100 + i}`,
        floor: 1 + Math.floor(i / 10),
        status: 'AVAILABLE',
      });
    }

    await prisma.room.createMany({ data: roomsToCreate });

    res.status(201).json({ success: true, message: 'Room category and rooms created!', category });
  } catch (err: any) {
    res.status(500).json({ success: false, message: err.message || 'Failed to create room category.' });
  }
};

export const updateRoomCategory = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const {
      name,
      description,
      basePrice,
      capacityAdults,
      capacityChildren,
      bedType,
      sizeSqFt,
      images,
      amenities,
      totalRooms,
    } = req.body;

    const data: any = {};
    if (name) data.name = name;
    if (description) data.description = description;
    if (basePrice !== undefined) data.basePrice = Number(basePrice);
    if (capacityAdults !== undefined) data.capacityAdults = Number(capacityAdults);
    if (capacityChildren !== undefined) data.capacityChildren = Number(capacityChildren);
    if (bedType) data.bedType = bedType;
    if (sizeSqFt !== undefined) data.sizeSqFt = Number(sizeSqFt);
    if (images) data.images = JSON.stringify(images);
    if (amenities) data.amenities = JSON.stringify(amenities);
    if (totalRooms !== undefined) data.totalRooms = Number(totalRooms);

    const category = await prisma.roomCategory.update({
      where: { id },
      data,
    });

    res.json({ success: true, message: 'Room category updated successfully!', category });
  } catch (err: any) {
    res.status(500).json({ success: false, message: err.message || 'Failed to update room category.' });
  }
};

export const deleteRoomCategory = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    await prisma.roomCategory.delete({ where: { id } });
    res.json({ success: true, message: 'Room category deleted.' });
  } catch (err: any) {
    res.status(500).json({ success: false, message: err.message || 'Failed to delete room category.' });
  }
};

// All Bookings Management
export const getAllBookings = async (req: Request, res: Response) => {
  try {
    const { status, search } = req.query;
    const where: any = {};

    if (status && status !== 'ALL') {
      where.status = status;
    }

    if (search) {
      const q = String(search).trim();
      where.OR = [
        { bookingReference: { contains: q } },
        { guestName: { contains: q } },
        { guestEmail: { contains: q } },
      ];
    }

    const bookings = await prisma.booking.findMany({
      where,
      include: {
        hotel: { select: { id: true, name: true, city: true } },
        category: { select: { id: true, name: true } },
        payment: true,
        user: { select: { id: true, name: true, email: true, phone: true } },
      },
      orderBy: { createdAt: 'desc' },
    });

    res.json({ success: true, count: bookings.length, bookings });
  } catch (err: any) {
    res.status(500).json({ success: false, message: err.message || 'Failed to fetch bookings.' });
  }
};

export const updateBookingStatus = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const { status } = req.body;

    const valid = ['CONFIRMED', 'CHECKED_IN', 'CHECKED_OUT', 'CANCELLED'];
    if (!valid.includes(status)) {
      return res.status(400).json({ success: false, message: 'Invalid booking status.' });
    }

    const booking = await prisma.booking.update({
      where: { id },
      data: { status },
      include: { hotel: true, category: true, payment: true },
    });

    res.json({ success: true, message: `Booking status changed to ${status}.`, booking });
  } catch (err: any) {
    res.status(500).json({ success: false, message: err.message || 'Failed to update booking status.' });
  }
};

// Customers
export const getAllCustomers = async (_req: Request, res: Response) => {
  try {
    const customers = await prisma.user.findMany({
      where: { role: 'CUSTOMER' },
      select: {
        id: true,
        name: true,
        email: true,
        phone: true,
        createdAt: true,
        _count: {
          select: {
            bookings: true,
            reviews: true,
          },
        },
      },
      orderBy: { createdAt: 'desc' },
    });

    res.json({ success: true, count: customers.length, customers });
  } catch (err: any) {
    res.status(500).json({ success: false, message: err.message || 'Failed to fetch customers.' });
  }
};

// Payments
export const getAllPayments = async (_req: Request, res: Response) => {
  try {
    const payments = await prisma.payment.findMany({
      include: {
        booking: {
          select: {
            bookingReference: true,
            guestName: true,
            hotel: { select: { name: true } },
          },
        },
      },
      orderBy: { paymentDate: 'desc' },
    });

    res.json({ success: true, count: payments.length, payments });
  } catch (err: any) {
    res.status(500).json({ success: false, message: err.message || 'Failed to fetch payments.' });
  }
};

// Reviews
export const getAllReviews = async (_req: Request, res: Response) => {
  try {
    const reviews = await prisma.review.findMany({
      include: {
        user: { select: { id: true, name: true, email: true } },
        hotel: { select: { id: true, name: true, city: true } },
      },
      orderBy: { createdAt: 'desc' },
    });

    res.json({ success: true, count: reviews.length, reviews });
  } catch (err: any) {
    res.status(500).json({ success: false, message: err.message || 'Failed to fetch reviews.' });
  }
};

export const deleteReview = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    await prisma.review.delete({ where: { id } });
    res.json({ success: true, message: 'Review removed by administrator.' });
  } catch (err: any) {
    res.status(500).json({ success: false, message: err.message || 'Failed to delete review.' });
  }
};

// All Service Requests
export const getAllServiceRequests = async (_req: Request, res: Response) => {
  try {
    const requests = await prisma.serviceRequest.findMany({
      include: {
        hotel: { select: { name: true, city: true } },
        booking: { select: { bookingReference: true, guestName: true, guestPhone: true } },
        user: { select: { name: true, email: true } },
      },
      orderBy: { requestedAt: 'desc' },
    });

    res.json({ success: true, count: requests.length, serviceRequests: requests });
  } catch (err: any) {
    res.status(500).json({ success: false, message: err.message || 'Failed to fetch service requests.' });
  }
};
