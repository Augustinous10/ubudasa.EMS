// src/context/SiteManagerContext.js
import React, { createContext, useContext, useState, useEffect } from 'react';

const SiteManagerContext = createContext();

export const useSiteManager = () => useContext(SiteManagerContext);

export const SiteManagerProvider = ({ children }) => {
  const [siteManagers, setSiteManagers] = useState([]);

  useEffect(() => {
    const stored = JSON.parse(localStorage.getItem('siteManagers')) || [];
    setSiteManagers(stored);
  }, []);

  const addSiteManager = (manager) => {
    const updated = [...siteManagers, manager];
    setSiteManagers(updated);
    localStorage.setItem('siteManagers', JSON.stringify(updated));
  };

  return (
    <SiteManagerContext.Provider value={{ siteManagers, addSiteManager }}>
      {children}
    </SiteManagerContext.Provider>
  );
};
