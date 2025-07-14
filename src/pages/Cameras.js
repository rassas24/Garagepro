import React, { useEffect, useState } from 'react';
import styled from 'styled-components';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  FiCamera, 
  FiSettings, 
  FiEdit2, 
  FiTrash2, 
  FiPlus,
  FiWifi,
  FiWifiOff,
  FiEye,
  FiEyeOff,
  FiMapPin,
  FiActivity
} from 'react-icons/fi';
import toast from 'react-hot-toast';
import { useNavigate, useParams } from 'react-router-dom';
import api from '../api';
import { useBranches } from '../context/BranchContext';

const CamerasContainer = styled.div`
  padding: ${({ theme }) => theme.spacing.lg};
  height: calc(100vh - 80px);
  overflow-y: auto;
`;

const PageHeader = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin-bottom: ${({ theme }) => theme.spacing.xl};
  
  @media (max-width: ${({ theme }) => theme.breakpoints.md}) {
    flex-direction: column;
    gap: ${({ theme }) => theme.spacing.md};
    align-items: stretch;
  }
`;

const PageTitle = styled.h1`
  font-size: ${({ theme }) => theme.typography.fontSize['3xl']};
  font-weight: ${({ theme }) => theme.typography.fontWeight.bold};
  color: ${({ theme }) => theme.colors.textPrimary};
  margin: 0;
`;

const AddButton = styled(motion.button)`
  display: flex;
  align-items: center;
  gap: ${({ theme }) => theme.spacing.sm};
  background: linear-gradient(135deg, ${({ theme }) => theme.colors.primary}, ${({ theme }) => theme.colors.secondary});
  border: none;
  border-radius: ${({ theme }) => theme.borderRadius.md};
  padding: ${({ theme }) => theme.spacing.sm} ${({ theme }) => theme.spacing.md};
  color: ${({ theme }) => theme.colors.textPrimary};
  font-size: ${({ theme }) => theme.typography.fontSize.sm};
  font-weight: ${({ theme }) => theme.typography.fontWeight.medium};
  cursor: pointer;
  transition: all ${({ theme }) => theme.transitions.fast};
  
  &:hover {
    transform: translateY(-2px);
    box-shadow: ${({ theme }) => theme.shadows.glow};
  }
`;

const CamerasGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(350px, 1fr));
  gap: ${({ theme }) => theme.spacing.lg};
  
  @media (max-width: ${({ theme }) => theme.breakpoints.md}) {
    grid-template-columns: 1fr;
  }
`;

const CameraCard = styled(motion.div)`
  background: ${({ theme }) => theme.colors.surface};
  border: 1px solid ${({ theme }) => theme.colors.border};
  border-radius: ${({ theme }) => theme.borderRadius.lg};
  overflow: hidden;
  transition: all ${({ theme }) => theme.transitions.fast};
  
  &:hover {
    transform: translateY(-4px);
    box-shadow: ${({ theme }) => theme.shadows.lg};
    border-color: ${({ theme }) => theme.colors.primary};
  }
`;

const CameraPreview = styled.div`
  width: 100%;
  height: 200px;
  background: ${({ theme }) => theme.colors.background};
  position: relative;
  display: flex;
  align-items: center;
  justify-content: center;
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

const CameraIcon = styled.div`
  color: ${({ theme }) => theme.colors.textMuted};
  font-size: 3rem;
  z-index: 1;
`;

const StatusIndicator = styled.div`
  position: absolute;
  top: ${({ theme }) => theme.spacing.sm};
  right: ${({ theme }) => theme.spacing.sm};
  display: flex;
  align-items: center;
  gap: ${({ theme }) => theme.spacing.xs};
  background: ${({ theme }) => theme.colors.surface}CC;
  padding: ${({ theme }) => theme.spacing.xs} ${({ theme }) => theme.spacing.sm};
  border-radius: ${({ theme }) => theme.borderRadius.sm};
  font-size: ${({ theme }) => theme.typography.fontSize.xs};
  font-weight: ${({ theme }) => theme.typography.fontWeight.medium};
  z-index: 2;
  
  &.online {
    color: ${({ theme }) => theme.colors.success};
  }
  
  &.offline {
    color: ${({ theme }) => theme.colors.error};
  }
  
  &.recording {
    color: ${({ theme }) => theme.colors.warning};
  }
