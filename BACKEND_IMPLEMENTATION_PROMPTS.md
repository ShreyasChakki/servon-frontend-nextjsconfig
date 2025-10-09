# ServonF Backend Implementation Prompts
## Phase-by-Phase Development Instructions

---

## 🚀 PHASE 1: Foundation Setup (Weeks 1-2)
### Project Setup and Basic Authentication System

**Prompt for Windsurf:**

```
I need to build the foundation for my ServonF backend project. Please create a complete Node.js + Express.js + MongoDB backend with the following requirements:

1. PROJECT STRUCTURE:
Create this exact folder structure:
/backend
├── /config
│   ├── database.js          # MongoDB connection configuration
├── /controllers
│   ├── authController.js     # Authentication logic
│   ├── userController.js     # User management logic
├── /middleware
│   ├── auth.js              # Authentication & authorization
│   ├── validation.js        # Input validation rules
│   ├── errorHandler.js      # Global error handling
├── /models
│   ├── User.js              # User schema and model
├── /routes
│   ├── authRoutes.js        # Authentication routes
│   ├── userRoutes.js        # User management routes
├── /utils
│   ├── emailService.js      # Email sending utilities
├── server.js               # Main application entry point
├── package.json            # Dependencies and scripts
├── .env.example            # Environment variables template
└── README.md              # Project documentation

2. DEPENDENCIES TO INSTALL:
- express
- mongoose
- bcrypt
- jsonwebtoken
- cors
- helmet
- morgan
- express-rate-limit
- express-validator
- dotenv

3. USER MODEL SCHEMA:
Create User model with these exact fields:
- name: String (required, trim)
- email: String (required, unique, lowercase)
- password: String (required, minlength: 6)
- role: String (enum: ['customer', 'provider', 'admin'], default: 'customer')
- profile: {
  phone: String (default: ''),
  bio: String (default: ''),
  location: String (default: ''),
  avatar: String (default: '/placeholder-user.jpg')
}
- isActive: Boolean (default: true)
- lastLogin: Date
- timestamps: true

4. AUTHENTICATION ENDPOINTS:
Implement these exact API endpoints:
- POST /api/auth/register - Register new user
- POST /api/auth/login - Login user
- POST /api/auth/logout - Logout user
- GET /api/user/profile - Get user profile (protected)
- PUT /api/user/profile - Update user profile (protected)

5. MIDDLEWARE REQUIREMENTS:
- JWT authentication middleware
- Role-based authorization middleware
- Input validation for registration and login
- Global error handling middleware
- Rate limiting middleware

6. ENVIRONMENT VARIABLES:
Create .env.example with:
PORT=5000
NODE_ENV=development
MONGO_URI=mongodb+srv://<username>:<password>@cluster.mongodb.net/<dbname>
JWT_SECRET=your_jwt_secret_key
CLIENT_URL=http://localhost:3000

7. SECURITY FEATURES:
- Password hashing with bcrypt
- JWT token generation and verification
- CORS configuration
- Helmet for security headers
- Rate limiting

8. ERROR HANDLING:
Implement comprehensive error handling for:
- Validation errors
- Duplicate user registration
- Invalid login credentials
- JWT token errors
- Database connection errors

Please create all files with complete implementations, proper error handling, and follow Node.js best practices. Make sure the authentication system is fully functional and ready for testing.
```

---

## 💼 PHASE 2: Core Features (Weeks 3-4)
### Service Management and Quotation System

**Prompt for Windsurf:**

