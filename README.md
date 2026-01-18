# Laundry Tracker App

A simple React Native mobile app for tracking laundry items in a hostel environment.

## Features

- **Home Screen**: Quick access to create new entries and view history
- **New Entry**: Add laundry items with customizable categories and counters
- **History**: View all past laundry records with status (pending/returned)
- **Detail View**: See complete information about each laundry batch
- **Settings**: Manage app settings and data
- **Customize Categories**: Add, edit, or delete laundry categories

## Tech Stack

- **React Native** with **Expo**
- **TypeScript** for type safety
- **React Navigation** (Stack Navigator)
- **Zustand** for state management with persist middleware
- **AsyncStorage** for local data persistence

## Project Structure

```
laundry/
├── src/
│   ├── screens/
│   │   ├── HomeScreen.tsx
│   │   ├── NewEntryScreen.tsx
│   │   ├── HistoryScreen.tsx
│   │   ├── DetailScreen.tsx
│   │   ├── SettingsScreen.tsx
│   │   └── CustomizeCategoriesScreen.tsx
│   ├── store/
│   │   ├── categoryStore.ts
│   │   └── laundryStore.ts
│   ├── types/
│   │   └── index.ts
│   ├── components/
│   └── Navigation.tsx
├── App.tsx
└── package.json
```

## Getting Started

### Prerequisites

- Node.js (v16 or higher)
- npm or yarn
- Expo Go app on your mobile device (for testing)

### Installation

1. Install dependencies:
   ```bash
   npm install
   ```

2. Start the development server:
   ```bash
   npx expo start
   ```

3. Scan the QR code with:
   - **Android**: Expo Go app
   - **iOS**: Camera app

## How to Use

1. **Create Entry**: 
   - Tap "New Entry" on home screen
   - Use + and - buttons to count items for each category
   - Tap "Save Entry" to record

2. **View History**:
   - Tap "History" on home screen
   - See all laundry batches with status
   - Tap any entry to see details

3. **Mark as Returned**:
   - Open any pending entry from history
   - Tap "Mark as Returned" button

4. **Customize Categories**:
   - Go to Settings → Customize Categories
   - Add, edit, or delete categories as needed

## Default Categories

- 👕 Shirts
- 👖 Pants
- 🩳 Track Pants
- 🩳 Shorts
- 🩲 Inners
- 🧦 Socks

## Data Persistence

All data is stored locally using AsyncStorage and persists across app restarts. No internet connection required.

## Development

- Run type checking: `npx tsc --noEmit`
- Clear cache: `npx expo start --clear`

## Future Enhancements

- Photo uploads for laundry receipts
- Reminder notifications
- Data export/import functionality
- Statistics and analytics
- Search and filter options

## Version

1.0.0
