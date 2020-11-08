import React from 'react';

import { makeStyles } from '@material-ui/core/styles';
import Grid from '@material-ui/core/Grid';
import Paper from '@material-ui/core/Paper';
import EnhancedTable from '../util/table'

import { STATIONS_PATH } from "../util/REST/paths";
import GET from "../util/REST/GET.js";

function Stations({ location, props }) {

    const [data, setData] = React.useState([]);

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

    function onError() {
        console.log("Stations, fetch data error")
    }

    function resolve(promise) {
        return Promise.resolve(promise);
    }

    function getJson(response) {
        return response.json();
    }

    React.useEffect(() => {
        function onSuccess(json) {
            console.log("Station, fetchData SUCCESS, json: ", json);
            setData(json);
        }

        fetch("http://127.0.0.1:8000/stations/")
            .then(resolve)
            .then(getJson)
            .then(onSuccess)
        //Następujący błąd występujący w Firefoxie:
        //Błąd mapy źródła: Error: NetworkError when attempting to fetch resource.
        //należy zignorować, wynika z buga w tej przeglądarce
    }, []
    );

    const headCells = [
        { id: 'station_id', numeric: true, disablePadding: true, label: 'Identyfikator stacji' },
        { id: 'latitude', numeric: true, disablePadding: false, label: 'Szerokość geogr.' },
        { id: 'longitude', numeric: true, disablePadding: false, label: 'Długość geogr.' },
        { id: 'station_name', numeric: false, disablePadding: false, label: 'Nazwa stacji' },
    ];



    return (
        <div className={classes.root}>
            <Grid container spacing={2} justify="space-around">
                <Grid item xs={5}>
                    <EnhancedTable
                        headCells={headCells}
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
        </div>

    );

}

export default Stations;