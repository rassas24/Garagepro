import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import styled from 'styled-components';
import { motion } from 'framer-motion';
import { 
  FiPlay, 
  FiPause, 
  FiVolume2, 
  FiVolumeX,
  FiMaximize,
  FiRefreshCw,
  FiAlertCircle,
  FiClock,
  FiCamera
} from 'react-icons/fi';
import toast from 'react-hot-toast';

const CustomerViewContainer = styled.div`
  min-height: 100vh;
  background: ${({ theme }) => theme.colors.background};
  display: flex;
  flex-direction: column;
  position: relative;
  
  &::before {
    content: '';
    position: fixed;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
    background: 
      radial-gradient(circle at 20% 80%, rgba(0, 179, 255, 0.05) 0%, transparent 50%),
      radial-gradient(circle at 80% 20%, rgba(0, 119, 204, 0.05) 0%, transparent 50%);
    pointer-events: none;
  }
`;

const Header = styled.header`
  background: ${({ theme }) => theme.colors.surface};
  border-bottom: 1px solid ${({ theme }) => theme.colors.border};
  padding: ${({ theme }) => theme.spacing.md} ${({ theme }) => theme.spacing.lg};
  display: flex;
  align-items: center;
  justify-content: space-between;
  position: relative;
  z-index: 10;
  
  @media (max-width: ${({ theme }) => theme.breakpoints.md}) {
    padding: ${({ theme }) => theme.spacing.sm} ${({ theme }) => theme.spacing.md};
  }
`;

const Logo = styled.div`
  display: flex;
  align-items: center;
  gap: ${({ theme }) => theme.spacing.sm};
  font-size: ${({ theme }) => theme.typography.fontSize.lg};
  font-weight: ${({ theme }) => theme.typography.fontWeight.bold};
  color: ${({ theme }) => theme.colors.primary};
  
  .logo-icon {
    font-size: 1.5em;
  }
`;

const StatusIndicator = styled.div`
  display: flex;
  align-items: center;
  gap: ${({ theme }) => theme.spacing.sm};
  font-size: ${({ theme }) => theme.typography.fontSize.sm};
  color: ${({ theme }) => theme.colors.textSecondary};
  
  .status-dot {
    width: 8px;
    height: 8px;
    border-radius: 50%;
    background: ${({ theme, status }) => {
      if (status === 'live') return theme.colors.success;
      if (status === 'expired') return theme.colors.error;
      return theme.colors.warning;
    }};
  }
`;

const MainContent = styled.main`
  flex: 1;
  display: flex;
  flex-direction: column;
  position: relative;
  z-index: 1;
`;

const VideoContainer = styled.div`
  flex: 1;
  display: flex;
  align-items: center;
  justify-content: center;
  padding: ${({ theme }) => theme.spacing.lg};
  position: relative;
  
  @media (max-width: ${({ theme }) => theme.breakpoints.md}) {
    padding: ${({ theme }) => theme.spacing.md};
  }
`;

const VideoPlayer = styled.div`
  width: 100%;
  max-width: 1200px;
  aspect-ratio: 16/9;
  background: ${({ theme }) => theme.colors.surface};
  border: 1px solid ${({ theme }) => theme.colors.border};
  border-radius: ${({ theme }) => theme.borderRadius.lg};
  position: relative;
  overflow: hidden;
  
  @media (max-width: ${({ theme }) => theme.breakpoints.md}) {
    aspect-ratio: 4/3;
  }
`;

const VideoContent = styled.div`
  width: 100%;
  height: 100%;
  display: flex;
  align-items: center;
  justify-content: center;
  background: ${({ theme }) => theme.colors.background};
  position: relative;
  
  &::before {
    content: '';
    position: absolute;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
    background: linear-gradient(45deg, transparent 30%, rgba(0, 179, 255, 0.1) 50%, transparent 70%);
    animation: shimmer 2s infinite;
  }
  
  @keyframes shimmer {
    0% { transform: translateX(-100%); }
    100% { transform: translateX(100%); }
  }
`;

const VideoIcon = styled.div`
  color: ${({ theme }) => theme.colors.textMuted};
  font-size: 4rem;
  z-index: 1;
  
  @media (max-width: ${({ theme }) => theme.breakpoints.md}) {
    font-size: 3rem;
  }
`;

