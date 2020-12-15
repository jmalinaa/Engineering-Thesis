import React from "react";

import Alert from '@material-ui/lab/Alert';
import Chart from './chart';
import Grid from '@material-ui/core/Grid';

import {
    STATION_PATH,
    COLUMN_NAMES_PATH,
    ALL_MEASUREMENTS_PATH,
} from "../../util/REST/paths";
import GET from "../../util/REST/GET";
import { TimeRange } from "pondjs";
import makeStyles from './styles';
import useField from "../../../materialUiWrappers/useField";
import DefaultSelectField from "../../../materialUiWrappers/DefaultSelectField";

export default function StationsComparison({ ...props }) {
    console.log("StationComparison, props:", props);
    const styles = makeStyles();
    const station1Id = props.match.params.id1;
    const station2Id = props.match.params.id2;
    const [measurementTypes, setMeasurementTypes] = React.useState(null);
    const [station1Data, setStation1Data] = React.useState(null);
    const [station2Data, setStation2Data] = React.useState(null);
    const [station1MeasurementData, setStation1MeasurementData] = React.useState(null);
    const [station2MeasurementData, setStation2MeasurementData] = React.useState(null);
    const [seriesList, setSeriesList] = React.useState([]);
    const [timeRange, setTimeRange] = React.useState(null);
    const [alertMsg, setAlertMsg] = React.useState(null);
    const referencialStationField = useField(station1Id);

    function onTimePeriodChange(newTimePeriod) {
        console.log("StationComparison, onTimePeriodChange, newTimePeriod:", newTimePeriod);
        setTimeRange(new TimeRange(...newTimePeriod));
    }

    //TODO Wypadałoby rozdzdzielić stację 1 od stacji 2 zeby po zmianie jednej pobierała siętylko ta nowa a nie obie
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

        GET(ALL_MEASUREMENTS_PATH + station1Id,
            json => onGetSuccess(json, setStation1MeasurementData),     //TODO zastąpić filtrowanie nowym endpointem gdy Jasiek go doda
            error => onGetError(error, station1Id, setStation1MeasurementData)
        );
        GET(ALL_MEASUREMENTS_PATH + station2Id,
            json => onGetSuccess(json, setStation2MeasurementData),     //TODO zastąpić filtrowanie nowym endpointem gdy Jasiek go doda
            error => onGetError(error, station2Id, setStation2MeasurementData)
        );

    }, [station1Id, station2Id]
    );

    React.useEffect(() => {
        function onColumnsSuccess(json) {
            console.log("StationComparison, fetch columns SUCCESS, json: ", json);
            if (json != null) {
                setMeasurementTypes(json.filter(measurementType => measurementType != 'TIME' && measurementType != 'time'));
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
        GET(COLUMN_NAMES_PATH, onColumnsSuccess, onColumnsError);
    }, []
    );

    function pickTimerange() {
        if (timeRange != null)
            return timeRange;
        let seriesHavingTimerange = seriesList.find(series => series.timerange() != null)
        if (seriesHavingTimerange == null)
            return null;
        return seriesHavingTimerange.timerange();
    }

    let pickedTimeRange = pickTimerange();
    

    const chartStyle = null;

    console.log("StationComparison, seriesList:", seriesList);
    console.log("StationComparison, timeRange:", timeRange);
    console.log("StationComparison, pickedTimeRange:", pickedTimeRange);

    let station1NameInBracket = station1Data != null ? '('+station1Data.name + ')' : '';
    let station2NameInBracket = station2Data != null ? '('+station2Data.name + ')' : '';
    //TODO może wydrębić wykresy do osobnego komponentu?
    //TODO dodać dane stacji pod tekstem 'Porównanie stacji o identyfikatorach...'
    //TODO dodać więcej typów wykresów, np słupkowy https://software.es.net/react-timeseries-charts/#/example/barchart

    return (
        <div className={styles.root}>
            {alertMsg != null &&
                <Alert severity="warning">{alertMsg}</Alert>
            }
            {alertMsg == null &&
                <Grid container direction='row' spacing={2} >
                    <Grid item xs={12}>
                        <h2>Porównanie stacji o identyfikatorach {station1Id} {station1NameInBracket} i {station2Id} {station2NameInBracket}:</h2>
                        <DefaultSelectField
                            field={referencialStationField}
                            selectableValues={[station1Id, station2Id]}
                            label="Stacja referencyjna"
                        />
                    </Grid>
                    <Chart
                        stationIds={[station1Id, station2Id]}
                        measurementTypes={measurementTypes}
                        station1MeasurementData = {station1MeasurementData}
                        station2MeasurementData = {station2MeasurementData}
                        seriesList={seriesList}
                        setSeriesList={setSeriesList}
                        onTimePeriodChange={onTimePeriodChange}
                        pickedTimeRange={pickedTimeRange}
                    />
                </Grid>
            }
        </div>
    )
}