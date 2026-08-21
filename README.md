# Smart Trolly 2.0

An AI-powered automated checkout system that detects retail items in real time using computer vision, calculates itemized bills with GST, and processes payments seamlessly.

<p align="left">
  <img src="https://img.shields.io/badge/Node.js-20+-339933?logo=node.js&logoColor=white" alt="Node.js" />
  <img src="https://img.shields.io/badge/React-19.2.6-61DAFB?logo=react&logoColor=black" alt="React" />
  <img src="https://img.shields.io/badge/Vite-8.0.12-646CFF?logo=vite&logoColor=white" alt="Vite" />
  <img src="https://img.shields.io/badge/Express-5.2.1-000000?logo=express&logoColor=white" alt="Express" />
  <img src="https://img.shields.io/badge/ONNX_Runtime-1.26.0-005CED?logo=onnx&logoColor=white" alt="ONNX Runtime" />
  <img src="https://img.shields.io/badge/MongoDB-Mongoose_9.7.0-47A248?logo=mongodb&logoColor=white" alt="MongoDB" />
  <img src="https://img.shields.io/badge/Tailwind_CSS-4.3.0-06B6D4?logo=tailwindcss&logoColor=white" alt="Tailwind CSS" />
  <img src="https://img.shields.io/badge/Three.js-R3F_9.7.0-000000?logo=threedotjs&logoColor=white" alt="Three.js" />
  <img src="https://img.shields.io/badge/Framer_Motion-13.1.1-0055FF?logo=framer&logoColor=white" alt="Framer Motion" />
  <img src="https://img.shields.io/badge/Razorpay-2.9.6-0C2340?logo=razorpay&logoColor=white" alt="Razorpay" />
</p>

## Features

- Real-Time Object Detection: Runs a YOLOv8 ONNX model (`best.onnx`) directly on the Node.js backend using `onnxruntime-node` and `sharp` image preprocessing.
- WebSocket Stream Pipeline: Streams camera frames at throttled intervals over WebSockets (`/ws/detection`) with candidate filtering and Non-Maximum Suppression (NMS).
- Anti-Duplication Cart Logic: Applies temporal consistency checks (minimum consecutive frames) and item cooldowns to eliminate false positives and duplicate scans.
- Automated GST Billing Engine: Computes real-time item subtotals, applicable FMCG GST rates (5% and 18%), and order totals entirely on the server.
- Interactive 3D Landing Page: Features a lazy-loaded low-poly holographic smart sensor node rendered via React Three Fiber and Drei with scroll-triggered animations.
- Interactive Live Simulation: In-browser retail item simulation playground that calculates real-time line items, tax breakdowns, and grand totals without requiring active camera permissions.
- Payment Integration: Integrates Razorpay payment orders, signature verification, and client checkout flow.
- Thermal PDF Receipt Generation: Generates PDF receipts formatted as thermal checkout bills via `pdfkit` and dispatches them via email using `nodemailer`.
- Authentication System: Provides JWT authentication via HTTP-only secure cookies alongside Google OAuth 2.0 integration via `passport`.
- Dedicated Transition & 404 Pages: High-performance hydration loading screen and on-brand error routing.

## Tech Stack

| Category | Tool / Library | Version |
| :--- | :--- | :--- |
| Frontend Framework | React | 19.2.6 |
| Frontend Tooling | Vite | 8.0.12 |
| 3D Graphics & WebGL | three, @react-three/fiber, @react-three/drei | 0.185.1, 9.7.0, 10.7.8 |
| Motion & Animation | framer-motion | 13.1.1 |
| Icons & Visuals | lucide-react | 1.33.0 |
| State Management | Redux Toolkit | 2.12.0 |
| React Redux Bindings | react-redux | 9.3.0 |
| Client Routing | React Router DOM | 7.17.0 |
| Styling Engine | Tailwind CSS (Vite plugin) | 4.3.0 |
| HTTP Client | Axios | 1.17.0 |
| Notifications | react-hot-toast | 2.6.0 |
| Backend Runtime | Node.js (ES Modules) | 20+ |
| Backend Server Framework | Express | 5.2.1 |
| Real-Time Communication | ws | 8.21.0 |
| ML Inference Engine | onnxruntime-node | 1.26.0 |
| Image Processing | sharp | 0.35.1 |
| Database ODM | Mongoose | 9.7.0 |
| Authentication & Security | jsonwebtoken, bcryptjs, passport, passport-google-oauth20 | 9.0.3, 3.0.3, 0.7.0, 2.0.0 |
| Payment Gateway | razorpay | 2.9.6 |
| Document Generation | pdfkit | 0.19.1 |
| Email Dispatcher | nodemailer | 9.0.0 |
| Request Validation | express-validator | 7.3.2 |

## Architecture & Structure

