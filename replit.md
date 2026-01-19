# Daily Clarity

## Overview
Daily Clarity is a minimalist daily check-in app that helps users start their day with intention. One simple question: "What matters most today?" with three choices: Focus, Calm, or Energy. One check-in per calendar day - once completed, the app locks until tomorrow.

## Architecture

### Frontend (React Native + Expo)
- **Location**: `/client`
- **Port**: 8081 (Expo dev server)
- **Stack**: React Native, Expo, React Navigation, AsyncStorage
- **Key Features**:
  - Fully offline functionality using AsyncStorage
  - Stack-only navigation (linear daily flow)
  - Brutalist minimal design with near-monochromatic palette
  - One check-in per calendar day enforcement

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
1. **SplashScreen** - Brief brand moment (0.5s)
2. **QuestionScreen** - "What matters most today?" with 3 choices
3. **ConfirmationScreen** - Shows selected choice
4. **LockedScreen** - Shows when already checked in today
5. **PatternsScreen** - View past check-ins (premium feature gate)

## Key Files

### Frontend
- `client/App.tsx` - Root component with navigation
- `client/navigation/RootStackNavigator.tsx` - Stack navigation setup
- `client/storage/localStorage.ts` - AsyncStorage utilities for entries
- `client/constants/theme.ts` - Colors, spacing, typography
- `client/screens/` - All screen components
- `client/components/ChoiceButton.tsx` - Choice selection button

### Backend
- `backend/manage.py` - Django management script
- `backend/core/settings.py` - Django configuration
- `backend/entries/models.py` - Entry model for PostgreSQL

## Design Guidelines
- **Aesthetic**: Brutally minimal, maximum whitespace
- **Colors**: Near-black (#1A1A1A) on white (#FFFFFF)
- **Typography**: System fonts, specific size scale
- **Memorable Element**: The locked state after daily check-in

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
