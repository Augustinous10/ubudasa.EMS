import React, { createContext, useContext, useEffect, useState } from 'react';
import axios from 'axios';

const SiteContext = createContext();

export const SiteProvider = ({ children }) => {
  const [sites, setSites] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchSites = async () => {
      setLoading(true);
      setError(null);
      try {
        const res = await axios.get('/api/sites');
        if (res.data && res.data.success) {
          setSites(res.data.data);
        } else {
          setError('Failed to fetch sites');
        }
      } catch (err) {
        console.error('Error fetching sites:', err);
        setError(err.message || 'Error fetching sites');
      } finally {
        setLoading(false);
      }
    };

    fetchSites();
  }, []);

  return (
    <SiteContext.Provider value={{ sites, loading, error }}>
      {children}
    </SiteContext.Provider>
  );
};

export const useSite = () => useContext(SiteContext);
