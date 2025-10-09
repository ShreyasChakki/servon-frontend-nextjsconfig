# ServonF Backend - Product Requirement Document (PRD)
## MVP Architecture with Node.js + Express.js + MongoDB

---

## 1️⃣ Project Overview

### Application Description
ServonF is a comprehensive service marketplace platform that connects customers with service providers. The platform supports multi-role authentication (Customer, Provider, Admin) and facilitates service discovery, quotation management, real-time chat, booking management, and payment processing.

### Core User Journeys & Backend Support Needed

1. **User Authentication & Management**
   - User registration with role selection (Customer/Provider/Admin)
   - Login/logout with JWT token management
   - Profile management and updates
   - Password reset functionality

2. **Service Management**
   - Browse and search services by category
   - View detailed service information
   - Provider service creation and management
   - Service reviews and ratings

3. **Quotation System**
   - Customer quotation requests
   - Provider quotation responses
   - Quotation status tracking
   - Quotation history management

4. **Booking & Payment System**
   - Service booking creation
   - Payment processing and status tracking
   - Booking status management
   - Booking history

5. **Communication System**
   - Real-time chat between customers and providers
   - Message history management
   - Notification system

6. **Admin Management**
   - Platform statistics and analytics
   - User management
   - Service oversight
   - Quotation monitoring

---

## 2️⃣ MVP Architecture Breakdown

| Layer | Description | Technologies |
|-------|-------------|--------------|
| **Model** | Mongoose schemas representing MongoDB collections with business logic | MongoDB, Mongoose |
| **View** | Existing Next.js frontend components | React, Next.js |
| **Presenter** | Express controllers + routes handling logic between model and view | Express.js, Node.js |

### Data Flow Architecture
```
Frontend (View) ⇄ Express Routes (Presenter) ⇄ Mongoose Models (Model) ⇄ MongoDB Database
```

**Detailed Flow:**
1. Frontend sends HTTP requests to Express routes
2. Routes validate requests and call appropriate controllers
3. Controllers implement business logic and interact with Mongoose models
4. Models perform database operations and return data
5. Controllers format responses and send back to frontend
6. Frontend updates UI based on response data

---

## 3️⃣ Database Design (Schemas & Models)

### Core Collections Required

| Model | Fields | Description | Relations |
|-------|--------|-------------|-----------|
| **User** | name, email, password, role, profile_data, timestamps | Stores user authentication and profile info | HasMany: Services, Quotations, Bookings, Messages |
| **Service** | title, description, category, price, features, location, images | Service listings created by providers | BelongsTo: User (Provider), HasMany: Reviews, Quotations |
| **Quotation** | service_id, customer_id, provider_id, details, budget, status, responses | Customer service requests and provider responses | BelongsTo: User (Customer & Provider), Service |
| **Booking** | service_id, customer_id, provider_id, date, amount, status, payment_status | Confirmed service bookings | BelongsTo: User, Service |
| **Message** | sender_id, receiver_id, quotation_id, content, timestamp | Chat messages between users | BelongsTo: User (Sender & Receiver), Quotation |
| **Review** | service_id, customer_id, rating, comment, timestamp | Service reviews and ratings | BelongsTo: User (Customer), Service |
| **Notification** | user_id, title, message, type, read, link, timestamp | User notifications | BelongsTo: User |

### Sample Mongoose Schemas

