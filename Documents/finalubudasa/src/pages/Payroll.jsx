import React, { useEffect, useState, useCallback } from 'react';
import payrollApi from '../api/payrollApi';
import { fetchSiteManagers } from '../api/SiteManagerAPI';
import './payroll.css';

const ITEMS_PER_PAGE = 5;

const PayrollDashboard = () => {
  const [unpaidEmployees, setUnpaidEmployees] = useState([]);
  const [paymentHistory, setPaymentHistory] = useState([]);
  const [selectedPayments, setSelectedPayments] = useState([]);
  const [siteManagers, setSiteManagers] = useState([]);

  const [filters, setFilters] = useState({
    siteManagerId: '',
    startDate: '',
    endDate: '',
  });

  const [unpaidPage, setUnpaidPage] = useState(1);
  const [historyPage, setHistoryPage] = useState(1);
  const [loadingUnpaid, setLoadingUnpaid] = useState(false);
  const [loadingHistory, setLoadingHistory] = useState(false);

  useEffect(() => {
    const loadManagers = async () => {
      try {
        const response = await fetchSiteManagers();
        if (Array.isArray(response)) setSiteManagers(response);
        else if (response?.siteManagers) setSiteManagers(response.siteManagers);
        else setSiteManagers([]);
      } catch (err) {
        console.error('Error loading site managers:', err);
        setSiteManagers([]);
      }
    };
    loadManagers();
  }, []);

  const isValidDate = (dateStr) => !isNaN(new Date(dateStr).getTime());

  const fetchUnpaid = useCallback(async () => {
    if (
      !filters.siteManagerId ||
      !filters.startDate ||
      !filters.endDate ||
      !isValidDate(filters.startDate) ||
      !isValidDate(filters.endDate)
    ) {
      setUnpaidEmployees([]);
      return;
    }
    setLoadingUnpaid(true);
    try {
      const response = await payrollApi.fetchUnpaid(filters);
      setUnpaidEmployees(response || []);
    } catch (err) {
      console.error('Error fetching unpaid employees:', err);
      setUnpaidEmployees([]);
    } finally {
      setLoadingUnpaid(false);
    }
  }, [filters]);

  const fetchHistory = useCallback(async () => {
    if (
      !filters.siteManagerId ||
      !filters.startDate ||
      !filters.endDate ||
      !isValidDate(filters.startDate) ||
      !isValidDate(filters.endDate)
    ) {
      setPaymentHistory([]);
      return;
    }
    setLoadingHistory(true);
    try {
      const response = await payrollApi.fetchHistory(filters);

      // Debug log to check for duplicates:
      console.log('Fetched payment history:', response);

      setPaymentHistory(response || []);
    } catch (err) {
      console.error('Error fetching payment history:', err);
      setPaymentHistory([]);
    } finally {
      setLoadingHistory(false);
    }
  }, [filters]);

  // Reset pagination and selections when filters change
  useEffect(() => {
    setUnpaidPage(1);
    setHistoryPage(1);
    setSelectedPayments([]);
  }, [filters]);

  // Selection logic remains same
  const isGroupSelected = (group) =>
    group.dates.every((date) =>
      selectedPayments.some(
        (p) => p.employeeId === group.employee._id && p.date === date
      )
    );

  const togglePaymentSelection = (group) => {
    if (isGroupSelected(group)) {
      setSelectedPayments((prev) =>
        prev.filter((p) => p.employeeId !== group.employee._id)
      );
    } else {
      const newPayments = group.dates.map((date) => ({
        employeeId: group.employee._id,
        siteManager: filters.siteManagerId,
        date,
        amount: group.dailySalary,
      }));
      setSelectedPayments((prev) => [...prev, ...newPayments]);
    }
  };

  const markSelectedAsPaid = async () => {
    if (!selectedPayments.length) return alert('No payments selected');
    try {
      await payrollApi.markAsPaid(selectedPayments);
      alert('Payments marked as paid.');
      setSelectedPayments([]);
      fetchUnpaid();
      fetchHistory();
    } catch (err) {
      console.error('Error marking selected payments as paid:', err);
      alert('Failed to mark selected payments as paid.');
    }
  };

  const markGroupAsPaid = async (group) => {
    const payments = group.dates.map((date) => ({
      employeeId: group.employee._id,
      siteManager: filters.siteManagerId,
      date,
      amount: group.dailySalary,
    }));
    try {
      await payrollApi.markAsPaid(payments);
      alert(`${group.employee.name}'s payment marked as paid.`);
      fetchUnpaid();
      fetchHistory();
      setSelectedPayments((prev) =>
        prev.filter((p) => p.employeeId !== group.employee._id)
      );
    } catch (err) {
      console.error('Error marking group payment:', err);
      alert('Failed to mark group as paid.');
    }
  };

  const totalSelectedAmount = selectedPayments.reduce(
    (sum, p) => sum + (p.amount || 0),
    0
  );

  // Frontend pagination slices data only - no fetch on page change
  const paginatedUnpaid = unpaidEmployees.slice(
    (unpaidPage - 1) * ITEMS_PER_PAGE,
    unpaidPage * ITEMS_PER_PAGE
  );
  const unpaidTotalPages = Math.ceil(unpaidEmployees.length / ITEMS_PER_PAGE);

  const paginatedHistory = paymentHistory.slice(
    (historyPage - 1) * ITEMS_PER_PAGE,
    historyPage * ITEMS_PER_PAGE
  );
  const historyTotalPages = Math.ceil(paymentHistory.length / ITEMS_PER_PAGE);

  return (
    <div className="payroll-dashboard">
      <h1>Payroll Dashboard</h1>

      <div className="filter-form">
        <select
          value={filters.siteManagerId}
          onChange={(e) =>
            setFilters({ ...filters, siteManagerId: e.target.value })
          }
        >
          <option value="">Select Site Manager</option>
          {siteManagers.map((sm) => (
            <option key={sm._id} value={sm._id}>
              {sm.name} ({sm.email})
            </option>
          ))}
        </select>

        <input
          type="date"
          value={filters.startDate}
          onChange={(e) =>
            setFilters({ ...filters, startDate: e.target.value })
          }
        />
        <input
          type="date"
          value={filters.endDate}
          onChange={(e) =>
            setFilters({ ...filters, endDate: e.target.value })
          }
        />
        <button
          className="btn fetch"
          onClick={() => {
            fetchUnpaid();
            fetchHistory();
          }}
          disabled={
            !filters.siteManagerId ||
            !filters.startDate ||
            !filters.endDate ||
            !isValidDate(filters.startDate) ||
            !isValidDate(filters.endDate)
          }
        >
          Fetch Data
        </button>
      </div>

      <section className="unpaid-section">
        <h2>Unpaid Employees</h2>

        {loadingUnpaid ? (
          <p>Loading unpaid data...</p>
        ) : !filters.siteManagerId || !filters.startDate || !filters.endDate ? (
          <p>Please select site manager and date range to view unpaid data.</p>
        ) : paginatedUnpaid.length === 0 ? (
          <p>No unpaid records found for selected filters.</p>
        ) : (
          <div className="table-responsive">
            <table>
              <thead>
                <tr>
                  <th>Select</th>
                  <th>Name</th>
                  <th>Days Attended</th>
                  <th>Daily Salary</th>
                  <th>Total Amount</th>
                  <th>Unpaid Dates</th>
                  <th>Action</th>
                </tr>
              </thead>
              <tbody>
                {paginatedUnpaid.map((group) => (
                  <tr key={group.employee._id}>
                    <td>
                      <input
                        type="checkbox"
                        checked={isGroupSelected(group)}
                        onChange={() => togglePaymentSelection(group)}
                      />
                    </td>
                    <td>{group.employee.name}</td>
                    <td>{group.daysAttended}</td>
                    <td>{group.dailySalary?.toFixed(2) ?? '-'}</td>
                    <td>{group.totalAmount?.toFixed(2) ?? '-'}</td>
                    <td>
                      {group.dates
                        .map((date) => new Date(date).toLocaleDateString())
                        .join(', ')}
                    </td>
                    <td>
                      <button
                        className="btn pay"
                        onClick={() => markGroupAsPaid(group)}
                      >
                        Pay All
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}

        {unpaidTotalPages > 1 && (
          <div className="pagination">
            <button
              disabled={unpaidPage === 1}
              onClick={() => setUnpaidPage(unpaidPage - 1)}
            >
              Previous
            </button>
            <span>
              Page {unpaidPage} of {unpaidTotalPages}
            </span>
            <button
              disabled={unpaidPage === unpaidTotalPages}
              onClick={() => setUnpaidPage(unpaidPage + 1)}
            >
              Next
            </button>
          </div>
        )}

        <button
          className="btn mark"
          onClick={markSelectedAsPaid}
          disabled={!selectedPayments.length}
        >
          Mark Selected as Paid
        </button>

        {selectedPayments.length > 0 && (
          <div className="total-amount">
            Total to pay selected: {totalSelectedAmount.toFixed(2)}
          </div>
        )}
      </section>

      <section className="history-section">
        <h2>Payment History</h2>
        {loadingHistory ? (
          <p>Loading payment history...</p>
        ) : paymentHistory.length === 0 ? (
          <p>No payment history available.</p>
        ) : (
          <div className="table-responsive">
            <table>
              <thead>
                <tr>
                  <th>Name</th>
                  <th>Date</th>
                  <th>Amount</th>
                  <th>Paid At</th>
                </tr>
              </thead>
              <tbody>
                {paginatedHistory.map((record) => {
                  // Generate a unique key if _id is missing
                  const uniqueKey = record._id
                    ? record._id
                    : `${record.employee?._id ?? 'unknown'}-${record.date}-${record.salary}-${record.paidAt}`;

                  return (
                    <tr key={uniqueKey}>
                      <td>{record.employee?.name ?? 'Unknown'}</td>
                      <td>{record.date ? new Date(record.date).toLocaleDateString() : 'N/A'}</td>
                      <td>{record.totalAmount?.toFixed?.(2) ?? record.salary ?? 'N/A'}</td>
                      <td>{record.paidAt ? new Date(record.paidAt).toLocaleString() : 'N/A'}</td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        )}

        {historyTotalPages > 1 && (
          <div className="pagination">
            <button
              disabled={historyPage === 1}
              onClick={() => setHistoryPage(historyPage - 1)}
            >
              Previous
            </button>
            <span>
              Page {historyPage} of {historyTotalPages}
            </span>
            <button
              disabled={historyPage === historyTotalPages}
              onClick={() => setHistoryPage(historyPage + 1)}
            >
              Next
            </button>
          </div>
        )}
      </section>
    </div>
  );
};

export default PayrollDashboard;
