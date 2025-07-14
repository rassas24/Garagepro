import React, { useState, useEffect } from 'react';
import styled from 'styled-components';
import { motion } from 'framer-motion';
import { 
  FiUser, 
  FiMail, 
  FiPhone, 
  FiLock, 
  FiShield,
  FiSettings,
  FiDownload,
  FiTrash2,
  FiCamera,
  FiMapPin,
  FiBell,
  FiGlobe,
  FiMonitor,
  FiLogOut,
  FiEdit2,
  FiCheck,
  FiX,
  FiUpload,
  FiEye,
  FiEyeOff,
  FiKey,
  FiClock,
  FiSmartphone
} from 'react-icons/fi';
import { useAuth } from '../context/AuthContext';
import toast from 'react-hot-toast';
import api from '../api';

const ProfileContainer = styled.div`
  padding: ${({ theme }) => theme.spacing.lg};
  height: calc(100vh - 80px);
  overflow-y: auto;
`;

const PageHeader = styled.div`
  margin-bottom: ${({ theme }) => theme.spacing.xl};
`;

const PageTitle = styled.h1`
  font-size: ${({ theme }) => theme.typography.fontSize['3xl']};
  font-weight: ${({ theme }) => theme.typography.fontWeight.bold};
  color: ${({ theme }) => theme.colors.textPrimary};
  margin: 0;
`;

const ProfileGrid = styled.div`
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: ${({ theme }) => theme.spacing.xl};
  
  @media (max-width: ${({ theme }) => theme.breakpoints.lg}) {
    grid-template-columns: 1fr;
  }
`;

const ProfileSection = styled.div`
  background: ${({ theme }) => theme.colors.surface};
  border: 1px solid ${({ theme }) => theme.colors.border};
  border-radius: ${({ theme }) => theme.borderRadius.lg};
  padding: ${({ theme }) => theme.spacing.lg};
`;

const SectionHeader = styled.div`
  display: flex;
  align-items: center;
  gap: ${({ theme }) => theme.spacing.sm};
  margin-bottom: ${({ theme }) => theme.spacing.lg};
  padding-bottom: ${({ theme }) => theme.spacing.md};
  border-bottom: 1px solid ${({ theme }) => theme.colors.border};
`;

const SectionIcon = styled.div`
  width: 40px;
  height: 40px;
  border-radius: ${({ theme }) => theme.borderRadius.md};
  display: flex;
  align-items: center;
  justify-content: center;
  background: ${({ theme }) => theme.colors.primary}20;
  color: ${({ theme }) => theme.colors.primary};
`;

const SectionTitle = styled.h2`
  font-size: ${({ theme }) => theme.typography.fontSize.lg};
  font-weight: ${({ theme }) => theme.typography.fontWeight.semibold};
  color: ${({ theme }) => theme.colors.textPrimary};
  margin: 0;
`;

const AvatarSection = styled.div`
  display: flex;
  align-items: center;
  gap: ${({ theme }) => theme.spacing.lg};
  margin-bottom: ${({ theme }) => theme.spacing.lg};
`;

const Avatar = styled.div`
  position: relative;
  width: 100px;
  height: 100px;
  border-radius: ${({ theme }) => theme.borderRadius.full};
  overflow: hidden;
  background: ${({ theme }) => theme.colors.surfaceHover};
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 2rem;
  color: ${({ theme }) => theme.colors.textMuted};
  
  img {
    width: 100%;
    height: 100%;
    object-fit: cover;
  }
`;

const AvatarUpload = styled.div`
  display: flex;
  flex-direction: column;
  gap: ${({ theme }) => theme.spacing.sm};
`;

const UploadButton = styled(motion.button)`
  display: flex;
  align-items: center;
  gap: ${({ theme }) => theme.spacing.sm};
  padding: ${({ theme }) => theme.spacing.sm} ${({ theme }) => theme.spacing.md};
  background: ${({ theme }) => theme.colors.surfaceHover};
  border: 1px solid ${({ theme }) => theme.colors.border};
  border-radius: ${({ theme }) => theme.borderRadius.md};
  color: ${({ theme }) => theme.colors.textSecondary};
  font-size: ${({ theme }) => theme.typography.fontSize.sm};
  cursor: pointer;
  transition: all ${({ theme }) => theme.transitions.fast};
  
  &:hover {
    border-color: ${({ theme }) => theme.colors.primary};
    color: ${({ theme }) => theme.colors.primary};
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
  
  &:disabled {
    opacity: 0.6;
    cursor: not-allowed;
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

const Switch = styled.label`
  display: flex;
  align-items: center;
  justify-content: space-between;
  cursor: pointer;
  padding: ${({ theme }) => theme.spacing.sm} 0;
