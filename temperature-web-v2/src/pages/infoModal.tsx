import { Grid, Paper, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Typography, useMediaQuery, useTheme } from '@mui/material';
import { ScatterChart } from '@mui/x-charts';
import React from 'react';
import { TempResponse } from '../types/TempResponse';

interface InfoProps {
    data: TempResponse;
}

const InfoModal: React.FC<InfoProps> = ({ data }) => {
    const theme = useTheme();
    const isMobile = useMediaQuery(theme.breakpoints.down('md')); // Detect mobile screens

    const getOutdoor = (v: any) => {
        return v?.outdoor ?? null;
    }

    const getMinutesFromLatest = (latest: Date, dateStr: string) => {
        const latestDate = new Date(latest);
        const d = new Date(dateStr);
        const diff = latestDate.getTime() - d.getTime();
        return Math.floor(diff / (1000 * 60));
    }

    const getLatestDate = (data: TempResponse) => {
        return new Date(Math.max(...data.results.map((d) => new Date(d.date).getTime())));
    }

    const latestDate = getLatestDate(data);
    const minutesArray = data.results.map((v) => getMinutesFromLatest(latestDate, v.date));
    const maxMinutes = minutesArray.length ? Math.max(...minutesArray) : 0;

    const outdoorSeries = data.results
        .map((v) => ({ x: getMinutesFromLatest(latestDate, v.date), y: getOutdoor(v) }))
        .filter((p) => p.y !== null);
    

    return (
        <div>
            <Grid container spacing={2}>
                <Grid size={{ xs: 12 }}>
                    <TableContainer component={Paper}>
                        <Table aria-label="simple table">
                            <TableHead>
                                <TableRow>
                                    <TableCell align="center">{"Average Temp"}</TableCell>
                                    <TableCell align="center">{"High Temp"}</TableCell>
                                    <TableCell align="center">{"Low Temp"}</TableCell>
                                </TableRow>
                            </TableHead>
                            <TableBody>
                                <TableRow>
                                    <TableCell align="center">{data.stats['average_temp']}</TableCell>
                                    <TableCell align="center">{data.stats['high_temp']}</TableCell>
                                    <TableCell align="center">{data.stats['low_temp']}</TableCell>
                                </TableRow>
                            </TableBody>
                        </Table>
                    </TableContainer>
                </Grid>

                <Grid size={{ xs: 12 }}>
                    <TableContainer component={Paper}>
                        <Table aria-label="simple table">
                            <TableHead>
                                <TableRow>
                                    <TableCell align="center">{"Average Humid"}</TableCell>
                                    <TableCell align="center">{"High Humid"}</TableCell>
                                    <TableCell align="center">{"Low Humid"}</TableCell>
                                </TableRow>
                            </TableHead>
                            <TableBody>
                                <TableRow>
                                    <TableCell align="center">{data.stats['average_humid']}</TableCell>
                                    <TableCell align="center">{data.stats['high_humid']}</TableCell>
                                    <TableCell align="center">{data.stats['low_humid']}</TableCell>
                                </TableRow>
                            </TableBody>
                        </Table>
                    </TableContainer>
                </Grid>

                <Grid size={{ xs: 12 }} p={2} component={Paper}>
                        <Typography variant="h6" align="center">Temperature vs Time</Typography>
                        <ScatterChart
                            height={200}
                            title='Temperature'
                            series={[
                                {
                                    data: data.results.map((v) => ({ x: getMinutesFromLatest(latestDate, v.date), y: v.temperature })),
                                    color: 'orange'
                                },
                            ]}
                            grid={{ vertical: true, horizontal: true }}
                            yAxis={isMobile ? [] : [{ label: 'Temperature' }]}
                            xAxis={isMobile ? [{min: maxMinutes, max: 0 }] : [{ label: 'Time (minutes)', min: maxMinutes, max: 0 }]}
                            margin={isMobile ? {left: -12, right: 0, top: 0, bottom: 0} : 0}
                        >
                        </ScatterChart>
                </Grid>

                <Grid size={{ xs: 12 }} p={2} component={Paper}>
                        <Typography variant="h6" align="center">Outdoor Temperature vs Time</Typography>
                        <ScatterChart
                            height={200}
                            title='Outdoor Temperature'
                            series={[
                                { data: outdoorSeries },
                            ]}
                            grid={{ vertical: true, horizontal: true }}
                            yAxis={isMobile ? [] : [{ label: 'Temperature' }]}
                            xAxis={isMobile ? [{min: maxMinutes, max: 0 }] : [{ label: 'Time (minutes)', min: maxMinutes, max: 0 }]}
                            margin={isMobile ? {left: -12, right: 0, top: 0, bottom: 0} : 0}
                        />
                </Grid>
                <Grid size={{ xs: 12 }} p={2} component={Paper}>
                        <Typography variant="h6" align="center">Humidity vs Time</Typography>
                        <ScatterChart
                            height={200}
                            title='Humidity'
                            series={[
                                {
                                    data: data.results.map((v) => ({ x: getMinutesFromLatest(latestDate, v.date), y: v.humidity })),
                                    color: 'orange'
                                },
                            ]}
                            grid={{ vertical: true, horizontal: true }}
                            yAxis={isMobile ? [] : [{ label: 'Humidity' }]}
                            xAxis={isMobile ? [{min: maxMinutes, max: 0 }] : [{ label: 'Time (minutes)', min: maxMinutes, max: 0 }]}
                            margin={isMobile ? {left: -12, right: 0, top: 0, bottom: 0} : 0}
                        />
                </Grid>
                <Grid size={{ xs: 12 }} p={2} component={Paper}>
                        <Typography variant="h6" align="center">Temperature vs Humidity</Typography>
                        <ScatterChart
                            height={300}
                            title='Humidity'
                            series={[
                                {
                                    data: data.results.map((v) => ({ x: v.humidity, y: v.temperature })),
                                    color: 'orange'
                                },
                            ]}
                            grid={{ vertical: true, horizontal: true }}
                            yAxis={isMobile ? [] : [{ label: 'Temperature' }]}
                            xAxis={isMobile ? [] : [{ label: 'Humidity' }]}
                            margin={isMobile ? {left: -12, right: 0, top: 0, bottom: 0} : 0}
                        />
                </Grid>
            </Grid>
        </div>
    );
};

export default InfoModal;