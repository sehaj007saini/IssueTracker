# India Local Problems OS - Frontend

React + TypeScript + Vite frontend for the civic issue reporting platform.

## Tech Stack

- **React 18** - UI library
- **TypeScript** - Type safety
- **Vite** - Build tool
- **Tailwind CSS** - Styling
- **React Router** - Navigation
- **TanStack Query** - Server state management
- **Axios** - HTTP client
- **Leaflet** - Maps (ready for integration)

## Prerequisites

- **Node.js 18+** (recommended: use nvm or fnm)
- **npm or yarn**

## Installation

```bash
cd frontend
npm install
```

## Development

```bash
npm run dev
```

The app will open at `http://localhost:5173`

The Vite dev server proxies API requests to `http://localhost:8080` (Spring Boot backend).

## Build for Production

```bash
npm run build
```

Built files will be in the `dist/` directory.

## Project Structure

```
src/
├── components/         # Reusable components
│   └── layout/        # Layout components (Header, ProtectedRoute)
├── context/           # React context providers
│   └── AuthContext.tsx
├── pages/             # Page components
│   ├── auth/         # Login, Register
│   ├── citizen/      # Citizen pages
│   └── officer/      # Officer pages
├── services/          # API services
│   ├── api.ts        # Axios instance with interceptors
│   └── authService.ts
├── types/             # TypeScript type definitions
│   ├── user.ts
│   └── issue.ts
├── App.tsx            # Root component with routing
├── main.tsx           # Entry point
└── index.css          # Global styles with Tailwind
```

## Features Implemented

### Authentication
- ✅ Login page
- ✅ Registration page
- ✅ JWT token management
- ✅ Protected routes
- ✅ Auth context with user state

### Citizen Features
- ✅ Home page with call-to-action
- ✅ Report issue page with geolocation and photo upload
- ✅ My reports page (skeleton)
- ✅ Issue detail page (skeleton)

### Officer Features
- ✅ Officer dashboard (skeleton)

### Layouts
- ✅ Header with navigation
- ✅ Protected route wrapper
- ✅ Role-based access control

## Environment Configuration

The app uses Vite's proxy configuration to forward `/api` requests to the backend.

To change the backend URL, edit `vite.config.ts`:

```typescript
server: {
  proxy: {
    '/api': {
      target: 'http://localhost:8080',  // Change this
      changeOrigin: true,
    }
  }
}
```

## Next Steps

1. **Integrate Leaflet Maps**
   - Display issues on interactive map
   - Nearby issues visualization
   - Location picker for reports

2. **Complete Issue Services**
   - Create issue API integration
   - Nearby issues query
   - Issue details fetch
   - Support/verification APIs

3. **Officer Features**
   - Issue assignment
   - Status updates
   - Resolution evidence upload
   - Dashboard with statistics

4. **UI Enhancements**
   - Loading states
   - Error boundaries
   - Toast notifications
   - Image preview
   - Form validation

5. **Testing**
   - Unit tests with Vitest
   - Integration tests
   - E2E tests with Playwright

## Available Scripts

- `npm run dev` - Start development server
- `npm run build` - Build for production
- `npm run lint` - Run ESLint
- `npm run preview` - Preview production build

## Troubleshooting

### Port Already in Use
If port 5173 is in use:
```bash
npm run dev -- --port 3000
```

### API Connection Issues
Ensure the Spring Boot backend is running on `http://localhost:8080`

### CORS Errors
The backend SecurityConfig should allow `http://localhost:5173` in CORS configuration.

## Contributing

1. Create feature branch from `main`
2. Follow existing code structure and naming conventions
3. Use TypeScript strict mode
4. Follow Tailwind CSS utility-first approach
5. Test authentication flows before committing