const Watermark = styled.div`
  position: absolute;
  top: ${({ theme }) => theme.spacing.md};
  right: ${({ theme }) => theme.spacing.md};
  background: ${({ theme }) => theme.colors.surface}CC;
  color: ${({ theme }) => theme.colors.textSecondary};
  padding: ${({ theme }) => theme.spacing.sm} ${({ theme }) => theme.spacing.md};
  border-radius: ${({ theme }) => theme.borderRadius.md};
  font-size: ${({ theme }) => theme.typography.fontSize.sm};
  font-weight: ${({ theme }) => theme.typography.fontWeight.medium};
  z-index: 2;
  
  @media (max-width: ${({ theme }) => theme.breakpoints.md}) {
    font-size: ${({ theme }) => theme.typography.fontSize.xs};
    padding: ${({ theme }) => theme.spacing.xs} ${({ theme }) => theme.spacing.sm};
  }
`;

const VideoControls = styled.div`
  position: absolute;
  bottom: 0;
  left: 0;
  right: 0;
  background: linear-gradient(transparent, ${({ theme }) => theme.colors.surface}CC);
  padding: ${({ theme }) => theme.spacing.lg};
  display: flex;
  align-items: center;
  justify-content: center;
  gap: ${({ theme }) => theme.spacing.md};
  z-index: 2;
  
  @media (max-width: ${({ theme }) => theme.breakpoints.md}) {
    padding: ${({ theme }) => theme.spacing.md};
    gap: ${({ theme }) => theme.spacing.sm};
  }
`;

const ControlButton = styled(motion.button)`
  display: flex;
  align-items: center;
  justify-content: center;
  width: 48px;
  height: 48px;
  background: ${({ theme }) => theme.colors.surface}CC;
  border: 1px solid ${({ theme }) => theme.colors.border};
  border-radius: ${({ theme }) => theme.borderRadius.md};
  color: ${({ theme }) => theme.colors.textPrimary};
  cursor: pointer;
  transition: all ${({ theme }) => theme.transitions.fast};
  
  &:hover {
    background: ${({ theme }) => theme.colors.surfaceHover};
    border-color: ${({ theme }) => theme.colors.primary};
    color: ${({ theme }) => theme.colors.primary};
  }
  
  @media (max-width: ${({ theme }) => theme.breakpoints.md}) {
    width: 40px;
    height: 40px;
  }
`;

const ExpiredMessage = styled(motion.div)`
  text-align: center;
  padding: ${({ theme }) => theme.spacing['3xl']};
  max-width: 500px;
  margin: 0 auto;
  
  .icon {
    font-size: 4rem;
    color: ${({ theme }) => theme.colors.error};
    margin-bottom: ${({ theme }) => theme.spacing.lg};
  }
  
  .title {
    font-size: ${({ theme }) => theme.typography.fontSize['2xl']};
    font-weight: ${({ theme }) => theme.typography.fontWeight.bold};
    color: ${({ theme }) => theme.colors.textPrimary};
    margin-bottom: ${({ theme }) => theme.spacing.md};
  }
  
  .message {
    color: ${({ theme }) => theme.colors.textSecondary};
    margin-bottom: ${({ theme }) => theme.spacing.xl};
    line-height: ${({ theme }) => theme.typography.lineHeight.relaxed};
  }
`;

const RequestButton = styled(motion.button)`
  background: linear-gradient(135deg, ${({ theme }) => theme.colors.primary}, ${({ theme }) => theme.colors.secondary});
  border: none;
  border-radius: ${({ theme }) => theme.borderRadius.md};
  color: ${({ theme }) => theme.colors.textPrimary};
  padding: ${({ theme }) => theme.spacing.md} ${({ theme }) => theme.spacing.xl};
  font-size: ${({ theme }) => theme.typography.fontSize.base};
  font-weight: ${({ theme }) => theme.typography.fontWeight.medium};
  cursor: pointer;
  transition: all ${({ theme }) => theme.transitions.fast};
  
  &:hover {
    transform: translateY(-2px);
    box-shadow: ${({ theme }) => theme.shadows.glow};
  }
`;

const LoadingSpinner = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
  gap: ${({ theme }) => theme.spacing.sm};
  color: ${({ theme }) => theme.colors.textSecondary};
  font-size: ${({ theme }) => theme.typography.fontSize.lg};
  
  .spinner {
    animation: spin 1s linear infinite;
  }
  
  @keyframes spin {
    from { transform: rotate(0deg); }
    to { transform: rotate(360deg); }
  }
