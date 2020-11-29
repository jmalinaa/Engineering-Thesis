import React from 'react';

import { makeStyles } from '@material-ui/core/styles';
import AddIcon from '@material-ui/icons/Add';
import IconButton from '@material-ui/core/IconButton';
import ConfrimationDialog from '../util/popups/confirmationDialog/ConfirmationDialog';
import CompareIcon from '@material-ui/icons/Compare';
import DataTable from 'react-data-table-component';
import Grid from '@material-ui/core/Grid';
import Paper from '@material-ui/core/Paper';
import StationManager from './stationManager';
import Tooltip from '@material-ui/core/Tooltip';
import SubdirectoryArrowRightIcon from '@material-ui/icons/SubdirectoryArrowRight';

import { ALL_STATIONS_PATH, ADD_STATION_PATH } from "../util/REST/paths";
import GET from "../util/REST/GET";
import POST from "../util/REST/POST";
import { Redirect } from 'react-router-dom';

function Stations({ location, props }) {

    const [data, setData] = React.useState([]);
    const [addStationDialogOpen, setAddStationDialogOpen] = React.useState(false);
    const [selectedRows, setSelectedRows] = React.useState([]);
    const [selectedRowsCount, setSelectedRowsCount] = React.useState(0);
    const [confirmationDialogOpen, setConfirmationDialogOpen] = React.useState(false);
    const [confirmationMessage, setConfirmationMessage] = React.useState('');
    const [confirmationSeverity, setConfirmationSeverity] = React.useState(null);
    const [triggerRedirectionToStation, setTriggerRedirectionToStation] = React.useState(false);
    const [triggerRedirectionToComparison, setTriggerRedirectionToComparison] = React.useState(false);
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
        { selector: 'id', name: 'Identyfikator stacji' },
        { selector: 'latitude', name: 'Szerokość geogr.' },
        { selector: 'longitude', name: 'Długość geogr.' },
        { selector: 'name', name: 'Nazwa stacji' },
    ];

    function onAddStationSuccess(json) {
        console.log("Stations, onAddStationSuccess, SUCCESS json: ", json);
        handleOpenConfrimationDialog("Stacja została dodana", 'success')
        refresh();
    }

    function onAddStationError(error) {
        console.log("Stations, onAddStationSuccess, ERROR error: ", error);
        handleOpenConfrimationDialog(error.toString(), 'error')
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

    function handleSelectedRowsChange(state) {  //state object contains also bool 'allSelected' field
        console.log("Stations, handleSelectedRowsChange, state: ", state);
        setSelectedRowsCount(state.selectedCount);
        setSelectedRows(state.selectedRows);
    }

    function isRowSelected(row) {
        return selectedRows.findIndex(selectedRow => selectedRow.id === row.id) >= 0
    }

    function handleOnRowClicked(row) {
        console.log("Stations, handleOnRowClicked, row: ", row);
        if (isRowSelected(row)) {
            const filtered = selectedRows.filter(selectedRow => selectedRow.id !== row.id)
            setSelectedRows(filtered)
        }
        else
            setSelectedRows(selectedRows.concat([row]))
        refresh();
    }

    //TODO add alert if fetching data fails

    function redirectToStation() {
        console.log("Stations, redirectToStation, selectedRows: ", selectedRows);
        if (triggerRedirectionToStation)
            return (<Redirect
                to={`/station/${selectedRows[0].id}`} //assuming there is exactly one selected row!
            />)
        return null;
    }

    function redirectToComparison() {
        console.log("Stations, redirectToComparison, selectedRows: ", selectedRows);
        if (triggerRedirectionToComparison)
            // return (<Redirect        TODO here, figure out redirection with queryParams
            //     to={`/station/${selectedRows[0].id}`} //assuming there are exactly two selected rows!
            // />)
            return null;
    }

    const actions = [
        <Tooltip title="Dodaj nową stację" id={'addTootltip'}>
            <IconButton onClick={addNewStation}>
                <AddIcon />
            </IconButton>
        </Tooltip>
    ]   //actions which will always be available in the table

    const contextActions = [
        <Tooltip title="Przejdź do stacji" id={'redirectTooltip'}>
            <span>
                <IconButton onClick={() => setTriggerRedirectionToStation(true)} disabled={selectedRowsCount !== 1} >
                    {redirectToStation()}
                    <SubdirectoryArrowRightIcon />
                </IconButton>
            </span>
        </Tooltip>,
        <Tooltip title="Porównaj dane pomiarowe na wykresie" id={'comparisonTooltip'}>
            <span>
                <IconButton onClick={() => setTriggerRedirectionToComparison(true)} disabled={selectedRowsCount !== 2} >
                    {redirectToComparison()}
                    <CompareIcon />
                </IconButton>
            </span>
        </Tooltip>
    ]   //actions which will become available when ate least one row is selected

    //TODO dodać wyszukiwanie! nie ma tego w pakiecie, więc trzeba będzie dodać akcję (do listy 'actions')
    //moze jednak jest rozszerzenie: https://www.npmjs.com/package/react-data-table-component-extensions

    return (
        <div className={classes.root}>
            <Grid container spacing={2} justify="space-around">
                <Grid item xs={8}>
                    <DataTable
                        pagination
                        highlightOnHover
                        selectableRows
                        selectableRowsHighlight
                        columns={headCells}
                        data={data}
                        onSelectedRowsChange={handleSelectedRowsChange}
                        onRowClicked={handleOnRowClicked}
                        selectableRowSelected={isRowSelected}
                        actions={contextActions.concat(actions)}
                        contextActions={contextActions.concat(actions)}
                        contextMessage={{ singular: 'stację', plural: 'stacje', message: 'wybrano' }}
                        paginationRowsPerPageOptions={[5, 10, 15, 20, 25, 30, 50, 100, 150, 200]}
                    />
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
                message={confirmationMessage}
                severity={confirmationSeverity}
            />
        </div>

    );

}

export default Stations;