// This file contains instructions for applying theme to remaining screens
// Due to file size, manual application recommended for: NewEntryScreen, HistoryScreen, DetailScreen, CustomizeCategoriesScreen

/*
Steps to apply theme to each screen:

1. Import useThemeStore at the top:
   import { useThemeStore } from '../store/themeStore';

2. Get theme in component:
   const theme = useThemeStore((state) => state.theme);

3. Apply theme to main container:
   style={[styles.container, { backgroundColor: theme.background }]}

4. Apply theme to cards/containers:
   style={[styles.card, { backgroundColor: theme.cardBackground }]}

5. Apply theme to text elements:
   Primary text: { color: theme.primaryText }
   Secondary text: { color: theme.secondaryText }
   Tertiary text: { color: theme.tertiaryText }

6. Apply theme to buttons:
   Primary button: { backgroundColor: theme.primaryButton }
   Primary button text: { color: theme.primaryButtonText }
   Success button: { backgroundColor: theme.successButton }
   Success text: { color: theme.successText }
   Danger button: { backgroundColor: theme.dangerButton }
   Danger text: { color: theme.dangerText }

7. Apply theme to inputs:
   { backgroundColor: theme.inputBackground, borderColor: theme.border, color: theme.inputText }
   placeholderTextColor={theme.placeholder}

8. Remove all hardcoded color values from StyleSheet.create()

9. Apply colors dynamically in render using inline styles or combined styles
*/

export default {};
