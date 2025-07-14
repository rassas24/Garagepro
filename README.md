# GaragePro - Advanced Garage Management System

A comprehensive garage management system with live streaming capabilities, customer portals, and administrative tools built with React and styled-components.

## 🚀 Features

### User Roles & Authentication
- **Role-based access control** with JWT authentication
- **Three user types**: Garage Staff, Customers, Admins
- **Secure login system** with demo credentials
- **Session management** with automatic token validation

### Dashboard & Job Management
- **Interactive job picker sidebar** for mechanics
- **Live stream panels** with multi-camera views
- **Recording controls** with start/stop functionality
- **Bookmarking system** for important moments
- **Share link generation** via SMS/email (Twilio/SendGrid integration ready)

### Customer Portal
- **One-time expiring links** for customer access
- **Mobile-first video player** with watermark
- **Token validation** and expiry handling
- **Live and recorded stream viewing**
- **Responsive design** for all devices

### Admin Panel
- **Camera management** with RTSP sources
- **User management** with role assignment
- **Storage dashboard** with usage analytics
- **Link analytics** and tracking
- **Reporting system** with CSV/PDF export

### Technical Features
- **Dark sci-fi theme** with neon blue accents
- **Responsive design** for all screen sizes
- **Real-time updates** with WebSocket support
- **Progressive Web App** capabilities
- **Modern UI/UX** with smooth animations

## 🎨 Design System

### Color Palette
- **Background**: Dark tones (#0A0E14, #141A23)
- **Primary**: Neon blue (#00B3FF)
- **Accents**: High contrast typography
- **Status Colors**: Success, Warning, Error, Info

### Typography
- **Primary Font**: Inter (Google Fonts)
- **Monospace**: SF Mono for technical data
- **Hierarchy**: Clear font weights and sizes

### Layout Components
- **Header**: Logo, branch selector, user menu
- **Sidebar**: Collapsible navigation with role-based items
- **Main Content**: Cards, tables, video panels
- **Modals**: Centered with backdrop blur

## 🛠️ Setup & Installation

### Prerequisites
- Node.js (v16 or higher)
- npm or yarn

### Installation
```bash
# Clone the repository
git clone <repository-url>
cd garageproj

# Install dependencies
npm install

# Start development server
npm start
```

### Demo Credentials
- **Admin**: `admin@garagepro.com` / `admin123`
- **Mechanic**: `john@garagepro.com` / `mechanic123`

## 📱 Usage

### For Garage Staff
1. **Login** with mechanic credentials
2. **Select jobs** from the sidebar
3. **View live streams** from multiple cameras
4. **Record sessions** and add bookmarks
5. **Share links** with customers

### For Customers
1. **Receive one-time link** via SMS/email
2. **Access live stream** or recordings
3. **View with watermark** and expiry handling
4. **Mobile-optimized** experience

### For Admins
1. **Login** with admin credentials
2. **Manage cameras** and RTSP sources
3. **View analytics** and reports
4. **Export data** in CSV/PDF format
5. **Monitor system** performance

## 🔧 Technical Architecture

### Frontend Stack
- **React 18** with functional components
- **React Router** for navigation
- **Styled Components** for theming
- **Framer Motion** for animations
- **React Icons** for iconography
- **React Hot Toast** for notifications

### State Management
- **Context API** for authentication
- **Local state** for component data
- **Mock data** for demonstration

### Styling
- **Theme provider** with design tokens
- **Global styles** with CSS reset
- **Responsive breakpoints** for all devices
- **Dark theme** with consistent spacing

## 🚀 Deployment

### Build for Production
```bash
npm run build
```

### Environment Variables
Create a `.env` file for production:
```
REACT_APP_API_URL=your-backend-url
REACT_APP_TWILIO_ACCOUNT_SID=your-twilio-sid
REACT_APP_TWILIO_AUTH_TOKEN=your-twilio-token
REACT_APP_SENDGRID_API_KEY=your-sendgrid-key
```

## 📊 API Integration Points

### Authentication
- JWT token validation
- Role-based route protection
- Session management

### Live Streaming
- RTSP camera feeds
- WebRTC for real-time video
- Recording functionality

### Communication
- Twilio for SMS notifications
- SendGrid for email delivery
- Share link generation

### Analytics
- Usage tracking
- Performance monitoring
- Export capabilities

## 🔒 Security Features

- **JWT authentication** with token validation
- **Role-based access control**
- **Secure link generation** with expiry
- **Input validation** and sanitization
- **XSS protection** with proper encoding

## 📱 Responsive Design

- **Mobile-first** approach
- **Tablet optimization**
- **Desktop enhancement**
- **Touch-friendly** interactions

## 🎯 Future Enhancements

- **Real-time notifications** with WebSocket
- **Advanced analytics** dashboard
- **Multi-language support**
- **Offline capabilities** with service workers
- **Push notifications** for mobile
- **Advanced camera controls** (PTZ, zoom)
- **AI-powered** job recommendations

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Add tests if applicable
5. Submit a pull request

## 📄 License

This project is licensed under the MIT License.

---

**GaragePro** - Transforming garage management with modern technology and exceptional user experience. 