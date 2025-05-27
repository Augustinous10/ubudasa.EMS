const API_URL = 'http://localhost:5000/api/attendance';

async function handleResponse(res) {
  if (!res.ok) {
    const error = await res.json().catch(() => ({}));
    throw new Error(error.error || 'API request failed');
  }
  return res.json();
}

// Get all attendance records
export async function getAllAttendance() {
  const res = await fetch(API_URL);
  return handleResponse(res);
}

// Get attendance by date (YYYY-MM-DD)
export async function getAttendanceByDate(date) {
  const res = await fetch(`${API_URL}/date/${date}`);
  return handleResponse(res);
}

// Get attendance by employee ID
export async function getAttendanceByEmployee(employeeId) {
  const res = await fetch(`${API_URL}/employee/${employeeId}`);
  return handleResponse(res);
}

// Get attendance by site manager ID
export async function getAttendanceBySiteManager(siteManagerId) {
  const res = await fetch(`${API_URL}/manager/${siteManagerId}`);
  return handleResponse(res);
}

// Get filtered attendance by date and/or site manager ID
export async function getAttendanceByFilter(date, siteManagerId) {
  const url = new URL(`${API_URL}/filter`, window.location.origin);
  if (date) url.searchParams.append('date', date);
  if (siteManagerId) url.searchParams.append('siteManagerId', siteManagerId);

  const res = await fetch(url);
  return handleResponse(res);
}

// Create a new attendance sheet
export async function createAttendanceSheet(data) {
  const res = await fetch(API_URL, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(data),
  });
  return handleResponse(res);
}

// Finalize attendance with group image upload (expects FormData)
export async function finalizeAttendance(formData) {
  const res = await fetch(`${API_URL}/finalize`, {
    method: 'POST',
    body: formData,
  });
  return handleResponse(res);
}

// Mark attendance payment as paid for an employee
export async function markAttendancePaid(attendanceId, employeeId) {
  const res = await fetch(`${API_URL}/${attendanceId}/mark-paid/${employeeId}`, {
    method: 'PATCH',
  });
  return handleResponse(res);
}

// Get today's attendance for logged-in manager
export async function getTodayAttendanceForManager() {
  const res = await fetch(`${API_URL}/today`, {
    credentials: 'include',
  });
  return handleResponse(res);
}

// Get combined attendance and report for siteManagerId and date
export async function getCombinedAttendanceAndReport(siteManagerId, date) {
  const url = new URL(`${API_URL}/combined`, window.location.origin);
  url.searchParams.append('siteManagerId', siteManagerId);
  url.searchParams.append('date', date);

  const res = await fetch(url);
  return handleResponse(res);
}