```javascript
// models/User.js
const mongoose = require('mongoose');
const bcrypt = require('bcrypt');

const userSchema = new mongoose.Schema({
  name: { type: String, required: true, trim: true },
  email: { type: String, required: true, unique: true, lowercase: true },
  password: { type: String, required: true, minlength: 6 },
  role: { 
    type: String, 
    enum: ['customer', 'provider', 'admin'], 
    default: 'customer' 
  },
  profile: {
    phone: { type: String, default: '' },
    bio: { type: String, default: '' },
    location: { type: String, default: '' },
    avatar: { type: String, default: '/placeholder-user.jpg' }
  },
  isActive: { type: Boolean, default: true },
  lastLogin: { type: Date }
}, { timestamps: true });

// Hash password before saving
userSchema.pre('save', async function(next) {
  if (!this.isModified('password')) return next();
  this.password = await bcrypt.hash(this.password, 12);
  next();
});

// Compare password method
userSchema.methods.comparePassword = async function(candidatePassword) {
  return bcrypt.compare(candidatePassword, this.password);
};

module.exports = mongoose.model('User', userSchema);

// models/Service.js
const mongoose = require('mongoose');

const serviceSchema = new mongoose.Schema({
  title: { type: String, required: true, trim: true },
  description: { type: String, required: true },
  category: { 
    type: String, 
    required: true,
    enum: ['tech', 'home', 'creative', 'business', 'health', 'education', 'outdoor']
  },
  price: { type: Number, required: true, min: 0 },
  providerId: { 
    type: mongoose.Schema.Types.ObjectId, 
    ref: 'User', 
    required: true 
  },
  location: { type: String, required: true },
  images: [{ type: String }],
  features: [{ type: String }],
  deliveryTime: { type: String, default: '1-2 weeks' },
  rating: { type: Number, default: 0, min: 0, max: 5 },
  reviewCount: { type: Number, default: 0 },
  views: { type: Number, default: 0 },
  isActive: { type: Boolean, default: true }
}, { timestamps: true });

// Create indexes for better search performance
serviceSchema.index({ category: 1, isActive: 1 });
serviceSchema.index({ providerId: 1, isActive: 1 });
serviceSchema.index({ title: 'text', description: 'text' });

module.exports = mongoose.model('Service', serviceSchema);

// models/Quotation.js
const mongoose = require('mongoose');

const quotationSchema = new mongoose.Schema({
  serviceId: { 
    type: mongoose.Schema.Types.ObjectId, 
    ref: 'Service', 
    required: true 
  },
  customerId: { 
    type: mongoose.Schema.Types.ObjectId, 
    ref: 'User', 
    required: true 
  },
  providerId: { 
    type: mongoose.Schema.Types.ObjectId, 
    ref: 'User', 
    required: true 
  },
  details: { type: String, required: true },
  budget: { type: Number, required: true, min: 0 },
  deadline: { type: Date, required: true },
  status: { 
    type: String, 
    enum: ['pending', 'responded', 'accepted', 'rejected', 'completed', 'cancelled'], 
    default: 'pending' 
  },
  providerResponse: {
    message: { type: String },
    quotedPrice: { type: Number, min: 0 },
    estimatedDuration: { type: String },
    respondedAt: { type: Date }
  },
  customerDecision: {
    accepted: { type: Boolean },
    message: { type: String },
    decidedAt: { type: Date }
  }
}, { timestamps: true });

// Create indexes
quotationSchema.index({ customerId: 1, status: 1 });
quotationSchema.index({ providerId: 1, status: 1 });
quotationSchema.index({ serviceId: 1 });

module.exports = mongoose.model('Quotation', quotationSchema);

// models/Booking.js
const mongoose = require('mongoose');

const bookingSchema = new mongoose.Schema({
  serviceId: { 
    type: mongoose.Schema.Types.ObjectId, 
    ref: 'Service', 
    required: true 
  },
  customerId: { 
    type: mongoose.Schema.Types.ObjectId, 
    ref: 'User', 
    required: true 
  },
  providerId: { 
    type: mongoose.Schema.Types.ObjectId, 
    ref: 'User', 
    required: true 
  },
  quotationId: { 
    type: mongoose.Schema.Types.ObjectId, 
    ref: 'Quotation', 
    required: true 
  },
  scheduledDate: { type: Date, required: true },
  location: { type: String, required: true },
  amount: { type: Number, required: true, min: 0 },
  description: { type: String, required: true },
  status: { 
    type: String, 
    enum: ['active', 'completed', 'cancelled'], 
    default: 'active' 
  },
  paymentStatus: { 
    type: String, 
    enum: ['pending', 'paid', 'refunded'], 
    default: 'pending' 
  },
  completedAt: { type: Date },
  cancelledAt: { type: Date },
  cancellationReason: { type: String }
}, { timestamps: true });

bookingSchema.index({ customerId: 1, status: 1 });
bookingSchema.index({ providerId: 1, status: 1 });

module.exports = mongoose.model('Booking', bookingSchema);

// models/Message.js
const mongoose = require('mongoose');

const messageSchema = new mongoose.Schema({
  senderId: { 
    type: mongoose.Schema.Types.ObjectId, 
    ref: 'User', 
    required: true 
  },
  receiverId: { 
    type: mongoose.Schema.Types.ObjectId, 
    ref: 'User', 
    required: true 
  },
  quotationId: { 
    type: mongoose.Schema.Types.ObjectId, 
    ref: 'Quotation',
    required: true 
  },
  content: { type: String, required: true, maxlength: 1000 },
  messageType: { 
    type: String, 
    enum: ['text', 'file', 'image'], 
    default: 'text' 
  },
  fileUrl: { type: String },
  isRead: { type: Boolean, default: false },
  readAt: { type: Date }
}, { timestamps: true });

messageSchema.index({ quotationId: 1, createdAt: 1 });
messageSchema.index({ receiverId: 1, isRead: 1 });

module.exports = mongoose.model('Message', messageSchema);

// models/Review.js
const mongoose = require('mongoose');

const reviewSchema = new mongoose.Schema({
  serviceId: { 
    type: mongoose.Schema.Types.ObjectId, 
    ref: 'Service', 
    required: true 
  },
  customerId: { 
    type: mongoose.Schema.Types.ObjectId, 
    ref: 'User', 
    required: true 
  },
  bookingId: { 
    type: mongoose.Schema.Types.ObjectId, 
    ref: 'Booking', 
    required: true 
  },
  rating: { type: Number, required: true, min: 1, max: 5 },
  comment: { type: String, required: true, maxlength: 500 },
  isVerified: { type: Boolean, default: true }
}, { timestamps: true });

// Prevent duplicate reviews
reviewSchema.index({ customerId: 1, bookingId: 1 }, { unique: true });
reviewSchema.index({ serviceId: 1 });

module.exports = mongoose.model('Review', reviewSchema);

// models/Notification.js
const mongoose = require('mongoose');

const notificationSchema = new mongoose.Schema({
  userId: { 
    type: mongoose.Schema.Types.ObjectId, 
    ref: 'User', 
    required: true 
  },
  title: { type: String, required: true },
  message: { type: String, required: true },
  type: { 
    type: String, 
    enum: ['quotation', 'booking', 'message', 'review', 'payment', 'system'], 
    required: true 
  },
  relatedId: { type: mongoose.Schema.Types.ObjectId },
  link: { type: String },
  isRead: { type: Boolean, default: false },
  readAt: { type: Date }
}, { timestamps: true });

notificationSchema.index({ userId: 1, isRead: 1, createdAt: -1 });

module.exports = mongoose.model('Notification', notificationSchema);
```