```
Build upon the existing ServonF backend foundation to add core service marketplace features. I need the complete service management and quotation system implemented.

CONTEXT: I already have the basic authentication system from Phase 1. Now I need to add the main business logic.

1. NEW MODELS TO CREATE:

SERVICE MODEL:
- title: String (required, trim)
- description: String (required)
- category: String (required, enum: ['tech', 'home', 'creative', 'business', 'health', 'education', 'outdoor'])
- price: Number (required, min: 0)
- providerId: ObjectId (ref: 'User', required)
- location: String (required)
- images: [String]
- features: [String]
- deliveryTime: String (default: '1-2 weeks')
- rating: Number (default: 0, min: 0, max: 5)
- reviewCount: Number (default: 0)
- views: Number (default: 0)
- isActive: Boolean (default: true)
- timestamps: true

QUOTATION MODEL:
- serviceId: ObjectId (ref: 'Service', required)
- customerId: ObjectId (ref: 'User', required)
- providerId: ObjectId (ref: 'User', required)
- details: String (required)
- budget: Number (required, min: 0)
- deadline: Date (required)
- status: String (enum: ['pending', 'responded', 'accepted', 'rejected', 'completed', 'cancelled'], default: 'pending')
- providerResponse: {
  message: String,
  quotedPrice: Number (min: 0),
  estimatedDuration: String,
  respondedAt: Date
}
- customerDecision: {
  accepted: Boolean,
  message: String,
  decidedAt: Date
}
- timestamps: true

2. NEW CONTROLLERS TO CREATE:

SERVICE CONTROLLER with methods:
- getServices (with filtering by category, location, price range)
- getServiceById
- createService (provider only)
- updateService (provider only)
- deleteService (provider only)
- getServiceReviews

QUOTATION CONTROLLER with methods:
- createQuotation (customer only)
- getQuotations (role-based filtering)
- getQuotationById
- respondToQuotation (provider only)
- acceptQuotation (customer only)
- rejectQuotation (customer only)

3. API ENDPOINTS TO IMPLEMENT:

SERVICE ROUTES:
- GET /api/services - Get all services (with filters)
- GET /api/services/:id - Get service by ID
- POST /api/services - Create new service (Provider auth required)
- PUT /api/services/:id - Update service (Provider auth required)
- DELETE /api/services/:id - Delete service (Provider auth required)
- GET /api/services/:id/reviews - Get service reviews

QUOTATION ROUTES:
- GET /api/quotations - Get user's quotations (auth required)
- GET /api/quotations/:id - Get quotation by ID (auth required)
- POST /api/quotations - Create quotation request (Customer auth required)
- PUT /api/quotations/:id/respond - Provider responds to quotation (Provider auth required)
- PUT /api/quotations/:id/accept - Customer accepts quotation (Customer auth required)
- PUT /api/quotations/:id/reject - Customer rejects quotation (Customer auth required)

4. VALIDATION REQUIREMENTS:
Add validation for:
- Service creation/update (title, description, category, price, location)
- Quotation creation (serviceId, details, budget, deadline)
- Quotation responses (message, quotedPrice, estimatedDuration)

5. BUSINESS LOGIC:
- Only providers can create/edit/delete services
- Only customers can create quotation requests
- Only providers can respond to quotations
- Only customers can accept/reject quotations
- Proper status transitions for quotations
- Population of related data in responses

6. DATABASE INDEXES:
Add these indexes for performance:
- Service: { category: 1, isActive: 1 }
- Service: { providerId: 1, isActive: 1 }
- Service: { title: 'text', description: 'text' }
- Quotation: { customerId: 1, status: 1 }
- Quotation: { providerId: 1, status: 1 }
- Quotation: { serviceId: 1 }

Please implement all the above with proper error handling, validation, and role-based access control. Ensure all endpoints return consistent JSON responses and handle edge cases properly.
```

---

## 🔔 PHASE 3: Advanced Features (Weeks 5-6)
### Booking System, Chat, and Notifications

**Prompt for Windsurf:**