`;

const CameraInfo = styled.div`
  padding: ${({ theme }) => theme.spacing.lg};
`;

const CameraHeader = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin-bottom: ${({ theme }) => theme.spacing.md};
`;

const CameraName = styled.h3`
  font-size: ${({ theme }) => theme.typography.fontSize.lg};
  font-weight: ${({ theme }) => theme.typography.fontWeight.semibold};
  color: ${({ theme }) => theme.colors.textPrimary};
  margin: 0;
`;

const CameraActions = styled.div`
  display: flex;
  gap: ${({ theme }) => theme.spacing.sm};
`;

const ActionButton = styled.button`
  display: flex;
  align-items: center;
  justify-content: center;
  width: 32px;
  height: 32px;
  background: ${({ theme }) => theme.colors.surfaceHover};
  border: 1px solid ${({ theme }) => theme.colors.border};
  border-radius: ${({ theme }) => theme.borderRadius.sm};
  color: ${({ theme }) => theme.colors.textSecondary};
  cursor: pointer;
  transition: all ${({ theme }) => theme.transitions.fast};
  
  &:hover {
    border-color: ${({ theme }) => theme.colors.primary};
    color: ${({ theme }) => theme.colors.primary};
  }
  
  &.danger:hover {
    border-color: ${({ theme }) => theme.colors.error};
    color: ${({ theme }) => theme.colors.error};
  }
`;

const CameraDetails = styled.div`
  display: flex;
  flex-direction: column;
  gap: ${({ theme }) => theme.spacing.sm};
  margin-bottom: ${({ theme }) => theme.spacing.lg};
`;

const DetailItem = styled.div`
  display: flex;
  align-items: center;
  gap: ${({ theme }) => theme.spacing.sm};
  color: ${({ theme }) => theme.colors.textSecondary};
  font-size: ${({ theme }) => theme.typography.fontSize.sm};
`;

const CameraControls = styled.div`
  display: flex;
  gap: ${({ theme }) => theme.spacing.sm};
`;

const ControlButton = styled(motion.button)`
  flex: 1;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: ${({ theme }) => theme.spacing.xs};
  padding: ${({ theme }) => theme.spacing.sm};
  background: ${({ theme, variant }) => {
    if (variant === 'danger') return theme.colors.error + '20';
    if (variant === 'success') return theme.colors.success + '20';
    return theme.colors.surfaceHover;
  }};
  border: 1px solid ${({ theme, variant }) => {
    if (variant === 'danger') return theme.colors.error;
    if (variant === 'success') return theme.colors.success;
    return theme.colors.border;
  }};
  border-radius: ${({ theme }) => theme.borderRadius.md};
  color: ${({ theme, variant }) => {
    if (variant === 'danger') return theme.colors.error;
    if (variant === 'success') return theme.colors.success;
    return theme.colors.textSecondary;
  }};
  font-size: ${({ theme }) => theme.typography.fontSize.sm};
  font-weight: ${({ theme }) => theme.typography.fontWeight.medium};
  cursor: pointer;
  transition: all ${({ theme }) => theme.transitions.fast};
  
  &:hover {
    transform: translateY(-1px);
    box-shadow: ${({ theme }) => theme.shadows.sm};
  }
`;

const Modal = styled(motion.div)`
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: ${({ theme }) => theme.colors.backdrop};
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: ${({ theme }) => theme.zIndex.modal};
  padding: ${({ theme }) => theme.spacing.lg};
`;

const ModalContent = styled(motion.div)`
  background: ${({ theme }) => theme.colors.surface};
  border: 1px solid ${({ theme }) => theme.colors.border};
  border-radius: ${({ theme }) => theme.borderRadius.lg};
  padding: ${({ theme }) => theme.spacing.xl};
  max-width: 600px;
  width: 100%;
  max-height: 90vh;
  overflow-y: auto;
`;

const ModalHeader = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin-bottom: ${({ theme }) => theme.spacing.lg};
`;

const ModalTitle = styled.h2`
  font-size: ${({ theme }) => theme.typography.fontSize.xl};
  font-weight: ${({ theme }) => theme.typography.fontWeight.semibold};
  color: ${({ theme }) => theme.colors.textPrimary};
  margin: 0;