---

## 4️⃣ API Endpoints & Routes

### Authentication Routes

| Method | Endpoint | Description | Controller Function | Auth Required |
|--------|----------|-------------|-------------------|---------------|
| POST | `/api/auth/register` | Register new user | `authController.register` | No |
| POST | `/api/auth/login` | Login user | `authController.login` | No |
| POST | `/api/auth/logout` | Logout user | `authController.logout` | Yes |
| POST | `/api/auth/refresh` | Refresh JWT token | `authController.refreshToken` | Yes |
| POST | `/api/auth/forgot-password` | Request password reset | `authController.forgotPassword` | No |
| POST | `/api/auth/reset-password` | Reset password | `authController.resetPassword` | No |

### User Management Routes

| Method | Endpoint | Description | Controller Function | Auth Required |
|--------|----------|-------------|-------------------|---------------|
| GET | `/api/user/profile` | Get user profile | `userController.getProfile` | Yes |
| PUT | `/api/user/profile` | Update user profile | `userController.updateProfile` | Yes |
| POST | `/api/user/avatar` | Upload user avatar | `userController.uploadAvatar` | Yes |
| DELETE | `/api/user/account` | Delete user account | `userController.deleteAccount` | Yes |

### Service Routes

| Method | Endpoint | Description | Controller Function | Auth Required |
|--------|----------|-------------|-------------------|---------------|
| GET | `/api/services` | Get all services (with filters) | `serviceController.getServices` | No |
| GET | `/api/services/:id` | Get service by ID | `serviceController.getServiceById` | No |
| POST | `/api/services` | Create new service | `serviceController.createService` | Yes (Provider) |
| PUT | `/api/services/:id` | Update service | `serviceController.updateService` | Yes (Provider) |
| DELETE | `/api/services/:id` | Delete service | `serviceController.deleteService` | Yes (Provider) |
| GET | `/api/services/:id/reviews` | Get service reviews | `serviceController.getServiceReviews` | No |

### Quotation Routes

| Method | Endpoint | Description | Controller Function | Auth Required |
|--------|----------|-------------|-------------------|---------------|
| GET | `/api/quotations` | Get user's quotations | `quotationController.getQuotations` | Yes |
| GET | `/api/quotations/:id` | Get quotation by ID | `quotationController.getQuotationById` | Yes |
| POST | `/api/quotations` | Create quotation request | `quotationController.createQuotation` | Yes (Customer) |
| PUT | `/api/quotations/:id/respond` | Provider responds to quotation | `quotationController.respondToQuotation` | Yes (Provider) |
| PUT | `/api/quotations/:id/accept` | Customer accepts quotation | `quotationController.acceptQuotation` | Yes (Customer) |
| PUT | `/api/quotations/:id/reject` | Customer rejects quotation | `quotationController.rejectQuotation` | Yes (Customer) |
| PUT | `/api/quotations/:id/complete` | Mark quotation as complete | `quotationController.completeQuotation` | Yes |

### Booking Routes

| Method | Endpoint | Description | Controller Function | Auth Required |
|--------|----------|-------------|-------------------|---------------|
| GET | `/api/bookings` | Get user's bookings | `bookingController.getBookings` | Yes |
| GET | `/api/bookings/:id` | Get booking by ID | `bookingController.getBookingById` | Yes |
| POST | `/api/bookings` | Create booking from quotation | `bookingController.createBooking` | Yes |
| PUT | `/api/bookings/:id/status` | Update booking status | `bookingController.updateBookingStatus` | Yes |
| PUT | `/api/bookings/:id/payment` | Update payment status | `bookingController.updatePaymentStatus` | Yes |
| POST | `/api/bookings/:id/cancel` | Cancel booking | `bookingController.cancelBooking` | Yes |

### Message/Chat Routes

| Method | Endpoint | Description | Controller Function | Auth Required |
|--------|----------|-------------|-------------------|---------------|
| GET | `/api/chat/:quotationId/messages` | Get chat messages | `chatController.getMessages` | Yes |
| POST | `/api/chat/:quotationId/messages` | Send message | `chatController.sendMessage` | Yes |
| PUT | `/api/chat/messages/:id/read` | Mark message as read | `chatController.markAsRead` | Yes |
| GET | `/api/chat/conversations` | Get user's conversations | `chatController.getConversations` | Yes |

### Review Routes

