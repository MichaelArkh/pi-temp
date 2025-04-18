import { Checkbox, FormControlLabel, Grid, Link, Paper, Slider, Typography } from '@mui/material';
import { MobileDatePicker } from '@mui/x-date-pickers';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import React, { ChangeEvent, useState } from 'react';
import dayjs from '../config/dayjs';

interface SettingsProps {
    updateUnit?: (update: boolean) => void; // Optional function to set update state
}

const SettingsModal: React.FC<SettingsProps> = ({  }) => {
    const [startDate, setStartDate] = useState(() => {
        const storedDate = localStorage.getItem("startDate");
        return storedDate ? dayjs(storedDate) : dayjs();
    });

    const [endDate, setEndDate] = useState(() => {
        const storedDate = localStorage.getItem("endDate");
        return storedDate ? dayjs(storedDate) : dayjs();
    });

    const [startDateEnable, setStartDateEnable] = useState<boolean>(() => {
        const storedValue = localStorage.getItem("startDateEnable");
        return storedValue ? JSON.parse(storedValue) : false;
    });

    const [endDateEnable, setEndDateEnable] = useState<boolean>(() => {
        const storedValue = localStorage.getItem("endDateEnable");
        return storedValue ? JSON.parse(storedValue) : false;
    });

    const [max, setMax] = useState<number>(() => {
        const storedValue = localStorage.getItem("max");
        return storedValue ? Number(storedValue) : 30;
    });

    const startChange = (event: ChangeEvent<HTMLInputElement>) => {
        const isChecked = event.target.checked;
        localStorage.setItem("startDateEnable", isChecked.toString());
        setStartDateEnable(isChecked);
    }

    const endChange = (event: ChangeEvent<HTMLInputElement>) => {
        const isChecked = event.target.checked;
        localStorage.setItem("endDateEnable", isChecked.toString());
        setEndDateEnable(isChecked);
    }

    const handleStartDateChange = (date: dayjs.Dayjs | null) => {
        if (date) {
            const userTimezone = Intl.DateTimeFormat().resolvedOptions().timeZone;
            const utcDate = date.tz(userTimezone).utc().format('YYYY-MM-DD');
            localStorage.setItem("startDate", utcDate);
            setStartDate(date);
        }
    };

    const handleEndDateChange = (date: dayjs.Dayjs | null) => {
        if (date) {
            const userTimezone = Intl.DateTimeFormat().resolvedOptions().timeZone;
            const utcDate = date.tz(userTimezone).utc().format('YYYY-MM-DD');
            localStorage.setItem("endDate", utcDate);
            setEndDate(date);
        }
    };

    const maxChange = (val: number) => {
        localStorage.setItem("max", val.toString());
        setMax(val);
    }

    return (
        <Grid container spacing={2} padding={2} >
            <LocalizationProvider dateAdapter={AdapterDayjs}>
                {/* First Paper Section */}
                <Grid container spacing={2} padding={2} component={Paper} sx={{ width: '100%' }}>
                    <Grid size={{ xs: 12, md: 4 }}>
                        <MobileDatePicker
                            label="Start Date"
                            onChange={(newValue) => handleStartDateChange(newValue as dayjs.Dayjs | null)}
                            value={startDate}
                            sx={{ width: '100%' }}
                        />
                    </Grid>
                    <Grid size={{ xs: 12, md: 8 }}>
                        <FormControlLabel
                            control={<Checkbox checked={startDateEnable} color="secondary" onChange={(event) => startChange(event)} />}
                            label="Enabled"
                            
                        />
                    </Grid>
                    <Grid size={{ xs: 12, md: 4 }}>
                        <MobileDatePicker
                            label="End Date"
                            onChange={(newValue) => handleEndDateChange(newValue as dayjs.Dayjs | null)}
                            value={endDate}
                            sx={{ width: '100%' }}
                        />
                    </Grid>
                    <Grid size={{ xs: 12, md: 8 }}>
                        <FormControlLabel
                            control={<Checkbox checked={endDateEnable} color="secondary" onChange={(event) => endChange(event)} />}
                            label="Enabled"
                        />
                    </Grid>
                </Grid>

                {/* Second Paper Section */}
                <Grid container spacing={2} padding={2} component={Paper} sx={{ width: '100%' }}>
                    <Grid size={{ xs: 12 }}>
                        <Typography id="discrete-slider" gutterBottom>
                            Max Points
                        </Typography>
                        <Slider
                            valueLabelDisplay="auto"
                            step={1}
                            min={0}
                            max={1000}
                            value={max}
                            onChange={(_, value) => {
                                maxChange(value as number);
                            }}
                            color="secondary"
                        />
                        <div>Icon made by <Link href="https://www.flaticon.com/authors/pixel-perfect" title="Pixel perfect" color="secondary">Pixel perfect</ Link> from <Link href="https://www.flaticon.com/" title="Flaticon" color="secondary">www.flaticon.com</ Link></div>
                    </Grid>
                </Grid>
            </LocalizationProvider>
        </Grid>
    );
};

export default SettingsModal;