import { Dialog, DialogContent, DialogTitle, Grid, Paper, Table, TableBody, TableCell, TableContainer, TableHead, TableRow } from '@mui/material';
import React, { useEffect, useState } from 'react';
import Page from '../components/page';
import { RoomsResponse } from '../types/RoomsResponse';
import { TempResponse } from '../types/TempResponse';
import InfoModal from './infoModal';

const Home: React.FC = () => {
    const [isLoaded, setIsLoaded] = useState(false);
    const [items, setItems] = useState<TempResponse[]>([]);
    const [open, setOpen] = useState(false); // Tracks whether the dialog is open
    const [selectedItem, setSelectedItem] = useState<TempResponse | null>(null); // Tracks the selected item
    const [update, setUpdate] = useState(true);


    useEffect(() => {
        var unit = (localStorage.getItem("unit") || "fahrenheit").toLowerCase();
        var end = "&before_date=" + (localStorage.getItem("endDateEnable") === null ? "" : JSON.parse(localStorage.getItem("endDateEnable") || "false") ? (localStorage.getItem("endDate") || "2222-01-01") : "");
        var start = "&from_date=" + (localStorage.getItem("startDateEnable") === null ? "" : JSON.parse(localStorage.getItem("startDateEnable") || "false") ? (localStorage.getItem("startDate") || "2020-01-01") : "");
        var max = "&count=" + (localStorage.getItem("max") === null ? 30 : Number(localStorage.getItem("max") || "30"));
        // fetch endpoint for all tables now
        fetch(import.meta.env.VITE_SERV_URL + "/temp/rooms")
            .then((response) => response.json())
            .then((data: RoomsResponse) => {
                const fetchPromises = data.rooms.map((room: string) => {
                    return fetch(import.meta.env.VITE_SERV_URL + "/temp/get?room=" + encodeURIComponent(room) + max + "&units=" + unit + end + start)
                        .then((response) => response.json())
                        .then((data: TempResponse) => {
                            data.room = room; // Add room name to the data
                            return data;
                        })
                        .catch((error) => {
                            console.error("Error fetching data for room:", room, error);
                        });
                });

                // Wait for all fetch requests to complete
                Promise.all(fetchPromises)
                    .then((results: (void | TempResponse)[]) => {
                        const validResults = results.filter((result): result is TempResponse => result !== undefined);
                        setItems(validResults); // Set all fetched items
                        setIsLoaded(true);
                        setUpdate(true);
                    })
                    .catch((error) => {
                        console.error("Error fetching all rooms:", error);
                        //setError(error);
                        setIsLoaded(true); // Mark as loaded even if there are errors
                    });
            })

    }, [update]);

    const formatDate = (dateString: string): string => {
        const parsedDate = new Date(dateString + "Z");
        return parsedDate.toLocaleString('en-US', {
            day: 'numeric',
            month: 'long',
            year: 'numeric',
            hour: 'numeric',
            minute: 'numeric',
            hour12: true
        });
    };

    const handleOpen = (item: TempResponse) => {
        setSelectedItem(item); // Set the selected item
        setOpen(true); // Open the dialog
    };

    const handleClose = () => {
        setOpen(false); // Close the dialog
    };


    return (
        <Page maxWidth="lg" sx={{ marginTop: 4, marginBottom: 4 }} loading={!isLoaded} setUpdate={setUpdate}>
            <Grid container spacing={2} justifyContent="center" alignItems="center">
                {
                    items.map((item, index) => {
                        return (
                            <Grid key={index} size={{ xs: 12, md: 6 }}>
                                <TableContainer onClick={() => handleOpen(item)} component={Paper}>
                                    <Table aria-label="simple table">
                                        <TableHead>
                                            <TableRow>
                                                <TableCell style={{ fontSize: '30px' }} align="center">{item.room}</TableCell>
                                            </TableRow>
                                        </TableHead>
                                        <TableBody>
                                            <TableRow>
                                                <TableCell style={{ fontSize: '25px' }} align="center">
                                                    {item.results[0] !== undefined ? item.results[0]['temperature'] + "°" : "not avail"} <br />
                                                    {item.results[0] !== undefined ? item.results[0]['humidity'] + "%" : "not avail"}
                                                </TableCell>
                                            </TableRow>
                                            <TableRow>
                                                <TableCell align="right">
                                                    {"Updated: " + (item.results[0] !== undefined ? formatDate(item.results[0]['date']) : "not avail")}
                                                </TableCell>
                                            </TableRow>
                                        </TableBody>
                                    </Table>
                                </TableContainer>
                            </Grid>
                        )
                    }
                    )}
            </Grid>
            <Dialog
                open={open}
                onClose={handleClose}
                fullWidth={true}
                maxWidth="md"
                aria-labelledby="alert-dialog-title"
                aria-describedby="alert-dialog-description">
                <DialogTitle id="alert-dialog-title">
                    {selectedItem?.room || 'Room Details'}
                </DialogTitle>
                <DialogContent>
                    {selectedItem && <InfoModal data={selectedItem} />}
                </DialogContent>
            </Dialog>
        </Page>
    );
};

export default Home;