| Method | Endpoint | Description | Controller Function | Auth Required |
|--------|----------|-------------|-------------------|---------------|
| GET | `/api/reviews` | Get user's reviews | `reviewController.getReviews` | Yes |
| POST | `/api/reviews` | Create review | `reviewController.createReview` | Yes (Customer) |
| PUT | `/api/reviews/:id` | Update review | `reviewController.updateReview` | Yes (Customer) |
| DELETE | `/api/reviews/:id` | Delete review | `reviewController.deleteReview` | Yes (Customer) |

### Customer Specific Routes

| Method | Endpoint | Description | Controller Function | Auth Required |
|--------|----------|-------------|-------------------|---------------|
| GET | `/api/customer/dashboard` | Get customer dashboard stats | `customerController.getDashboard` | Yes (Customer) |
| GET | `/api/customer/bookings` | Get customer bookings | `customerController.getBookings` | Yes (Customer) |
| GET | `/api/customer/quotations` | Get customer quotations | `customerController.getQuotations` | Yes (Customer) |
| GET | `/api/customer/saved-services` | Get saved services | `customerController.getSavedServices` | Yes (Customer) |
| POST | `/api/customer/saved-services` | Save service | `customerController.saveService` | Yes (Customer) |
| DELETE | `/api/customer/saved-services/:id` | Remove saved service | `customerController.removeSavedService` | Yes (Customer) |

### Provider Specific Routes

| Method | Endpoint | Description | Controller Function | Auth Required |
|--------|----------|-------------|-------------------|---------------|
| GET | `/api/provider/dashboard` | Get provider dashboard stats | `providerController.getDashboard` | Yes (Provider) |
| GET | `/api/provider/services` | Get provider's services | `providerController.getServices` | Yes (Provider) |
| GET | `/api/provider/quotations` | Get provider quotations | `providerController.getQuotations` | Yes (Provider) |
| GET | `/api/provider/bookings` | Get provider bookings | `providerController.getBookings` | Yes (Provider) |
| GET | `/api/provider/earnings` | Get earnings stats | `providerController.getEarnings` | Yes (Provider) |

### Admin Routes

| Method | Endpoint | Description | Controller Function | Auth Required |
|--------|----------|-------------|-------------------|---------------|
| GET | `/api/admin/dashboard` | Get admin dashboard stats | `adminController.getDashboard` | Yes (Admin) |
| GET | `/api/admin/users` | Get all users | `adminController.getUsers` | Yes (Admin) |
| GET | `/api/admin/services` | Get all services | `adminController.getServices` | Yes (Admin) |
| GET | `/api/admin/quotations` | Get all quotations | `adminController.getQuotations` | Yes (Admin) |
| PUT | `/api/admin/users/:id/status` | Update user status | `adminController.updateUserStatus` | Yes (Admin) |
| DELETE | `/api/admin/services/:id` | Remove service | `adminController.removeService` | Yes (Admin) |

### Notification Routes

| Method | Endpoint | Description | Controller Function | Auth Required |
|--------|----------|-------------|-------------------|---------------|
| GET | `/api/notifications` | Get user notifications | `notificationController.getNotifications` | Yes |
| PUT | `/api/notifications/:id/read` | Mark notification as read | `notificationController.markAsRead` | Yes |
| PUT | `/api/notifications/read-all` | Mark all notifications as read | `notificationController.markAllAsRead` | Yes |
| DELETE | `/api/notifications/:id` | Delete notification | `notificationController.deleteNotification` | Yes |

---

## 5️⃣ Controllers (Presenter Layer)

### Sample Controller Implementation

