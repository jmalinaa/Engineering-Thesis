import React from 'react';

import { makeStyles } from '@material-ui/core/styles';
import ConfirmationDialog from "../util/popups/confirmationDialog";
import Grid from '@material-ui/core/Grid';
import Paper from '@material-ui/core/Paper';
import EnhancedTable from '../util/table'
import StationManager from './stationManager';

import { ALL_STATIONS_PATH, ADD_STATION_PATH } from "../util/REST/paths";
import GET from "../util/REST/GET";
import POST from "../util/REST/POST";
import ConfrimationDialog from '../util/popups/confirmationDialog/ConfirmationDialog';

function Stations({ location, props }) {

    const [data, setData] = React.useState([]);
    const [addStationDialogOpen, setAddStationDialogOpen] = React.useState(false);
    const [confirmationDialogOpen, setConfirmationDialogOpen] = React.useState(false);
    const [confirmationMessage, setConfirmationMessage] = React.useState('');
    const [confirmationSeverity, setConfirmationSeverity] = React.useState(null);
    const [refreshValue, setRefreshValue] = React.useState(0);

    function refresh() {
        setRefreshValue(refreshValue + 1);
    }

    console.log("Stations, props: ", props);

    const useStyles = makeStyles((theme) => ({
        root: {
            flexGrow: 1,
            marginLeft: 5,
            marginRight: 5
        },
        paper: {
            padding: theme.spacing(2),
            textAlign: 'center',
            color: theme.palette.text.secondary,
        },
    }));

    const classes = useStyles();

    React.useEffect(() => {
        function onSuccess(json) {
            console.log("Stations, fetchData SUCCESS, json: ", json);
            setData(json);
        }
        function onError(error) {
            console.log("Stations, fetch data error: ", error)
            setData([]);
        }

        console.log("Stations, attempting to fetch data, path: ", ALL_STATIONS_PATH);

        GET(ALL_STATIONS_PATH, onSuccess, onError);

    }, [refreshValue]
    );

    const headCells = [
        { id: 'id', numeric: true, disablePadding: true, label: 'Identyfikator stacji' },
        { id: 'latitude', numeric: true, disablePadding: false, label: 'Szerokość geogr.' },
        { id: 'longitude', numeric: true, disablePadding: false, label: 'Długość geogr.' },
        { id: 'stationName', numeric: false, disablePadding: false, label: 'Nazwa stacji' },
    ];

    function onAddStationSuccess(json) {
        console.log("Stations, onAddStationSuccess, SUCCESS json: ", json);
        handleOpenConfrimationDialog("Stacja została dodana", 'success')
        refresh();
    }

    function onAddStationError(error) {
        console.log("Stations, onAddStationSuccess, ERROR error: ", error);
        handleOpenConfrimationDialog(error, 'error')
    }

    function addNewStation() {
        setAddStationDialogOpen(true);
    }

    function handleCloseDialog() {
        setAddStationDialogOpen(false);
    }

    function handleSubmitNewStation(newStationData) {
        setAddStationDialogOpen(false);
        console.log("Stations, handleSubmitNewStation, newStationData: ", newStationData);
        POST(ADD_STATION_PATH, newStationData, onAddStationSuccess, onAddStationError);
    }

    function handleOpenConfrimationDialog(message, severity) {
        setConfirmationMessage(message);
        setConfirmationSeverity(severity);
        setConfirmationDialogOpen(true);
    }

    function handleCloseConfrimationDialog() {
        setConfirmationDialogOpen(false);
    }

    return (
        <div className={classes.root}>
            <Grid container spacing={2} justify="space-around">
                <Grid item xs={5}>
                    <EnhancedTable
                        headCells={headCells}
                        addNewRowHandler={addNewStation}
                        rows={data}
                    />
                </Grid>
                <Grid item xs={3}>
                    <Paper className={classes.paper}>przyciski</Paper>
                </Grid>
                <Grid item xs={4}>
                    <Paper className={classes.paper}>mapa</Paper>
                </Grid>
            </Grid>
            <StationManager
                open={addStationDialogOpen}
                handleClose={handleCloseDialog}
                handleSubmit={handleSubmitNewStation}
            />
            <ConfrimationDialog
                open={confirmationDialogOpen}
                handleClose={handleCloseConfrimationDialog}
                message = {confirmationMessage}
                severity = {confirmationSeverity}
                />
        </div>

    );

}

export default Stations;