let mockAttendance = [];

export const getAttendance = async () => {
  return new Promise(resolve => {
    setTimeout(() => resolve(mockAttendance), 500);
  });
};

export const addAttendance = async (entry) => {
  return new Promise(resolve => {
    setTimeout(() => {
      mockAttendance.push({ id: Date.now(), ...entry });
      resolve(true);
    }, 500);
  });
};