```javascript
// controllers/authController.js
const User = require('../models/User');
const jwt = require('jsonwebtoken');
const { validationResult } = require('express-validator');

class AuthController {
  // Register new user
  async register(req, res) {
    try {
      const errors = validationResult(req);
      if (!errors.isEmpty()) {
        return res.status(400).json({
          success: false,
          message: 'Validation failed',
          errors: errors.array()
        });
      }

      const { name, email, password, role } = req.body;

      // Check if user already exists
      const existingUser = await User.findOne({ email });
      if (existingUser) {
        return res.status(400).json({
          success: false,
          message: 'User already exists with this email'
        });
      }

      // Create new user
      const user = new User({ name, email, password, role });
      await user.save();

      // Generate JWT token
      const token = jwt.sign(
        { userId: user._id, role: user.role },
        process.env.JWT_SECRET,
        { expiresIn: '7d' }
      );

      // Remove password from response
      const userResponse = user.toObject();
      delete userResponse.password;

      res.status(201).json({
        success: true,
        message: 'User registered successfully',
        user: userResponse,
        token
      });
    } catch (error) {
      console.error('Registration error:', error);
      res.status(500).json({
        success: false,
        message: 'Internal server error'
      });
    }
  }

  // Login user
  async login(req, res) {
    try {
      const errors = validationResult(req);
      if (!errors.isEmpty()) {
        return res.status(400).json({
          success: false,
          message: 'Validation failed',
          errors: errors.array()
        });
      }

      const { email, password } = req.body;

      // Find user and include password for comparison
      const user = await User.findOne({ email, isActive: true });
      if (!user) {
        return res.status(401).json({
          success: false,
          message: 'Invalid email or password'
        });
      }

      // Check password
      const isPasswordValid = await user.comparePassword(password);
      if (!isPasswordValid) {
        return res.status(401).json({
          success: false,
          message: 'Invalid email or password'
        });
      }

      // Update last login
      user.lastLogin = new Date();
      await user.save();

      // Generate JWT token
      const token = jwt.sign(
        { userId: user._id, role: user.role },
        process.env.JWT_SECRET,
        { expiresIn: '7d' }
      );

      // Remove password from response
      const userResponse = user.toObject();
      delete userResponse.password;

      res.json({
        success: true,
        message: 'Login successful',
        user: userResponse,
        token
      });
    } catch (error) {
      console.error('Login error:', error);
      res.status(500).json({
        success: false,
        message: 'Internal server error'
      });
    }
  }

  // Logout user (client-side token removal mainly)
  async logout(req, res) {
    res.json({
      success: true,
      message: 'Logout successful'
    });
  }
}

module.exports = new AuthController();

// controllers/quotationController.js
const Quotation = require('../models/Quotation');
const Service = require('../models/Service');
const User = require('../models/User');
const Notification = require('../models/Notification');

class QuotationController {
  // Create quotation request
  async createQuotation(req, res) {
    try {
      const { serviceId, details, budget, deadline } = req.body;
      const customerId = req.user.userId;

      // Validate service exists
      const service = await Service.findById(serviceId).populate('providerId');
      if (!service) {
        return res.status(404).json({
          success: false,
          message: 'Service not found'
        });
      }

      // Create quotation
      const quotation = new Quotation({
        serviceId,
        customerId,
        providerId: service.providerId._id,
        details,
        budget,
        deadline: new Date(deadline)
      });

      await quotation.save();

      // Create notification for provider
      await Notification.create({
        userId: service.providerId._id,
        title: 'New Quotation Request',
        message: `You have a new quotation request for ${service.title}`,
        type: 'quotation',
        relatedId: quotation._id,
        link: '/provider/quotations'
      });

      // Populate response data
      const populatedQuotation = await Quotation.findById(quotation._id)
        .populate('serviceId', 'title category')
        .populate('customerId', 'name email')
        .populate('providerId', 'name email');

      res.status(201).json({
        success: true,
        message: 'Quotation request created successfully',
        quotation: populatedQuotation
      });
    } catch (error) {
      console.error('Create quotation error:', error);
      res.status(500).json({
        success: false,
        message: 'Internal server error'
      });
    }
  }

  // Provider responds to quotation
  async respondToQuotation(req, res) {
    try {
      const { id } = req.params;
      const { message, quotedPrice, estimatedDuration } = req.body;
      const providerId = req.user.userId;

      const quotation = await Quotation.findOne({ 
        _id: id, 
        providerId, 
        status: 'pending' 
      });

      if (!quotation) {
        return res.status(404).json({
          success: false,
          message: 'Quotation not found or not available for response'
        });
      }

      // Update quotation with provider response
      quotation.providerResponse = {
        message,
        quotedPrice,
        estimatedDuration,
        respondedAt: new Date()
      };
      quotation.status = 'responded';

      await quotation.save();

      // Create notification for customer
      await Notification.create({
        userId: quotation.customerId,
        title: 'Quotation Response Received',
        message: `Provider has responded to your quotation request`,
        type: 'quotation',
        relatedId: quotation._id,
        link: '/customer/quotations'
      });

      const populatedQuotation = await Quotation.findById(quotation._id)
        .populate('serviceId', 'title category')
        .populate('customerId', 'name email')
        .populate('providerId', 'name email');

      res.json({
        success: true,
        message: 'Quotation response sent successfully',
        quotation: populatedQuotation
      });
    } catch (error) {
      console.error('Respond to quotation error:', error);
      res.status(500).json({
        success: false,
        message: 'Internal server error'
      });
    }
  }

  // Get user's quotations
  async getQuotations(req, res) {
    try {
      const { userId, role } = req.user;
      const { status, page = 1, limit = 10 } = req.query;

      let query = {};
      if (role === 'customer') {
        query.customerId = userId;
      } else if (role === 'provider') {
        query.providerId = userId;
      }

      if (status && status !== 'all') {
        query.status = status;
      }

      const quotations = await Quotation.find(query)
        .populate('serviceId', 'title category price')
        .populate('customerId', 'name email profile.avatar')
        .populate('providerId', 'name email profile.avatar')
        .sort({ createdAt: -1 })
        .limit(limit * 1)
        .skip((page - 1) * limit);

      const total = await Quotation.countDocuments(query);

      res.json({
        success: true,
        quotations,
        pagination: {
          currentPage: page,
          totalPages: Math.ceil(total / limit),
          totalQuotations: total
        }
      });
    } catch (error) {
      console.error('Get quotations error:', error);
      res.status(500).json({
        success: false,
        message: 'Internal server error'
      });
    }
  }
}

module.exports = new QuotationController();
```

---

## 6️⃣ Middleware

### Authentication Middleware

