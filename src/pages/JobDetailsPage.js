import React, { useEffect, useState } from 'react';
import styled from 'styled-components';
import { useParams, useNavigate } from 'react-router-dom';
import { FiUser, FiPhone, FiTruck, FiCamera, FiClock, FiChevronLeft } from 'react-icons/fi';
import { toast } from 'react-toastify';
import api from '../api';
import ReactHLSPlayer from 'react-hls-player';

const Container = styled.div`
  max-width: 700px;
  margin: 40px auto;
  background: ${({ theme }) => theme.colors.surface};
  border-radius: ${({ theme }) => theme.borderRadius.lg};
  box-shadow: ${({ theme }) => theme.shadows.lg};
  padding: ${({ theme }) => theme.spacing.xl};
  display: flex;
  flex-direction: column;
  align-items: flex-start;
`;

const Title = styled.h1`
  font-size: ${({ theme }) => theme.typography.fontSize['2xl']};
  font-weight: ${({ theme }) => theme.typography.fontWeight.bold};
  color: ${({ theme }) => theme.colors.textPrimary};
  margin-bottom: ${({ theme }) => theme.spacing.lg};
`;

const InfoGroup = styled.div`
  margin-bottom: ${({ theme }) => theme.spacing.lg};
  width: 100%;
`;

const InfoRow = styled.div`
  display: flex;
  align-items: center;
  gap: 1rem;
  margin-bottom: 0.75rem;
  color: ${({ theme }) => theme.colors.textSecondary};
  font-size: 1.1rem;
`;

const CameraBox = styled.div`
  background: ${({ theme }) => theme.colors.surfaceHover};
  border: 1px solid ${({ theme }) => theme.colors.border};
  border-radius: ${({ theme }) => theme.borderRadius.md};
  padding: 1rem 1.5rem;
  margin-bottom: 2rem;
  display: flex;
  align-items: center;
  gap: 1rem;
`;

const ButtonRow = styled.div`
  display: flex;
  gap: 1rem;
  margin-top: 2rem;
`;

const Button = styled.button`
  padding: 0.75rem 2rem;
  border-radius: ${({ theme }) => theme.borderRadius.md};
  border: none;
  font-size: 1rem;
  font-weight: 500;
  cursor: pointer;
  background: ${({ theme, variant }) =>
    variant === 'primary' ? theme.colors.primary : theme.colors.surfaceHover};
  color: ${({ theme, variant }) =>
    variant === 'primary' ? theme.colors.textPrimary : theme.colors.textSecondary};
  border: 1px solid ${({ theme, variant }) =>
    variant === 'primary' ? theme.colors.primary : theme.colors.border};
  transition: all 0.15s;
  &:hover {
    background: ${({ theme, variant }) =>
      variant === 'primary' ? theme.colors.primary + 'CC' : theme.colors.surface};
  }
`;

// Add new layout wrappers
const PageLayout = styled.div`
  display: flex;
  height: calc(100vh - 80px);
  background: ${({ theme }) => theme.colors.background};
`;

const DetailsSidebar = styled.div`
  width: 400px;
  min-width: 320px;
  max-width: 480px;
  background: ${({ theme }) => theme.colors.surface};
  border-right: 1px solid ${({ theme }) => theme.colors.border};
  box-shadow: ${({ theme }) => theme.shadows.lg};
  padding: ${({ theme }) => theme.spacing.xl};
  display: flex;
  flex-direction: column;
  align-items: flex-start;
  z-index: 2;
`;

const CameraArea = styled.div`
  flex: 1;
  display: flex;
  align-items: center;
  justify-content: center;
  background: ${({ theme }) => theme.colors.background};
  position: relative;
`;

const CameraFeedBox = styled.div`
  background: ${({ theme }) => theme.colors.surfaceHover};
  border: 1px solid ${({ theme }) => theme.colors.border};
  border-radius: ${({ theme }) => theme.borderRadius.lg};
  width: 90%;
  max-width: 900px;
  aspect-ratio: 16/9;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  position: relative;
  box-shadow: ${({ theme }) => theme.shadows.md};
`;

// Add a wrapper for the back button with margin
const BackButtonWrapper = styled.div`
  margin-bottom: 2rem;
`;

