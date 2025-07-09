import React, { createContext, useState, useContext, useEffect } from 'react';

// Create the context
const DoctorContext = createContext();

// Create a provider component
export const DoctorProvider = ({ children }) => {
  const [doctorId, setDoctorId] = useState(null);
  const [doctorData, setDoctorData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    // Load doctor ID from localStorage on mount
    try {
      const userStr = localStorage.getItem('user');
      if (userStr) {
        const userData = JSON.parse(userStr);
        const id = userData.doctorId || userData.id;
        
        if (id) {
          console.log('DoctorContext: Found doctor ID in localStorage:', id);
          setDoctorId(id);
          setDoctorData(userData);
        } else {
          console.warn('DoctorContext: No doctor ID found in user data');
          setError('No doctor ID found in user data');
        }
      } else {
        console.warn('DoctorContext: No user data found in localStorage');
        setError('No user data found');
      }
    } catch (err) {
      console.error('DoctorContext: Error loading doctor data:', err);
      setError('Error loading doctor data: ' + err.message);
    } finally {
      setLoading(false);
    }
  }, []);

  // Method to manually update the doctor ID
  const updateDoctorId = (id) => {
    setDoctorId(id);
  };

  return (
    <DoctorContext.Provider 
      value={{ 
        doctorId, 
        doctorData, 
        loading, 
        error,
        updateDoctorId 
      }}
    >
      {children}
    </DoctorContext.Provider>
  );
};

// Custom hook to use the doctor context
export const useDoctor = () => {
  const context = useContext(DoctorContext);
  if (!context) {
    throw new Error('useDoctor must be used within a DoctorProvider');
  }
  return context;
};
