import Brightness4Icon from '@mui/icons-material/Brightness4';
import Brightness7Icon from '@mui/icons-material/Brightness7';
import Settings from '@mui/icons-material/Settings';
import { Dialog, DialogContent, DialogTitle } from '@mui/material';
import AppBar from '@mui/material/AppBar';
import IconButton from '@mui/material/IconButton';
import Toolbar from '@mui/material/Toolbar';
import Typography from '@mui/material/Typography';
import React, { useState } from 'react';
import SettingsModal from '../pages/settingsModal';

interface PageProps {
    toggleTheme?: () => void
    darkMode?: boolean
    updateUnit?: (update: boolean) => void; // Optional function to set update state
}

const Header: React.FC<PageProps> = ({toggleTheme, darkMode, updateUnit}) => {
    const [unit, setUnit] = useState<'Fahrenheit' | 'Celsius'>(() => {
        const savedUnit = localStorage.getItem('unit');
        return savedUnit === 'celsius' ? 'Celsius' : 'Fahrenheit';
    }); // State for the unit
    const [openSettings, setOpenSettings] = useState(false); // State for the dialog

    const toggleUnit = () => {
        localStorage.setItem('unit', unit === 'Fahrenheit' ? 'celsius' : 'fahrenheit');
        setUnit((prevUnit) => (prevUnit === 'Fahrenheit' ? 'Celsius' : 'Fahrenheit')); // Toggle between units
        updateUnit && updateUnit(false);
    };

    return (
        <>
            <AppBar position="static" enableColorOnDark>
                <Toolbar>
                    <Typography variant="h6" sx={{ flexGrow: 1 }}>
                        Temperature
                    </Typography>
                    <IconButton onClick={toggleUnit} color="inherit">
                        <Typography variant="body2" sx={{ marginRight: 1 }}>
                            {unit}
                        </Typography>
                    </IconButton>
                    <IconButton color="inherit" onClick={() => setOpenSettings(true)}>
                        <Settings />
                    </IconButton>
                    <IconButton onClick={toggleTheme} color="inherit">
                        {darkMode ? <Brightness7Icon /> : <Brightness4Icon />}
                    </IconButton>
                </Toolbar>
            </AppBar>
                        <Dialog
                            open={openSettings}
                            onClose={() => {setOpenSettings(false); updateUnit && updateUnit(false);}}
                            fullWidth={true}
                            maxWidth="md"
                            aria-labelledby="alert-dialog-title"
                            aria-describedby="alert-dialog-description">
                            <DialogTitle id="alert-dialog-title">
                                Settings
                            </DialogTitle>
                            <DialogContent>
                                <SettingsModal updateUnit={updateUnit} />
                            </DialogContent>
                        </Dialog>
        </>
    );
};

export default Header;