`;

const SwitchInput = styled.input`
  display: none;
`;

const SwitchSlider = styled.div`
  position: relative;
  width: 48px;
  height: 24px;
  background: ${({ theme, checked }) => checked ? theme.colors.primary : theme.colors.border};
  border-radius: ${({ theme }) => theme.borderRadius.full};
  transition: all ${({ theme }) => theme.transitions.fast};
  
  &::after {
    content: '';
    position: absolute;
    top: 2px;
    left: ${({ checked }) => checked ? '26px' : '2px'};
    width: 20px;
    height: 20px;
    background: ${({ theme }) => theme.colors.textPrimary};
    border-radius: 50%;
    transition: all ${({ theme }) => theme.transitions.fast};
  }
`;

const SwitchLabel = styled.span`
  color: ${({ theme }) => theme.colors.textSecondary};
  font-size: ${({ theme }) => theme.typography.fontSize.sm};
`;

const SessionItem = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: ${({ theme }) => theme.spacing.md};
  background: ${({ theme }) => theme.colors.surfaceHover};
  border-radius: ${({ theme }) => theme.borderRadius.md};
  margin-bottom: ${({ theme }) => theme.spacing.sm};
`;

const SessionInfo = styled.div`
  display: flex;
  flex-direction: column;
  gap: ${({ theme }) => theme.spacing.xs};
`;

const SessionDevice = styled.div`
  font-weight: ${({ theme }) => theme.typography.fontWeight.medium};
  color: ${({ theme }) => theme.colors.textPrimary};
`;

const SessionDetails = styled.div`
  font-size: ${({ theme }) => theme.typography.fontSize.sm};
  color: ${({ theme }) => theme.colors.textSecondary};
`;

const LogoutButton = styled.button`
  padding: ${({ theme }) => theme.spacing.xs} ${({ theme }) => theme.spacing.sm};
  background: ${({ theme }) => theme.colors.error}20;
  border: 1px solid ${({ theme }) => theme.colors.error};
  border-radius: ${({ theme }) => theme.borderRadius.sm};
  color: ${({ theme }) => theme.colors.error};
  font-size: ${({ theme }) => theme.typography.fontSize.xs};
  cursor: pointer;
  transition: all ${({ theme }) => theme.transitions.fast};
  
  &:hover {
    background: ${({ theme }) => theme.colors.error};
    color: ${({ theme }) => theme.colors.textPrimary};
  }
`;

const ActionButton = styled(motion.button)`
  display: flex;
  align-items: center;
  gap: ${({ theme }) => theme.spacing.sm};
  padding: ${({ theme }) => theme.spacing.md} ${({ theme }) => theme.spacing.lg};
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
  
  &.danger {
    background: ${({ theme }) => theme.colors.error};
    color: ${({ theme }) => theme.colors.textPrimary};
    
    &:hover {
      background: ${({ theme }) => theme.colors.error}80;
      transform: translateY(-1px);
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

const DangerZone = styled.div`
  margin-top: ${({ theme }) => theme.spacing.xl};
  padding: ${({ theme }) => theme.spacing.lg};
  background: ${({ theme }) => theme.colors.error}10;
  border: 1px solid ${({ theme }) => theme.colors.error}30;
  border-radius: ${({ theme }) => theme.borderRadius.lg};
`;

const DangerTitle = styled.h3`
  color: ${({ theme }) => theme.colors.error};
  font-size: ${({ theme }) => theme.typography.fontSize.lg};
  font-weight: ${({ theme }) => theme.typography.fontWeight.semibold};
  margin-bottom: ${({ theme }) => theme.spacing.md};
