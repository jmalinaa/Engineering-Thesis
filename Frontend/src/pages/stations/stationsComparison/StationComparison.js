import React from "react";

import Alert from '@material-ui/lab/Alert';
import Grid from '@material-ui/core/Grid';
import { Charts, ChartContainer, ChartRow, YAxis, LineChart } from "react-timeseries-charts";
import ChartOptions from './chartOptions';

import {
    STATION_PATH,
    COLUMN_NAMES_PATH,
    ALL_MEASUREMENTS_PATH,
} from "../../util/REST/paths";
import GET from "../../util/REST/GET";
import { useStyles } from './styles';

export default function StationComparison({ ...props }) {
    console.log("StationComparison, props:", props);
    const classes = useStyles();
    const station1Id = props.match.params.id1;
    const station2Id = props.match.params.id2;
    const [measurementTypes, setMeasurementTypes] = React.useState(null);
    const [station1Data, setStation1Data] = React.useState(null);
    const [station2Data, setStation2Data] = React.useState(null);
    const [station1MeasurementData, setStation1MeasurementData] = React.useState(null);
    const [station2MeasurementData, setStation2MeasurementData] = React.useState(null);
    const [chart1Data, setChart1Data] = React.useState(null);   //list of { x: 1, y: 2 }-like objects
    const [chart2Data, setChart2Data] = React.useState(null);
    const [alertMsg, setAlertMsg] = React.useState(null);

    React.useEffect(() => {
        function onGetSuccess(json, setter) {
            console.log("Station, fetchData SUCCESS, json: ", json);
            if (json != null)
                setAlertMsg(null);
            else
                setAlertMsg("Nie znaleziono danych stacji o id: " + station1Id);
            setter(json);
        }
        function onGetError(error, stationId, setter) {
            console.log("Station, fetch data error: ", error);
            let msg = "Nie udało się pobrać danych stacji ";
            if (error.message != null)
                setAlertMsg(msg + stationId + ". Treść błędu: " + error.message);
            else
                setAlertMsg(msg + stationId + ". Treść błędu: " + error);
            setter(null);
        }

        GET(STATION_PATH + station1Id,
            json => onGetSuccess(json, setStation1Data),
            error => onGetError(error, station1Id, setStation1Data)
        );
        GET(STATION_PATH + station2Id,
            json => onGetSuccess(json, setStation2Data),
            error => onGetError(error, station2Id, setStation2Data)
        );

        GET(ALL_MEASUREMENTS_PATH,
            json => onGetSuccess(json.filter(row => row.station.id == station1Id), setStation1MeasurementData),     //TODO zastąpić filtrowanie nowym endpointem gdy Jasiek go doda
            error => onGetError(error, station1Id, setStation1MeasurementData)
        );
        GET(ALL_MEASUREMENTS_PATH,
            json => onGetSuccess(json.filter(row => row.station.id == station2Id), setStation2MeasurementData),     //TODO zastąpić filtrowanie nowym endpointem gdy Jasiek go doda
            error => onGetError(error, station2Id, setStation2MeasurementData)
        );

    }, [station1Id, station2Id]
    );

    React.useEffect(() => {
        function onColumnsSuccess(json) {
            console.log("StationComparison, fetch columns SUCCESS, json: ", json);
            if (json != null) {
                setMeasurementTypes(json);
                setAlertMsg(null);
            }
            else {
                setMeasurementTypes(null);
                setAlertMsg("Nie znaleziono nazw kolumn!");
            }
        }
        function onColumnsError(error) {
            console.log("StationComparison, fetch columns error: ", error);
            if (error.message != null)
                setAlertMsg(error.message);
            else
                setAlertMsg(error.toString());
            setMeasurementTypes(null);
        }
        console.log("StationComparison, attempting to fetch columns from: ", COLUMN_NAMES_PATH);
        GET(COLUMN_NAMES_PATH, onColumnsSuccess, onColumnsError);
    }, []
    );

    function onMeasurementTypesChange(event) {
        console.log("StationComparison, onMeasurementTypesChange, event:", event);
    }

    function onTimePeriodChange(event) {
        console.log("StationComparison, onTimePeriodChange, event:", event);
    }


    // var timerange = new TimeRange([begin, end]);     //przyda sieprzy zawężaniu przedziału czasowego wykresu

    console.log("StationComparison, requested stations data:", station1Data, station2Data);
    console.log("StationComparison, requested stations data:", station1MeasurementData, station2MeasurementData);

    //TODO może wydrębić wykresy do osobnego komponentu?
    //TODO dodać date nstacji pod tekstem 'Porównanie stacji o identyfikatorach...'
    return (
        <div>
            {alertMsg != null &&
                <Alert severity="warning">{alertMsg}</Alert>
            }
            {alertMsg == null &&
                <Grid container spacing={2}>
                    <Grid item xs={12}>
                        <h2>Porównanie stacji o identyfikatorach {station1Id} i {station2Id}:</h2>
                    </Grid>

                    <Grid item xs={3}>
                        <ChartOptions
                            asCheckBoxes={measurementTypes}
                            onCheckBoxesChange={onMeasurementTypesChange}
                            asTimePeriod={null}
                            onTimePeriodChangeChange={onTimePeriodChange}
                        />
                    </Grid>

                    <Grid item xs={9}>
                        <ChartContainer timeRange={series1.timerange()} width={800}>
                            <ChartRow height="200">
                                <YAxis id="axis1" label="AUD" min={0.5} max={1.5} width="60" type="linear" format="$,.2f" />
                                <Charts>
                                    <LineChart axis="axis1" series={series1} />
                                    <LineChart axis="axis2" series={series2} />
                                </Charts>
                                <YAxis id="axis2" label="Euro" min={0.5} max={1.5} width="80" type="linear" format="$,.2f" />
                            </ChartRow>
                        </ChartContainer>
                    </Grid>
                </Grid>
            }
        </div>
    )
}