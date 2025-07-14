import React, { useState } from 'react';
import { NavLink, useLocation } from 'react-router-dom';
import styled from 'styled-components';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  FiHome, 
  FiVideo, 
  FiUsers, 
  FiCamera, 
  FiBarChart2, 
  FiSettings,
  FiUser,
  FiX,
  FiMenu,
  FiChevronLeft,
  FiChevronRight
} from 'react-icons/fi';
import { useAuth } from '../../context/AuthContext';

const SidebarContainer = styled(motion.aside)`
  background: ${({ theme }) => theme.colors.surface};
  border-right: 1px solid ${({ theme }) => theme.colors.border};
  width: ${({ collapsed }) => collapsed ? '60px' : '240px'};
  height: 100vh;
  position: fixed;
  left: 0;
  top: 0;
  z-index: 20;
  transition: width ${({ theme }) => theme.transitions.normal};
  overflow: hidden;
  
  @media (max-width: ${({ theme }) => theme.breakpoints.md}) {
    transform: translateX(${({ isOpen }) => isOpen ? '0' : '-100%'});
    width: 240px;
  }
`;

const SidebarContent = styled.div`
  height: 100%;
  display: flex;
  flex-direction: column;
  padding: ${({ theme }) => theme.spacing.lg} 0;
`;

const SidebarHeader = styled.div`
  padding: 0 ${({ theme }) => theme.spacing.lg};
  margin-bottom: ${({ theme }) => theme.spacing.xl};
  display: flex;
  align-items: center;
  justify-content: ${({ collapsed }) => collapsed ? 'center' : 'space-between'};
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
  
  .logo-text {
    display: ${({ collapsed }) => collapsed ? 'none' : 'block'};
  }
`;

const ToggleButton = styled.button`
  display: flex;
  align-items: center;
  justify-content: center;
  width: 32px;
  height: 32px;
  background: ${({ theme }) => theme.colors.surfaceHover};
  border: 1px solid ${({ theme }) => theme.colors.border};
  border-radius: ${({ theme }) => theme.borderRadius.md};
  color: ${({ theme }) => theme.colors.textSecondary};
  transition: all ${({ theme }) => theme.transitions.fast};
  
  &:hover {
    border-color: ${({ theme }) => theme.colors.primary};
    color: ${({ theme }) => theme.colors.primary};
  }
  
  @media (max-width: ${({ theme }) => theme.breakpoints.md}) {
    display: none;
  }
`;

const NavMenu = styled.nav`
  flex: 1;
  padding: 0 ${({ theme }) => theme.spacing.lg};
`;

const NavList = styled.ul`
  display: flex;
  flex-direction: column;
  gap: ${({ theme }) => theme.spacing.xs};
`;

const NavItem = styled.li``;

const NavLinkStyled = styled(NavLink)`
  display: flex;
  align-items: center;
  gap: ${({ theme }) => theme.spacing.md};
  padding: ${({ theme }) => theme.spacing.md};
  color: ${({ theme }) => theme.colors.textSecondary};
  border-radius: ${({ theme }) => theme.borderRadius.md};
  transition: all ${({ theme }) => theme.transitions.fast};
  text-decoration: none;
  position: relative;
  
  &:hover {
    background: ${({ theme }) => theme.colors.surfaceHover};
    color: ${({ theme }) => theme.colors.primary};
  }
  
  &.active {
    background: ${({ theme }) => theme.colors.primary}20;
    color: ${({ theme }) => theme.colors.primary};
    border-right: 3px solid ${({ theme }) => theme.colors.primary};
    
    &::before {
      content: '';
      position: absolute;
      left: 0;
      top: 0;
      bottom: 0;
      width: 3px;
      background: ${({ theme }) => theme.colors.primary};
      border-radius: 0 2px 2px 0;
    }
  }
  
  .nav-icon {
    min-width: 20px;
    display: flex;
    align-items: center;
    justify-content: center;
  }
  
  .nav-text {
    display: ${({ collapsed }) => collapsed ? 'none' : 'block'};
    white-space: nowrap;
  }
`;

