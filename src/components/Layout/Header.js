import React, { useState } from 'react';
import styled from 'styled-components';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  FiChevronDown, 
  FiSettings, 
  FiLogOut, 
  FiUser,
  FiMapPin,
  FiMenu,
  FiCamera
} from 'react-icons/fi';
import { useAuth } from '../../context/AuthContext';
import { Link, useNavigate } from 'react-router-dom';
import { useBranches } from '../../context/BranchContext';

const HeaderContainer = styled.header`
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

const LeftSection = styled.div`
  display: flex;
  align-items: center;
  gap: ${({ theme }) => theme.spacing.lg};
`;

const Logo = styled.div`
  display: flex;
  align-items: center;
  gap: ${({ theme }) => theme.spacing.sm};
  font-size: ${({ theme }) => theme.typography.fontSize.xl};
  font-weight: ${({ theme }) => theme.typography.fontWeight.bold};
  color: ${({ theme }) => theme.colors.primary};
  
  .logo-icon {
    font-size: 1.5em;
    color: ${({ theme }) => theme.colors.primary};
  }
`;

const BranchSelector = styled.div`
  position: relative;
`;

const BranchButton = styled.button`
  display: flex;
  align-items: center;
  gap: ${({ theme }) => theme.spacing.sm};
  background: ${({ theme }) => theme.colors.surfaceHover};
  border: 1px solid ${({ theme }) => theme.colors.border};
  border-radius: ${({ theme }) => theme.borderRadius.md};
  padding: ${({ theme }) => theme.spacing.sm} ${({ theme }) => theme.spacing.md};
  color: ${({ theme }) => theme.colors.textSecondary};
  font-size: ${({ theme }) => theme.typography.fontSize.sm};
  transition: all ${({ theme }) => theme.transitions.fast};
  
  &:hover {
    border-color: ${({ theme }) => theme.colors.primary};
    color: ${({ theme }) => theme.colors.primary};
  }
`;

const AddBranchButton = styled.button`
  display: flex;
  align-items: center;
  gap: 4px;
  background: ${({ theme }) => theme.colors.surfaceHover};
  border: 1px solid ${({ theme }) => theme.colors.primary};
  border-radius: ${({ theme }) => theme.borderRadius.md};
  padding: 6px 12px;
  color: ${({ theme }) => theme.colors.primary};
  font-size: 0.95em;
  font-weight: 500;
  cursor: pointer;
  transition: all 0.15s;
  &:hover {
    background: ${({ theme }) => theme.colors.primary}20;
  }
`;

const AddCameraButton = styled.button`
  display: flex;
  align-items: center;
  gap: 4px;
  background: ${({ theme }) => theme.colors.surfaceHover};
  border: 1px solid ${({ theme }) => theme.colors.secondary};
  border-radius: ${({ theme }) => theme.borderRadius.md};
  padding: 6px 12px;
  color: ${({ theme }) => theme.colors.secondary};
  font-size: 0.95em;
  font-weight: 500;
  cursor: pointer;
  transition: all 0.15s;
  &:hover {
    background: ${({ theme }) => theme.colors.secondary}20;
  }
`;

const Dropdown = styled(motion.div)`
  position: absolute;
  top: 100%;
  left: 0;
  right: 0;
  background: ${({ theme }) => theme.colors.surface};
  border: 1px solid ${({ theme }) => theme.colors.border};
  border-radius: ${({ theme }) => theme.borderRadius.md};
  box-shadow: ${({ theme }) => theme.shadows.lg};
  z-index: ${({ theme }) => theme.zIndex.dropdown};
  margin-top: ${({ theme }) => theme.spacing.xs};
`;

const DropdownItem = styled.button`
  width: 100%;
  padding: ${({ theme }) => theme.spacing.sm} ${({ theme }) => theme.spacing.md};
  text-align: left;
  color: ${({ theme }) => theme.colors.textSecondary};
  transition: all ${({ theme }) => theme.transitions.fast};
  
  &:hover {
    background: ${({ theme }) => theme.colors.surfaceHover};
    color: ${({ theme }) => theme.colors.primary};
  }
`;

const RightSection = styled.div`
  display: flex;
  align-items: center;
  gap: ${({ theme }) => theme.spacing.md};
`;

const UserMenu = styled.div`
  position: relative;
`;

const UserButton = styled.button`
  display: flex;
  align-items: center;
  gap: ${({ theme }) => theme.spacing.sm};
  background: ${({ theme }) => theme.colors.surfaceHover};
  border: 1px solid ${({ theme }) => theme.colors.border};
  border-radius: ${({ theme }) => theme.borderRadius.md};
  padding: ${({ theme }) => theme.spacing.sm} ${({ theme }) => theme.spacing.md};
  color: ${({ theme }) => theme.colors.textSecondary};
  transition: all ${({ theme }) => theme.transitions.fast};
  
  &:hover {
    border-color: ${({ theme }) => theme.colors.primary};
    color: ${({ theme }) => theme.colors.primary};
  }
`;

const UserAvatar = styled.img`
  width: 32px;
  height: 32px;
  border-radius: ${({ theme }) => theme.borderRadius.full};
  object-fit: cover;
`;

const UserDropdown = styled(motion.div)`
  position: absolute;
  top: 100%;
  right: 0;
  background: ${({ theme }) => theme.colors.surface};
  border: 1px solid ${({ theme }) => theme.colors.border};
  border-radius: ${({ theme }) => theme.borderRadius.md};
  box-shadow: ${({ theme }) => theme.shadows.lg};
  z-index: ${({ theme }) => theme.zIndex.dropdown};
  margin-top: ${({ theme }) => theme.spacing.xs};
  min-width: 200px;
