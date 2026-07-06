const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';

// Helper function to handle API responses
async function handleResponse(response) {
  const data = await response.json();
  if (!response.ok) {
    throw new Error(data.message || 'Une erreur est survenue');
  }
  return data;
}

// Get auth token from localStorage
function getAuthToken() {
  return localStorage.getItem('token');
}

// Set auth token in localStorage
function setAuthToken(token) {
  localStorage.setItem('token', token);
}

// Remove auth token from localStorage
function removeAuthToken() {
  localStorage.removeItem('token');
}

// API request helper with auth
async function apiRequest(endpoint, options = {}) {
  const token = getAuthToken();
  const headers = {
    'Content-Type': 'application/json',
    ...(token && { Authorization: `Bearer ${token}` }),
    ...options.headers,
  };

  const response = await fetch(`${API_BASE_URL}${endpoint}`, {
    ...options,
    headers,
  });

  return handleResponse(response);
}

// Auth API
export const authAPI = {
  login: async (email, password) => {
    const response = await fetch(`${API_BASE_URL}/auth/login`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email, password }),
    });
    const data = await handleResponse(response);
    if (data.data?.token) {
      setAuthToken(data.data.token);
    }
    return data;
  },

  register: async (userData) => {
    const response = await fetch(`${API_BASE_URL}/auth/register`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(userData),
    });
    return handleResponse(response);
  },

  getProfile: async () => {
    return apiRequest('/auth/profile');
  },

  logout: () => {
    removeAuthToken();
  },
};

// Participants API
export const participantsAPI = {
  register: async (data) => {
    // Si c'est un FormData, ne pas forcer Content-Type (le navigateur gère le boundary)
    const isFormData = data instanceof FormData;
    const response = await fetch(`${API_BASE_URL}/participants/register`, {
      method: 'POST',
      headers: isFormData ? {} : { 'Content-Type': 'application/json' },
      body: isFormData ? data : JSON.stringify(data),
    });
    return handleResponse(response);
  },

  getAll: async (filters = {}) => {
    const params = new URLSearchParams(filters);
    return apiRequest(`/participants?${params}`);
  },

  getById: async (id) => {
    return apiRequest(`/participants/${id}`);
  },

  getByDossier: async (numeroDossier) => {
    const response = await fetch(`${API_BASE_URL}/participants/dossier/${numeroDossier}`);
    return handleResponse(response);
  },

  getByMatricule: async (matricule) => {
    const response = await fetch(`${API_BASE_URL}/participants/matricule/${matricule}`);
    return handleResponse(response);
  },

  getStatistics: async () => {
    const response = await fetch(`${API_BASE_URL}/participants/statistics`);
    return handleResponse(response);
  },

  update: async (id, data) => {
    return apiRequest(`/participants/${id}`, {
      method: 'PUT',
      body: JSON.stringify(data),
    });
  },

  validate: async (id, workshopId, roomId) => {
    return apiRequest(`/participants/${id}/validate`, {
      method: 'POST',
      body: JSON.stringify({ workshop_id: workshopId, room_id: roomId }),
    });
  },

  reject: async (id) => {
    return apiRequest(`/participants/${id}/reject`, {
      method: 'POST',
    });
  },

  delete: async (id) => {
    return apiRequest(`/participants/${id}`, {
      method: 'DELETE',
    });
  },

  uploadPhoto: async (participantId, file) => {
    const token = getAuthToken();
    const formData = new FormData();
    formData.append('photo', file);

    const response = await fetch(`${API_BASE_URL}/upload/photo/${participantId}`, {
      method: 'POST',
      headers: { Authorization: `Bearer ${token}` },
      body: formData,
    });
    return handleResponse(response);
  },

  uploadPaymentProof: async (participantId, file) => {
    const token = getAuthToken();
    const formData = new FormData();
    formData.append('payment_proof', file);

    const response = await fetch(`${API_BASE_URL}/upload/payment/${participantId}`, {
      method: 'POST',
      headers: { Authorization: `Bearer ${token}` },
      body: formData,
    });
    return handleResponse(response);
  },
};

// Admin API
export const adminAPI = {
  getDashboard: async () => {
    return apiRequest('/admin/dashboard');
  },

  getUsers: async () => {
    return apiRequest('/admin/users');
  },

  createUser: async (userData) => {
    return apiRequest('/admin/users', {
      method: 'POST',
      body: JSON.stringify(userData),
    });
  },

  updateUser: async (id, userData) => {
    return apiRequest(`/admin/users/${id}`, {
      method: 'PUT',
      body: JSON.stringify(userData),
    });
  },

  deleteUser: async (id) => {
    return apiRequest(`/admin/users/${id}`, {
      method: 'DELETE',
    });
  },

  getWorkshops: async () => {
    return apiRequest('/admin/workshops');
  },

  createWorkshop: async (workshopData) => {
    return apiRequest('/admin/workshops', {
      method: 'POST',
      body: JSON.stringify(workshopData),
    });
  },

  updateWorkshop: async (id, workshopData) => {
    return apiRequest(`/admin/workshops/${id}`, {
      method: 'PUT',
      body: JSON.stringify(workshopData),
    });
  },

  deleteWorkshop: async (id) => {
    return apiRequest(`/admin/workshops/${id}`, {
      method: 'DELETE',
    });
  },

  getRooms: async () => {
    return apiRequest('/admin/rooms');
  },

  createRoom: async (roomData) => {
    return apiRequest('/admin/rooms', {
      method: 'POST',
      body: JSON.stringify(roomData),
    });
  },

  updateRoom: async (id, roomData) => {
    return apiRequest(`/admin/rooms/${id}`, {
      method: 'PUT',
      body: JSON.stringify(roomData),
    });
  },

  deleteRoom: async (id) => {
    return apiRequest(`/admin/rooms/${id}`, {
      method: 'DELETE',
    });
  },
};

// Export API
export const exportAPI = {
  exportExcel: async (filters = {}) => {
    const params = new URLSearchParams(filters);
    return apiRequest(`/export/excel?${params}`);
  },

  exportPDF: async (filters = {}) => {
    const params = new URLSearchParams(filters);
    return apiRequest(`/export/pdf?${params}`);
  },
};

// Presence API
export const presenceAPI = {
  scan: async (matricule, type, note) => {
    return apiRequest('/presences/scan', {
      method: 'POST',
      body: JSON.stringify({ matricule, type, note }),
    });
  },

  getLive: async () => {
    return apiRequest('/presences/live');
  },

  getHistorique: async (matricule) => {
    return apiRequest(`/presences/historique/${matricule}`);
  },
};

export default { authAPI, participantsAPI, adminAPI, exportAPI, presenceAPI };
