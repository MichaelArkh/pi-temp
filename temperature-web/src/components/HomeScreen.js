import React, { useState, useEffect } from 'react';
import Navbar from './Navbar';
import CircularProgress from '@material-ui/core/CircularProgress';
import { Grid } from '@material-ui/core';
import Table from '@material-ui/core/Table';
import TableBody from '@material-ui/core/TableBody';
import TableCell from '@material-ui/core/TableCell';
import TableContainer from '@material-ui/core/TableContainer';
import TableHead from '@material-ui/core/TableHead';
import TableRow from '@material-ui/core/TableRow';
import Button from '@material-ui/core/Button';
import Container from '@material-ui/core/Container';
import Paper from '@material-ui/core/Paper';
import Dialog from '@material-ui/core/Dialog';
import DialogActions from '@material-ui/core/DialogActions';
import DialogContent from '@material-ui/core/DialogContent';
import DialogTitle from '@material-ui/core/DialogTitle';
import { useTheme } from '@material-ui/core/styles';

import InfoModal from './InfoModal';

const placeholder = {
    "stats": {
        "average_temp": "not avail",
        "high_temp": "not avail",
        "low_temp": "not avail",
        "average_humid": "not avail",
        "high_humid": "not avail",
        "low_humid": "not avail"
    },
    "results": [{
        "date": new Date().toString()
    }]
}

export default function HomeScreen() {
    const [error, setError] = useState();
    const [isLoaded, setIsLoaded] = useState(false);
    const [items, setItems] = useState([]);
    const [itemsGraph, setItemsGraph] = useState([]);
    const [open, setOpen] = useState(false);
    const [index, setIndex] = useState(0);
    const [update, setUpdate] = useState(true);
    const theme = useTheme();

    const handleOpen = (index) => {
        setIndex(index);
        setOpen(true);
    };

    const handleClose = () => {
        setOpen(false);
    };

    useEffect(() => {
        var table = ["bedroom", "livingroom"];
        var unit = (localStorage.getItem("unit") === null ? "fahrenheit" : localStorage.getItem("unit")).toLowerCase();
        var end = "&before=" + (localStorage.getItem("endDateEnable") === null ? "" : JSON.parse(localStorage.getItem("endDateEnable")) ? localStorage.getItem("endDate") === null ? "2222-01-01" : localStorage.getItem("endDate") : "");
        var start = "&from=" + (localStorage.getItem("startDateEnable") === null ? "" : JSON.parse(localStorage.getItem("startDateEnable")) ? localStorage.getItem("startDate") === null ? "2020-01-01" : localStorage.getItem("startDate") : "");
        var max = "&count=" + (localStorage.getItem("max") === null ? 30 : Number(localStorage.getItem("max")));
        Promise.all([
            fetch("https://api.mgelsk.com/temp/get?room=" + table[0] + "&count=3&units=" + unit + end + start).then(val => val.json()),
            fetch("https://api.mgelsk.com/temp/get?room=" + table[1] + "&count=3&units=" + unit + end + start).then(val => val.json()),
            fetch("https://api.mgelsk.com/temp/get?room=" + table[0] + max + "&units=" + unit + end + start).then(val => val.json()),
            fetch("https://api.mgelsk.com/temp/get?room=" + table[1] + max + "&units=" + unit + end + start).then(val => val.json())
        ]).then(([items1, items2, items3, items4]) => {
            if(items1.stats === null){
                items1 = placeholder;
            }
            if(items2.stats === null){
                items2 = placeholder;
            }
            if(items3.stats === null){
                items3 = placeholder;
            }
            if(items4.stats === null){
                items4 = placeholder;
            }
            setItems([items1, items2])
            setItemsGraph([items3, items4])
            setIsLoaded(true);
            setUpdate(true);
        }).catch((err) => {
            setError(err);
            setIsLoaded(true);
        });

    }, [update])

    function updateCallback() {
        setUpdate(false);
    }

    function formatDate(date) {
        var date = new Date(date + " UTC");
        return date.toLocaleString('en-US', { day: 'numeric', month: 'long', year: 'numeric', hour: 'numeric', minute: 'numeric', hour12: true });
    }

    if (error) {
        return <div>Error: {error.message}</div>;
    } else if (!isLoaded) {
        return (
            <div>
                
                    
                    <Navbar updateCallback={updateCallback} />
                    <Grid container alignItems="center" justify="center">
                        <CircularProgress color="secondary" style={{ marginTop: "20px" }} />
                    </Grid>
                
            </div>
        );
    } else {
        return (
            <div>
                <Navbar updateCallback={updateCallback} />
                <Container>
                    <Grid spacing={3} container >{
                        items.map((item, index) => {
                            return (
                                <Grid key={index} item md={6} xs={12} align="center">
                                    <TableContainer component={Paper}>
                                        <Table onClick={() => handleOpen(index)} aria-label="simple table">
                                            <TableHead>
                                                <TableRow>
                                                    <TableCell style={{ fontSize: '30px' }} align="center">{index === 0 ? "Bedroom" : "Living Room"}</TableCell>
                                                </TableRow>
                                            </TableHead>
                                            <TableBody>
                                                <TableRow>
                                                    <TableCell style={{ fontSize: '25px' }} align="center">
                                                        {item.stats['average_temp'] + "°"} <br />
                                                        {item.stats['average_humid'] + "%"}
                                                    </TableCell>
                                                </TableRow>
                                                <TableRow>
                                                    <TableCell align="right">
                                                        {"Updated: " + formatDate(item.results[0]['date'])}
                                                    </TableCell>
                                                </TableRow>
                                            </TableBody>
                                        </Table>
                                    </TableContainer>
                                </Grid>
                            )
                        })
                    }

                    </Grid>
                </Container>
                <Dialog
                    open={open}
                    onClose={handleClose}
                    fullWidth={true}
                    maxWidth="md"
                    aria-labelledby="alert-dialog-title"
                    aria-describedby="alert-dialog-description"
                    PaperProps={{ style: { backgroundColor:  theme.palette.background.default} }}
                >
                    <DialogTitle  id="alert-dialog-title">{index === 0 ? "Bedroom" : "Living Room"}</DialogTitle>
                    <DialogContent >
                        <InfoModal index={index} data={itemsGraph}/>
                    </DialogContent>
                </Dialog>
                </div>
        );
    }

}