```javascript
// middleware/auth.js
const jwt = require('jsonwebtoken');
const User = require('../models/User');

const authenticateToken = async (req, res, next) => {
  try {
    const authHeader = req.headers['authorization'];
    const token = authHeader && authHeader.split(' ')[1];

    if (!token) {
      return res.status(401).json({
        success: false,
        message: 'Access token required'
      });
    }

    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    
    // Verify user still exists and is active
    const user = await User.findById(decoded.userId);
    if (!user || !user.isActive) {
      return res.status(401).json({
        success: false,
        message: 'Invalid token or user not found'
      });
    }

    req.user = decoded;
    next();
  } catch (error) {
    console.error('Auth middleware error:', error);
    return res.status(403).json({
      success: false,
      message: 'Invalid token'
    });
  }
};

const authorizeRoles = (...roles) => {
  return (req, res, next) => {
    if (!req.user) {
      return res.status(401).json({
        success: false,
        message: 'Authentication required'
      });
    }

    if (!roles.includes(req.user.role)) {
      return res.status(403).json({
        success: false,
        message: 'Access denied. Insufficient permissions.'
      });
    }

    next();
  };
};

module.exports = { authenticateToken, authorizeRoles };
```

### Validation Middleware

```javascript
// middleware/validation.js
const { body } = require('express-validator');

const validateRegister = [
  body('name')
    .trim()
    .isLength({ min: 2, max: 50 })
    .withMessage('Name must be between 2 and 50 characters'),
  body('email')
    .isEmail()
    .normalizeEmail()
    .withMessage('Please provide a valid email'),
  body('password')
    .isLength({ min: 6 })
    .withMessage('Password must be at least 6 characters long'),
  body('role')
    .isIn(['customer', 'provider'])
    .withMessage('Role must be either customer or provider')
];

const validateLogin = [
  body('email')
    .isEmail()
    .normalizeEmail()
    .withMessage('Please provide a valid email'),
  body('password')
    .notEmpty()
    .withMessage('Password is required')
];

const validateQuotation = [
  body('serviceId')
    .isMongoId()
    .withMessage('Valid service ID is required'),
  body('details')
    .trim()
    .isLength({ min: 10, max: 1000 })
    .withMessage('Details must be between 10 and 1000 characters'),
  body('budget')
    .isNumeric()
    .isFloat({ min: 0 })
    .withMessage('Budget must be a positive number'),
  body('deadline')
    .isISO8601()
    .withMessage('Valid deadline date is required')
];

module.exports = {
  validateRegister,
  validateLogin,
  validateQuotation
};
```

### Error Handling Middleware

```javascript
// middleware/errorHandler.js
const errorHandler = (err, req, res, next) => {
  console.error('Error Stack:', err.stack);

  // Mongoose validation error
  if (err.name === 'ValidationError') {
    const errors = Object.values(err.errors).map(val => val.message);
    return res.status(400).json({
      success: false,
      message: 'Validation Error',
      errors
    });
  }

  // Mongoose duplicate key error
  if (err.code === 11000) {
    const field = Object.keys(err.keyValue)[0];
    return res.status(400).json({
      success: false,
      message: `${field} already exists`
    });
  }

  // JWT errors
  if (err.name === 'JsonWebTokenError') {
    return res.status(401).json({
      success: false,
      message: 'Invalid token'
    });
  }

  if (err.name === 'TokenExpiredError') {
    return res.status(401).json({
      success: false,
      message: 'Token expired'
    });
  }

  // Default error
  res.status(err.statusCode || 500).json({
    success: false,
    message: err.message || 'Internal Server Error'
  });
};

module.exports = errorHandler;
```

---

## 7️⃣ Environment Setup

### Required Environment Variables

```bash
# .env.example
# Server Configuration
PORT=5000
NODE_ENV=development

# Database Configuration
MONGO_URI=mongodb+srv://<username>:<password>@cluster.mongodb.net/<dbname>?retryWrites=true&w=majority

# JWT Configuration
JWT_SECRET=your_super_secure_jwt_secret_key_here_make_it_long_and_random
JWT_REFRESH_SECRET=your_refresh_token_secret_key

# Email Configuration (for password reset, notifications)
EMAIL_SERVICE=gmail
EMAIL_USER=your_email@gmail.com
EMAIL_PASS=your_app_password

# File Upload Configuration
MAX_FILE_SIZE=5242880
UPLOAD_PATH=./uploads

# Client URL (for CORS and email links)
CLIENT_URL=http://localhost:3000

# Payment Gateway (if implementing payments)
STRIPE_SECRET_KEY=your_stripe_secret_key
STRIPE_PUBLISHABLE_KEY=your_stripe_publishable_key

# AI Service (for chatbot)
OPENAI_API_KEY=your_openai_api_key
```

### MongoDB Connection Setup

