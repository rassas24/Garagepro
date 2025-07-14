import React, { useEffect, useState } from 'react';
import styled from 'styled-components';
import { motion } from 'framer-motion';
import { 
  FiPlay, 
  FiSquare, 
  FiBookmark, 
  FiShare2, 
  FiCamera,
  FiClock,
  FiUser,
  FiTruck,
  FiPlus,
  FiChevronLeft,
  FiMessageCircle
} from 'react-icons/fi';
import toast from 'react-hot-toast';
import { useParams, useNavigate, useLocation } from 'react-router-dom';
import api from '../api';
import { useBranches } from '../context/BranchContext';
import WhatsAppShare from '../components/WhatsAppShare';

const DashboardContainer = styled.div`
  display: flex;
  height: calc(100vh - 80px);
  gap: ${({ theme }) => theme.spacing.lg};
  padding: ${({ theme }) => theme.spacing.lg};
  
  @media (max-width: ${({ theme }) => theme.breakpoints.lg}) {
    flex-direction: column;
    height: auto;
  }
`;

const JobPickerSidebar = styled.div`
  width: 320px;
  background: ${({ theme }) => theme.colors.surface};
  border: 1px solid ${({ theme }) => theme.colors.border};
  border-radius: ${({ theme }) => theme.borderRadius.lg};
  padding: ${({ theme }) => theme.spacing.lg};
  height: 100%;
  overflow-y: auto;
  
  @media (max-width: ${({ theme }) => theme.breakpoints.lg}) {
    width: 100%;
    height: auto;
    max-height: 300px;
  }
`;

const SidebarHeader = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin-bottom: ${({ theme }) => theme.spacing.lg};
  
  .title {
    font-size: ${({ theme }) => theme.typography.fontSize.lg};
    font-weight: ${({ theme }) => theme.typography.fontWeight.semibold};
    color: ${({ theme }) => theme.colors.textPrimary};
  }
  
  .count {
    background: ${({ theme }) => theme.colors.primary}20;
    color: ${({ theme }) => theme.colors.primary};
    padding: ${({ theme }) => theme.spacing.xs} ${({ theme }) => theme.spacing.sm};
    border-radius: ${({ theme }) => theme.borderRadius.full};
    font-size: ${({ theme }) => theme.typography.fontSize.sm};
    font-weight: ${({ theme }) => theme.typography.fontWeight.medium};
  }
`;

const AddJobButton = styled(motion.button)`
  display: flex;
  align-items: center;
  gap: 4px;
  background: ${({ theme }) => theme.colors.primary};
  border: none;
  border-radius: ${({ theme }) => theme.borderRadius.md};
  padding: 6px 12px;
  color: ${({ theme }) => theme.colors.textPrimary};
  font-size: 0.95em;
  font-weight: 500;
  cursor: pointer;
  transition: all 0.15s;
  margin-left: ${({ theme }) => theme.spacing.md};
  &:hover {
    background: ${({ theme }) => theme.colors.primary}CC;
    transform: translateY(-1px);
  }
`;

const JobList = styled.div`
  display: flex;
  flex-direction: column;
  gap: ${({ theme }) => theme.spacing.md};
`;

const JobCard = styled(motion.div)`
  background: ${({ theme, active }) => active ? theme.colors.primary + '20' : theme.colors.surfaceHover};
  border: 1px solid ${({ theme, active }) => active ? theme.colors.primary : theme.colors.border};
  border-radius: ${({ theme }) => theme.borderRadius.md};
  padding: ${({ theme }) => theme.spacing.md};
  cursor: pointer;
  transition: all ${({ theme }) => theme.transitions.fast};
  
  &:hover {
    border-color: ${({ theme }) => theme.colors.primary};
    transform: translateY(-2px);
  }
`;

const JobHeader = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin-bottom: ${({ theme }) => theme.spacing.sm};
`;

