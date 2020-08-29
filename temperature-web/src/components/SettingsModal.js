import React, { useState } from 'react';
import 'date-fns';
import { Grid, Paper } from '@material-ui/core';
import DateFnsUtils from '@date-io/date-fns';

import {
    MuiPickersUtilsProvider,
    KeyboardDatePicker
} from '@material-ui/pickers';
import FormControlLabel from '@material-ui/core/FormControlLabel';
import Checkbox from '@material-ui/core/Checkbox';
import Slider from '@material-ui/core/Slider';
import Typography from '@material-ui/core/Typography';

export default function SettingsModal(props) {
    const [startDate, setStartDate] = useState(localStorage.getItem("startDate") === null ? new Date() : localStorage.getItem("startDate"));
    const [endDate, setEndDate] = useState(localStorage.getItem("endDate") === null ? new Date() : localStorage.getItem("endDate"));
    const [startDateEnable, setStartDateEnable] = useState(localStorage.getItem("startDateEnable") === null ? false : JSON.parse(localStorage.getItem("startDateEnable")));
    const [endDateEnable, setEndDateEnable] = useState(localStorage.getItem("endDateEnable") === null ? false : JSON.parse(localStorage.getItem("endDateEnable")));
    const [max, setMax] = useState(localStorage.getItem("max") === null ? 30 : Number(localStorage.getItem("max")))

    const startChange = (event) => {
        localStorage.setItem("startDateEnable", event.target.checked);
        setStartDateEnable(event.target.checked);
        console.log(startDateEnable);
        props.changed();
    }
    const endChange = (event) => {
        localStorage.setItem("endDateEnable", event.target.checked);
        setEndDateEnable(event.target.checked);
        props.changed();
    }

    const handleStartDateChange = (date) => {
        localStorage.setItem("startDate", date.getUTCFullYear() + "-" + (date.getMonth() + 1) + "-" + (date.getDate()));
        setStartDate(date);
        props.changed();
    };

    const handleEndDateChange = (date) => {
        localStorage.setItem("endDate", date.getUTCFullYear() + "-" + (date.getMonth() + 1) + "-" + (date.getDate()));
        setEndDate(date);
        props.changed();
    };

    const maxChange = (max, val) => {
        localStorage.setItem("max", val);
        setMax(val);
        props.changed();
    }

    return (
        <MuiPickersUtilsProvider utils={DateFnsUtils}>
            <Grid container spacing={2}>
                <Grid item xs={12}>
                    <Paper style={{ padding: "5px" }}>
                        <Grid container spacing={3}>
                            <Grid item xs>
                                <KeyboardDatePicker
                                    margin="normal"
                                    id="date-picker-dialog"
                                    label="Select Start Date"
                                    format="MM/dd/yyyy"
                                    color="secondary"
                                    value={startDate}
                                    onChange={handleStartDateChange}
                                    KeyboardButtonProps={{
                                        'aria-label': 'change date',
                                    }}
                                />
                            </Grid>
                            <Grid item xs>
                                <FormControlLabel
                                    control={<Checkbox checked={startDateEnable} onChange={startChange} name="checkedA" />}
                                    label="Enabled"
                                />
                            </Grid>
                        </Grid>


                        <Grid container spacing={3}>
                            <Grid item xs>
                                <KeyboardDatePicker
                                    margin="normal"
                                    id="date-picker-dialo"
                                    label="Select End Date"
                                    format="MM/dd/yyyy"
                                    color="secondary"
                                    value={endDate}
                                    onChange={handleEndDateChange}
                                    KeyboardButtonProps={{
                                        'aria-label': 'change date',
                                    }}
                                />
                            </Grid>
                            <Grid item xs>
                                <FormControlLabel
                                    control={<Checkbox checked={endDateEnable} onChange={endChange} name="checkedB" />}
                                    label="Enabled"
                                />
                            </Grid>
                        </Grid>
                    </Paper>
                </Grid>
                <Grid item xs>
                    <Paper style={{ padding: "5px" }}>
                        <Grid container spacing={2} >
                            <Grid item xs >
                                <Typography id="discrete-slider" gutterBottom>Max Points</Typography>
                                <Slider
                                    value={max}
                                    aria-labelledby="discrete-slider"
                                    valueLabelDisplay="auto"
                                    color="secondary"
                                    step={1}
                                    onChange={maxChange}
                                    min={3}
                                    max={1000}

                                />
                                <div>Icon made by <a href="https://www.flaticon.com/authors/pixel-perfect" title="Pixel perfect">Pixel perfect</a> from <a href="https://www.flaticon.com/" title="Flaticon">www.flaticon.com</a></div>
                            </Grid>
                        </Grid>
                    </Paper>
                </Grid>
            </Grid>
        </MuiPickersUtilsProvider>
    );
}