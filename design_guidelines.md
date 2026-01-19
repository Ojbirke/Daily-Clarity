# Daily Clarity - Design Guidelines

## Brand Identity

**Purpose**: Daily Clarity helps users build a reflection habit through one simple prompt per day. It's a sanctuary from notification overload—calm, intentional, and focused.

**Aesthetic Direction**: **Brutally Minimal**
- Maximum breathing room, stark simplicity
- Reduction to essentials: one question, one text field, one action
- Whitespace as a design element, not filler
- Typography as primary visual hierarchy
- Muted, near-monochromatic palette to reduce visual noise

**Memorable Element**: The locked state. When you've completed today's entry, the app REFUSES further access until tomorrow—reinforcing discipline and preventing rumination.

## Navigation Architecture

**Root Navigation**: Stack-only (linear daily flow)

**Screen List**:
1. **SplashScreen** - Silent app launch (0.5s fade to next screen)
2. **QuestionScreen** - Today's reflection prompt
3. **NoteScreen** - Text entry for response
4. **ConfirmationScreen** - Entry saved, see you tomorrow
5. **LockedScreen** - Already completed today (shows tomorrow's unlock time)
6. **PatternsScreen** - Premium feature (view past entries in calendar/list)

## Screen-by-Screen Specifications

### SplashScreen
- **Purpose**: Brief brand moment during app initialization
- **Layout**: 
  - No header
  - Centered app logo (generated asset: splash-icon.png)
  - Pure white background
  - Top inset: 0, Bottom inset: 0
- **Behavior**: Auto-advances after 500ms to appropriate screen (Question or Locked)

### QuestionScreen
- **Purpose**: Present today's reflection prompt
- **Layout**:
  - No header
  - Root view: Non-scrollable, centered content
  - Top inset: insets.top + 80, Bottom inset: insets.bottom + 80
- **Components**:
  - Date label (small, uppercase, muted) at top
  - Question text (large, bold, centered)
  - Single "Reflect" button at bottom (full-width minus margins)
- **Empty State**: N/A

### NoteScreen
- **Purpose**: Capture user's written response
- **Layout**:
  - Transparent header with "Cancel" left button
  - Root view: Non-scrollable
  - Top inset: headerHeight + 24, Bottom inset: insets.bottom + 24
- **Components**:
  - Question text (medium, top of screen, muted)
  - Multi-line text input (borderless, auto-focus, large font)
  - Floating "Save" button (bottom-right corner with drop shadow)
- **Behavior**: Dismiss keyboard when tapping outside input

### ConfirmationScreen
- **Purpose**: Affirm completion, reinforce tomorrow's return
- **Layout**:
  - No header
  - Root view: Non-scrollable, centered content
  - Top inset: insets.top + 80, Bottom inset: insets.bottom + 80
- **Components**:
  - Checkmark icon (large, subtle)
  - "Entry saved" heading
  - "See you tomorrow at [time]" subtext
  - "Done" button at bottom
- **Behavior**: Button returns to LockedScreen or exits app

### LockedScreen
- **Purpose**: Reinforce one-per-day constraint, show unlock countdown
- **Layout**:
  - No header
  - Root view: Non-scrollable, centered content
  - Top inset: insets.top + 80, Bottom inset: insets.bottom + 80
- **Components**:
  - Lock icon (large, subtle)
  - "You've reflected today" heading
  - "Next entry unlocks in [countdown]" subtext
  - "View Patterns" button (if premium) or "Upgrade" button
- **Empty State**: First-time users see "Start your first entry" instead

### PatternsScreen
- **Purpose**: View past entries (premium feature gate in MVP)
- **Layout**:
  - Default header with "Back" left button, title "Patterns"
  - Root view: Scrollable list
  - Top inset: 16, Bottom inset: insets.bottom + 16
- **Components**:
  - Calendar month view (mini) at top
  - List of past entries (date + question + truncated response)
- **Empty State**: Illustration (empty-patterns.png) + "No entries yet"

## Color Palette

**Primary**: `#1A1A1A` (near-black, used for primary text and accents)
**Background**: `#FFFFFF` (pure white)
**Surface**: `#F8F8F8` (barely-there gray for input backgrounds)
**Text Primary**: `#1A1A1A`
**Text Secondary**: `#6B6B6B` (muted gray for labels/dates)
**Accent**: `#1A1A1A` (same as primary - no color distraction)
**Semantic Success**: `#2D2D2D` (subtle confirmation state)

## Typography

**Font**: System default (SF Pro on iOS, Roboto on Android)

**Type Scale**:
- **Display** (Question text): 28pt, Bold, line-height 1.2
- **Heading** (Screen titles): 20pt, Semibold, line-height 1.3
- **Body** (User input): 18pt, Regular, line-height 1.5
- **Label** (Dates, metadata): 13pt, Medium, uppercase, letter-spacing 0.5pt
- **Button**: 16pt, Semibold

## Visual Design

- All touchable components: Scale down to 0.96 on press (subtle feedback)
- Floating "Save" button: Use specified drop shadow (offset 0,2, opacity 0.10, radius 2)
- No border radius on full-width buttons (brutalist aesthetic)
- Moderate border radius (8pt) on floating buttons
- Icons: Use Feather icons from @expo/vector-icons at 32pt minimum
- Margins: 24pt horizontal, 16pt vertical between elements

## Assets to Generate

1. **icon.png** - App icon for device home screen
   - Simple "DC" monogram in bold sans-serif
   - Near-black on white background
   - Minimalist, no gradients or shadows

2. **splash-icon.png** - Shown during SplashScreen
   - Same as icon.png but larger (1024x1024)
   - Centered on white background

3. **empty-patterns.png** - PatternsScreen empty state
   - Illustration of a blank journal or calendar with single mark
   - Muted gray tones
   - Simple line art style
   - WHERE USED: PatternsScreen when no entries exist