`;

const Profile = () => {
  const { user, updateUser, logout } = useAuth();
  const [showPassword, setShowPassword] = useState(false);
  const [showNewPassword, setShowNewPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  
  const [profile, setProfile] = useState({
    first_name: user?.first_name || '',
    last_name: user?.last_name || '',
    email: user?.email || '',
    phone_country_code: user?.phone_country_code || '',
    phone_number: user?.phone_number || '',
    avatar_url: user?.avatar_url || '',
  });

  const [security, setSecurity] = useState({
    twoFactorEnabled: false,
    sessionTimeout: '8',
  });

  const [preferences, setPreferences] = useState({
    defaultBranch: 'Main Branch',
    defaultCameraView: 'grid',
    notifications: {
      email: true,
      sms: true,
      inApp: true,
    },
    language: 'en',
    theme: 'auto',
  });

  const [sessions, setSessions] = useState([]);
  const [loadingSessions, setLoadingSessions] = useState(true);

  useEffect(() => {
    setLoadingSessions(true);
    api.get('/users/me/sessions')
      .then(res => setSessions(res.data))
      .catch(() => toast.error('Failed to load sessions'))
      .finally(() => setLoadingSessions(false));
  }, []);

  const handleAvatarUpload = (event) => {
    const file = event.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (e) => {
        setProfile(prev => ({ ...prev, avatar: e.target.result }));
        toast.success('Avatar updated successfully');
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSaveProfile = () => {
    updateUser(profile);
  };

  const handlePasswordChange = () => {
    toast.success('Password changed successfully');
  };

  const handleToggleTwoFactor = () => {
    setSecurity(prev => ({ ...prev, twoFactorEnabled: !prev.twoFactorEnabled }));
    toast.success(security.twoFactorEnabled ? 'Two-factor authentication disabled' : 'Two-factor authentication enabled');
  };

  const handleLogoutSession = (sessionId, isCurrent) => {
    if (isCurrent) {
      api.post('/users/me/logout')
        .then(() => {
          toast.success('Logged out from current session');
          logout(); // Use AuthContext logout to clear token and redirect
        })
        .catch(() => toast.error('Failed to logout from current session'));
    } else {
      api.delete(`/users/me/sessions/${sessionId}`)
        .then(() => {
          setSessions(prev => prev.filter(s => s.id !== sessionId));
          toast.success('Session logged out successfully');
        })
        .catch(() => toast.error('Failed to logout session'));
    }
  };

  const handleDownloadData = () => {
    toast.success('Data export started. You will receive an email when ready.');
  };

  const handleDeleteAccount = () => {
    if (window.confirm('Are you sure you want to delete your account? This action cannot be undone.')) {
      toast.success('Account deletion requested. You will receive a confirmation email.');
    }
  };

  return (
    <ProfileContainer>
      <PageHeader>
        <PageTitle>Profile Settings</PageTitle>
      </PageHeader>

      <ProfileGrid>
        {/* Personal Information */}
        <ProfileSection>
          <SectionHeader>
            <SectionIcon>
              <FiUser size={20} />
            </SectionIcon>
            <SectionTitle>Personal Information</SectionTitle>
          </SectionHeader>

          <AvatarSection>
            <Avatar>
              {profile.avatar ? (
                <img src={profile.avatar} alt="Profile" />
              ) : (
                <FiUser size={40} />
              )}
            </Avatar>
            <AvatarUpload>
              <UploadButton
                as="label"
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                <FiUpload size={16} />
                Change Avatar
                <input
                  type="file"
                  accept="image/*"
                  onChange={handleAvatarUpload}
                  style={{ display: 'none' }}
                />
              </UploadButton>
            </AvatarUpload>
          </AvatarSection>

          <FormGroup>
            <Label>First Name</Label>
            <Input
              type="text"
              value={profile.first_name}
              onChange={(e) => setProfile(prev => ({ ...prev, first_name: e.target.value }))}
              placeholder="Enter first name"
            />
          </FormGroup>

          <FormGroup>
            <Label>Last Name</Label>
            <Input
              type="text"
              value={profile.last_name}
              onChange={(e) => setProfile(prev => ({ ...prev, last_name: e.target.value }))}
              placeholder="Enter last name"
            />
          </FormGroup>

          <FormGroup>
            <Label>Email</Label>
            <Input
              type="email"
              value={profile.email}
              onChange={(e) => setProfile(prev => ({ ...prev, email: e.target.value }))}
              placeholder="Enter email address"
            />
          </FormGroup>

          <FormGroup>
            <Label>Phone Number</Label>
            <Input
              type="tel"
              value={`${profile.phone_country_code} ${profile.phone_number}`}
              onChange={(e) => {
                const [code, ...number] = e.target.value.split(' ');
                setProfile(prev => ({ ...prev, phone_country_code: code, phone_number: number.join(' ') }))
              }}
              placeholder="Enter phone number"
            />
          </FormGroup>

          <ActionButton
            className="primary"
            onClick={handleSaveProfile}
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
          >
            <FiCheck size={16} />
            Save Changes
          </ActionButton>
        </ProfileSection>

        {/* Security */}
        <ProfileSection>
          <SectionHeader>
            <SectionIcon>
              <FiShield size={20} />
            </SectionIcon>
            <SectionTitle>Security</SectionTitle>
          </SectionHeader>

          <FormGroup>
            <Label>Current Password</Label>
            <div style={{ position: 'relative' }}>
              <Input
                type={showPassword ? 'text' : 'password'}
                placeholder="Enter current password"
                style={{ paddingRight: '3rem' }}
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                style={{
                  position: 'absolute',
                  right: '1rem',
                  top: '50%',
                  transform: 'translateY(-50%)',
                  background: 'none',
                  border: 'none',
                  color: '#8A8A8A',
                  cursor: 'pointer',
                }}
              >
                {showPassword ? <FiEyeOff size={16} /> : <FiEye size={16} />}
              </button>
            </div>
          </FormGroup>

          <FormGroup>
            <Label>New Password</Label>
            <div style={{ position: 'relative' }}>
              <Input
                type={showNewPassword ? 'text' : 'password'}
                placeholder="Enter new password"
                style={{ paddingRight: '3rem' }}
              />
              <button
                type="button"
                onClick={() => setShowNewPassword(!showNewPassword)}
                style={{
                  position: 'absolute',
                  right: '1rem',
                  top: '50%',
                  transform: 'translateY(-50%)',
                  background: 'none',
                  border: 'none',
                  color: '#8A8A8A',
                  cursor: 'pointer',
                }}
              >
                {showNewPassword ? <FiEyeOff size={16} /> : <FiEye size={16} />}
              </button>
            </div>
          </FormGroup>

          <FormGroup>
            <Label>Confirm New Password</Label>
            <div style={{ position: 'relative' }}>
              <Input
                type={showConfirmPassword ? 'text' : 'password'}
                placeholder="Confirm new password"
                style={{ paddingRight: '3rem' }}
              />
              <button
                type="button"
                onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                style={{
                  position: 'absolute',
                  right: '1rem',
                  top: '50%',
                  transform: 'translateY(-50%)',
                  background: 'none',
                  border: 'none',
                  color: '#8A8A8A',
                  cursor: 'pointer',
                }}
              >
                {showConfirmPassword ? <FiEyeOff size={16} /> : <FiEye size={16} />}
              </button>
            </div>
          </FormGroup>

          <ActionButton
            className="secondary"
            onClick={handlePasswordChange}
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
          >
            <FiKey size={16} />
            Change Password
          </ActionButton>

          <div style={{ marginTop: '2rem' }}>
            <Switch>
              <SwitchLabel>Two-Factor Authentication</SwitchLabel>
              <SwitchInput
                type="checkbox"
                checked={security.twoFactorEnabled}
                onChange={handleToggleTwoFactor}
              />
              <SwitchSlider checked={security.twoFactorEnabled} />
            </Switch>
          </div>

          <FormGroup>
            <Label>Session Timeout (hours)</Label>
            <Select
              value={security.sessionTimeout}
              onChange={(e) => setSecurity(prev => ({ ...prev, sessionTimeout: e.target.value }))}
            >
              <option value="1">1 hour</option>
              <option value="4">4 hours</option>
              <option value="8">8 hours</option>
              <option value="24">24 hours</option>
            </Select>
          </FormGroup>
        </ProfileSection>

        {/* Preferences */}
        <ProfileSection>
          <SectionHeader>
            <SectionIcon>
              <FiSettings size={20} />
            </SectionIcon>
            <SectionTitle>Preferences</SectionTitle>
          </SectionHeader>

          <FormGroup>
            <Label>Default Branch</Label>
            <Select
              value={preferences.defaultBranch}
              onChange={(e) => setPreferences(prev => ({ ...prev, defaultBranch: e.target.value }))}
            >
              <option value="Main Branch">Main Branch</option>
              <option value="North Branch">North Branch</option>
              <option value="South Branch">South Branch</option>
            </Select>
          </FormGroup>

          <FormGroup>
            <Label>Default Camera View</Label>
            <Select
              value={preferences.defaultCameraView}
              onChange={(e) => setPreferences(prev => ({ ...prev, defaultCameraView: e.target.value }))}
            >
              <option value="grid">Grid View</option>
              <option value="single">Single Bay</option>
            </Select>
          </FormGroup>

          <div style={{ marginBottom: '1rem' }}>
            <Label>Notification Channels</Label>
            <Switch>
              <SwitchLabel>Email Notifications</SwitchLabel>
              <SwitchInput
                type="checkbox"
                checked={preferences.notifications.email}
                onChange={(e) => setPreferences(prev => ({
                  ...prev,
                  notifications: { ...prev.notifications, email: e.target.checked }
                }))}
              />
              <SwitchSlider checked={preferences.notifications.email} />
            </Switch>

            <Switch>
              <SwitchLabel>SMS Notifications</SwitchLabel>
              <SwitchInput
                type="checkbox"
                checked={preferences.notifications.sms}
                onChange={(e) => setPreferences(prev => ({
                  ...prev,
                  notifications: { ...prev.notifications, sms: e.target.checked }
                }))}
              />
              <SwitchSlider checked={preferences.notifications.sms} />
            </Switch>

            <Switch>
              <SwitchLabel>In-App Notifications</SwitchLabel>
              <SwitchInput
                type="checkbox"
                checked={preferences.notifications.inApp}
                onChange={(e) => setPreferences(prev => ({
                  ...prev,
                  notifications: { ...prev.notifications, inApp: e.target.checked }
                }))}
              />
              <SwitchSlider checked={preferences.notifications.inApp} />
            </Switch>
          </div>

          <FormGroup>
            <Label>Language</Label>
            <Select
              value={preferences.language}
              onChange={(e) => setPreferences(prev => ({ ...prev, language: e.target.value }))}
            >
              <option value="en">English</option>
              <option value="ar">العربية</option>
              <option value="es">Español</option>
              <option value="fr">Français</option>
            </Select>
          </FormGroup>

          <FormGroup>
            <Label>Theme</Label>
            <Select
              value={preferences.theme}
              onChange={(e) => setPreferences(prev => ({ ...prev, theme: e.target.value }))}
            >
              <option value="auto">Auto (System)</option>
              <option value="dark">Dark</option>
              <option value="light">Light</option>
            </Select>
          </FormGroup>
        </ProfileSection>

        {/* Active Sessions */}
        <ProfileSection>
          <SectionHeader>
            <SectionIcon>
              <FiClock size={20} />
            </SectionIcon>
            <SectionTitle>Active Sessions</SectionTitle>
          </SectionHeader>

          {loadingSessions ? (
            <div>Loading sessions...</div>
          ) : sessions.length === 0 ? (
            <div>No active sessions.</div>
          ) : sessions.map((session) => (
            <SessionItem key={session.id}>
              <SessionInfo>
                <SessionDevice>
                  {session.device || 'Unknown Device'}
                  {session.current && (
                    <span style={{ color: '#00D4AA', marginLeft: '0.5rem' }}>(Current)</span>
                  )}
                </SessionDevice>
                <SessionDetails>
                  {session.location || ''} • {session.lastActive || ''}
                </SessionDetails>
              </SessionInfo>
              <LogoutButton
                style={{ background: '#ff4444', color: '#fff', border: '1px solid #ff4444' }}
                onClick={() => handleLogoutSession(session.id, session.current)}
              >
                Logout
              </LogoutButton>
            </SessionItem>
          ))}
        </ProfileSection>
      </ProfileGrid>

      {/* Account Actions */}
      <div style={{ marginTop: '2rem' }}>
        <ProfileSection>
          <SectionHeader>
            <SectionIcon>
              <FiDownload size={20} />
            </SectionIcon>
            <SectionTitle>Account Actions</SectionTitle>
          </SectionHeader>

          <div style={{ display: 'flex', gap: '1rem', flexWrap: 'wrap' }}>
            <ActionButton
              className="secondary"
              onClick={handleDownloadData}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              <FiDownload size={16} />
              Download My Data
            </ActionButton>
          </div>
        </ProfileSection>
      </div>

      {/* Danger Zone */}
      <DangerZone>
        <DangerTitle>Danger Zone</DangerTitle>
        <p style={{ color: '#8A8A8A', marginBottom: '1rem' }}>
          These actions are irreversible. Please proceed with caution.
        </p>
        
        <ActionButton
          className="danger"
          onClick={handleDeleteAccount}
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
        >
          <FiTrash2 size={16} />
          Delete Account
        </ActionButton>
      </DangerZone>
    </ProfileContainer>
  );
};

export default Profile; 