`;

const UserDropdownItem = styled.button`
  width: 100%;
  display: flex;
  align-items: center;
  gap: ${({ theme }) => theme.spacing.sm};
  padding: ${({ theme }) => theme.spacing.sm} ${({ theme }) => theme.spacing.md};
  text-align: left;
  color: ${({ theme }) => theme.colors.textSecondary};
  transition: all ${({ theme }) => theme.transitions.fast};
  
  &:hover {
    background: ${({ theme }) => theme.colors.surfaceHover};
    color: ${({ theme }) => theme.colors.primary};
  }
  
  &.danger {
    color: ${({ theme }) => theme.colors.error};
    
    &:hover {
      background: ${({ theme }) => theme.colors.error}20;
      color: ${({ theme }) => theme.colors.error};
    }
  }
`;

const ViewAllHistoryButton = styled.button`
  margin-left: ${({ theme }) => theme.spacing.md};
  padding: 6px 16px;
  border-radius: ${({ theme }) => theme.borderRadius.md};
  border: 1px solid ${({ theme }) => theme.colors.info};
  background: ${({ theme }) => theme.colors.surfaceHover};
  color: ${({ theme }) => theme.colors.info};
  font-weight: 500;
  font-size: 1rem;
  cursor: pointer;
  transition: all 0.15s;
  &:hover {
    background: ${({ theme }) => theme.colors.info}20;
  }
`;

const MobileMenuButton = styled.button`
  display: none;
  align-items: center;
  justify-content: center;
  width: 40px;
  height: 40px;
  background: ${({ theme }) => theme.colors.surfaceHover};
  border: 1px solid ${({ theme }) => theme.colors.border};
  border-radius: ${({ theme }) => theme.borderRadius.md};
  color: ${({ theme }) => theme.colors.textSecondary};
  
  @media (max-width: ${({ theme }) => theme.breakpoints.md}) {
    display: flex;
  }
`;

const Header = ({ onMobileMenuToggle }) => {
  const { user, logout } = useAuth();
  const { branches, currentBranch, selectBranch, loading } = useBranches();
  const [branchDropdownOpen, setBranchDropdownOpen] = useState(false);
  const [userDropdownOpen, setUserDropdownOpen] = useState(false);
  const navigate = useNavigate();

  const handleBranchSelect = (branch) => {
    selectBranch(branch);
    setBranchDropdownOpen(false);
    navigate(`/dashboard/branch/${branch.id}`);
  };

  return (
    <HeaderContainer>
      <LeftSection>
        <MobileMenuButton onClick={onMobileMenuToggle}>
          <FiMenu size={20} />
        </MobileMenuButton>
        
        {/* Make logo clickable */}
        <Logo as={Link} to="/">
          <span className="logo-icon">🔧</span>
          GaragePro
        </Logo>
        
        <BranchSelector>
          <BranchButton onClick={() => setBranchDropdownOpen(!branchDropdownOpen)}>
            <FiMapPin size={16} />
            {loading ? 'Loading...' : currentBranch?.name || 'Select Branch'}
            <FiChevronDown size={16} />
          </BranchButton>
          <AnimatePresence>
            {branchDropdownOpen && (
              <Dropdown
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                transition={{ duration: 0.2 }}
              >
                {branches.map((branch) => (
                  <DropdownItem key={branch.id} onClick={() => handleBranchSelect(branch)}>
                    <div>
                      <div style={{ fontWeight: 500 }}>{branch.name}</div>
                      <div style={{ fontSize: '0.75rem', color: '#8A8A8A' }}>
                        {branch.address}
                      </div>
                    </div>
                  </DropdownItem>
                ))}
              </Dropdown>
            )}
          </AnimatePresence>
        </BranchSelector>
        <ViewAllHistoryButton
          onClick={() => navigate(currentBranch.id ? `/dashboard/branch/${currentBranch.id}/history` : '/dashboard/history')}
        >
          View All History
        </ViewAllHistoryButton>
      </LeftSection>

      <RightSection>
        <AddCameraButton type="button" onClick={() => navigate('/cameras/new')}>
          <FiCamera size={16} />
          Camera
        </AddCameraButton>
        <AddBranchButton type="button" onClick={() => navigate('/branches/new')}>
          + Branch
        </AddBranchButton>
        <UserMenu>
          <UserButton onClick={() => setUserDropdownOpen(!userDropdownOpen)}>
            <UserAvatar src={user?.avatar} alt={user?.name} />
            <span>{user?.name}</span>
            <FiChevronDown size={16} />
          </UserButton>
          
          <AnimatePresence>
            {userDropdownOpen && (
              <UserDropdown
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                transition={{ duration: 0.2 }}
              >
                <UserDropdownItem onClick={() => { navigate('/profile'); setUserDropdownOpen(false); }}>
                  <FiUser size={16} />
                  Profile
                </UserDropdownItem>
                <UserDropdownItem onClick={() => { navigate('/settings'); setUserDropdownOpen(false); }}>
                  <FiSettings size={16} />
                  Settings
                </UserDropdownItem>
                <UserDropdownItem className="danger" onClick={logout}>
                  <FiLogOut size={16} />
                  Logout
                </UserDropdownItem>
              </UserDropdown>
            )}
          </AnimatePresence>
        </UserMenu>
      </RightSection>
    </HeaderContainer>
  );
};

export default Header; 