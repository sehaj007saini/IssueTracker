import { MapContainer, TileLayer, Marker, Popup, useMap } from 'react-leaflet'
import MarkerClusterGroup from 'react-leaflet-cluster'
import { Icon } from 'leaflet'
import 'leaflet/dist/leaflet.css'
import { Issue } from '../../types/issue'

interface IssueMapProps {
  issues: Issue[]
  center?: [number, number]
  zoom?: number
  onIssueClick?: (issue: Issue) => void
}

// Custom icons for different issue statuses
const getIssueIcon = (status: string, severity: string) => {
  let color = '#3b82f6' // blue default
  
  switch (status) {
    case 'OPEN':
      color = '#ef4444' // red
      break
    case 'ASSIGNED':
    case 'IN_PROGRESS':
      color = '#f59e0b' // orange
      break
    case 'RESOLVED':
      color = '#10b981' // green
      break
    case 'UNDER_VERIFICATION':
      color = '#8b5cf6' // purple
      break
  }

  return new Icon({
    iconUrl: `https://raw.githubusercontent.com/pointhi/leaflet-color-markers/master/img/marker-icon-2x-${
      color === '#ef4444' ? 'red' :
      color === '#f59e0b' ? 'orange' :
      color === '#10b981' ? 'green' :
      color === '#8b5cf6' ? 'violet' : 'blue'
    }.png`,
    shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-shadow.png',
    iconSize: [25, 41],
    iconAnchor: [12, 41],
    popupAnchor: [1, -34],
    shadowSize: [41, 41]
  })
}

function MapBounds({ issues }: { issues: Issue[] }) {
  const map = useMap()
  
  if (issues.length > 0) {
    const bounds = issues.map(issue => [issue.latitude, issue.longitude] as [number, number])
    map.fitBounds(bounds, { padding: [50, 50] })
  }
  
  return null
}

export default function IssueMap({ issues, center = [12.9716, 77.5946], zoom = 13, onIssueClick }: IssueMapProps) {
  const getSeverityColor = (severity: string) => {
    switch (severity) {
      case 'CRITICAL': return 'text-red-600'
      case 'HIGH': return 'text-orange-600'
      case 'MEDIUM': return 'text-yellow-600'
      case 'LOW': return 'text-green-600'
      default: return 'text-gray-600'
    }
  }

  const getStatusBadge = (status: string) => {
    const statusColors: Record<string, string> = {
      OPEN: 'bg-red-100 text-red-800',
      ASSIGNED: 'bg-blue-100 text-blue-800',
      IN_PROGRESS: 'bg-yellow-100 text-yellow-800',
      RESOLUTION_SUBMITTED: 'bg-purple-100 text-purple-800',
      UNDER_VERIFICATION: 'bg-indigo-100 text-indigo-800',
      RESOLVED: 'bg-green-100 text-green-800',
      REOPENED: 'bg-orange-100 text-orange-800'
    }
    
    return statusColors[status] || 'bg-gray-100 text-gray-800'
  }

  return (
    <MapContainer
      center={center}
      zoom={zoom}
      style={{ height: '600px', width: '100%', borderRadius: '0.5rem' }}
      className="z-0"
    >
      <TileLayer
        attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
        url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
      />
      
      <MarkerClusterGroup
        chunkedLoading
        maxClusterRadius={50}
      >
        {issues.map((issue) => (
          <Marker
            key={issue.id}
            position={[issue.latitude, issue.longitude]}
            icon={getIssueIcon(issue.status, issue.severity)}
            eventHandlers={{
              click: () => onIssueClick?.(issue)
            }}
          >
            <Popup>
              <div className="p-2 min-w-[250px]">
                <div className="flex items-start justify-between mb-2">
                  <h3 className="font-semibold text-gray-900">Issue #{issue.id}</h3>
                  <span className={`text-xs font-medium px-2 py-1 rounded ${getStatusBadge(issue.status)}`}>
                    {issue.status.replace('_', ' ')}
                  </span>
                </div>
                
                <p className="text-sm text-gray-700 mb-2">{issue.description}</p>
                
                <div className="flex items-center gap-2 text-xs text-gray-500 mb-2">
                  <span className={`font-medium ${getSeverityColor(issue.severity)}`}>
                    {issue.severity}
                  </span>
                  <span>•</span>
                  <span>{issue.reportCount} report(s)</span>
                  <span>•</span>
                  <span>{issue.supportCount} support(s)</span>
                </div>
                
                {issue.address && (
                  <p className="text-xs text-gray-500 mb-2">
                    📍 {issue.address}
                  </p>
                )}
                
                {issue.photoUrl && (
                  <img 
                    src={issue.photoUrl} 
                    alt="Issue" 
                    className="w-full h-32 object-cover rounded mt-2"
                  />
                )}
                
                <button
                  onClick={() => onIssueClick?.(issue)}
                  className="mt-2 w-full bg-primary-600 text-white text-sm py-1 px-3 rounded hover:bg-primary-700 transition"
                >
                  View Details
                </button>
              </div>
            </Popup>
          </Marker>
        ))}
      </MarkerClusterGroup>
      
      {issues.length > 0 && <MapBounds issues={issues} />}
    </MapContainer>
  )
}
