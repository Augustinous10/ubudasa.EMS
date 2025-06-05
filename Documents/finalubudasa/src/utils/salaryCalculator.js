// src/utils/salaryCalculator.js

/**
 * Calculates total days attended and total amount for each employee
 * @param {Array} attendanceData - Array of attendance records, each containing employeeId, name, dailySalary
 * @returns {Array} - Array of objects with employeeId, name, dailySalary, totalDaysAttended, totalAmount
 */
const calculateSalaryDetails = (attendanceData) => {
  const grouped = {};

  attendanceData.forEach((record) => {
    const { employeeId, name, dailySalary } = record;

    if (!grouped[employeeId]) {
      grouped[employeeId] = {
        employeeId,
        name,
        dailySalary,
        totalDaysAttended: 0,
      };
    }

    grouped[employeeId].totalDaysAttended += 1;
  });

  // Convert grouped object to array and calculate total amount
  return Object.values(grouped).map(emp => ({
    ...emp,
    totalAmount: emp.dailySalary * emp.totalDaysAttended,
  }));
};

export default calculateSalaryDetails;
