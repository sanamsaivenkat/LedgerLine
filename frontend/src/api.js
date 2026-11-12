
const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:8080/api'

function getToken() {
  return sessionStorage.getItem('ledgerline_token')
}

function parseResponse(text) {
  if (!text) return null

  try {
    return JSON.parse(text)
  } catch {
    return text
  }
}

async function apiRequest(endpoint, options = {}) {
  const token = getToken()

  const response = await fetch(`${API_BASE_URL}${endpoint}`, {
    ...options,
    headers: {
      'Content-Type': 'application/json',
      ...(token ? { Authorization: `Bearer ${token}` } : {}),
      ...options.headers,
    },
  })

  const text = await response.text()
  const data = parseResponse(text)

  if (!response.ok) {
    const message =
      data?.message ||
      data?.detail ||
      data?.error ||
      (typeof data === 'string' ? data : null) ||
      `Request failed (${response.status})`

    throw new Error(message)
  }

  return data
}

export const authApi = {
  async register(email, password) {
    return apiRequest('/auth/register', {
      method: 'POST',
      body: JSON.stringify({ email, password }),
    })
  },

  async login(email, password) {
    const data = await apiRequest('/auth/login', {
      method: 'POST',
      body: JSON.stringify({ email, password }),
    })

    if (data?.accessToken) {
      sessionStorage.setItem('ledgerline_token', data.accessToken)
    }

    return data
  },

  logout() {
    sessionStorage.removeItem('ledgerline_token')
  },
}

export const accountApi = {
  getAccounts() {
    return apiRequest('/accounts')
  },

  createAccount(accountHolderName) {
    return apiRequest('/accounts', {
      method: 'POST',
      body: JSON.stringify({ accountHolderName }),
    })
  },
}

export const transactionApi = {
  deposit(accountId, amount) {
    return apiRequest(`/accounts/${accountId}/deposit`, {
      method: 'POST',
      body: JSON.stringify({ amount: Number(amount) }),
    })
  },

  withdraw(accountId, amount) {
    return apiRequest(`/accounts/${accountId}/withdraw`, {
      method: 'POST',
      body: JSON.stringify({ amount: Number(amount) }),
    })
  },

  getTransactions(accountId) {
    return apiRequest(`/accounts/${accountId}/transactions`)
  },
}

