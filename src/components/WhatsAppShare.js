import React, { useState } from 'react';
import styled from 'styled-components';
import { FiMessageCircle, FiX, FiSend } from 'react-icons/fi';
import { toast } from 'react-hot-toast';
import api from '../api';

const WhatsAppModal = styled.div`
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: rgba(0, 0, 0, 0.8);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 1000;
`;

const ModalContent = styled.div`
  background: ${props => props.theme.colors.background};
  border: 1px solid ${props => props.theme.colors.border};
  border-radius: 12px;
  padding: 24px;
  width: 90%;
  max-width: 500px;
  box-shadow: 0 20px 40px rgba(0, 0, 0, 0.3);
`;

const ModalHeader = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 20px;
`;

const ModalTitle = styled.h3`
  color: ${props => props.theme.colors.text};
  margin: 0;
  font-size: 1.2rem;
  font-weight: 600;
`;

const CloseButton = styled.button`
  background: none;
  border: none;
  color: ${props => props.theme.colors.textSecondary};
  cursor: pointer;
  font-size: 1.5rem;
  padding: 0;
  
  &:hover {
    color: ${props => props.theme.colors.text};
  }
`;

const FormGroup = styled.div`
  margin-bottom: 16px;
`;

const Label = styled.label`
  display: block;
  color: ${props => props.theme.colors.text};
  margin-bottom: 8px;
  font-weight: 500;
  font-size: 0.9rem;
`;

const Input = styled.input`
  width: 100%;
  padding: 12px;
  border: 1px solid ${props => props.theme.colors.border};
  border-radius: 8px;
  background: ${props => props.theme.colors.inputBackground};
  color: ${props => props.theme.colors.text};
  font-size: 0.9rem;
  
  &:focus {
    outline: none;
    border-color: ${props => props.theme.colors.primary};
  }
  
  &::placeholder {
    color: ${props => props.theme.colors.textSecondary};
  }
`;

const TextArea = styled.textarea`
  width: 100%;
  padding: 12px;
  border: 1px solid ${props => props.theme.colors.border};
  border-radius: 8px;
  background: ${props => props.theme.colors.inputBackground};
  color: ${props => props.theme.colors.text};
  font-size: 0.9rem;
  min-height: 80px;
  resize: vertical;
  
  &:focus {
    outline: none;
    border-color: ${props => props.theme.colors.primary};
  }
  
  &::placeholder {
    color: ${props => props.theme.colors.textSecondary};
  }
`;

const ButtonGroup = styled.div`
  display: flex;
  gap: 12px;
  margin-top: 24px;
`;

const Button = styled.button`
  padding: 12px 24px;
  border: none;
  border-radius: 8px;
  font-weight: 600;
  cursor: pointer;
  display: flex;
  align-items: center;
  gap: 8px;
  transition: all 0.2s ease;
  
  ${props => props.variant === 'primary' && `
    background: ${props.theme.colors.primary};
    color: white;
    
    &:hover {
      background: ${props.theme.colors.primaryHover};
    }
  `}
  
  ${props => props.variant === 'secondary' && `
    background: transparent;
    color: ${props.theme.colors.text};
    border: 1px solid ${props.theme.colors.border};
    
    &:hover {
      background: ${props.theme.colors.backgroundHover};
    }
  `}
  
  &:disabled {
    opacity: 0.5;
    cursor: not-allowed;
  }
`;

const WhatsAppShare = ({ isOpen, onClose, jobId, cameraId, customerPhone = '' }) => {
  const [phone, setPhone] = useState(customerPhone);
  const [message, setMessage] = useState('');
  const [isSending, setIsSending] = useState(false);

  const handleSend = async () => {
    if (!phone.trim()) {
      toast.error('Please enter a phone number');
      return;
    }

    setIsSending(true);
    try {
      const response = await api.post('/whatsapp/send', {
        customerPhone: phone.trim(),
        jobId,
        cameraId,
        message: message.trim() || undefined
      });

      if (response.data.success) {
        toast.success('WhatsApp message sent successfully!');
        onClose();
      } else {
        toast.error('Failed to send WhatsApp message');
      }
    } catch (error) {
      console.error('WhatsApp send error:', error);
      toast.error(error.response?.data?.message || 'Failed to send WhatsApp message');
    } finally {
      setIsSending(false);
    }
  };

  const handleClose = () => {
    setPhone(customerPhone);
    setMessage('');
    onClose();
  };

  if (!isOpen) return null;

  return (
    <WhatsAppModal onClick={handleClose}>
      <ModalContent onClick={(e) => e.stopPropagation()}>
        <ModalHeader>
          <ModalTitle>
            <FiMessageCircle style={{ marginRight: '8px' }} />
            Send WhatsApp Link
          </ModalTitle>
          <CloseButton onClick={handleClose}>
            <FiX />
          </CloseButton>
        </ModalHeader>

        <FormGroup>
          <Label>Customer Phone Number</Label>
          <Input
            type="tel"
            placeholder="+1234567890"
            value={phone}
            onChange={(e) => setPhone(e.target.value)}
            disabled={isSending}
          />
        </FormGroup>

        <FormGroup>
          <Label>Custom Message (Optional)</Label>
          <TextArea
            placeholder="Your vehicle service is in progress. Click the link below to view the live stream..."
            value={message}
            onChange={(e) => setMessage(e.target.value)}
            disabled={isSending}
          />
        </FormGroup>

        <ButtonGroup>
          <Button variant="secondary" onClick={handleClose} disabled={isSending}>
            Cancel
          </Button>
          <Button variant="primary" onClick={handleSend} disabled={isSending}>
            <FiSend />
            {isSending ? 'Sending...' : 'Send WhatsApp'}
          </Button>
        </ButtonGroup>
      </ModalContent>
    </WhatsAppModal>
  );
};

export default WhatsAppShare; 