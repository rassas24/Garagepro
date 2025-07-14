import React, { createContext, useState, useEffect, useContext } from 'react';
import api from '../api';
import toast from 'react-hot-toast';

const BranchContext = createContext();

export const useBranches = () => useContext(BranchContext);

export const BranchProvider = ({ children }) => {
  const [branches, setBranches] = useState([]);
  const [currentBranch, setCurrentBranch] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchBranches = async () => {
      try {
        const { data } = await api.get('/branches');
        setBranches(data);
        if (data.length > 0) {
          setCurrentBranch(data[0]);
        }
      } catch (error) {
        toast.error('Failed to load branches.');
        console.error(error);
      } finally {
        setLoading(false);
      }
    };
    fetchBranches();
  }, []);

  const selectBranch = (branch) => {
    setCurrentBranch(branch);
  };

  const addBranch = (branch) => {
    setBranches(prev => [...prev, branch]);
  }

  const value = {
    branches,
    currentBranch,
    loading,
    selectBranch,
    addBranch,
  };

  return (
    <BranchContext.Provider value={value}>
      {children}
    </BranchContext.Provider>
  );
};