```
Extend the ServonF backend with advanced features including booking management, chat system, and notifications.

CONTEXT: I have Phase 1 (Authentication) and Phase 2 (Services & Quotations) completed. Now I need to add the booking workflow, messaging, and notification system.

1. NEW MODELS TO CREATE:

BOOKING MODEL:
- serviceId: ObjectId (ref: 'Service', required)
- customerId: ObjectId (ref: 'User', required)
- providerId: ObjectId (ref: 'User', required)
- quotationId: ObjectId (ref: 'Quotation', required)
- scheduledDate: Date (required)
- location: String (required)
- amount: Number (required, min: 0)
- description: String (required)
- status: String (enum: ['active', 'completed', 'cancelled'], default: 'active')
- paymentStatus: String (enum: ['pending', 'paid', 'refunded'], default: 'pending')
- completedAt: Date
- cancelledAt: Date
- cancellationReason: String
- timestamps: true

MESSAGE MODEL:
- senderId: ObjectId (ref: 'User', required)
- receiverId: ObjectId (ref: 'User', required)
- quotationId: ObjectId (ref: 'Quotation', required)
- content: String (required, maxlength: 1000)
- messageType: String (enum: ['text', 'file', 'image'], default: 'text')
- fileUrl: String
- isRead: Boolean (default: false)
- readAt: Date
- timestamps: true

NOTIFICATION MODEL:
- userId: ObjectId (ref: 'User', required)
- title: String (required)
- message: String (required)
- type: String (enum: ['quotation', 'booking', 'message', 'review', 'payment', 'system'], required)
- relatedId: ObjectId
- link: String
- isRead: Boolean (default: false)
- readAt: Date
- timestamps: true

2. NEW CONTROLLERS TO CREATE:

BOOKING CONTROLLER with methods:
- createBooking (from accepted quotation)
- getBookings (role-based filtering)
- getBookingById
- updateBookingStatus
- updatePaymentStatus
- cancelBooking

CHAT CONTROLLER with methods:
- getMessages (for specific quotation)
- sendMessage
- markAsRead
- getConversations (user's chat list)

NOTIFICATION CONTROLLER with methods:
- getNotifications
- markAsRead
- markAllAsRead
- deleteNotification
- createNotification (internal utility)

3. API ENDPOINTS TO IMPLEMENT:

BOOKING ROUTES:
- GET /api/bookings - Get user's bookings (auth required)
- GET /api/bookings/:id - Get booking by ID (auth required)
- POST /api/bookings - Create booking from quotation (auth required)
- PUT /api/bookings/:id/status - Update booking status (auth required)
- PUT /api/bookings/:id/payment - Update payment status (auth required)
- POST /api/bookings/:id/cancel - Cancel booking (auth required)

CHAT ROUTES:
- GET /api/chat/:quotationId/messages - Get chat messages (auth required)
- POST /api/chat/:quotationId/messages - Send message (auth required)
- PUT /api/chat/messages/:id/read - Mark message as read (auth required)
- GET /api/chat/conversations - Get user's conversations (auth required)

NOTIFICATION ROUTES:
- GET /api/notifications - Get user notifications (auth required)
- PUT /api/notifications/:id/read - Mark notification as read (auth required)
- PUT /api/notifications/read-all - Mark all notifications as read (auth required)
- DELETE /api/notifications/:id - Delete notification (auth required)

4. INTEGRATION WITH EXISTING SYSTEM:
- When quotation is accepted → automatically create booking
- When quotation status changes → create notifications
- When new message is sent → create notification for receiver
- When booking status changes → create notifications
- Update quotation status to 'completed' when booking is completed

5. BUSINESS LOGIC RULES:
- Only accepted quotations can become bookings
- Both customer and provider can send messages
- Only participants in quotation can see messages
- Notifications are user-specific and private
- Booking cancellation requires reason (optional)
- Payment status updates should trigger notifications

6. DATABASE INDEXES:
Add these indexes:
- Booking: { customerId: 1, status: 1 }
- Booking: { providerId: 1, status: 1 }
- Message: { quotationId: 1, createdAt: 1 }
- Message: { receiverId: 1, isRead: 1 }
- Notification: { userId: 1, isRead: 1, createdAt: -1 }

7. SPECIAL FEATURES:
- Auto-notification creation for important events
- Message read status tracking
- Conversation listing with last message preview
- Booking status workflow validation
- Proper error handling for concurrent operations

Please implement all features with proper validation, error handling, and ensure all endpoints work seamlessly with the existing authentication and quotation system.
```

