import React from "react";

import Alert from '@material-ui/lab/Alert';
import Chart from './chart';
import Grid from '@material-ui/core/Grid';

import {
    STATION_PATH,
    COLUMN_NAMES_PATH,
    ALL_MEASUREMENTS_PATH,
    CALIBRATION_PATH,
} from "../../util/REST/paths";
import GET from "../../util/REST/GET";
import { TimeRange } from "pondjs";
import makeStyles from './styles';
import useField from "../../../materialUiWrappers/useField";
import DefaultSelectField from "../../../materialUiWrappers/DefaultSelectField";
import CorrelationTable from "./calibrationResults/CalibrationResults";

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
    const [timeRangeUserChose, setTimeRangeUserChose] = React.useState(null);
    const [timeRangeDefault, setTimeRangeDefault] = React.useState(null);
    const [alertMsg, setAlertMsg] = React.useState(null);
    const [correlation, setCorrelation] = React.useState(null);
    const [meanAndMaxDiffMap, setMeanAndMaxDiffMap] = React.useState(null);
    const [sameMeasurementTypes, setSameMeasurementTypes] = React.useState(null);
    const referencialStationField = useField('');

    function onTimePeriodManualChange(newTimePeriod) {
        console.log("StationComparison, onTimePeriodManualChange, newTimePeriod:", newTimePeriod);
        setTimeRangeUserChose(new TimeRange(...newTimePeriod));
    }

    //TODO Wypadałoby rozdzdzielić stację 1 od stacji 2 zeby po zmianie jednej pobierała siętylko ta nowa a nie obie
    React.useEffect(() => {
        function onGetSuccess(json, setter) {
            console.log("Station, fetchData SUCCESS, json: ", json);
            if (json == null)
                setAlertMsg("Nie znaleziono danych stacji o id: " + station1Id);
            // else
            // setAlertMsg(null);
            setter(json);
        }
        function onGetError(error, stationId, setter) {
            console.log("StationsComparison, fetch data error: ", error);
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
                setMeasurementTypes(json.filter(measurementType => measurementType.toUpperCase() !== 'TIME'));
                // setAlertMsg(null);
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

    function buildCorrelationTable(correlationResults) {
        const rows = [];
        correlationResults.correlationValues.forEach((valuesList, index) => {
            const row = [correlationResults.rowNames[index]].concat(valuesList);    //add row name at the beginning of the row
            rows.push(row);
        })
        correlationResults.values = rows;
        correlationResults.columnNames = ['agh'].concat(correlationResults.columnNames);
    }

    React.useEffect(() => {
        function onCalibrationSuccess(json) {
            console.log("StationComparison, fetch calibration SUCCESS, json: ", json);
            if (json != null) {
                buildCorrelationTable(json.correlationResult);
                setCorrelation(json.correlationResult);
                setMeanAndMaxDiffMap(json.meanAndMaxDiffMap);
                setSameMeasurementTypes(json.sameMeasurementTypes);
                // setAlertMsg(null);
            }
            else {
                setCorrelation(null);
                setAlertMsg("Nie znaleziono nazw kolumn!");
            }
        }
        function onCalibrationError(error, response) {
            console.log("StationComparison, fetch calibration error: ", error);
            if (response.status === 400)
                setAlertMsg(`Stacje ${station1Id} ${station1NameInBracket} i ${station2Id} ${station2NameInBracket}: za mało pomiarów dla przeprowadzenia kalibracji!`);
            else if (error.message != null)
                setAlertMsg(error.message);
            else
                setAlertMsg(error.toString());
            setCorrelation(null);
        }

        if (referencialStationField.get.value == '')
            return;

        const referencialStationId = referencialStationField.get.value;
        const calibratedStationId = station1Id === referencialStationId ? station2Id : station1Id;
        const path = CALIBRATION_PATH.replace('{refStation}', referencialStationId) + calibratedStationId;
        GET(path, onCalibrationSuccess, onCalibrationError);
    }, [station1Id, station2Id, referencialStationField.get.value]
    );

    function pickTimerange() {
        if (timeRangeUserChose != null)
            return timeRangeUserChose;
        let seriesHavingTimerange = seriesList.find(series => series.timerange() != null)
        if (seriesHavingTimerange == null)
            return null;
        const tr = seriesHavingTimerange.timerange();
        //to avoid "too many rerenders error" - apparently .timerange()
        // returns new object each time and react's shallow comparison sees it as a new state
        if (timeRangeDefault == null || timeRangesDiffer(tr, timeRangeDefault))
            setTimeRangeDefault(tr);
        return tr;
    }

    let pickedTimeRange = pickTimerange();      //TODO this time range is sometimes picked wrong

    console.log("StationComparison, seriesList:", seriesList);
    if (timeRangeUserChose != null)
        console.log("StationComparison, timeRangeUserChose:", timeRangeUserChose.toString());
    if (pickedTimeRange != null)
        console.log("StationComparison, pickedTimeRange:", pickedTimeRange.toString());

    let station1NameInBracket = station1Data != null ? '(' + station1Data.name + ')' : '';
    let station2NameInBracket = station2Data != null ? '(' + station2Data.name + ')' : '';
    //TODO dodać dane stacji pod tekstem 'Porównanie stacji o identyfikatorach...'
    //TODO dodać więcej typów wykresów, np słupkowy https://software.es.net/react-timeseries-charts/#/example/barchart

    console.log("StationsComparison, sameMeasurementTypes: ", sameMeasurementTypes);
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
                            selectableValues={['', station1Id, station2Id]}
                            label="Stacja referencyjna"
                        />
                    </Grid>
                    <Grid item xs={12}>
                        <Chart
                            stationIds={[station1Id, station2Id]}
                            measurementTypes={measurementTypes}
                            station1MeasurementData={station1MeasurementData}
                            station2MeasurementData={station2MeasurementData}
                            seriesList={seriesList}
                            setSeriesList={setSeriesList}
                            onTimePeriodManualChange={onTimePeriodManualChange}
                            pickedTimeRange={pickedTimeRange}
                        />
                    </Grid>
                    {correlation != null &&
                        <Grid item xs={6}>
                            <CorrelationTable
                                correlation={correlation}
                            />
                        </Grid>
                    }
                    <Grid item xs={6} container direction='column'>
                        {meanAndMaxDiffMap != null &&
                            <Grid item xs={12} container direction='column'>
                                {Object.keys(meanAndMaxDiffMap).map((measurementType, index) => {
                                    const meanDiff = meanAndMaxDiffMap[measurementType].meanDiff;
                                    const maxDiff = meanAndMaxDiffMap[measurementType].maxDiff;
                                    return <b key={index}>{measurementType}: średnia różnica: {meanDiff}, maksymalna różnica: {maxDiff} </b>
                                })}
                            </Grid>
                        }
                    </Grid>
                </Grid>
            }
        </div>
    )
}

function timeRangesDiffer(tr1, tr2) {
    const begin1 = tr1.begin().valueOf();    //returns number of milliseconds since "begginning of time"
    if (begin1 !== tr2.begin().valueOf())
        return true
    const end1 = tr1.end().valueOf();    //returns number of milliseconds since "begginning of time"
    if (end1 !== tr2.end().valueOf())
        return true;
    return false;
}