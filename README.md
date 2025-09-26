# 🎟️ LockMyTicket

**Find Parties. Book Tickets. Organize Events.**

LockMyTicket is a comprehensive event management platform that connects party-goers with local events and empowers organizers to create and manage their events seamlessly. Built with modern web technologies, it offers a secure, user-friendly experience for both attendees and event organizers.

![LockMyTicket Banner](frontend/src/assets/logo.png)

## 🌟 Features

### For Event Attendees
- 🔍 **Event Discovery** - Browse and search for parties and events in your city
- 🎫 **Instant Booking** - Secure your tickets with integrated payment processing
- 📱 **Digital Tickets** - QR code-based tickets for easy entry
- 🎯 **Location-Based Search** - Find events happening near you
- 🔒 **Secure Payments** - Safe transactions through Razorpay integration
- 📊 **Personal Dashboard** - Track your upcoming events and ticket history

### For Event Organizers
- 📝 **Event Creation** - Easy-to-use event creation with rich media support
- 📈 **Event Management** - Comprehensive dashboard for managing events
- 💰 **Payment Processing** - Integrated payment collection system
- 📊 **Real-time Analytics** - Live attendance tracking and ticket sales
- 🎨 **Media Support** - Upload posters, images, and videos for events
- ✏️ **Easy Editing** - Update event details, pricing, and availability

### Technical Features
- 🔐 **JWT Authentication** - Secure user authentication and authorization
- 🌐 **Real-time Updates** - WebSocket integration for live event updates
- ☁️ **Cloud Storage** - Cloudinary integration for media management
- 📱 **Responsive Design** - Works seamlessly across all devices
- 🚀 **Modern Stack** - Built with React, Node.js, and Supabase

## 🛠️ Tech Stack

### Frontend
- **React 18** - Modern React with hooks and context
- **Vite** - Lightning-fast build tool and development server
- **Tailwind CSS** - Utility-first CSS framework for rapid UI development
- **React Router** - Client-side routing
- **Lucide React** - Beautiful icon library
- **QRCode.react** - QR code generation for digital tickets

### Backend
- **Node.js** - JavaScript runtime environment
- **Express.js** - Fast, minimalist web framework
- **Supabase** - Backend-as-a-service with PostgreSQL database
- **Socket.io** - Real-time bidirectional event-based communication
- **JWT** - JSON Web Tokens for authentication
- **Multer** - Middleware for handling multipart/form-data
- **bcrypt** - Password hashing for security

### Third-Party Integrations
- **Razorpay** - Payment gateway for secure transactions
- **Cloudinary** - Cloud-based image and video management
- **Supabase** - Database, authentication, and real-time subscriptions

## 🚀 Getting Started

### Prerequisites
- Node.js (v16 or higher)
- npm or yarn package manager
- Supabase account and project
- Razorpay account for payments
- Cloudinary account for media storage

### Environment Variables

Create `.env` files in both `backend` and `frontend` directories:

#### Backend `.env`
```env
SUPABASE_URL=your_supabase_project_url
SUPABASE_API_KEY=your_supabase_anon_key
JWT_SECRET=your_jwt_secret_key
RAZORPAY_KEY_ID=your_razorpay_key_id
RAZORPAY_KEY_SECRET=your_razorpay_key_secret
CLOUDINARY_CLOUD_NAME=your_cloudinary_cloud_name
CLOUDINARY_API_KEY=your_cloudinary_api_key
CLOUDINARY_API_SECRET=your_cloudinary_api_secret
```

#### Frontend `.env`
```env
VITE_BASE_URL=http://localhost:3000
VITE_RAZORPAY_KEY_ID=your_razorpay_key_id
```

### Installation

1. **Clone the repository**
   ```bash
   git clone https://github.com/gulabjam/LockMyTicket.git
   cd LockMyTicket
   ```

2. **Install backend dependencies**
   ```bash
   cd backend
   npm install
   ```

3. **Install frontend dependencies**
   ```bash
   cd ../frontend
   npm install
   ```

4. **Start the backend server**
   ```bash
   cd ../backend
   npm run dev
   ```

5. **Start the frontend development server**
   ```bash
   cd ../frontend
   npm run dev
   ```

The application will be available at:
- Frontend: `http://localhost:5173`
- Backend API: `http://localhost:3000`

## 📁 Project Structure

