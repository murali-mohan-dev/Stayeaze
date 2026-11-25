import { Response } from 'express';
import prisma from '../utils/prisma.js';
import { AuthRequest } from '../middleware/auth.js';

export const toggleWishlist = async (req: AuthRequest, res: Response) => {
  try {
    if (!req.user) {
      return res.status(401).json({ success: false, message: 'Unauthorized' });
    }

    const { hotelId } = req.body;
    if (!hotelId) {
      return res.status(400).json({ success: false, message: 'Hotel ID is required.' });
    }

    const existing = await prisma.wishlist.findUnique({
      where: {
        userId_hotelId: {
          userId: req.user.userId,
          hotelId,
        },
      },
    });

    if (existing) {
      await prisma.wishlist.delete({
        where: { id: existing.id },
      });
      return res.json({ success: true, isWishlisted: false, message: 'Removed from favorites' });
    } else {
      await prisma.wishlist.create({
        data: {
          userId: req.user.userId,
          hotelId,
        },
      });
      return res.json({ success: true, isWishlisted: true, message: 'Added to favorites' });
    }
  } catch (err: any) {
    res.status(500).json({ success: false, message: err.message || 'Failed to update wishlist.' });
  }
};

export const getMyWishlist = async (req: AuthRequest, res: Response) => {
  try {
    if (!req.user) {
      return res.status(401).json({ success: false, message: 'Unauthorized' });
    }

    const items = await prisma.wishlist.findMany({
      where: { userId: req.user.userId },
      include: {
        hotel: {
          include: {
            roomCategories: {
              select: {
                id: true,
                name: true,
                basePrice: true,
              },
            },
          },
        },
      },
      orderBy: { createdAt: 'desc' },
    });

    const parsedItems = items.map((item) => ({
      ...item,
      hotel: {
        ...item.hotel,
        images: JSON.parse(item.hotel.images || '[]'),
        amenities: JSON.parse(item.hotel.amenities || '[]'),
      },
    }));

    res.json({ success: true, count: parsedItems.length, wishlist: parsedItems });
  } catch (err: any) {
    res.status(500).json({ success: false, message: err.message || 'Failed to fetch wishlist.' });
  }
};
