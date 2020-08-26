import React, { useState } from 'react';
import Paper from '@material-ui/core/Paper';
import Grid from '@material-ui/core/Grid';

import {
    Chart,
    ScatterSeries,
    ArgumentAxis,
    ValueAxis,
    ScatterSeriesProps
} from '@devexpress/dx-react-chart-material-ui';

import { Animation, Title } from '@devexpress/dx-react-chart';

import Table from '@material-ui/core/Table';
import TableBody from '@material-ui/core/TableBody';
import TableCell from '@material-ui/core/TableCell';
import TableContainer from '@material-ui/core/TableContainer';
import TableHead from '@material-ui/core/TableHead';
import TableRow from '@material-ui/core/TableRow';

export default function InfoModal(props) {
    const [data, setData] = useState(props.data[props.index]);


    return (
        <div>
            <Grid container spacing={2}>
                <Grid item xs={12}>
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

                <Grid item xs={12}>
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

                <Grid item xs={12}>
                    <Paper>
                        <Chart data={data.results} >
                            <ArgumentAxis showGrid />
                            <ValueAxis />
                            <ScatterSeries
                                valueField="temperature"
                                argumentField="humidity"
                            />
                            <Animation />
                        </Chart>
                    </Paper>
                </Grid>
            </Grid>
        </div>
    );
}