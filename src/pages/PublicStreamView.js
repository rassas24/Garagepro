import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import styled from 'styled-components';
import ReactHLSPlayer from 'react-hls-player';
import { FiPlay, FiPause, FiVolume2, FiVolumeX, FiMaximize, FiMinimize, FiRefreshCw } from 'react-icons/fi';
import { toast } from 'react-hot-toast';

const Container = styled.div`
  min-height: 100vh;
  background: linear-gradient(135deg, #0A0E14 0%, #141A23 100%);
  color: white;
  font-family: 'Inter', sans-serif;
`;

const Header = styled.header`
  background: rgba(0, 0, 0, 0.3);
  backdrop-filter: blur(10px);
  padding: 16px 24px;
  border-bottom: 1px solid rgba(255, 255, 255, 0.1);
`;

const HeaderContent = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  max-width: 1200px;
  margin: 0 auto;
`;

const Logo = styled.div`
  font-size: 1.5rem;
  font-weight: 700;
  color: #00B3FF;
`;

const JobInfo = styled.div`
  text-align: center;
  flex: 1;
  margin: 0 24px;
`;

const JobTitle = styled.h1`
  font-size: 1.2rem;
  font-weight: 600;
  margin: 0 0 4px 0;
  color: white;
`;

const JobStatus = styled.div`
  font-size: 0.9rem;
  color: #8A8A8A;
`;

const MainContent = styled.main`
  max-width: 1200px;
  margin: 0 auto;
  padding: 24px;
`;

const VideoContainer = styled.div`
  position: relative;
  width: 100%;
  max-width: 800px;
  margin: 0 auto;
  border-radius: 12px;
  overflow: hidden;
  box-shadow: 0 20px 40px rgba(0, 0, 0, 0.3);
  background: #000;
`;

const VideoPlayer = styled.div`
  position: relative;
  width: 100%;
  aspect-ratio: 16/9;
  background: #000;
`;

const Controls = styled.div`
  position: absolute;
  bottom: 0;
  left: 0;
  right: 0;
  background: linear-gradient(transparent, rgba(0, 0, 0, 0.8));
  padding: 20px;
  display: flex;
  align-items: center;
  gap: 16px;
  opacity: 0;
  transition: opacity 0.3s ease;
  
  ${VideoContainer}:hover & {
    opacity: 1;
  }
`;

const ControlButton = styled.button`
  background: rgba(255, 255, 255, 0.2);
  border: none;
  color: white;
  padding: 8px;
  border-radius: 6px;
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  transition: all 0.2s ease;
  
  &:hover {
    background: rgba(255, 255, 255, 0.3);
  }
  
  &:disabled {
    opacity: 0.5;
    cursor: not-allowed;
  }
`;

const LoadingContainer = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  height: 400px;
  color: #8A8A8A;
`;

const ErrorContainer = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  height: 400px;
  color: #ff6b6b;
  text-align: center;
`;

const Watermark = styled.div`
  position: absolute;
  top: 20px;
  right: 20px;
  background: rgba(0, 0, 0, 0.7);
  color: white;
  padding: 8px 16px;
  border-radius: 6px;
  font-size: 0.8rem;
  font-weight: 500;
`;

const InfoPanel = styled.div`
  background: rgba(255, 255, 255, 0.05);
  border-radius: 12px;
  padding: 20px;
  margin-top: 24px;
  border: 1px solid rgba(255, 255, 255, 0.1);
`;

const InfoTitle = styled.h3`
  margin: 0 0 16px 0;
  font-size: 1.1rem;
  font-weight: 600;
  color: #00B3FF;
`;

const InfoGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
  gap: 16px;
`;

const InfoItem = styled.div`
  display: flex;
  flex-direction: column;
  gap: 4px;
`;

const InfoLabel = styled.span`
  font-size: 0.8rem;
  color: #8A8A8A;
  text-transform: uppercase;
  letter-spacing: 0.5px;
`;

const InfoValue = styled.span`
  font-size: 0.9rem;
  color: white;
  font-weight: 500;
`;