---

## 📊 PHASE 4: Dashboard Analytics & Role-Specific Features (Week 7)
### Customer, Provider, and Admin Dashboards

**Prompt for Windsurf:**

```
Complete the ServonF backend by implementing role-specific dashboard analytics and specialized endpoints for customers, providers, and admins.

CONTEXT: I have a fully functional backend with authentication, services, quotations, bookings, chat, and notifications. Now I need comprehensive dashboard APIs and role-specific features.

1. NEW CONTROLLERS TO CREATE:

CUSTOMER CONTROLLER with methods:
- getDashboard (customer stats and analytics)
- getBookings (customer's bookings with filters)
- getQuotations (customer's quotations with filters)
- getSavedServices (customer's saved/favorite services)
- saveService (add service to favorites)
- removeSavedService (remove from favorites)
- getSpendingAnalytics (spending breakdown by service/month)

PROVIDER CONTROLLER with methods:
- getDashboard (provider stats and analytics)
- getServices (provider's services with analytics)
- getQuotations (provider's quotations with filters)
- getBookings (provider's bookings with filters)
- getEarnings (detailed earnings analytics)
- getPerformanceMetrics (rating, reviews, completion rate)

ADMIN CONTROLLER with methods:
- getDashboard (platform-wide statistics)
- getUsers (all users with filters and pagination)
- getServices (all services with management options)
- getQuotations (all quotations with monitoring)
- getPlatformAnalytics (revenue, user growth, service trends)
- updateUserStatus (activate/deactivate users)
- removeService (admin service removal)
- getReports (various platform reports)

2. CUSTOMER-SPECIFIC ENDPOINTS:

CUSTOMER ROUTES:
- GET /api/customer/dashboard - Get customer dashboard stats (Customer auth)
- GET /api/customer/bookings - Get customer bookings with filters (Customer auth)
- GET /api/customer/quotations - Get customer quotations with filters (Customer auth)
- GET /api/customer/saved-services - Get saved services (Customer auth)
- POST /api/customer/saved-services - Save service to favorites (Customer auth)
- DELETE /api/customer/saved-services/:id - Remove saved service (Customer auth)
- GET /api/customer/activity - Get recent activity feed (Customer auth)
- GET /api/customer/stats - Get spending analytics (Customer auth)

3. PROVIDER-SPECIFIC ENDPOINTS:

PROVIDER ROUTES:
- GET /api/provider/dashboard - Get provider dashboard stats (Provider auth)
- GET /api/provider/services - Get provider's services (Provider auth)
- GET /api/provider/quotations - Get provider quotations (Provider auth)
- GET /api/provider/bookings - Get provider bookings (Provider auth)
- GET /api/provider/earnings - Get earnings analytics (Provider auth)
- GET /api/provider/stats - Get performance metrics (Provider auth)
- GET /api/provider/reviews - Get all reviews for provider's services (Provider auth)

4. ADMIN-SPECIFIC ENDPOINTS:

ADMIN ROUTES:
- GET /api/admin/dashboard - Get admin dashboard stats (Admin auth)
- GET /api/admin/users - Get all users with pagination (Admin auth)
- GET /api/admin/services - Get all services for management (Admin auth)
- GET /api/admin/quotations - Get all quotations for monitoring (Admin auth)
- GET /api/admin/analytics - Get platform analytics (Admin auth)
- PUT /api/admin/users/:id/status - Update user status (Admin auth)
- DELETE /api/admin/services/:id - Remove service (Admin auth)
- GET /api/admin/reports - Get various reports (Admin auth)

5. DASHBOARD ANALYTICS TO IMPLEMENT:

CUSTOMER DASHBOARD DATA:
- Total bookings (active/completed/cancelled)
- Total spent (with monthly breakdown)
- Pending quotation responses
- Saved services count
- Recent activity feed
- Spending analytics by category
- Top service categories used

PROVIDER DASHBOARD DATA:
- Total earnings (with monthly breakdown)
- Active services count
- Pending quotations count
- Average rating
- Total reviews
- Completion rate
- Recent bookings/quotations
- Performance trends

ADMIN DASHBOARD DATA:
- Total platform users (customers/providers)
- Total services listed
- Total quotations processed
- Platform revenue
- User growth metrics
- Most popular service categories
- Platform activity overview
- System health metrics

6. SPECIAL FEATURES TO IMPLEMENT:

ANALYTICS FEATURES:
- Date range filtering for all analytics
- Export functionality for reports (JSON format)
- Pagination for all list endpoints
- Search and filtering capabilities
- Sorting options for data tables
- Real-time statistics calculation

SAVED SERVICES SYSTEM:
- Add/remove services from customer favorites
- Prevent duplicate saves
- Include service details in saved list
- Track when service was saved

ACTIVITY FEEDS:
- Recent activities for customers (bookings, quotations)
- Recent activities for providers (new quotations, bookings)
- Proper timestamp formatting
- Activity type categorization

7. VALIDATION AND SECURITY:
- Strict role-based access control
- Data filtering based on user ownership
- Prevent unauthorized data access
- Input validation for all filters and parameters
- Rate limiting for analytics endpoints

8. RESPONSE FORMAT STANDARDS:
All dashboard endpoints should return:
{
  "success": true,
  "data": { ... },
  "pagination": { ... } (if applicable),
  "timestamp": "ISO date"
}

Please implement all dashboard features with proper caching considerations, efficient database queries, and comprehensive error handling. Ensure all analytics are calculated in real-time and reflect the current state of the platform.
```

