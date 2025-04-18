import { Box, CircularProgress, Container, ContainerProps, createTheme, CssBaseline, ThemeProvider } from '@mui/material';
import useMediaQuery from '@mui/material/useMediaQuery';
import React, { ReactNode, useEffect, useMemo, useState } from 'react';
import Header from './header';

interface PageProps extends ContainerProps {
    children?: ReactNode; // Define the type for children
    loading?: boolean; // Optional loading prop
    setUpdate?: (update: boolean) => void; // Optional function to set update state
}

const Page: React.FC<PageProps> = ({ children, loading, setUpdate, ...props }) => {
    const prefersDarkMode = useMediaQuery('(prefers-color-scheme: dark)');
    const [darkMode, setDarkMode] = useState<boolean>(() => {
        const savedTheme = localStorage.getItem('darkMode');
        return savedTheme !== null ? JSON.parse(savedTheme) : prefersDarkMode;
    });

    const theme = useMemo(
        () =>
            createTheme({
                palette: {
                    mode: darkMode ? 'dark' : 'light',
                    primary: {
                        main: darkMode ? '#311b92' : '#7A6F63', // Light blue for dark mode, brown for light mode
                    },
                    background: {
                        default: darkMode ? '#1e1e1e' : '#f0f0f0', // Gray dark for dark mode, light gray for light mode
                        paper: darkMode ? '#2a2a2a' : '#ffffff', // Slightly lighter gray for paper elements in dark mode
                    },
                    text: {
                        primary: darkMode ? '#e0e0e0' : '#212121', // Light gray text for dark mode, dark text for light mode
                        secondary: darkMode ? '#bdbdbd' : '#616161', // Secondary text color
                    },
                },
            }),
        [darkMode] // Recreate the theme object whenever darkMode changes
    );

    const toggleTheme = () => {
        setDarkMode(!darkMode); // Toggle between light and dark modes
    };

    // Update localStorage whenever the theme mode changes
    useEffect(() => {
        localStorage.setItem('darkMode', JSON.stringify(darkMode));
    }, [darkMode]);

    return (
        <ThemeProvider theme={theme}>
            <CssBaseline />
            <Header toggleTheme={toggleTheme} darkMode={darkMode} updateUnit={setUpdate}/>
            <Container {...props}>
                {loading ? (
                    <Box
                        sx={{
                            display: 'flex',
                            justifyContent: 'center',
                            alignItems: 'center',
                        }}
                    >
                        <CircularProgress />
                    </Box>
                ) : (
                    children
                )}
            </Container>
        </ThemeProvider>
    );
};

export default Page;
