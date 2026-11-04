export interface Issue {
  id: number
  category: string
  description: string
  latitude: number
  longitude: number
  address?: string
  ward?: string
  status: IssueStatus
  severity: Severity
  reportCount: number
  supportCount: number
  distance?: number
  createdAt: string
  updatedAt: string
  photoUrl?: string
  department?: {
    id: number
    name: string
  }
  assignedOfficer?: {
    id: number
    name: string
  }
}

export type IssueStatus = 
  | 'OPEN' 
  | 'ASSIGNED' 
  | 'IN_PROGRESS' 
  | 'RESOLUTION_SUBMITTED' 
  | 'UNDER_VERIFICATION' 
  | 'RESOLVED' 
  | 'REOPENED'

export type Severity = 'LOW' | 'MEDIUM' | 'HIGH' | 'CRITICAL'

export interface IssueDetail extends Issue {
  reports: IssueReport[]
  statusHistory: StatusHistory[]
}

export interface IssueReport {
  id: number
  reportedBy: string
  description: string
  photoUrl?: string
  isPrimary: boolean
  createdAt: string
}

export interface StatusHistory {
  fromStatus?: IssueStatus
  toStatus: IssueStatus
  changedBy: string
  comment?: string
  changedAt: string
}

export interface CreateIssueRequest {
  categoryId: number
  description: string
  latitude: number
  longitude: number
  address?: string
  photo?: File
}

export interface CreateIssueResponse {
  issueId: number
  reportId: number
  status: string
  isDuplicate: boolean
  similarityScore?: number
  message: string
}

export interface NearbyIssuesRequest {
  lat: number
  lng: number
  radius?: number
  category?: number
}
