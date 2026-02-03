import { createContext, useContext, useState, useEffect, type ReactNode } from 'react';

export type ThemeId = 'dark' | 'light' | 'glass';

interface ThemeContextType {
    themeId: ThemeId;
    setTheme: (id: ThemeId) => void;
}

const ThemeContext = createContext<ThemeContextType | undefined>(undefined);

export const ThemeProvider = ({ children }: { children: ReactNode }) => {
    const [themeId, setThemeId] = useState<ThemeId>(() => {
        const savedTheme = localStorage.getItem('themeId');
        return (savedTheme as ThemeId) || 'dark';
    });

    useEffect(() => {
        localStorage.setItem('themeId', themeId);
    }, [themeId]);

    const setTheme = (id: ThemeId) => {
        setThemeId(id);
    };

    return (
        <ThemeContext.Provider value={{ themeId, setTheme }}>
            {children}
        </ThemeContext.Provider>
    );
};

export const useAppTheme = () => {
    const context = useContext(ThemeContext);
    if (!context) {
        throw new Error('useAppTheme must be used within a ThemeProvider');
    }
    return context;
};
