// src/context/SiteManagerContext.jsx
import React, { createContext, useContext, useState } from 'react';

const SiteManagerContext = createContext();

export const useSiteManager = () => useContext(SiteManagerContext);

export const SiteManagerProvider = ({ children }) => {
  const [siteManagers, setSiteManagers] = useState([]);

  const addSiteManager = (manager) => {
    setSiteManagers(prev => [...prev, { id: Date.now(), ...manager }]);
  };

  const removeSiteManager = (id) => {
    setSiteManagers(prev => prev.filter(m => m.id !== id));
  };

  return (
    <SiteManagerContext.Provider value={{ siteManagers, addSiteManager, removeSiteManager }}>
      {children}
    </SiteManagerContext.Provider>
  );
};