const JobTitle = styled.div`
  font-weight: ${({ theme }) => theme.typography.fontWeight.medium};
  color: ${({ theme }) => theme.colors.textPrimary};
  font-size: ${({ theme }) => theme.typography.fontSize.base};
`;

const StatusBadge = styled.span`
  padding: ${({ theme }) => theme.spacing.xs} ${({ theme }) => theme.spacing.sm};
  border-radius: ${({ theme }) => theme.borderRadius.full};
  font-size: ${({ theme }) => theme.typography.fontSize.xs};
  font-weight: ${({ theme }) => theme.typography.fontWeight.medium};
  text-transform: uppercase;
  
  &.active {
    background: ${({ theme }) => theme.colors.success}20;
    color: ${({ theme }) => theme.colors.success};
  }
  
  &.pending {
    background: ${({ theme }) => theme.colors.warning}20;
    color: ${({ theme }) => theme.colors.warning};
  }
  
  &.completed {
    background: ${({ theme }) => theme.colors.info}20;
    color: ${({ theme }) => theme.colors.info};
  }
`;

const JobDetails = styled.div`
  display: flex;
  flex-direction: column;
  gap: ${({ theme }) => theme.spacing.xs};
  font-size: ${({ theme }) => theme.typography.fontSize.sm};
  color: ${({ theme }) => theme.colors.textSecondary};
`;

const JobDetail = styled.div`
  display: flex;
  align-items: center;
  gap: ${({ theme }) => theme.spacing.xs};
`;

const MainContent = styled.div`
  flex: 1;
  display: flex;
  flex-direction: column;
  gap: ${({ theme }) => theme.spacing.lg};
`;

const LiveStreamPanel = styled.div`
  flex: 1;
  background: ${({ theme }) => theme.colors.surface};
  border: 1px solid ${({ theme }) => theme.colors.border};
  border-radius: ${({ theme }) => theme.borderRadius.lg};
  overflow: hidden;
  display: flex;
  flex-direction: column;
`;

const StreamHeader = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: ${({ theme }) => theme.spacing.lg};
  border-bottom: 1px solid ${({ theme }) => theme.colors.border};
`;

const StreamTitle = styled.div`
  font-size: ${({ theme }) => theme.typography.fontSize.lg};
  font-weight: ${({ theme }) => theme.typography.fontWeight.semibold};
  color: ${({ theme }) => theme.colors.textPrimary};
`;

const StreamControls = styled.div`
  display: flex;
  align-items: center;
  gap: ${({ theme }) => theme.spacing.md};
`;

const ControlButton = styled(motion.button)`
  display: flex;
  align-items: center;
  gap: ${({ theme }) => theme.spacing.sm};
  padding: ${({ theme }) => theme.spacing.sm} ${({ theme }) => theme.spacing.md};
  background: ${({ theme, variant }) => {
    if (variant === 'danger') return theme.colors.error;
    if (variant === 'success') return theme.colors.success;
    return theme.colors.surfaceHover;
  }};
  border: 1px solid ${({ theme, variant }) => {
    if (variant === 'danger') return theme.colors.error;
    if (variant === 'success') return theme.colors.success;
    return theme.colors.border;
  }};
  border-radius: ${({ theme }) => theme.borderRadius.md};
  color: ${({ theme }) => theme.colors.textPrimary};
  font-size: ${({ theme }) => theme.typography.fontSize.sm};
  font-weight: ${({ theme }) => theme.typography.fontWeight.medium};
  cursor: pointer;
  transition: all ${({ theme }) => theme.transitions.fast};
  
  &:hover {
    transform: translateY(-1px);
    box-shadow: ${({ theme }) => theme.shadows.md};
  }
  
  &:disabled {
    opacity: 0.6;
    cursor: not-allowed;
    transform: none;
  }
`;

const StreamContent = styled.div`
  flex: 1;
  display: flex;
  align-items: center;
  justify-content: center;
  background: ${({ theme }) => theme.colors.background};
  position: relative;
  overflow: hidden;
