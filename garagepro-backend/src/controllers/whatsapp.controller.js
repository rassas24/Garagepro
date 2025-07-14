import axios from 'axios';

// WhatsApp Business API configuration
const WHATSAPP_API_URL = process.env.WHATSAPP_API_URL || 'https://graph.facebook.com/v17.0';
const WHATSAPP_PHONE_NUMBER_ID = process.env.WHATSAPP_PHONE_NUMBER_ID;
const WHATSAPP_ACCESS_TOKEN = process.env.WHATSAPP_ACCESS_TOKEN;

// Send WhatsApp message with stream link
export const sendWhatsAppMessage = async (req, res) => {
  try {
    const { customerPhone, jobId, cameraId, message } = req.body;
    
    if (!customerPhone || !jobId || !cameraId) {
      return res.status(400).json({ 
        message: 'Missing required fields: customerPhone, jobId, cameraId' 
      });
    }

    // Generate public stream link
    const streamUrl = `${process.env.FRONTEND_URL}/stream/${jobId}/${cameraId}`;
    
    // Format phone number (remove + and add country code if needed)
    const formattedPhone = customerPhone.replace(/^\+/, '');
    
    // Create WhatsApp message
    const whatsappMessage = {
      messaging_product: 'whatsapp',
      to: formattedPhone,
      type: 'template',
      template: {
        name: 'garage_stream_link',
        language: {
          code: 'en'
        },
        components: [
          {
            type: 'body',
            parameters: [
              {
                type: 'text',
                text: message || 'Your vehicle service is in progress. Click the link below to view the live stream:'
              }
            ]
          },
          {
            type: 'button',
            sub_type: 'url',
            index: 0,
            parameters: [
              {
                type: 'text',
                text: streamUrl
              }
            ]
          }
        ]
      }
    };

    // Send message via WhatsApp API
    const response = await axios.post(
      `${WHATSAPP_API_URL}/${WHATSAPP_PHONE_NUMBER_ID}/messages`,
      whatsappMessage,
      {
        headers: {
          'Authorization': `Bearer ${WHATSAPP_ACCESS_TOKEN}`,
          'Content-Type': 'application/json'
        }
      }
    );

    console.log(`[sendWhatsAppMessage] Message sent to ${customerPhone} for job ${jobId}`);
    
    res.json({ 
      success: true, 
      messageId: response.data.messages[0].id,
      streamUrl 
    });

  } catch (error) {
    console.error('[sendWhatsAppMessage] Error:', error.response?.data || error.message);
    res.status(500).json({ 
      message: 'Failed to send WhatsApp message',
      error: error.response?.data || error.message 
    });
  }
};

// Send custom message with stream link
export const sendCustomWhatsAppMessage = async (req, res) => {
  try {
    const { customerPhone, streamUrl, customMessage } = req.body;
    
    if (!customerPhone || !streamUrl) {
      return res.status(400).json({ 
        message: 'Missing required fields: customerPhone, streamUrl' 
      });
    }

    const formattedPhone = customerPhone.replace(/^\+/, '');
    
    const whatsappMessage = {
      messaging_product: 'whatsapp',
      to: formattedPhone,
      type: 'template',
      template: {
        name: 'custom_stream_link',
        language: {
          code: 'en'
        },
        components: [
          {
            type: 'body',
            parameters: [
              {
                type: 'text',
                text: customMessage || 'Click the link below to view the live stream:'
              }
            ]
          },
          {
            type: 'button',
            sub_type: 'url',
            index: 0,
            parameters: [
              {
                type: 'text',
                text: streamUrl
              }
            ]
          }
        ]
      }
    };

    const response = await axios.post(
      `${WHATSAPP_API_URL}/${WHATSAPP_PHONE_NUMBER_ID}/messages`,
      whatsappMessage,
      {
        headers: {
          'Authorization': `Bearer ${WHATSAPP_ACCESS_TOKEN}`,
          'Content-Type': 'application/json'
        }
      }
    );

    console.log(`[sendCustomWhatsAppMessage] Message sent to ${customerPhone}`);
    
    res.json({ 
      success: true, 
      messageId: response.data.messages[0].id 
    });

  } catch (error) {
    console.error('[sendCustomWhatsAppMessage] Error:', error.response?.data || error.message);
    res.status(500).json({ 
      message: 'Failed to send WhatsApp message',
      error: error.response?.data || error.message 
    });
  }
}; 