`;

const CustomerView = () => {
  const { token } = useParams();
  const navigate = useNavigate();
  const [isLoading, setIsLoading] = useState(true);
  const [isExpired, setIsExpired] = useState(false);
  const [isPlaying, setIsPlaying] = useState(false);
  const [isMuted, setIsMuted] = useState(false);
  const [isFullscreen, setIsFullscreen] = useState(false);

  // Simulate token validation and expiry check
  useEffect(() => {
    const validateToken = async () => {
      try {
        // Simulate API call
        await new Promise(resolve => setTimeout(resolve, 2000));
        
        // Mock token validation - in real app, this would check with backend
        if (token && !token.includes('expired')) {
          setIsLoading(false);
        } else {
          setIsExpired(true);
          setIsLoading(false);
        }
      } catch (error) {
        setIsExpired(true);
        setIsLoading(false);
      }
    };

    validateToken();
  }, [token]);

  const togglePlay = () => {
    setIsPlaying(!isPlaying);
    toast.success(isPlaying ? 'Paused' : 'Playing');
  };

  const toggleMute = () => {
    setIsMuted(!isMuted);
    toast.success(isMuted ? 'Unmuted' : 'Muted');
  };

  const toggleFullscreen = () => {
    setIsFullscreen(!isFullscreen);
    toast.success(isFullscreen ? 'Exited fullscreen' : 'Entered fullscreen');
  };

  const requestNewLink = () => {
    toast.success('New link request sent to garage');
    // In a real app, this would trigger an email/SMS to the garage
  };

  if (isLoading) {
    return (
      <CustomerViewContainer>
        <Header>
          <Logo>
            <span className="logo-icon">🔧</span>
            GaragePro
          </Logo>
          <StatusIndicator>
            <div className="status-dot" status="loading" />
            Validating link...
          </StatusIndicator>
        </Header>
        
        <MainContent>
          <VideoContainer>
            <LoadingSpinner>
              <FiRefreshCw className="spinner" />
              Loading...
            </LoadingSpinner>
          </VideoContainer>
        </MainContent>
      </CustomerViewContainer>
    );
  }

  if (isExpired) {
    return (
      <CustomerViewContainer>
        <Header>
          <Logo>
            <span className="logo-icon">🔧</span>
            GaragePro
          </Logo>
          <StatusIndicator>
            <div className="status-dot" status="expired" />
            Link Expired
          </StatusIndicator>
        </Header>
        
        <MainContent>
          <VideoContainer>
            <ExpiredMessage
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
            >
              <div className="icon">
                <FiAlertCircle />
              </div>
              <div className="title">Link Expired</div>
              <div className="message">
                This viewing link has expired. Please contact your garage to request a new link.
              </div>
              <RequestButton
                onClick={requestNewLink}
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                Request New Link
              </RequestButton>
            </ExpiredMessage>
          </VideoContainer>
        </MainContent>
      </CustomerViewContainer>
    );
  }

  return (
    <CustomerViewContainer>
      <Header>
        <Logo>
          <span className="logo-icon">🔧</span>
          GaragePro
        </Logo>
        <StatusIndicator>
          <div className="status-dot" status="live" />
          Live Stream
        </StatusIndicator>
      </Header>
      
      <MainContent>
        <VideoContainer>
          <VideoPlayer>
            <VideoContent>
              <VideoIcon>
                <FiCamera />
              </VideoIcon>
            </VideoContent>
            
            <Watermark>
              GaragePro - Confidential
            </Watermark>
            
            <VideoControls>
              <ControlButton
                onClick={togglePlay}
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.9 }}
              >
                {isPlaying ? <FiPause size={20} /> : <FiPlay size={20} />}
              </ControlButton>
              
              <ControlButton
                onClick={toggleMute}
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.9 }}
              >
                {isMuted ? <FiVolumeX size={20} /> : <FiVolume2 size={20} />}
              </ControlButton>
              
              <ControlButton
                onClick={toggleFullscreen}
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.9 }}
              >
                <FiMaximize size={20} />
              </ControlButton>
            </VideoControls>
          </VideoPlayer>
        </VideoContainer>
      </MainContent>
    </CustomerViewContainer>
  );
};

export default CustomerView; 