`;

const CameraGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
  gap: ${({ theme }) => theme.spacing.md};
  width: 100%;
  height: 100%;
  padding: ${({ theme }) => theme.spacing.lg};
`;

const CameraFeed = styled.div`
  background: ${({ theme }) => theme.colors.surfaceHover};
  border: 1px solid ${({ theme }) => theme.colors.border};
  border-radius: ${({ theme }) => theme.borderRadius.md};
  aspect-ratio: 16/9;
  display: flex;
  align-items: center;
  justify-content: center;
  position: relative;
  overflow: hidden;
  
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

const CameraLabel = styled.div`
  position: absolute;
  bottom: ${({ theme }) => theme.spacing.sm};
  left: ${({ theme }) => theme.spacing.sm};
  background: ${({ theme }) => theme.colors.surface};
  color: ${({ theme }) => theme.colors.textPrimary};
  padding: ${({ theme }) => theme.spacing.xs} ${({ theme }) => theme.spacing.sm};
  border-radius: ${({ theme }) => theme.borderRadius.sm};
  font-size: ${({ theme }) => theme.typography.fontSize.sm};
  font-weight: ${({ theme }) => theme.typography.fontWeight.medium};
`;

const CameraIcon = styled.div`
  color: ${({ theme }) => theme.colors.textMuted};
  font-size: 3rem;
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
`;

const ViewAllHistoryButton = styled.button`
  margin: 1rem 0 0 0;
  padding: 0.5rem 1.5rem;
  border-radius: ${({ theme }) => theme.borderRadius.md};
  border: 1px solid ${({ theme }) => theme.colors.primary};
  background: ${({ theme }) => theme.colors.surfaceHover};
  color: ${({ theme }) => theme.colors.primary};
  font-weight: 500;
  font-size: 1rem;
  cursor: pointer;
  transition: all 0.15s;
  &:hover {
    background: ${({ theme }) => theme.colors.primary}20;
  }
`;

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

const BackButtonWrapper = styled.div`
  margin-bottom: 2rem;
`;

const Title = styled.h2`
  margin-bottom: 1.5rem;
`;

const InfoGroup = styled.div`
  margin-bottom: 1.5rem;
`;

const Label = styled.div`
  font-weight: 500;
  color: ${({ theme }) => theme.colors.textSecondary};
  margin-bottom: 0.25rem;
`;

const Value = styled.div`
  font-size: 1.1rem;
  color: ${({ theme }) => theme.colors.textPrimary};
  margin-bottom: 0.5rem;
`;

const CameraArea = styled.div`
  flex: 1;
  display: flex;
  align-items: center;
  justify-content: center;
  background: ${({ theme }) => theme.colors.background};
`;

const Button = styled.button`
  background: ${({ theme }) => theme.colors.primary};
  color: ${({ theme }) => theme.colors.textPrimary};
  border: none;
  border-radius: ${({ theme }) => theme.borderRadius.md};
  padding: 0.75rem 2rem;
  font-weight: 600;
  font-size: 1rem;
  cursor: pointer;
  transition: all 0.15s;
  &:hover {
    background: ${({ theme }) => theme.colors.primary}CC;
  }
  &:disabled {
    opacity: 0.6;
    cursor: not-allowed;
  }
