const BASE_URL = import.meta.env.VITE_BACKEND_URL || 'http://localhost:5000';

export const registerUser = async (payload) => {
  const res = await fetch(`${BASE_URL}/api/auth/register`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    credentials: 'include',
    body: JSON.stringify(payload)
  });
  return res.json();
};

export const loginUser = async (payload) => {
  const res = await fetch(`${BASE_URL}/api/auth/login`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    credentials: 'include',
    body: JSON.stringify(payload)
  });
  return res.json();
};

export const verifyToken = async () => {
  const res = await fetch(`${BASE_URL}/api/auth/verify`, {
    method: 'GET',
    credentials: 'include'
  });
  return res.json();
};