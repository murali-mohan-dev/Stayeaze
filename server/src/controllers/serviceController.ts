import { Response } from 'express';
import prisma from '../utils/prisma.js';
import { AuthRequest } from '../middleware/auth.js';

export const createServiceRequest = async (req: AuthRequest, res: Response) => {
  try {
    if (!req.user) {
      return res.status(401).json({ success: false, message: 'Unauthorized' });
    }

    const { bookingId, serviceType, details, roomNumber } = req.body;

    if (!bookingId || !serviceType) {
      return res.status(400).json({ success: false, message: 'Booking ID and service type are required.' });
    }

    const booking = await prisma.booking.findUnique({
      where: { id: bookingId },
    });

    if (!booking) {
      return res.status(404).json({ success: false, message: 'Associated reservation not found.' });
    }

    if (booking.userId !== req.user.userId && req.user.role !== 'ADMIN') {
      return res.status(403).json({ success: false, message: 'Unauthorized for this reservation.' });
    }

    if (booking.status === 'CANCELLED') {
      return res.status(400).json({ success: false, message: 'Cannot request services for a cancelled booking.' });
    }

    const assignedRoom = roomNumber || booking.selectedRoomNumbers || 'Room 101';

    const serviceRequest = await prisma.serviceRequest.create({
      data: {
        bookingId,
        hotelId: booking.hotelId,
        userId: req.user.userId,
        roomNumber: assignedRoom,
        serviceType,
        details: details || '',
        status: 'PENDING',
      },
      include: {
        hotel: { select: { name: true, city: true } },
        booking: { select: { bookingReference: true } },
      },
    });

    res.status(201).json({
      success: true,
      message: 'Service request submitted to the front desk.',
      serviceRequest,
    });
  } catch (err: any) {
    res.status(500).json({ success: false, message: err.message || 'Failed to submit service request.' });
  }
};

export const getMyServiceRequests = async (req: AuthRequest, res: Response) => {
  try {
    if (!req.user) {
      return res.status(401).json({ success: false, message: 'Unauthorized' });
    }

    const serviceRequests = await prisma.serviceRequest.findMany({
      where: { userId: req.user.userId },
      include: {
        hotel: { select: { name: true, city: true } },
        booking: { select: { bookingReference: true } },
      },
      orderBy: { requestedAt: 'desc' },
    });

    res.json({ success: true, count: serviceRequests.length, serviceRequests });
  } catch (err: any) {
    res.status(500).json({ success: false, message: err.message || 'Failed to fetch service requests.' });
  }
};

export const updateServiceStatus = async (req: AuthRequest, res: Response) => {
  try {
    const { id } = req.params;
    const { status } = req.body;

    const validStatuses = ['PENDING', 'ACCEPTED', 'IN_PROGRESS', 'COMPLETED'];
    if (!validStatuses.includes(status)) {
      return res.status(400).json({ success: false, message: 'Invalid status value.' });
    }

    const updated = await prisma.serviceRequest.update({
      where: { id },
      data: {
        status,
        completedAt: status === 'COMPLETED' ? new Date() : undefined,
      },
    });

    res.json({
      success: true,
      message: `Service status updated to ${status}.`,
      serviceRequest: updated,
    });
  } catch (err: any) {
    res.status(500).json({ success: false, message: err.message || 'Failed to update service status.' });
  }
};
