import express from 'express';
import { sendWhatsAppMessage, sendCustomWhatsAppMessage } from '../controllers/whatsapp.controller.js';

const router = express.Router();

// Send WhatsApp message with stream link
router.post('/send', sendWhatsAppMessage);

// Send custom WhatsApp message with stream link
router.post('/send-custom', sendCustomWhatsAppMessage);

export default router; 