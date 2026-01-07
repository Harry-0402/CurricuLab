/* src/themeManager.ts */
import { Theme } from './types';

class ThemeManager {
    private currentTheme: 'light' | 'dark';
    private themeData: Theme | null = null;

    constructor() {
        this.currentTheme = (localStorage.getItem('theme') as 'light' | 'dark') || 'light';
    }

    async init() {
        try {
            const response = await fetch('/src/assets/json/theme.json');
            this.themeData = await response.json();
            this.applyTheme(this.currentTheme);
            this.injectTypography(this.themeData!.typography);
            this.injectSpacing(this.themeData!.spacing);
        } catch (error) {
            console.error('Failed to load theme:', error);
        }
    }

    toggleTheme() {
        this.currentTheme = this.currentTheme === 'light' ? 'dark' : 'light';
        localStorage.setItem('theme', this.currentTheme);
        this.applyTheme(this.currentTheme);
    }

    private applyTheme(themeName: 'light' | 'dark') {
        if (!this.themeData) return;
        const theme = this.themeData[themeName as keyof Theme];
        const root = document.documentElement;

        Object.entries(theme).forEach(([category, variables]) => {
            Object.entries(variables as object).forEach(([name, value]) => {
                root.style.setProperty(`--${category}-${name}`, value);
            });
        });

        // Update global variables
        Object.entries(this.themeData.global[themeName]).forEach(([name, value]) => {
            root.style.setProperty(`--${name}`, value as string);
        });
    }

    private injectTypography(typography: any) {
        const root = document.documentElement;
        Object.entries(typography).forEach(([name, value]) => {
            // Convert camelCase like fontFamily to kebab-case like font-family
            const cssName = name.replace(/([a-z0-9])([A-Z])/g, '$1-$2').toLowerCase();
            root.style.setProperty(`--font-${cssName}`, value as string);
        });
    }

    private injectSpacing(spacing: any) {
        const root = document.documentElement;
        Object.entries(spacing).forEach(([name, value]) => {
            root.style.setProperty(`--space-${name}`, value as string);
        });
    }
}

export const themeManager = new ThemeManager();
export default themeManager;
