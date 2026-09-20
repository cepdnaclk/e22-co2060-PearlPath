const Payment = require('../models/Payment');
const Booking = require('../models/Booking');
const { bankDetails } = require('../config/paymentConfig');

exports.getBankDetails = (req, res) => {
    res.status(200).json(bankDetails);
};

exports.createPayment = async (req, res) => {
    try {
        const { bookingId, bookingType, paymentMethod } = req.body;
        const userId = req.user._id;

        // 1. Validate booking exists
        const booking = await Booking.findById(bookingId);
        if (!booking) {
            return res.status(404).json({ message: 'Booking not found' });
        }

        // 2. Verify booking ownership
        if (booking.userId.toString() !== userId.toString()) {
            return res.status(403).json({ message: 'You are not authorized to pay for this booking' });
        }

        // 3. Determine real booking amount from DB
        const amount = booking.totalPrice;
        
        if (!amount || amount <= 0) {
            return res.status(400).json({ message: 'Invalid booking amount' });
        }

        // 4. Prevent duplicate active payment for the same booking
        const existingPayment = await Payment.findOne({ 
            bookingId, 
            paymentStatus: { $in: ['pending', 'submitted', 'verified'] } 
        });

        if (existingPayment) {
            return res.status(400).json({ message: 'An active payment already exists for this booking', paymentId: existingPayment._id });
        }

        // 5. Create payment
        const payment = new Payment({
            userId,
            bookingId,
            bookingType,
            amount,
            currency: 'LKR',
            paymentMethod,
            paymentStatus: paymentMethod === 'bank_transfer' ? 'pending' : 'verified'
        });

        await payment.save();
        res.status(201).json({ message: 'Payment created successfully', paymentId: payment._id });
    } catch (error) {
        console.error('Error creating payment:', error);
        res.status(500).json({ message: 'Server error creating payment' });
    }
};

exports.uploadBankSlip = async (req, res) => {
    try {
        const { paymentId } = req.params;
        const userId = req.user._id;

        const payment = await Payment.findById(paymentId);
        if (!payment) {
            return res.status(404).json({ message: 'Payment not found' });
        }

        if (payment.userId.toString() !== userId.toString()) {
            return res.status(403).json({ message: 'Not authorized' });
        }

        if (payment.paymentMethod !== 'bank_transfer') {
            return res.status(400).json({ message: 'This payment method does not support bank slips' });
        }

        if (payment.paymentStatus === 'verified') {
            return res.status(400).json({ message: 'Payment already verified' });
        }

        if (!req.file) {
            return res.status(400).json({ message: 'Bank slip file is required' });
        }

        // Update payment with file details
        payment.bankSlipUrl = `/uploads/bank-slips/${req.file.filename}`;
        payment.bankSlipFileName = req.file.originalname;
        payment.paymentStatus = 'submitted';
        payment.uploadedAt = Date.now();
        payment.rejectionReason = null; // Clear any previous rejection reason

        await payment.save();

        res.status(200).json({ message: 'Bank slip uploaded successfully', payment });
    } catch (error) {
        console.error('Error uploading bank slip:', error);
        res.status(500).json({ message: 'Server error uploading bank slip' });
    }
};

exports.getMyPayments = async (req, res) => {
    try {
        const payments = await Payment.find({ userId: req.user._id }).sort({ createdAt: -1 }).populate('bookingId');
        res.status(200).json(payments);
    } catch (error) {
        console.error('Error fetching my payments:', error);
        res.status(500).json({ message: 'Server error' });
    }
};

exports.getPaymentDetails = async (req, res) => {
    try {
        const payment = await Payment.findById(req.params.id).populate('bookingId');
        if (!payment) return res.status(404).json({ message: 'Payment not found' });

        if (payment.userId.toString() !== req.user._id.toString() && req.user.role !== 'admin') {
            return res.status(403).json({ message: 'Not authorized' });
        }

        res.status(200).json(payment);
    } catch (error) {
        console.error('Error fetching payment:', error);
        res.status(500).json({ message: 'Server error' });
    }
};

exports.getAdminPayments = async (req, res) => {
    try {
        const status = req.query.status;
        const query = status ? { paymentStatus: status, paymentMethod: 'bank_transfer' } : { paymentMethod: 'bank_transfer' };
        
        const payments = await Payment.find(query)
            .populate('userId', 'firstName lastName email')
            .sort({ uploadedAt: -1, createdAt: -1 });
            
        res.status(200).json(payments);
    } catch (error) {
        console.error('Error fetching admin payments:', error);
        res.status(500).json({ message: 'Server error' });
    }
};

exports.getProviderPayments = async (req, res) => {
    try {
        const providerId = req.user._id;
        // Find all bookings owned by this provider
        const providerBookings = await Booking.find({ providerId });
        const bookingIds = providerBookings.map(b => b._id);

        const status = req.query.status;
        const query = { 
            bookingId: { $in: bookingIds },
            paymentMethod: 'bank_transfer'
        };
        if (status) {
            query.paymentStatus = status;
        }

        const payments = await Payment.find(query)
            .populate('userId', 'firstName lastName email')
            .sort({ uploadedAt: -1, createdAt: -1 });

        res.status(200).json(payments);
    } catch (error) {
        console.error('Error fetching provider payments:', error);
        res.status(500).json({ message: 'Server error' });
    }
};

exports.verifyPayment = async (req, res) => {
    try {
        const payment = await Payment.findById(req.params.id);
        if (!payment) return res.status(404).json({ message: 'Payment not found' });

        const booking = await Booking.findById(payment.bookingId);
        
        // Authorization check: Admin OR the provider of the booking
        const isProvider = booking && booking.providerId.toString() === req.user._id.toString();
        const isAdmin = req.user.role === 'admin';
        if (!isProvider && !isAdmin) {
            return res.status(403).json({ message: 'Not authorized to verify this payment' });
        }

        if (payment.paymentStatus === 'verified') {
            return res.status(400).json({ message: 'Payment is already verified' });
        }

        payment.paymentStatus = 'verified';
        payment.verifiedAt = Date.now();
        payment.verifiedBy = req.user._id;
        await payment.save();

        // Update the related booking using existing logic (set to confirmed)
        if (booking) {
            booking.bookingStatus = 'confirmed';
            await booking.save();
        }

        res.status(200).json({ message: 'Payment verified and booking confirmed successfully', payment });
    } catch (error) {
        console.error('Error verifying payment:', error);
        res.status(500).json({ message: 'Server error verifying payment' });
    }
};

exports.rejectPayment = async (req, res) => {
    try {
        const { rejectionReason } = req.body;
        if (!rejectionReason) {
            return res.status(400).json({ message: 'Rejection reason is required' });
        }

        const payment = await Payment.findById(req.params.id);
        if (!payment) return res.status(404).json({ message: 'Payment not found' });

        const booking = await Booking.findById(payment.bookingId);
        
        // Authorization check: Admin OR the provider of the booking
        const isProvider = booking && booking.providerId.toString() === req.user._id.toString();
        const isAdmin = req.user.role === 'admin';
        if (!isProvider && !isAdmin) {
            return res.status(403).json({ message: 'Not authorized to reject this payment' });
        }

        payment.paymentStatus = 'rejected';
        payment.rejectionReason = rejectionReason;
        await payment.save();

        res.status(200).json({ message: 'Payment rejected', payment });
    } catch (error) {
        console.error('Error rejecting payment:', error);
        res.status(500).json({ message: 'Server error rejecting payment' });
    }
};