---

## 🔍 PHASE 5: Reviews & Advanced Features (Week 8)
### Review System, Search, and Production Polish

**Prompt for Windsurf:**

```
Complete the ServonF backend with the review system, advanced search functionality, and production-ready features.

CONTEXT: I have a complete backend with all core features. Now I need to add the review system, enhance search capabilities, and prepare for production deployment.

1. REVIEW MODEL TO CREATE:

REVIEW MODEL:
- serviceId: ObjectId (ref: 'Service', required)
- customerId: ObjectId (ref: 'User', required)
- bookingId: ObjectId (ref: 'Booking', required)
- rating: Number (required, min: 1, max: 5)
- comment: String (required, maxlength: 500)
- isVerified: Boolean (default: true)
- timestamps: true

With unique index: { customerId: 1, bookingId: 1 } (prevent duplicate reviews)

2. REVIEW CONTROLLER with methods:
- createReview (customer only, after completed booking)
- getReviews (user's reviews)
- updateReview (customer only, within time limit)
- deleteReview (customer only, within time limit)
- getServiceReviews (public, with pagination)

3. REVIEW ENDPOINTS:

REVIEW ROUTES:
- GET /api/reviews - Get user's reviews (Customer auth)
- POST /api/reviews - Create review (Customer auth, completed booking required)
- PUT /api/reviews/:id - Update review (Customer auth, time-limited)
- DELETE /api/reviews/:id - Delete review (Customer auth, time-limited)
- GET /api/services/:id/reviews - Get service reviews (public, paginated)

4. ENHANCED SERVICE SEARCH:

Update SERVICE CONTROLLER with advanced search:
- Text search in titles and descriptions
- Category filtering
- Location-based filtering
- Price range filtering
- Rating filtering (minimum rating)
- Sorting options (price, rating, newest, popularity)
- Pagination with proper metadata

Enhanced GET /api/services endpoint with query parameters:
- ?search=keyword
- ?category=tech
- ?location=city
- ?minPrice=100&maxPrice=1000
- ?minRating=4
- ?sort=price_asc|price_desc|rating|newest|popular
- ?page=1&limit=10

5. REVIEW INTEGRATION:

SERVICE MODEL UPDATES:
- Auto-update service rating when review is added/updated/deleted
- Auto-update reviewCount
- Calculate average rating properly

NOTIFICATION INTEGRATION:
- Notify provider when new review is received
- Notify customer when review is successfully posted

BUSINESS LOGIC:
- Only customers who completed bookings can review
- One review per booking
- Reviews can be edited within 24 hours
- Reviews affect service ratings immediately
- Deleted reviews update service ratings

6. PRODUCTION-READY FEATURES:

EMAIL SERVICE IMPLEMENTATION:
- Password reset emails
- Booking confirmation emails
- Quotation status update emails
- Review request emails
- Welcome emails for new users

FILE UPLOAD SERVICE:
- User avatar uploads
- Service image uploads
- Chat file sharing
- Proper file validation (size, type)
- Cloud storage integration (optional)

ADVANCED MIDDLEWARE:
- Request logging with Morgan
- API response time tracking
- Memory usage monitoring
- Request size limiting
- CORS fine-tuning for production

7. TESTING UTILITIES:

Create test utilities for:
- Database seeding with sample data
- Authentication helper functions
- API response validation
- Mock email service for testing
- Test cleanup utilities

8. PERFORMANCE OPTIMIZATIONS:

DATABASE OPTIMIZATIONS:
- Compound indexes for complex queries
- Query optimization for dashboard analytics
- Aggregation pipelines for statistics
- Proper connection pooling

CACHING STRATEGY:
- Cache service listings for popular categories
- Cache user dashboard data (5-minute TTL)
- Cache platform statistics (15-minute TTL)

9. PRODUCTION DEPLOYMENT PREP:

ENVIRONMENT CONFIGURATIONS:
- Separate development/staging/production configs
- Environment-specific database connections
- Production security headers
- SSL/HTTPS enforcement
- API versioning structure

MONITORING & LOGGING:
- Structured logging with Winston
- Error tracking and reporting
- Performance monitoring
- Health check endpoints
- Database connection monitoring

10. API DOCUMENTATION:

Create comprehensive API documentation including:
- All endpoint descriptions
- Request/response examples
- Authentication requirements
- Error codes and messages
- Postman collection export

11. FINAL TESTING REQUIREMENTS:

Implement complete test suite:
- Unit tests for all controllers
- Integration tests for API endpoints
- Authentication flow tests
- Role-based access tests
- Database transaction tests
- Error handling tests

Please implement all features with production-grade quality, comprehensive error handling, proper logging, and ensure the system is fully ready for deployment. Include proper data validation, security measures, and performance optimizations throughout.
```