const SidebarFooter = styled.div`
  padding: ${({ theme }) => theme.spacing.lg};
  border-top: 1px solid ${({ theme }) => theme.colors.border};
  margin-top: auto;
`;

const UserInfo = styled.div`
  display: flex;
  align-items: center;
  gap: ${({ theme }) => theme.spacing.sm};
  color: ${({ theme }) => theme.colors.textSecondary};
  font-size: ${({ theme }) => theme.typography.fontSize.sm};
  
  .user-avatar {
    width: 32px;
    height: 32px;
    border-radius: ${({ theme }) => theme.borderRadius.full};
    object-fit: cover;
  }
  
  .user-details {
    display: ${({ collapsed }) => collapsed ? 'none' : 'block'};
    flex: 1;
  }
  
  .user-name {
    font-weight: ${({ theme }) => theme.typography.fontWeight.medium};
    color: ${({ theme }) => theme.colors.textPrimary};
  }
  
  .user-role {
    font-size: ${({ theme }) => theme.typography.fontSize.xs};
    color: ${({ theme }) => theme.colors.textMuted};
    text-transform: capitalize;
  }
`;

const Overlay = styled(motion.div)`
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: ${({ theme }) => theme.colors.backdrop};
  z-index: 15;
  
  @media (min-width: ${({ theme }) => theme.breakpoints.md}) {
    display: none;
  }
`;

const Sidebar = ({ isOpen, onClose }) => {
  const { user } = useAuth();
  const location = useLocation();
  const [collapsed, setCollapsed] = useState(false);

  const navigationItems = [
    { name: 'Dashboard', href: '/dashboard', icon: FiHome },
    { name: 'Recordings', href: '/recordings', icon: FiVideo },
    { name: 'Customers', href: '/customers', icon: FiUsers },
    { name: 'Cameras', href: '/cameras', icon: FiCamera },
    // Add Branch Cameras button after Cameras
    { name: 'Branch Cameras', href: '/branch-cameras', icon: FiCamera },
    ...(user?.role === 'admin' ? [
      { name: 'Reports', href: '/reports', icon: FiBarChart2 },
      { name: 'Settings Console', href: '/settings-console', icon: FiSettings }
    ] : []),
    { name: 'Settings', href: '/settings', icon: FiSettings },
    { name: 'Profile', href: '/profile', icon: FiUser },
  ];

  return (
    <>
      <SidebarContainer
        collapsed={collapsed}
        isOpen={isOpen}
        initial={false}
        animate={{ x: isOpen ? 0 : -240 }}
        transition={{ duration: 0.3 }}
      >
        <SidebarContent>
          <SidebarHeader>
            <Logo collapsed={collapsed}>
              <span className="logo-icon">🔧</span>
              <span className="logo-text">GaragePro</span>
            </Logo>
            <ToggleButton onClick={() => setCollapsed(!collapsed)}>
              {collapsed ? <FiChevronRight size={16} /> : <FiChevronLeft size={16} />}
            </ToggleButton>
          </SidebarHeader>

          <NavMenu>
            <NavList>
              {navigationItems.map((item) => (
                <NavItem key={item.href}>
                  <NavLinkStyled
                    to={item.href}
                    collapsed={collapsed}
                    className={location.pathname === item.href ? 'active' : ''}
                  >
                    <span className="nav-icon">
                      <item.icon size={20} />
                    </span>
                    <span className="nav-text">{item.name}</span>
                  </NavLinkStyled>
                </NavItem>
              ))}
            </NavList>
          </NavMenu>

          <SidebarFooter>
            <UserInfo collapsed={collapsed}>
              <img 
                src={user?.avatar} 
                alt={user?.name} 
                className="user-avatar"
              />
              <div className="user-details">
                <div className="user-name">{user?.name}</div>
                <div className="user-role">{user?.role}</div>
              </div>
            </UserInfo>
          </SidebarFooter>
        </SidebarContent>
      </SidebarContainer>

      <AnimatePresence>
        {isOpen && (
          <Overlay
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
          />
        )}
      </AnimatePresence>
    </>
  );
};

export default Sidebar; 