`;

const Dashboard = () => {
  const { branchId } = useParams();
  const navigate = useNavigate();
  const location = useLocation();
  const { currentBranch, loading: branchesLoading } = useBranches();
  const [selectedJob, setSelectedJob] = useState(null);
  const [isRecording, setIsRecording] = useState(false);
  const [bookmarks, setBookmarks] = useState([]);
  const [jobs, setJobs] = useState([]);
  const [cameras, setCameras] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showWhatsAppShare, setShowWhatsAppShare] = useState(false);

  // Fetch jobs for current branch
  useEffect(() => {
    if (!currentBranch) return;
    setLoading(true);
    api.get(`/jobs?branchId=${currentBranch.id}`)
      .then(res => {
        setJobs(res.data);
      })
      .catch(err => toast.error('Failed to load jobs'))
      .finally(() => setLoading(false));
  }, [currentBranch]);

  // Fetch cameras for current branch
  useEffect(() => {
    if (!currentBranch) return;
    api.get(`/cameras?branchId=${currentBranch.id}`)
      .then(res => setCameras(res.data))
      .catch(err => toast.error('Failed to load cameras'));
  }, [currentBranch]);

  // Add job from AddJobPage if present in location.state
  useEffect(() => {
    if (location.state && location.state.newJob) {
      setJobs((prev) => [...prev, location.state.newJob]);
      navigate(location.pathname, { replace: true, state: {} });
    }
  }, [location.state, navigate, location.pathname]);

  // Mark job as complete
  const handleCompleteJob = async (jobId) => {
    try {
      await api.put(`/jobs/${jobId}`, { status: 'completed' });
      setJobs((prev) => prev.map(j => j.id === jobId ? { ...j, status: 'completed' } : j));
      toast.success('Job marked as complete');
    } catch {
      toast.error('Failed to mark job as complete');
    }
  };

  // Navigate to job details
  const handleJobSelect = (job) => {
    navigate(branchId ? `/dashboard/branch/${branchId}/jobs/${job.id}` : `/dashboard/jobs/${job.id}`);
  };

  const toggleRecording = () => {
    setIsRecording(!isRecording);
    toast.success(isRecording ? 'Recording stopped' : 'Recording started');
  };

  const addBookmark = () => {
    const bookmark = {
      id: Date.now(),
      timestamp: new Date().toLocaleTimeString(),
      jobId: selectedJob?.id,
    };
    setBookmarks([...bookmarks, bookmark]);
    toast.success('Bookmark added');
  };

  const shareLink = () => {
    if (!selectedJob) {
      toast.error('Please select a job first');
      return;
    }
    const shareUrl = `https://garagepro.com/view/${selectedJob.id}-${Date.now()}`;
    navigator.clipboard.writeText(shareUrl);
    toast.success('Share link copied to clipboard');
  };

  const shareWhatsApp = () => {
    if (!selectedJob) {
      toast.error('Please select a job first');
      return;
    }
    setShowWhatsAppShare(true);
  };

  if (branchesLoading) return <div>Loading branches...</div>;
  if (!currentBranch) return <div>No branch selected or available.</div>;

  const activeJobs = jobs.filter(j => j.status !== 'completed');
  const completedJobs = jobs.filter(j => j.status === 'completed');

  return (
    <DashboardContainer>
      <JobPickerSidebar>
        <SidebarHeader>
          <div className="title">{currentBranch?.name} - Active Jobs</div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
            <div className="count">{activeJobs.length}</div>
            <AddJobButton
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={() => navigate(branchId ? `/dashboard/branch/${branchId}/jobs/new` : '/dashboard/jobs/new')}
            >
              <FiPlus size={16} />
              Job
            </AddJobButton>
          </div>
        </SidebarHeader>
        <JobList>
          {loading ? (
            <div>Loading jobs...</div>
          ) : activeJobs.map((job) => (
            <JobCard
              key={job.id}
              active={selectedJob?.id === job.id}
              onClick={() => handleJobSelect(job)}
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
            >
              <JobHeader>
                <JobTitle>{job.car_model} {job.car_year}</JobTitle>
                <StatusBadge className={job.status}>{job.status}</StatusBadge>
              </JobHeader>
              <JobDetails>
                <JobDetail>
                  <FiUser size={14} />
                  {job.customer_name}
                </JobDetail>
                <JobDetail>
                  <FiClock size={14} />
                  {job.entered_at} {/* Format as needed */}
                </JobDetail>
                <JobDetail>
                  <FiTruck size={14} />
                  {job.issue_description}
                </JobDetail>
              </JobDetails>
            </JobCard>
          ))}
        </JobList>
        {completedJobs.length > 0 && (
          <>
            <div style={{ margin: '2rem 0 0.5rem', color: '#8A8A8A', fontWeight: 500 }}>History Jobs</div>
            <JobList>
              {completedJobs.slice(0, 3).map((job) => (
                <JobCard
                  key={job.id}
                  active={selectedJob?.id === job.id}
                  onClick={() => handleJobSelect(job)}
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                >
                  <JobHeader>
                    <JobTitle>{job.car_model} {job.car_year}</JobTitle>
                    <StatusBadge className={job.status}>{job.status}</StatusBadge>
                  </JobHeader>
                  <JobDetails>
                    <JobDetail>
                      <FiUser size={14} />
                      {job.customer_name}
                    </JobDetail>
                    <JobDetail>
                      <FiClock size={14} />
                      {job.entered_at}
                    </JobDetail>
                    <JobDetail>
                      <FiTruck size={14} />
                      {job.issue_description}
                    </JobDetail>
                  </JobDetails>
                </JobCard>
              ))}
            </JobList>
            <ViewAllHistoryButton onClick={() => navigate(branchId ? `/dashboard/branch/${branchId}/history` : '/dashboard/history')}>
              View All History
            </ViewAllHistoryButton>
          </>
        )}
      </JobPickerSidebar>

      <MainContent>
        <LiveStreamPanel>
          <StreamHeader>
            <StreamTitle>
              {selectedJob ? `${selectedJob.car_model} ${selectedJob.car_year} - Live Stream` : 'Select a job to view live stream'}
            </StreamTitle>
            <StreamControls>
              <ControlButton
                onClick={addBookmark}
                disabled={!selectedJob}
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                <FiBookmark size={16} />
                Bookmark
              </ControlButton>
              <ControlButton
                onClick={toggleRecording}
                variant={isRecording ? 'danger' : 'success'}
                disabled={!selectedJob}
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                {isRecording ? <FiSquare size={16} /> : <FiPlay size={16} />}
                {isRecording ? 'Stop Recording' : 'Start Recording'}
              </ControlButton>
              <ControlButton
                onClick={() => navigate('/branch-cameras')}
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                <FiCamera size={16} />
                Branch Cameras
              </ControlButton>
              <ControlButton
                onClick={shareLink}
                disabled={!selectedJob}
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                <FiShare2 size={16} />
                Share Link
              </ControlButton>
              <ControlButton
                onClick={shareWhatsApp}
                disabled={!selectedJob}
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                <FiMessageCircle size={16} />
                WhatsApp
              </ControlButton>
            </StreamControls>
          </StreamHeader>
          <StreamContent>
            {selectedJob ? (
              <>
                <CameraGrid>
                  {cameras.map((camera) => (
                    <CameraFeed key={camera.id}>
                      <CameraIcon>
                        <FiCamera />
                      </CameraIcon>
                      <CameraLabel>{camera.label}</CameraLabel>
                    </CameraFeed>
                  ))}
                </CameraGrid>
                <Watermark>
                  GaragePro - Confidential
                </Watermark>
              </>
            ) : (
              <div style={{ 
                textAlign: 'center', 
                color: '#8A8A8A',
                fontSize: '1.2rem'
              }}>
                <FiCamera size={48} style={{ marginBottom: '1rem' }} />
                <div>Select a job from the sidebar to view live stream</div>
              </div>
            )}
          </StreamContent>
        </LiveStreamPanel>
      </MainContent>

      <WhatsAppShare
        isOpen={showWhatsAppShare}
        onClose={() => setShowWhatsAppShare(false)}
        jobId={selectedJob?.id}
        cameraId={cameras[0]?.id} // You might want to let user select camera
        customerPhone={selectedJob?.customer_phone}
      />
    </DashboardContainer>
  );
};

export default Dashboard; 