const PublicStreamView = () => {
  const { jobId, cameraId } = useParams();
  const navigate = useNavigate();
  const [streamData, setStreamData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [isPlaying, setIsPlaying] = useState(true);
  const [isMuted, setIsMuted] = useState(false);
  const [isFullscreen, setIsFullscreen] = useState(false);

  useEffect(() => {
    const fetchStreamData = async () => {
      try {
        setLoading(true);
        setError(null);
        
        const response = await fetch(`/api/v1/public/stream/${jobId}/${cameraId}`);
        
        if (!response.ok) {
          const errorData = await response.json();
          throw new Error(errorData.message || 'Failed to load stream');
        }
        
        const data = await response.json();
        setStreamData(data);
      } catch (err) {
        console.error('Stream fetch error:', err);
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    if (jobId && cameraId) {
      fetchStreamData();
    }
  }, [jobId, cameraId]);

  const togglePlay = () => {
    setIsPlaying(!isPlaying);
  };

  const toggleMute = () => {
    setIsMuted(!isMuted);
  };

  const toggleFullscreen = () => {
    if (!document.fullscreenElement) {
      document.documentElement.requestFullscreen();
      setIsFullscreen(true);
    } else {
      document.exitFullscreen();
      setIsFullscreen(false);
    }
  };

  const refreshStream = () => {
    window.location.reload();
  };

  if (loading) {
    return (
      <Container>
        <Header>
          <HeaderContent>
            <Logo>GaragePro</Logo>
            <JobInfo>
              <JobTitle>Loading Stream...</JobTitle>
              <JobStatus>Please wait</JobStatus>
            </JobInfo>
          </HeaderContent>
        </Header>
        <MainContent>
          <LoadingContainer>
            <FiRefreshCw size={48} style={{ marginBottom: '16px', animation: 'spin 1s linear infinite' }} />
            <div>Loading live stream...</div>
          </LoadingContainer>
        </MainContent>
      </Container>
    );
  }

  if (error) {
    return (
      <Container>
        <Header>
          <HeaderContent>
            <Logo>GaragePro</Logo>
            <JobInfo>
              <JobTitle>Stream Error</JobTitle>
              <JobStatus>Unable to load stream</JobStatus>
            </JobInfo>
          </HeaderContent>
        </Header>
        <MainContent>
          <ErrorContainer>
            <div style={{ fontSize: '3rem', marginBottom: '16px' }}>⚠️</div>
            <h2>Stream Unavailable</h2>
            <p>{error}</p>
            <p style={{ fontSize: '0.9rem', color: '#8A8A8A', marginTop: '16px' }}>
              This could be because the job is completed or the stream is temporarily unavailable.
            </p>
          </ErrorContainer>
        </MainContent>
      </Container>
    );
  }

  return (
    <Container>
      <Header>
        <HeaderContent>
          <Logo>GaragePro</Logo>
          <JobInfo>
            <JobTitle>
              {streamData?.job?.car_year} {streamData?.job?.car_model}
            </JobTitle>
            <JobStatus>
              Status: {streamData?.job?.status} • Camera: {streamData?.camera?.label}
            </JobStatus>
          </JobInfo>
        </HeaderContent>
      </Header>

      <MainContent>
        <VideoContainer>
          <VideoPlayer>
            <ReactHLSPlayer
              src={streamData?.streamUrl}
              autoPlay={isPlaying}
              muted={isMuted}
              controls={false}
              width="100%"
              height="100%"
              onError={(e) => {
                console.error('Video error:', e);
                toast.error('Stream connection lost');
              }}
            />
            
            <Watermark>
              GaragePro - Live Stream
            </Watermark>

            <Controls>
              <ControlButton onClick={togglePlay}>
                {isPlaying ? <FiPause size={20} /> : <FiPlay size={20} />}
              </ControlButton>
              
              <ControlButton onClick={toggleMute}>
                {isMuted ? <FiVolumeX size={20} /> : <FiVolume2 size={20} />}
              </ControlButton>
              
              <ControlButton onClick={toggleFullscreen}>
                {isFullscreen ? <FiMinimize size={20} /> : <FiMaximize size={20} />}
              </ControlButton>
              
              <ControlButton onClick={refreshStream}>
                <FiRefreshCw size={20} />
              </ControlButton>
            </Controls>
          </VideoPlayer>
        </VideoContainer>

        <InfoPanel>
          <InfoTitle>Stream Information</InfoTitle>
          <InfoGrid>
            <InfoItem>
              <InfoLabel>Vehicle</InfoLabel>
              <InfoValue>{streamData?.job?.car_year} {streamData?.job?.car_model}</InfoValue>
            </InfoItem>
            <InfoItem>
              <InfoLabel>Job Status</InfoLabel>
              <InfoValue>{streamData?.job?.status}</InfoValue>
            </InfoItem>
            <InfoItem>
              <InfoLabel>Camera</InfoLabel>
              <InfoValue>{streamData?.camera?.label}</InfoValue>
            </InfoItem>
            <InfoItem>
              <InfoLabel>Stream Type</InfoLabel>
              <InfoValue>Live HLS Stream</InfoValue>
            </InfoItem>
          </InfoGrid>
        </InfoPanel>
      </MainContent>

      <style jsx>{`
        @keyframes spin {
          from { transform: rotate(0deg); }
          to { transform: rotate(360deg); }
        }
      `}</style>
    </Container>
  );
};

export default PublicStreamView; 