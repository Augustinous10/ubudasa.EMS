import api from '../../app/api'; // Adjust this path if needed

// Get current active term
export const getCurrentTerm = async () => {
  const res = await api.get('/term-configs/current');
  return res.data.data;
};

// Create a new term configuration
export const createTerm = async (termData) => {
  const res = await api.post('/term-configs', termData);
  return res.data.data;
};

// Get all term configurations
export const getTerms = async () => {
  const res = await api.get('/term-configs');
  return res.data.data;
};