```
LockMyTicket/
├── backend/
│   ├── config/           # Configuration files
│   │   ├── cloudinary.config.js
│   │   ├── razorpay.config.js
│   │   ├── socket.config.js
│   │   └── supabase.config.js
│   ├── controller/       # Route controllers
│   │   ├── auth.controller.js
│   │   ├── event.controller.js
│   │   ├── organizer.controller.js
│   │   ├── payment.controller.js
│   │   └── ticket.controller.js
│   ├── middleware/       # Custom middleware
│   │   ├── auth.middleware.js
│   │   ├── authorize.middleware.js
│   │   └── multer.middleware.js
│   ├── routes/          # API routes
│   │   ├── auth.routes.js
│   │   ├── event.routes.js
│   │   ├── organizer.routes.js
│   │   ├── payment.routes.js
│   │   └── ticket.routes.js
│   ├── package.json
│   └── server.js        # Entry point
├── frontend/
│   ├── src/
│   │   ├── components/  # Reusable React components
│   │   ├── context/     # React context providers
│   │   ├── pages/       # Page components
│   │   └── assets/      # Static assets
│   ├── public/
│   ├── package.json
│   └── vite.config.js
└── README.md
```

## 🔌 API Endpoints

### Authentication
- `POST /api/auth/register` - User registration
- `POST /api/auth/login` - User login
- `POST /api/auth/logout` - User logout

### Events
- `GET /api/event/` - Get all events
- `POST /api/event/create` - Create new event (Organizers only)
- `PUT /api/event/:id` - Update event (Organizers only)
- `DELETE /api/event/:id` - Delete event (Organizers only)

### Tickets
- `GET /api/tickets/my-tickets` - Get user's tickets
- `POST /api/tickets/purchase` - Purchase tickets

### Payments
- `POST /api/payment/initiate-payment` - Initiate payment process
- `POST /api/payment/verify` - Verify payment completion

### Organizer
- `POST /api/organizer/register` - Register as organizer
- `GET /api/organizer/events` - Get organizer's events

## 🎨 Key Components

### Frontend Components
- **AuthForm** - Authentication form component
- **EventCard** - Event display card
- **CreateEventForm** - Event creation form
- **UserDashboard** - User dashboard with event browsing
- **OrganizerDashboard** - Organizer event management
- **Ticket** - Digital ticket with QR code
- **Header** - Navigation header
- **Footer** - Site footer

### Backend Controllers
- **AuthController** - User authentication logic
- **EventController** - Event management operations
- **PaymentController** - Payment processing
- **TicketController** - Ticket management
- **OrganizerController** - Organizer-specific operations

## 💳 Payment Integration

LockMyTicket uses Razorpay for secure payment processing:

1. Users select events and ticket quantities
2. Payment is initiated through Razorpay's secure gateway
3. Upon successful payment, tickets are generated with unique QR codes
4. Users can access their tickets through their dashboard

## 📱 Digital Tickets

Each purchased ticket includes:
- Unique QR code for entry verification
- Event details (name, date, time, location)
- Ticket count and status
- Purchase timestamp
- Secure JWT token for authenticity

## 🔒 Security Features

- **JWT Authentication** - Secure token-based authentication
- **Password Hashing** - bcrypt encryption for user passwords
- **Role-based Authorization** - Different access levels for users and organizers
- **Input Validation** - Server-side validation for all user inputs
- **CORS Configuration** - Proper cross-origin resource sharing setup

## 🌐 Real-time Features

WebSocket integration provides:
- Live ticket availability updates
- Real-time event subscription management
- Instant payment status updates
- Live attendance tracking for organizers

## 📊 Database Schema

The application uses Supabase (PostgreSQL) with the following key tables:
- **Users** - User accounts and profiles
- **Events** - Event information and metadata
- **Tickets** - Ticket purchases and status
- **Payments** - Payment transactions and history

## 🤝 Contributing

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit your changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

## 📝 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 👥 Authors

- **Bhavin** - *Project Developer* - [gulabjam](https://github.com/gulabjam)

## 🙏 Acknowledgments

- React team for the amazing frontend framework
- Supabase for providing excellent backend-as-a-service
- Razorpay for reliable payment processing
- Cloudinary for robust media management
- All open-source contributors who made this project possible

---

## 🚀 Future Enhancements

- 🎯 Advanced event filtering and search
- 📧 Email notifications for event updates
- 📊 Analytics dashboard for organizers
- 🎫 Bulk ticket booking
- 🌍 Multi-language support
- 📱 Mobile application
- 🎨 Custom event themes
- 💬 In-app messaging system

---

**Made with ❤️ for the party and events community**