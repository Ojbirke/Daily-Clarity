# Daily Clarity

## Overview
Daily Clarity is a minimalist daily reflection app that helps users build a reflection habit through one simple prompt per day. The app enforces discipline by allowing only one entry per day - once completed, the app locks until midnight.

## Architecture

### Frontend (React Native + Expo)
- **Location**: `/client`
- **Port**: 8081 (Expo dev server)
- **Stack**: React Native, Expo, React Navigation, AsyncStorage
- **Key Features**:
  - Fully offline functionality using AsyncStorage
  - Stack-only navigation (linear daily flow)
  - Brutalist minimal design with near-monochromatic palette

### Backend (Django + DRF)
- **Location**: `/backend`
- **Status**: Stub implementation for future premium sync
- **Stack**: Django, Django REST Framework, PostgreSQL-compatible
- **API Endpoints** (not active in MVP):
  - POST /auth/login
  - POST /auth/register
  - POST /sync/entries
  - GET /stats/summary

## App Flow
1. **SplashScreen** → Brief brand moment (0.5s)
2. **QuestionScreen** → Today's reflection prompt
3. **NoteScreen** → Text entry for response
4. **ConfirmationScreen** → Entry saved confirmation
5. **LockedScreen** → Shows when already completed today
6. **PatternsScreen** → View past entries (premium feature gate)

## Key Files

### Frontend
- `client/App.tsx` - Root component with navigation
- `client/navigation/RootStackNavigator.tsx` - Stack navigation setup
- `client/storage/localStorage.ts` - AsyncStorage utilities for entries
- `client/constants/theme.ts` - Colors, spacing, typography
- `client/screens/` - All screen components

### Backend
- `backend/manage.py` - Django management script
- `backend/core/settings.py` - Django configuration
- `backend/core/urls.py` - URL routing
- `backend/entries/models.py` - Entry model for PostgreSQL

## Design Guidelines
- **Aesthetic**: Brutally minimal, maximum whitespace
- **Colors**: Near-black (#1A1A1A) on white (#FFFFFF)
- **Typography**: System fonts, specific size scale
- **Memorable Element**: The locked state after daily completion

## Development

### Start Frontend
```bash
npm run expo:dev
```

### Start Backend (Django - not needed for MVP)
```bash
cd backend
pip install -r requirements.txt
python manage.py runserver
```

## User Preferences
- Minimal UI with text-light interface
- No authentication required for MVP
- One entry per day enforcement
- Offline-first functionality
