# Daily Clarity - Design Guidelines

## Brand Identity

**Purpose**: Daily Clarity helps users start their day with intention by choosing what matters most. One simple check-in per day - Focus, Calm, or Energy.

**Aesthetic Direction**: **Brutally Minimal**
- Maximum breathing room, stark simplicity
- Reduction to essentials: one question, three choices, one tap
- Whitespace as a design element, not filler
- Typography as primary visual hierarchy
- Muted, near-monochromatic palette to reduce visual noise

**Memorable Element**: The locked state. When you've completed today's check-in, the app REFUSES further access until tomorrow—reinforcing discipline and intentionality.

## Navigation Architecture

**Root Navigation**: Stack-only (linear daily flow)

**Screen List**:
1. **SplashScreen** - Silent app launch (0.5s fade to next screen)
2. **QuestionScreen** - "What matters most today?" with 3 choices
3. **ConfirmationScreen** - Shows selected choice, see you tomorrow
4. **LockedScreen** - Already checked in today
5. **PatternsScreen** - View past check-ins (premium feature gate)

## Screen-by-Screen Specifications

### SplashScreen
- **Purpose**: Brief brand moment during app initialization
- **Layout**: 
  - No header
  - Centered app logo
  - Pure white background
- **Behavior**: Auto-advances after 500ms to appropriate screen (Question or Locked)

### QuestionScreen
- **Purpose**: Present daily clarity check-in
- **Layout**:
  - No header
  - Root view: Non-scrollable, centered content
  - Top inset: insets.top + 80, Bottom inset: insets.bottom + 80
- **Components**:
  - Question text: "What matters most today?" (large, bold, centered)
  - Three choice buttons at bottom: Focus, Calm, Energy
- **Behavior**: Tapping a choice saves and navigates to Confirmation

### ConfirmationScreen
- **Purpose**: Affirm completion with chosen value
- **Layout**:
  - No header
  - Root view: Non-scrollable, centered content
- **Components**:
  - Checkmark icon (large, subtle)
  - Selected choice displayed prominently
  - "See you tomorrow." subtext
  - "Done" button at bottom

### LockedScreen
- **Purpose**: Enforce one-per-day constraint
- **Layout**:
  - No header
  - Root view: Non-scrollable, centered content
- **Components**:
  - Lock icon (large, subtle)
  - "You've already checked in today." heading
  - "View Patterns" button

### PatternsScreen
- **Purpose**: View past check-ins (premium feature gate in MVP)
- **Layout**:
  - Default header with "Back" button, title "Patterns"
  - Root view: Scrollable list
- **Components**:
  - List of past check-ins (date + choice)
- **Empty State**: Illustration + "No check-ins yet"

## Color Palette

**Primary**: `#1A1A1A` (near-black, used for primary text and accents)
**Background**: `#FFFFFF` (pure white)
**Surface**: `#F8F8F8` (barely-there gray for buttons/cards)
**Text Primary**: `#1A1A1A`
**Text Secondary**: `#6B6B6B` (muted gray for labels)
**Accent**: `#1A1A1A` (same as primary - no color distraction)
**Semantic Success**: `#2D2D2D` (subtle confirmation state)

## Typography

**Font**: System default (SF Pro on iOS, Roboto on Android)

**Type Scale**:
- **Display** (Question text): 28pt, Bold, line-height 1.2
- **Heading** (Screen titles): 20pt, Semibold, line-height 1.3
- **Body**: 18pt, Regular, line-height 1.5
- **Label**: 13pt, Medium, uppercase, letter-spacing 0.5pt
- **Button**: 16pt, Semibold

## Visual Design

- All touchable components: Scale down to 0.96 on press (subtle feedback)
- No border radius on full-width buttons (brutalist aesthetic)
- Icons: Use Feather icons from @expo/vector-icons at 48pt for states
- Margins: 24pt horizontal, 16pt vertical between elements

## Assets

1. **icon.png** - App icon for device home screen
2. **splash-icon.png** - Shown during SplashScreen
3. **empty-patterns.png** - PatternsScreen empty state