```
Smart Trolly 2.0/
├── backend/
│   ├── models/
│   │   └── best.onnx                  # YOLOv8 object detection model in ONNX format
│   ├── src/
│   │   ├── config/
│   │   │   ├── config.js              # Environment variable validation and export
│   │   │   ├── database.js            # MongoDB connection setup
│   │   │   └── detection.config.js    # Model constants, class labels, prices, and thresholds
│   │   ├── controllers/
│   │   │   ├── auth.controller.js     # User registration, login, logout, OAuth handler
│   │   │   ├── detection.controller.js# WebSocket message throttling and inference dispatcher
│   │   │   └── payment.controller.js  # Bill calculation, Razorpay lifecycle, receipt resend
│   │   ├── middlewares/
│   │   │   └── auth.middleware.js     # JWT cookie verification middleware
│   │   ├── models/
│   │   │   └── user.model.js          # Mongoose schema and password hashing methods
│   │   ├── routes/
│   │   │   ├── auth.routes.js         # Authentication REST endpoints
│   │   │   └── payment.routes.js      # Cart preview and payment verification endpoints
│   │   ├── services/
│   │   │   ├── billing.service.js     # Pricing, GST rates, and bill breakdown calculation
│   │   │   ├── detection.service.js   # ONNX runtime session management and preprocessing
│   │   │   ├── mailer.service.js      # Nodemailer transporter and HTML receipt emails
│   │   │   ├── payment.service.js     # Razorpay API wrapper and signature validator
│   │   │   └── pdf.service.js         # Thermal receipt PDF builder with GST breakdown
│   │   ├── utils/
│   │   │   └── nms.js                 # Coordinate decoding, IoU calculation, Non-Max Suppression
│   │   ├── validator/
│   │   │   └── auth.validator.js      # Input validation rules for auth endpoints
│   │   └── app.js                     # Express application definition and middleware stack
│   ├── server.js                      # HTTP server initialization and WebSocket server binding
│   └── package.json                   # Backend dependencies and scripts
└── frontend/
    ├── public/                        # Static assets (sounds, icons)
    ├── src/
    │   ├── app/
    │   │   ├── App.jsx                # Router root component
    │   │   ├── app.routes.jsx         # React Router route tree with auth guards
    │   │   ├── app.store.js           # Redux Toolkit store configuration
    │   │   └── index.css              # Global styles and Tailwind CSS imports
    │   ├── features/
    │   │   ├── auth/
    │   │   │   ├── hooks/useAuth.js   # Auth dispatch and state hook
    │   │   │   ├── pages/             # Login, Register, and AuthLayout route wrapper
    │   │   │   ├── services/          # Auth Axios client
    │   │   │   └── state/             # Auth Redux slice and async thunks
    │   │   ├── common/
    │   │   │   └── pages/             # LoadingPage and NotFoundPage
    │   │   ├── payment/
    │   │   │   ├── services/          # Payment Axios client
    │   │   │   └── state/             # Payment Redux slice (orders, verification, preview)
    │   │   └── shop/
    │   │       ├── components/
    │   │       │   ├── InteractiveLiveDemo.jsx # Live cart calculation simulator
    │   │       │   └── Trolley3DCanvas.jsx     # R3F 3D holographic hero model
    │   │       ├── hooks/
    │   │       │   ├── useCheckout.js # Razorpay modal lifecycle hook
    │   │       │   └── useDetection.js# Camera capture loop and WebSocket client hook
    │   │       ├── pages/
    │   │       │   ├── CameraView.jsx # Live camera view, detection overlay, and cart summary
    │   │       │   ├── LandingPage.jsx# Interactive landing page with 3D and feature grid
    │   │       │   └── ReceiptModal.jsx# Post-checkout modal with PDF download and email trigger
    │   │       ├── services/          # WebSocket connection utility
    │   │       └── state/             # Cart detection Redux slice with streak/cooldown logic
    │   └── main.jsx                   # React DOM root entry point with Redux Provider
    ├── vite.config.js                 # Vite config with API and WebSocket proxies
    └── package.json                   # Frontend dependencies and scripts
```

## Getting Started

### Prerequisites

- Node.js (version 20 or higher recommended)
- npm or yarn package manager
- Running MongoDB instance (local or MongoDB Atlas)
- Razorpay account (Test mode Key ID and Key Secret)
- SMTP credentials (e.g. Gmail App Password) for email receipts

### Installation

1. Clone the repository and navigate to the project root:
   ```bash
   git clone <repository-url>
   cd "Smart Trolly 2.0"
   ```

2. Install backend dependencies:
   ```bash
   cd backend
   npm install
   ```

3. Install frontend dependencies:
   ```bash
   cd ../frontend
   npm install
   ```

### Running the Application

1. Start the backend server (runs on port configured in `.env`, default 3000):
   ```bash
   cd backend
   npm run dev
   ```

2. In a separate terminal, start the frontend development server:
   ```bash
   cd frontend
   npm run dev
   ```

3. Open your browser and navigate to `http://localhost:5173`.

### Building for Production

To create a production build of the frontend application:

```bash
cd frontend
npm run build
```

To preview the production build locally:

```bash
cd frontend
npm run preview
```

## Configuration

### Backend Environment Variables (`backend/.env`)

Create a `.env` file inside the `backend/` directory with the following variables:

```env
PORT=3000
MONGO_URI=mongodb://localhost:27017/smart-trolly
JWT_SECRET=your_jwt_secret_key_here
NODE_ENV=development

# Google OAuth Credentials
GOOGLE_CLIENT_ID=your_google_client_id
GOOGLE_CLIENT_SECRET=your_google_client_secret
GOOGLE_CALLBACK_URL=http://localhost:3000/api/auth/google/callback

# Razorpay Credentials
RAZORPAY_KEY_ID=rzp_test_your_key_id
RAZORPAY_KEY_SECRET=your_razorpay_secret

# SMTP Email Configuration
SMTP_HOST=smtp.gmail.com
SMTP_PORT=587
SMTP_USER=your_email@gmail.com
SMTP_PASS=your_app_specific_password
SMTP_FROM=noreply@smarttrolly.com
```

### Frontend Environment Variables (`frontend/.env`)

Create a `.env` file inside the `frontend/` directory:

```env
VITE_RAZORPAY_KEY_ID=rzp_test_your_key_id
```

## Testing

Backend test script status from `backend/package.json`:
- `npm run test` (echoes `"Error: no test specified"` - automated test suite not currently configured).

Frontend linting:
```bash
cd frontend
npm run lint
```