`;

const CloseButton = styled.button`
  display: flex;
  align-items: center;
  justify-content: center;
  width: 32px;
  height: 32px;
  background: ${({ theme }) => theme.colors.surfaceHover};
  border: 1px solid ${({ theme }) => theme.colors.border};
  border-radius: ${({ theme }) => theme.borderRadius.sm};
  color: ${({ theme }) => theme.colors.textSecondary};
  cursor: pointer;
  transition: all ${({ theme }) => theme.transitions.fast};
  
  &:hover {
    border-color: ${({ theme }) => theme.colors.error};
    color: ${({ theme }) => theme.colors.error};
  }
`;

const FormGroup = styled.div`
  margin-bottom: ${({ theme }) => theme.spacing.lg};
`;

const Label = styled.label`
  display: block;
  margin-bottom: ${({ theme }) => theme.spacing.sm};
  color: ${({ theme }) => theme.colors.textPrimary};
  font-weight: ${({ theme }) => theme.typography.fontWeight.medium};
`;

const Input = styled.input`
  width: 100%;
  padding: ${({ theme }) => theme.spacing.md};
  background: ${({ theme }) => theme.colors.surfaceHover};
  border: 1px solid ${({ theme }) => theme.colors.border};
  border-radius: ${({ theme }) => theme.borderRadius.md};
  color: ${({ theme }) => theme.colors.textPrimary};
  font-size: ${({ theme }) => theme.typography.fontSize.base};
  transition: all ${({ theme }) => theme.transitions.fast};
  
  &:focus {
    outline: none;
    border-color: ${({ theme }) => theme.colors.primary};
    box-shadow: 0 0 0 3px ${({ theme }) => theme.colors.primary}20;
  }
  
  &::placeholder {
    color: ${({ theme }) => theme.colors.textMuted};
  }
`;

const Select = styled.select`
  width: 100%;
  padding: ${({ theme }) => theme.spacing.md};
  background: ${({ theme }) => theme.colors.surfaceHover};
  border: 1px solid ${({ theme }) => theme.colors.border};
  border-radius: ${({ theme }) => theme.borderRadius.md};
  color: ${({ theme }) => theme.colors.textPrimary};
  font-size: ${({ theme }) => theme.typography.fontSize.base};
  transition: all ${({ theme }) => theme.transitions.fast};
  
  &:focus {
    outline: none;
    border-color: ${({ theme }) => theme.colors.primary};
    box-shadow: 0 0 0 3px ${({ theme }) => theme.colors.primary}20;
  }
`;

const ModalActions = styled.div`
  display: flex;
  gap: ${({ theme }) => theme.spacing.md};
  margin-top: ${({ theme }) => theme.spacing.xl};
`;

const Button = styled(motion.button)`
  flex: 1;
  padding: ${({ theme }) => theme.spacing.md};
  border: none;
  border-radius: ${({ theme }) => theme.borderRadius.md};
  font-size: ${({ theme }) => theme.typography.fontSize.base};
  font-weight: ${({ theme }) => theme.typography.fontWeight.medium};
  cursor: pointer;
  transition: all ${({ theme }) => theme.transitions.fast};
  
  &.primary {
    background: linear-gradient(135deg, ${({ theme }) => theme.colors.primary}, ${({ theme }) => theme.colors.secondary});
    color: ${({ theme }) => theme.colors.textPrimary};
    
    &:hover {
      transform: translateY(-2px);
      box-shadow: ${({ theme }) => theme.shadows.glow};
    }
  }
  
  &.secondary {
    background: ${({ theme }) => theme.colors.surfaceHover};
    border: 1px solid ${({ theme }) => theme.colors.border};
    color: ${({ theme }) => theme.colors.textSecondary};
    
    &:hover {
      border-color: ${({ theme }) => theme.colors.primary};
      color: ${({ theme }) => theme.colors.primary};
    }
  }
