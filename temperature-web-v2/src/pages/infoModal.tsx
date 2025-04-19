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


    const getMinutesElapsed = (start: Date, end: string) => {
        const startDate = new Date(start);
        const endDate = new Date(end);
        const diff = endDate.getTime() - startDate.getTime();
        return Math.floor(diff / (1000 * 60));
    }

    const getEarliestDate = (data: TempResponse) => {
        return new Date(Math.min(...data.results.map((d) => new Date(d.date).getTime())))
    }

    const earlistDate = getEarliestDate(data);

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
                                    data: data.results.map((v) => ({ x: getMinutesElapsed(earlistDate, v.date), y: v.temperature })),
                                    color: 'orange'
                                },
                            ]}
                            grid={{ vertical: true, horizontal: true }}
                            yAxis={isMobile ? [] : [{ label: 'Temperature' }]}
                            xAxis={isMobile ? [] : [{ label: 'Time (minutes)' }]}
                            margin={isMobile ? {left: -20, right: 0, top: 0, bottom: 0} : 0}
                        >
                        </ScatterChart>
                </Grid>
                <Grid size={{ xs: 12 }} p={2} component={Paper}>
                        <Typography variant="h6" align="center">Humidity vs Time</Typography>
                        <ScatterChart
                            height={200}
                            title='Humidity'
                            series={[
                                {
                                    data: data.results.map((v) => ({ x: getMinutesElapsed(earlistDate, v.date), y: v.humidity })),
                                    color: 'orange'
                                },
                            ]}
                            grid={{ vertical: true, horizontal: true }}
                            yAxis={isMobile ? [] : [{ label: 'Humidity' }]}
                            xAxis={isMobile ? [] : [{ label: 'Time (minutes)' }]}
                            margin={isMobile ? {left: -20, right: 0, top: 0, bottom: 0} : 0}
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
                            margin={isMobile ? {left: -20, right: 0, top: 0, bottom: 0} : 0}
                        />
                </Grid>
            </Grid>
        </div>
    );
};

export default InfoModal;