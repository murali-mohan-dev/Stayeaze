import { Response } from 'express';
import prisma from '../utils/prisma.js';
import { AuthRequest } from '../middleware/auth.js';

export const addReview = async (req: AuthRequest, res: Response) => {
  try {
    if (!req.user) {
      return res.status(401).json({ success: false, message: 'Unauthorized' });
    }

    const { hotelId, rating, title, comment } = req.body;

    if (!hotelId || !rating || !title || !comment) {
      return res.status(400).json({ success: false, message: 'All review fields are required.' });
    }

    const hotel = await prisma.hotel.findUnique({ where: { id: hotelId } });
    if (!hotel) {
      return res.status(404).json({ success: false, message: 'Hotel not found.' });
    }

    const review = await prisma.review.create({
      data: {
        userId: req.user.userId,
        hotelId,
        rating: Number(rating),
        title,
        comment,
      },
      include: {
        user: { select: { id: true, name: true, avatar: true } },
      },
    });

    // Update Hotel rating score and review count
    const allReviews = await prisma.review.findMany({
      where: { hotelId },
      select: { rating: true },
    });

    const totalRatings = allReviews.reduce((sum, r) => sum + r.rating, 0);
    const avgScore = Number((totalRatings / allReviews.length).toFixed(1));

    await prisma.hotel.update({
      where: { id: hotelId },
      data: {
        ratingScore: avgScore,
        reviewCount: allReviews.length,
      },
    });

    res.status(201).json({
      success: true,
      message: 'Review submitted successfully! Thank you for your feedback.',
      review,
      newAverageScore: avgScore,
    });
  } catch (err: any) {
    res.status(500).json({ success: false, message: err.message || 'Failed to submit review.' });
  }
};

export const getHotelReviews = async (req: AuthRequest, res: Response) => {
  try {
    const { hotelId } = req.params;

    const reviews = await prisma.review.findMany({
      where: { hotelId },
      include: {
        user: { select: { id: true, name: true, avatar: true } },
      },
      orderBy: { createdAt: 'desc' },
    });

    res.json({ success: true, count: reviews.length, reviews });
  } catch (err: any) {
    res.status(500).json({ success: false, message: err.message || 'Failed to fetch reviews.' });
  }
};