---

## 📋 IMPLEMENTATION CHECKLIST

### Phase 1 Completion Criteria:
- [ ] Authentication system fully functional
- [ ] User registration and login working
- [ ] JWT token management implemented
- [ ] Role-based access control working
- [ ] Basic user profile management

### Phase 2 Completion Criteria:
- [ ] Service CRUD operations working
- [ ] Quotation request/response system functional
- [ ] Role-based service and quotation access
- [ ] Proper validation and error handling
- [ ] Database relationships established

### Phase 3 Completion Criteria:
- [ ] Booking system integrated with quotations
- [ ] Chat system functional between users
- [ ] Notification system working for all events
- [ ] Message read status tracking
- [ ] Booking status workflow complete

### Phase 4 Completion Criteria:
- [ ] Customer dashboard with analytics
- [ ] Provider dashboard with earnings data
- [ ] Admin dashboard with platform stats
- [ ] Role-specific endpoints functional
- [ ] Saved services system working

### Phase 5 Completion Criteria:
- [ ] Review system fully functional
- [ ] Advanced search with filters working
- [ ] Email notifications implemented
- [ ] Production security measures in place
- [ ] Complete test suite passing

---

**Note:** Each phase builds upon the previous one. Complete each phase fully before moving to the next. Test thoroughly after each phase to ensure all features work correctly before adding new functionality.