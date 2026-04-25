// Test setup file to mock db connection during initial tests
import mongoose from 'mongoose';
import { vi } from 'vitest';

vi.mock('./config/db', () => ({
  default: vi.fn(() => Promise.resolve()),
}));

// Setup logic if needed
afterAll(async () => {
  await mongoose.disconnect();
});