function CameraView({ cameraId }) {
  const [streamUrl, setStreamUrl] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    if (!cameraId) return;
    
    setLoading(true);
    setStreamUrl(null);
    setError(null);
    
    const token = localStorage.getItem('token');
    if (!token) {
      setError('Authentication required');
      setLoading(false);
      return;
    }
    
    fetch(`/api/v1/cameras/${cameraId}/stream`, {
      headers: {
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json'
      }
    })
      .then(res => {
        if (!res.ok) {
          throw new Error(`HTTP ${res.status}: ${res.statusText}`);
        }
        return res.json();
      })
      .then(data => {
        console.log('[CameraView] Stream URL received:', data.streamUrl);
        setStreamUrl(data.streamUrl);
        setLoading(false);
      })
      .catch(err => {
        console.error('[CameraView] Error fetching stream:', err);
        setError(err.message);
        setLoading(false);
      });
  }, [cameraId]);

  if (loading) {
    return (
      <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '300px' }}>
        <div>Loading camera stream...</div>
      </div>
    );
  }

  if (error) {
    return (
      <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '300px', color: 'red' }}>
        <div>Error: {error}</div>
      </div>
    );
  }

  if (!streamUrl) {
    return (
      <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '300px' }}>
        <div>No stream available</div>
      </div>
    );
  }

  return (
    <div style={{ width: '100%', height: '300px', border: '1px solid #ccc', borderRadius: '8px', overflow: 'hidden' }}>
      <ReactHLSPlayer
        src={streamUrl}
        autoPlay
        controls
        width="100%"
        height="100%"
        onError={(e) => {
          console.error('[CameraView] Video error:', e);
          toast.error('Camera feed disconnected');
        }}
      />
    </div>
  );
}

const JobDetailsPage = () => {
  const { branchId, jobId } = useParams();
  const navigate = useNavigate();
  const [job, setJob] = useState(null);
  const [camera, setCamera] = useState(null);
  const [loading, setLoading] = useState(true);
  const [completing, setCompleting] = useState(false);

  useEffect(() => {
    setLoading(true);
    api.get(`/jobs/${jobId}`)
      .then(res => {
        setJob(res.data);
        if (res.data.camera_id) {
          api.get(`/cameras/${res.data.camera_id}`)
            .then(camRes => setCamera(camRes.data))
            .catch(() => setCamera(null));
        }
      })
      .catch(() => toast.error('Failed to load job details'))
      .finally(() => setLoading(false));
  }, [jobId]);

  const handleMarkComplete = async () => {
    setCompleting(true);
    try {
      await api.post(`/jobs/${job.id}/complete`);
      toast.success('Job marked complete');
      setJob((prev) => ({ ...prev, status: 'completed' }));
      setTimeout(() => navigate('/history'), 1000);
    } catch (err) {
      toast.error(err?.response?.data?.error || 'Failed to mark job as complete');
    } finally {
      setCompleting(false);
    }
  };

  if (loading) return <div>Loading...</div>;
  if (!job) return <div>Job not found.</div>;

  return (
    <PageLayout>
      <DetailsSidebar>
        <BackButtonWrapper>
          <Button onClick={() => navigate(-1)}><FiChevronLeft /> Back</Button>
        </BackButtonWrapper>
        <Title>Job Details</Title>
        <InfoGroup>
          <InfoRow><FiUser /> <b>Customer:</b> {job.customer_name}</InfoRow>
          <InfoRow><FiPhone /> <b>Phone:</b> {job.customer_phone_country_code} {job.customer_phone_number}</InfoRow>
          <InfoRow><FiTruck /> <b>Car:</b> {job.car_model} ({job.car_year})</InfoRow>
          <InfoRow><FiClock /> <b>Date/Time:</b> {job.entered_at}</InfoRow>
          <InfoRow><b>Status:</b> {job.status || 'active'}</InfoRow>
        </InfoGroup>
        <CameraBox>
          <FiCamera size={28} />
          <div>
            <div style={{ fontWeight: 600 }}>Assigned Camera</div>
            <div>{camera ? camera.label : 'N/A'}</div>
          </div>
        </CameraBox>
        <InfoGroup>
          <div style={{ fontWeight: 600, marginBottom: '0.5rem' }}>Issue / Description</div>
          <div style={{ color: '#b0b0b0' }}>{job.issue_description}</div>
        </InfoGroup>
        {job.status !== 'completed' && (
          <ButtonRow>
            <Button variant="primary" onClick={handleMarkComplete} disabled={completing}>Mark as Complete</Button>
          </ButtonRow>
        )}
      </DetailsSidebar>
      <CameraArea>
        {job.camera_id && <CameraView cameraId={job.camera_id} />}
      </CameraArea>
    </PageLayout>
  );
};

export default JobDetailsPage; 