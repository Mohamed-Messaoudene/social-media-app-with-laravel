import React, { createContext, useState, useEffect, useContext } from 'react';
import { createTheme, ThemeProvider as MUIThemeProvider } from '@mui/material/styles';
import generateTheme from '../assets/generateTheme'; // Adjust the import path accordingly

const ThemeContext = createContext();

export const useCustomTheme = () => {
    return useContext(ThemeContext);
};

export const ThemeProvider = ({ children }) => {
    const currentMode = localStorage.getItem('currentMode') || 'light'
    const [mode, setMode] = useState(currentMode);

    const toggleTheme = () => {
        localStorage.setItem('currentMode',mode === 'light' ? 'dark' : 'light')
        setMode(localStorage.getItem('currentMode'));
    };

    const theme = createTheme(generateTheme(mode));

    useEffect(() => {
        document.body.className = mode;
    }, [mode]);

    return (
        <ThemeContext.Provider value={{ mode, toggleTheme }}>
            <MUIThemeProvider theme={theme}>
                {children}
            </MUIThemeProvider>
        </ThemeContext.Provider>
    );
};
