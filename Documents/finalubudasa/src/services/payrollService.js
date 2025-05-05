let payrolls = [];

export const getPayrolls = async () => {
  return new Promise(resolve => {
    setTimeout(() => resolve(payrolls), 500);
  });
};

export const addPayroll = async (data) => {
  return new Promise(resolve => {
    setTimeout(() => {
      payrolls.push({ id: Date.now(), ...data });
      resolve(true);
    }, 500);
  });
};
