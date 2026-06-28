import dotenv from 'dotenv';
dotenv.config();

if (!process.env.PORT) {
  console.error('Error: PORT environment variable is not set.');
  process.exit(1);
}

if (!process.env.MONGO_URI) {
  console.error('Error: MONGO_URI environment variable is not set.');
  process.exit(1);
}

if (!process.env.JWT_SECRET) {
  console.error('Error: JWT_SECRET environment variable is not set.');
  process.exit(1);
}

if (!process.env.GOOGLE_CLIENT_ID) {
  console.error('Error: GOOGLE_CLIENT_ID environment variable is not set.');
  process.exit(1);
}

if (!process.env.GOOGLE_CLIENT_SECRET) {
  console.error('Error: GOOGLE_CLIENT_SECRET environment variable is not set.');
  process.exit(1);
}

if (!process.env.GOOGLE_CALLBACK_URL) {
  console.error('Error: GOOGLE_CALLBACK_URL environment variable is not set.');
  process.exit(1);
}

if (!process.env.NODE_ENV) {
  console.error('Error: NODE_ENV environment variable is not set.');
  process.exit(1);
}

if (!process.env.RAZORPAY_KEY_ID) {
  console.error('Error: RAZORPAY_KEY_ID environment variable is not set.');
  process.exit(1);
}

if (!process.env.RAZORPAY_KEY_SECRET) {
  console.error('Error: RAZORPAY_KEY_SECRET environment variable is not set.');
  process.exit(1);
}

if (!process.env.SMTP_HOST) {
  console.error('Error: SMTP_HOST environment variable is not set.');
  process.exit(1);
}

if (!process.env.SMTP_PORT) {
  console.error('Error: SMTP_PORT environment variable is not set.');
  process.exit(1);
}

if (!process.env.SMTP_USER) {
  console.error('Error: SMTP_USER environment variable is not set.');
  process.exit(1);
}

if (!process.env.SMTP_PASS) {
  console.error('Error: SMTP_PASS environment variable is not set.');
  process.exit(1);
}

if (!process.env.SMTP_FROM) {
  console.error('Error: SMTP_FROM environment variable is not set.');
  process.exit(1);
}

export const config = {
  PORT: process.env.PORT,
  MONGO_URI: process.env.MONGO_URI,
  JWT_SECRET: process.env.JWT_SECRET,
  GOOGLE_CLIENT_ID: process.env.GOOGLE_CLIENT_ID,
  GOOGLE_CLIENT_SECRET: process.env.GOOGLE_CLIENT_SECRET,
  GOOGLE_CALLBACK_URL: process.env.GOOGLE_CALLBACK_URL,
  NODE_ENV: process.env.NODE_ENV,
  RAZORPAY_KEY_ID: process.env.RAZORPAY_KEY_ID,
  RAZORPAY_KEY_SECRET: process.env.RAZORPAY_KEY_SECRET,
  SMTP_HOST: process.env.SMTP_HOST,
  SMTP_PORT: process.env.SMTP_PORT,
  SMTP_USER: process.env.SMTP_USER,
  SMTP_PASS: process.env.SMTP_PASS,
  SMTP_FROM: process.env.SMTP_FROM,
};