```javascript
// config/database.js
const mongoose = require('mongoose');

const connectDB = async () => {
  try {
    const conn = await mongoose.connect(process.env.MONGO_URI, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });

    console.log(`MongoDB Connected: ${conn.connection.host}`);
    
    // Handle connection events
    mongoose.connection.on('error', (err) => {
      console.error('MongoDB connection error:', err);
    });

    mongoose.connection.on('disconnected', () => {
      console.log('MongoDB disconnected');
    });

    // Graceful shutdown
    process.on('SIGINT', async () => {
      await mongoose.connection.close();
      console.log('MongoDB connection closed through app termination');
      process.exit(0);
    });

  } catch (error) {
    console.error('Database connection failed:', error);
    process.exit(1);
  }
};

module.exports = connectDB;
```

---

## 8️⃣ Project Structure

```
/backend
├── /config
│   ├── database.js          # MongoDB connection configuration
│   └── cloudinary.js        # File upload configuration (optional)
├── /controllers
│   ├── authController.js     # Authentication logic
│   ├── userController.js     # User management logic
│   ├── serviceController.js  # Service management logic
│   ├── quotationController.js # Quotation management logic
│   ├── bookingController.js  # Booking management logic
│   ├── chatController.js     # Chat/messaging logic
│   ├── reviewController.js   # Review management logic
│   ├── customerController.js # Customer-specific logic
│   ├── providerController.js # Provider-specific logic
│   ├── adminController.js    # Admin management logic
│   └── notificationController.js # Notification logic
├── /middleware
│   ├── auth.js              # Authentication & authorization
│   ├── validation.js        # Input validation rules
│   ├── errorHandler.js      # Global error handling
│   ├── upload.js            # File upload handling
│   └── rateLimiter.js       # API rate limiting
├── /models
│   ├── User.js              # User schema and model
│   ├── Service.js           # Service schema and model
│   ├── Quotation.js         # Quotation schema and model
│   ├── Booking.js           # Booking schema and model
│   ├── Message.js           # Message schema and model
│   ├── Review.js            # Review schema and model
│   └── Notification.js      # Notification schema and model
├── /routes
│   ├── authRoutes.js        # Authentication routes
│   ├── userRoutes.js        # User management routes
│   ├── serviceRoutes.js     # Service routes
│   ├── quotationRoutes.js   # Quotation routes
│   ├── bookingRoutes.js     # Booking routes
│   ├── chatRoutes.js        # Chat/messaging routes
│   ├── reviewRoutes.js      # Review routes
│   ├── customerRoutes.js    # Customer-specific routes
│   ├── providerRoutes.js    # Provider-specific routes
│   ├── adminRoutes.js       # Admin routes
│   └── notificationRoutes.js # Notification routes
├── /utils
│   ├── emailService.js      # Email sending utilities
│   ├── fileUtils.js         # File handling utilities
│   ├── dateUtils.js         # Date manipulation utilities
│   └── validation.js        # Custom validation functions
├── /uploads                 # File upload directory
├── server.js               # Main application entry point
├── package.json            # Dependencies and scripts
├── .env.example            # Environment variables template
└── README.md              # Project documentation
```

### Main Server File

```javascript
// server.js
const express = require('express');
const cors = require('cors');
const morgan = require('morgan');
const helmet = require('helmet');
const rateLimit = require('express-rate-limit');
require('dotenv').config();

const connectDB = require('./config/database');
const errorHandler = require('./middleware/errorHandler');

// Import routes
const authRoutes = require('./routes/authRoutes');
const userRoutes = require('./routes/userRoutes');
const serviceRoutes = require('./routes/serviceRoutes');
const quotationRoutes = require('./routes/quotationRoutes');
const bookingRoutes = require('./routes/bookingRoutes');
const chatRoutes = require('./routes/chatRoutes');
const reviewRoutes = require('./routes/reviewRoutes');
const customerRoutes = require('./routes/customerRoutes');
const providerRoutes = require('./routes/providerRoutes');
const adminRoutes = require('./routes/adminRoutes');
const notificationRoutes = require('./routes/notificationRoutes');

const app = express();

// Connect to database
connectDB();

// Security middleware
app.use(helmet());
app.use(cors({
  origin: process.env.CLIENT_URL || 'http://localhost:3000',
  credentials: true
}));

// Rate limiting
const limiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 100, // limit each IP to 100 requests per windowMs
  message: 'Too many requests from this IP, please try again later.'
});
app.use('/api/', limiter);

// Body parsing middleware
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true, limit: '10mb' }));

// Logging middleware
if (process.env.NODE_ENV === 'development') {
  app.use(morgan('dev'));
}

// Routes
app.use('/api/auth', authRoutes);
app.use('/api/user', userRoutes);
app.use('/api/services', serviceRoutes);
app.use('/api/quotations', quotationRoutes);
app.use('/api/bookings', bookingRoutes);
app.use('/api/chat', chatRoutes);
app.use('/api/reviews', reviewRoutes);
app.use('/api/customer', customerRoutes);
app.use('/api/provider', providerRoutes);
app.use('/api/admin', adminRoutes);
app.use('/api/notifications', notificationRoutes);

// Health check endpoint
app.get('/api/health', (req, res) => {
  res.json({
    success: true,
    message: 'Server is running',
    timestamp: new Date().toISOString()
  });
});

// 404 handler
app.use('*', (req, res) => {
  res.status(404).json({
    success: false,
    message: 'API endpoint not found'
  });
});

// Global error handler
app.use(errorHandler);

const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
  console.log(`Server running in ${process.env.NODE_ENV} mode on port ${PORT}`);
});

// Graceful shutdown
process.on('unhandledRejection', (err, promise) => {
  console.log(`Error: ${err.message}`);
  process.exit(1);
});
```