`;

const Cameras = () => {
  const { branchId } = useParams();
  const navigate = useNavigate();
  const { currentBranch, loading: branchesLoading } = useBranches();
  const [cameras, setCameras] = useState([]);
  const [loading, setLoading] = useState(true);
  const [jobs, setJobs] = useState([]);
  const [showBranchOnly, setShowBranchOnly] = useState(true);

  useEffect(() => {
    if (!currentBranch) return;
    setLoading(true);
    Promise.all([
      api.get(`/cameras?branchId=${currentBranch.id}`),
      api.get(`/jobs?branchId=${currentBranch.id}`)
    ])
      .then(([camerasRes, jobsRes]) => {
        setCameras(camerasRes.data);
        setJobs(jobsRes.data);
      })
      .catch(() => toast.error('Failed to load cameras or jobs'))
      .finally(() => setLoading(false));
  }, [currentBranch]);

  const handleAddCamera = () => {
    // This will need to be updated to navigate to a new camera form
    // For now, it will just show a toast message
    toast.info('Add camera functionality is not yet implemented.');
  };

  const handleEditCamera = (camera) => {
    // This will need to be updated to navigate to an edit form
    // For now, it will just show a toast message
    toast.info('Edit camera functionality is not yet implemented.');
  };

  const handleDeleteCamera = (camera) => {
    // This will need to be updated to delete the camera via API
    toast.info('Delete camera functionality is not yet implemented.');
  };

  const handleToggleRecording = (camera) => {
    // This will need to be updated to toggle recording via API
    toast.info('Toggle recording functionality is not yet implemented.');
  };

  const handleToggleCamera = (camera) => {
    // This will need to be updated to toggle camera status via API
    toast.info('Toggle camera status functionality is not yet implemented.');
  };

  const handleSaveCamera = (formData) => {
    // This will need to be updated to save the camera via API
    toast.info('Save camera functionality is not yet implemented.');
  };

  const getStatusIcon = (status) => {
    switch (status) {
      case 'online':
        return <FiWifi size={12} />;
      case 'offline':
        return <FiWifiOff size={12} />;
      default:
        return <FiActivity size={12} />;
    }
  };

  const getStatusText = (camera) => {
    // This will need to be updated to reflect actual recording status from API
    return camera.status;
  };

  if (branchesLoading) return <div>Loading...</div>;

  return (
    <CamerasContainer>
      <PageHeader>
        <PageTitle>Camera Management</PageTitle>
        <div style={{ display: 'flex', gap: '1rem' }}>
          <AddButton
            onClick={() => navigate(`/cameras/new`)}
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
          >
            <FiPlus size={16} />
            Add Camera
          </AddButton>
          <Button
            className={showBranchOnly ? 'primary' : 'secondary'}
            onClick={() => setShowBranchOnly((v) => !v)}
            style={{ marginLeft: 8 }}
          >
            {showBranchOnly ? 'Show All Cameras' : 'Show Only Branch Cameras'}
          </Button>
        </div>
      </PageHeader>

      <CamerasGrid>
        {(showBranchOnly ? cameras : cameras /* add logic for all cameras if needed */).map((camera) => {
          const assignedJob = jobs.find(j => j.camera_id === camera.id && j.status !== 'completed');
          return (
            <CameraCard
              key={camera.id}
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
            >
              <CameraPreview>
                <CameraIcon>
                  <FiCamera />
                </CameraIcon>
                <StatusIndicator className={getStatusText(camera)}>
                  {getStatusIcon(camera.status)}
                  {getStatusText(camera)}
                </StatusIndicator>
              </CameraPreview>
              
              <CameraInfo>
                <CameraHeader>
                  <CameraName>{camera.label}</CameraName>
                  <CameraActions>
                    <ActionButton onClick={() => handleEditCamera(camera)}>
                      <FiEdit2 size={16} />
                    </ActionButton>
                    <ActionButton 
                      className="danger"
                      onClick={() => handleDeleteCamera(camera)}
                    >
                      <FiTrash2 size={16} />
                    </ActionButton>
                  </CameraActions>
                </CameraHeader>
                
                <CameraDetails>
                  <DetailItem>
                    <FiMapPin size={14} />
                    {currentBranch?.name}
                  </DetailItem>
                  <DetailItem>
                    <FiCamera size={14} />
                    {camera.model}
                  </DetailItem>
                  <DetailItem>
                    <FiActivity size={14} />
                    {camera.stream_url}
                  </DetailItem>
                  <DetailItem>
                    {assignedJob ? (
                      <span style={{ color: 'red' }}>Assigned to job #{assignedJob.id}</span>
                    ) : (
                      <span style={{ color: 'green' }}>Available</span>
                    )}
                  </DetailItem>
                </CameraDetails>
                
                <CameraControls>
                  <ControlButton
                    onClick={() => handleToggleCamera(camera)}
                    variant={camera.status === 'online' ? 'success' : 'danger'}
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                  >
                    {camera.status === 'online' ? <FiEye size={16} /> : <FiEyeOff size={16} />}
                    {camera.status === 'online' ? 'Disable' : 'Enable'}
                  </ControlButton>
                  
                  <ControlButton
                    onClick={() => handleToggleRecording(camera)}
                    variant={camera.isRecording ? 'danger' : 'success'}
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                  >
                    <FiCamera size={16} />
                    {camera.isRecording ? 'Stop' : 'Record'}
                  </ControlButton>
                </CameraControls>
              </CameraInfo>
            </CameraCard>
          );
        })}
      </CamerasGrid>

      <AnimatePresence>
        {/* The modal structure and content will need to be updated to reflect new API calls */}
        {/* For now, it will just show a placeholder */}
        {/* {showModal && (
          <Modal
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => setShowModal(false)}
          >
            <ModalContent
              initial={{ opacity: 0, scale: 0.9, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.9, y: 20 }}
              onClick={(e) => e.stopPropagation()}
            >
              <ModalHeader>
                <ModalTitle>
                  {selectedCamera ? 'Edit Camera' : 'Add Camera'}
                </ModalTitle>
                <CloseButton onClick={() => setShowModal(false)}>
                  ✕
                </CloseButton>
              </ModalHeader>
              
              <form onSubmit={(e) => {
                e.preventDefault();
                const formData = new FormData(e.target);
                handleSaveCamera({
                  name: formData.get('name'),
                  rtspUrl: formData.get('rtspUrl'),
                  branch: formData.get('branch'),
                  location: formData.get('location'),
                  resolution: formData.get('resolution'),
                  fps: formData.get('fps'),
                });
              }}>
                <FormGroup>
                  <Label>Camera Name</Label>
                  <Input
                    name="name"
                    placeholder="e.g., Bay 1 - Front View"
                    defaultValue={selectedCamera?.name}
                    required
                  />
                </FormGroup>
                
                <FormGroup>
                  <Label>RTSP URL</Label>
                  <Input
                    name="rtspUrl"
                    placeholder="rtsp://192.168.1.100:554/stream1"
                    defaultValue={selectedCamera?.rtspUrl}
                    required
                  />
                </FormGroup>
                
                <FormGroup>
                  <Label>Branch</Label>
                  <Select name="branch" required>
                    <option value="">Select branch</option>
                    {branches.map((branch) => (
                      <option 
                        key={branch.id} 
                        value={branch.name}
                        selected={selectedCamera?.branch === branch.name}
                      >
                        {branch.name}
                      </option>
                    ))}
                  </Select>
                </FormGroup>
                
                <FormGroup>
                  <Label>Location</Label>
                  <Input
                    name="location"
                    placeholder="e.g., Service Bay 1"
                    defaultValue={selectedCamera?.location}
                    required
                  />
                </FormGroup>
                
                <div style={{ display: 'flex', gap: '1rem' }}>
                  <FormGroup style={{ flex: 1 }}>
                    <Label>Resolution</Label>
                    <Select name="resolution" required>
                      <option value="">Select resolution</option>
                      <option value="720p" selected={selectedCamera?.resolution === '720p'}>720p</option>
                      <option value="1080p" selected={selectedCamera?.resolution === '1080p'}>1080p</option>
                      <option value="4K" selected={selectedCamera?.resolution === '4K'}>4K</option>
                    </Select>
                  </FormGroup>
                  
                  <FormGroup style={{ flex: 1 }}>
                    <Label>FPS</Label>
                    <Select name="fps" required>
                      <option value="">Select FPS</option>
                      <option value="15" selected={selectedCamera?.fps === 15}>15</option>
                      <option value="25" selected={selectedCamera?.fps === 25}>25</option>
                      <option value="30" selected={selectedCamera?.fps === 30}>30</option>
                      <option value="60" selected={selectedCamera?.fps === 60}>60</option>
                    </Select>
                  </FormGroup>
                </div>
                
                <ModalActions>
                  <Button
                    type="button"
                    className="secondary"
                    onClick={() => setShowModal(false)}
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                  >
                    Cancel
                  </Button>
                  <Button
                    type="submit"
                    className="primary"
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                  >
                    {selectedCamera ? 'Update Camera' : 'Add Camera'}
                  </Button>
                </ModalActions>
              </form>
            </ModalContent>
          </Modal>
        )} */}
      </AnimatePresence>
    </CamerasContainer>
  );
};

export default Cameras; 