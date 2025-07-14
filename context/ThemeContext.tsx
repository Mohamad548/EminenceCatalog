
import React, { createContext, useState, useContext, useEffect, ReactNode, useMemo } from 'react';

interface Theme {
    primaryColor: string;
    goldColor: string;
    fontFamily: string;
}

interface ThemeContextType {
    theme: Theme;
    setTheme: (theme: Partial<Theme>) => void;
}

const defaultTheme: Theme = {
    primaryColor: '#066194',
    goldColor: '#d2ab67',
    fontFamily: 'IRANSansFaNum',
};

const ThemeContext = createContext<ThemeContextType | undefined>(undefined);

export const ThemeProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
    const [theme, setThemeState] = useState<Theme>(() => {
        try {
            const storedTheme = localStorage.getItem('app-theme');
            if (storedTheme) {
                return { ...defaultTheme, ...JSON.parse(storedTheme) };
            }
        } catch (error) {
            console.error("Failed to parse theme from localStorage", error);
        }
        return defaultTheme;
    });

    useEffect(() => {
        // Apply theme to root element
        const root = document.documentElement;
        root.style.setProperty('--color-primary', theme.primaryColor);
        root.style.setProperty('--color-gold', theme.goldColor);
        root.style.setProperty('--font-family', theme.fontFamily);
        
        // Apply to body for non-tailwind elements
        document.body.style.fontFamily = `var(--font-family, ${defaultTheme.fontFamily})`;

        // Persist theme to localStorage
        try {
            localStorage.setItem('app-theme', JSON.stringify(theme));
        } catch (error) {
            console.error("Failed to save theme to localStorage", error);
        }
    }, [theme]);
    
    const setTheme = (newTheme: Partial<Theme>) => {
        setThemeState(prevTheme => ({ ...prevTheme, ...newTheme }));
    };

    const contextValue = useMemo(() => ({ theme, setTheme }), [theme]);

    return (
        <ThemeContext.Provider value={contextValue}>
            {children}
        </ThemeContext.Provider>
    );
};

export const useTheme = () => {
    const context = useContext(ThemeContext);
    if (context === undefined) {
        throw new Error('useTheme must be used within a ThemeProvider');
    }
    return context;
};
