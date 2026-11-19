import axios from 'axios'

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:8080/api'

export interface ValidateIssueRequest {
  description: string
  latitude: number
  longitude: number
  accuracy?: number
  hasPhoto: boolean
}

export interface FraudCheckResponse {
  isValid: boolean
  score: number
  blockers: string[]
  warnings: string[]
  passedChecks: string[]
  userReputationScore: number
}

/**
 * Validate issue report before submission
 */
export async function validateIssueReport(
  data: ValidateIssueRequest,
  token: string
): Promise<FraudCheckResponse> {
  const response = await axios.post(`${API_BASE_URL}/issues/validate`, data, {
    headers: {
      'Authorization': `Bearer ${token}`,
      'Content-Type': 'application/json'
    }
  })
  return response.data
}

/**
 * Create issue report
 */
export async function createIssueReport(
  formData: FormData,
  token: string
): Promise<any> {
  const response = await axios.post(`${API_BASE_URL}/issues`, formData, {
    headers: {
      'Authorization': `Bearer ${token}`,
      'Content-Type': 'multipart/form-data'
    }
  })
  return response.data
}
