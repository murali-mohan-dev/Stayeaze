import { Request, Response } from 'express';
import prisma from '../utils/prisma.js';

export const validateCoupon = async (req: Request, res: Response) => {
  try {
    const { code, bookingAmount = 0 } = req.body;

    if (!code) {
      return res.status(400).json({ success: false, message: 'Coupon code is required.' });
    }

    const coupon = await prisma.coupon.findUnique({
      where: { code: code.trim().toUpperCase() },
    });

    if (!coupon || !coupon.isActive) {
      return res.status(404).json({ success: false, message: 'Invalid or inactive promotional code.' });
    }

    if (new Date(coupon.validUntil) < new Date()) {
      return res.status(400).json({ success: false, message: 'This coupon code has expired.' });
    }

    if (bookingAmount < coupon.minBookingAmount) {
      return res.status(400).json({
        success: false,
        message: `This coupon requires a minimum booking amount of ₹${coupon.minBookingAmount.toLocaleString('en-IN')}.`,
      });
    }

    let discountAmount = 0;
    if (coupon.discountType === 'PERCENTAGE') {
      discountAmount = (bookingAmount * coupon.discountValue) / 100;
      if (coupon.maxDiscount && discountAmount > coupon.maxDiscount) {
        discountAmount = coupon.maxDiscount;
      }
    } else {
      discountAmount = coupon.discountValue;
    }

    discountAmount = Math.min(discountAmount, bookingAmount);

    res.json({
      success: true,
      message: `Coupon '${coupon.code}' applied successfully!`,
      coupon: {
        code: coupon.code,
        description: coupon.description,
        discountType: coupon.discountType,
        discountValue: coupon.discountValue,
        discountAmount: Math.round(discountAmount),
      },
    });
  } catch (err: any) {
    res.status(500).json({ success: false, message: err.message || 'Failed to validate coupon.' });
  }
};

export const getActiveCoupons = async (_req: Request, res: Response) => {
  try {
    const coupons = await prisma.coupon.findMany({
      where: {
        isActive: true,
        validUntil: { gte: new Date() },
      },
      orderBy: { discountValue: 'desc' },
    });

    res.json({ success: true, coupons });
  } catch (err: any) {
    res.status(500).json({ success: false, message: err.message || 'Failed to fetch offers.' });
  }
};

// Admin Endpoints
export const getAllCouponsAdmin = async (_req: Request, res: Response) => {
  try {
    const coupons = await prisma.coupon.findMany({
      orderBy: { createdAt: 'desc' },
    });
    res.json({ success: true, count: coupons.length, coupons });
  } catch (err: any) {
    res.status(500).json({ success: false, message: err.message || 'Failed to fetch coupons.' });
  }
};

export const createCoupon = async (req: Request, res: Response) => {
  try {
    const {
      code,
      description,
      discountType = 'PERCENTAGE',
      discountValue,
      minBookingAmount = 0,
      maxDiscount,
      validUntil,
    } = req.body;

    if (!code || !description || discountValue === undefined) {
      return res.status(400).json({ success: false, message: 'Please provide code, description, and discount value.' });
    }

    const expiry = validUntil ? new Date(validUntil) : new Date(Date.now() + 365 * 24 * 60 * 60 * 1000);

    const newCoupon = await prisma.coupon.create({
      data: {
        code: code.trim().toUpperCase(),
        description,
        discountType,
        discountValue: Number(discountValue),
        minBookingAmount: Number(minBookingAmount),
        maxDiscount: maxDiscount ? Number(maxDiscount) : null,
        validUntil: expiry,
        isActive: true,
      },
    });

    res.status(201).json({ success: true, message: 'Promotional voucher created!', coupon: newCoupon });
  } catch (err: any) {
    res.status(500).json({ success: false, message: err.message || 'Failed to create coupon.' });
  }
};

export const deleteCoupon = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    await prisma.coupon.delete({ where: { id } });
    res.json({ success: true, message: 'Coupon deleted.' });
  } catch (err: any) {
    res.status(500).json({ success: false, message: err.message || 'Failed to delete coupon.' });
  }
};

export const toggleCouponStatus = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const existing = await prisma.coupon.findUnique({ where: { id } });
    if (!existing) {
      return res.status(404).json({ success: false, message: 'Coupon not found.' });
    }

    const updated = await prisma.coupon.update({
      where: { id },
      data: { isActive: !existing.isActive },
    });

    res.json({
      success: true,
      message: `Coupon '${updated.code}' is now ${updated.isActive ? 'Active' : 'Inactive'}.`,
      coupon: updated,
    });
  } catch (err: any) {
    res.status(500).json({ success: false, message: err.message || 'Failed to update coupon status.' });
  }
};
