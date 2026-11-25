import { Request, Response } from 'express';
import prisma from '../utils/prisma.js';

export const getHotels = async (req: Request, res: Response) => {
  try {
    const {
      destination,
      city,
      minPrice,
      maxPrice,
      starRating,
      amenities,
      sortBy,
      featured,
      limit,
    } = req.query;

    const where: any = {};

    // Search query or city
    const searchTarget = (destination || city) as string;
    if (searchTarget && searchTarget.trim() !== '') {
      where.OR = [
        { city: { contains: searchTarget.trim() } },
        { name: { contains: searchTarget.trim() } },
        { state: { contains: searchTarget.trim() } },
        { address: { contains: searchTarget.trim() } },
      ];
    }

    // Price range
    if (minPrice || maxPrice) {
      where.startingPrice = {};
      if (minPrice) where.startingPrice.gte = parseFloat(minPrice as string);
      if (maxPrice) where.startingPrice.lte = parseFloat(maxPrice as string);
    }

    // Star rating
    if (starRating) {
      const stars = parseInt(starRating as string);
      if (!isNaN(stars)) {
        where.starRating = { gte: stars };
      }
    }

    // Featured only
    if (featured === 'true') {
      where.featured = true;
    }

    // Sorting
    let orderBy: any = { ratingScore: 'desc' }; // default
    if (sortBy === 'price_low') {
      orderBy = { startingPrice: 'asc' };
    } else if (sortBy === 'price_high') {
      orderBy = { startingPrice: 'desc' };
    } else if (sortBy === 'rating') {
      orderBy = { ratingScore: 'desc' };
    } else if (sortBy === 'reviews') {
      orderBy = { reviewCount: 'desc' };
    }

    const hotels = await prisma.hotel.findMany({
      where,
      orderBy,
      take: limit ? parseInt(limit as string) : undefined,
      include: {
        roomCategories: {
          select: {
            id: true,
            name: true,
            basePrice: true,
            capacityAdults: true,
            capacityChildren: true,
            bedType: true,
            sizeSqFt: true,
            images: true,
            amenities: true,
            totalRooms: true,
          },
        },
      },
    });

    // Post-filter amenities if requested (since amenities is JSON string in SQLite)
    let filteredHotels = hotels;
    if (amenities) {
      const reqAmenities = (amenities as string).split(',').map((a) => a.trim().toLowerCase());
      filteredHotels = hotels.filter((hotel) => {
        try {
          const hotelAmenities: string[] = JSON.parse(hotel.amenities).map((a: string) => a.toLowerCase());
          return reqAmenities.every((reqA) => hotelAmenities.some((ha) => ha.includes(reqA)));
        } catch {
          return true;
        }
      });
    }

    // Parse JSON fields
    const parsedHotels = filteredHotels.map((h) => ({
      ...h,
      images: JSON.parse(h.images || '[]'),
      amenities: JSON.parse(h.amenities || '[]'),
      roomCategories: h.roomCategories.map((rc) => ({
        ...rc,
        images: JSON.parse(rc.images || '[]'),
        amenities: JSON.parse(rc.amenities || '[]'),
      })),
    }));

    res.json({ success: true, count: parsedHotels.length, hotels: parsedHotels });
  } catch (err: any) {
    res.status(500).json({ success: false, message: err.message || 'Failed to fetch hotels.' });
  }
};

export const getHotelById = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;

    const hotel = await prisma.hotel.findUnique({
      where: { id },
      include: {
        roomCategories: {
          include: {
            rooms: {
              select: {
                id: true,
                roomNumber: true,
                status: true,
              },
            },
          },
        },
        reviews: {
          include: {
            user: {
              select: {
                id: true,
                name: true,
                avatar: true,
              },
            },
          },
          orderBy: { createdAt: 'desc' },
          take: 10,
        },
      },
    });

    if (!hotel) {
      return res.status(404).json({ success: false, message: 'Hotel not found.' });
    }

    const parsedHotel = {
      ...hotel,
      images: JSON.parse(hotel.images || '[]'),
      amenities: JSON.parse(hotel.amenities || '[]'),
      roomCategories: hotel.roomCategories.map((rc) => ({
        ...rc,
        images: JSON.parse(rc.images || '[]'),
        amenities: JSON.parse(rc.amenities || '[]'),
        availableRoomCount: rc.rooms.filter((r) => r.status === 'AVAILABLE').length,
      })),
    };

    res.json({ success: true, hotel: parsedHotel });
  } catch (err: any) {
    res.status(500).json({ success: false, message: err.message || 'Failed to fetch hotel details.' });
  }
};

export const getPopularDestinations = async (_req: Request, res: Response) => {
  try {
    // Return aggregated destination statistics
    const hotels = await prisma.hotel.findMany({
      select: { city: true, startingPrice: true, images: true },
    });

    const destinationMap: Record<string, { count: number; minPrice: number; image: string }> = {};

    hotels.forEach((h) => {
      let firstImage = 'https://images.unsplash.com/photo-1566073771259-6a8506099945?auto=format&fit=crop&w=1200&q=80';
      try {
        const imgs = JSON.parse(h.images);
        if (imgs.length > 0) firstImage = imgs[0];
      } catch {}

      if (!destinationMap[h.city]) {
        destinationMap[h.city] = { count: 1, minPrice: h.startingPrice, image: firstImage };
      } else {
        destinationMap[h.city].count += 1;
        if (h.startingPrice < destinationMap[h.city].minPrice) {
          destinationMap[h.city].minPrice = h.startingPrice;
        }
      }
    });

    const destinations = Object.keys(destinationMap).map((city) => ({
      city,
      hotelCount: destinationMap[city].count,
      startingPrice: destinationMap[city].minPrice,
      image: destinationMap[city].image,
    }));

    res.json({ success: true, destinations });
  } catch (err: any) {
    res.status(500).json({ success: false, message: err.message || 'Failed to fetch destinations.' });
  }
};