---

## 9️⃣ Testing Plan

### Testing Strategy

1. **Unit Tests**
   - Test individual functions in controllers
   - Test model methods and validations
   - Test utility functions

2. **Integration Tests**
   - Test API endpoints with real database
   - Test authentication flows
   - Test business logic workflows

3. **API Testing**
   - Use Postman collections for manual testing
   - Automated API tests using Jest + Supertest

### Sample Test Files

```javascript
// tests/auth.test.js
const request = require('supertest');
const app = require('../server');
const User = require('../models/User');

describe('Authentication Endpoints', () => {
  beforeEach(async () => {
    await User.deleteMany({});
  });

  describe('POST /api/auth/register', () => {
    it('should register a new user successfully', async () => {
      const userData = {
        name: 'Test User',
        email: 'test@example.com',
        password: 'password123',
        role: 'customer'
      };

      const response = await request(app)
        .post('/api/auth/register')
        .send(userData)
        .expect(201);

      expect(response.body.success).toBe(true);
      expect(response.body.user.email).toBe(userData.email);
      expect(response.body.token).toBeDefined();
    });

    it('should not register user with invalid email', async () => {
      const userData = {
        name: 'Test User',
        email: 'invalid-email',
        password: 'password123',
        role: 'customer'
      };

      const response = await request(app)
        .post('/api/auth/register')
        .send(userData)
        .expect(400);

      expect(response.body.success).toBe(false);
    });
  });

  describe('POST /api/auth/login', () => {
    it('should login with valid credentials', async () => {
      // Create user first
      const user = new User({
        name: 'Test User',
        email: 'test@example.com',
        password: 'password123',
        role: 'customer'
      });
      await user.save();

      const response = await request(app)
        .post('/api/auth/login')
        .send({
          email: 'test@example.com',
          password: 'password123'
        })
        .expect(200);

      expect(response.body.success).toBe(true);
      expect(response.body.token).toBeDefined();
    });
  });
});
```

---

## 🔟 Future Enhancements

### Phase 1 Enhancements
- **Email Notifications**: Password reset, booking confirmations
- **File Upload**: Service images, user avatars, chat file sharing
- **Search & Filtering**: Advanced service search with location, price, rating filters
- **Pagination**: Implement across all list endpoints

### Phase 2 Enhancements
- **Real-time Features**: WebSocket integration for live chat and notifications
- **Payment Integration**: Stripe or PayPal integration for secure payments
- **Advanced Analytics**: Detailed reporting for providers and admins
- **Mobile API**: Enhanced mobile-specific endpoints

### Phase 3 Enhancements
- **Microservices**: Split into focused services (Auth, Booking, Payment, Chat)
- **Caching**: Redis implementation for improved performance
- **AI Features**: Smart service recommendations, automated customer support
- **Multi-language**: i18n support for global expansion

### Scalability Considerations
- **Database Indexing**: Optimize queries with proper indexes
- **Load Balancing**: Implement for high traffic scenarios
- **CDN Integration**: For file and image serving
- **Monitoring**: Application monitoring and logging (Winston, Morgan)

---

## 📚 Implementation Timeline

### Week 1-2: Foundation
- Project setup and database configuration
- User authentication system
- Basic user management

### Week 3-4: Core Features
- Service management system
- Quotation workflow implementation
- Basic API endpoints

### Week 5-6: Advanced Features
- Booking system
- Chat/messaging functionality
- Notification system

### Week 7-8: Admin & Polish
- Admin dashboard APIs
- Testing and bug fixes
- Documentation and deployment preparation

---

## 🚀 Deployment Recommendations

### Development Environment
- **Database**: MongoDB Atlas (free tier)
- **Hosting**: Local development server
- **File Storage**: Local filesystem

### Production Environment
- **Hosting**: Heroku, DigitalOcean, or AWS EC2
- **Database**: MongoDB Atlas (production cluster)
- **File Storage**: AWS S3 or Cloudinary
- **Email Service**: SendGrid or AWS SES
- **Monitoring**: New Relic or DataDog

### Environment-Specific Configurations
```javascript
// config/config.js
module.exports = {
  development: {
    database: {
      uri: process.env.MONGO_URI_DEV,
      options: { useNewUrlParser: true }
    },
    jwt: {
      expiresIn: '1d'
    }
  },
  production: {
    database: {
      uri: process.env.MONGO_URI_PROD,
      options: { 
        useNewUrlParser: true,
        ssl: true,
        sslValidate: true
      }
    },
    jwt: {
      expiresIn: '7d'
    }
  }
};
```

---

This comprehensive Backend PRD provides a complete roadmap for implementing the ServonF backend using Node.js, Express.js, MongoDB, and Mongoose with MVP architecture. The design ensures scalability, maintainability, and aligns perfectly with your existing Next.js frontend requirements.