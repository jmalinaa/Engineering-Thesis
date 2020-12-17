import React from "react";

import Alert from '@material-ui/lab/Alert';
import Chart from './chart';
import Grid from '@material-ui/core/Grid';

import {
    STATION_PATH,
    COLUMN_NAMES_PATH,
    ALL_MEASUREMENTS_PATH,
    // CALIBRATION_PATH,
} from "../../util/REST/paths";
import GET from "../../util/REST/GET";
import { TimeRange } from "pondjs";
import makeStyles from './styles';
import useField from "../../../materialUiWrappers/useField";
import DefaultSelectField from "../../../materialUiWrappers/DefaultSelectField";
import CalibrationResults from "./calibrationResults/CalibrationResults";

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
    const [calibration, setCalibration] = React.useState(null);
    const referencialStationField = useField(station1Id);

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

    React.useEffect(() => {
        //TODO UNCOMMENT when endpoint is finished
        // function onCalibrationSuccess(json) {
        //     console.log("StationComparison, fetch calibration SUCCESS, json: ", json);
        //     if (json != null) {
        //         setCalibration(json);
        //         // setAlertMsg(null);
        //     }
        //     else {
        //         setCalibration(null);
        //         setAlertMsg("Nie znaleziono nazw kolumn!");
        //     }
        // }
        // function onCalibrationError(error) {
        //     console.log("StationComparison, fetch calibration error: ", error);
        //     if (error.message != null)
        //         setAlertMsg(error.message);
        //     else
        //         setAlertMsg(error.toString());
        //     setCalibration(null);
        // }
        // GET(CALIBRATION_PATH, onCalibrationSuccess, onCalibrationError);
        //TODO MOCK STARTS HERE
        const calibrationMock = {
            columnNames: ['temp', 'humi', 'pm1', 'pm25', 'pm10'],
            rowNames: ['temp', 'humi', 'pm1', 'pm25', 'pm10'],
            values: [
                ['X', -0.83, -0.31, -0.33, -0.34],
                [-0.83, 'X', -0.47, -0.49, -0.50],
                [-0.31, 0.47, 'X', -0.998, -0.996],
                [-0.33, 0.49, -0.998, 'X', -0.999],
                [-0.34, 0.50, -0.996, -0.999, 'X']
            ]
        }
        // TODO MOCK ENDS HERE
        const rows = [];
        calibrationMock.values.forEach((valuesList, index) => {
            const row = [calibrationMock.rowNames[index]].concat(valuesList);    //add row name at the beginning of the row
            rows.push(row);
        })
        calibrationMock.values = rows;
        calibrationMock.columnNames = ['agh'].concat(calibrationMock.columnNames);

        setCalibration(calibrationMock);
    }, [station1Id, station2Id]
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
                    {calibration != null &&
                        <Grid item xs={6}>
                            <CalibrationResults
                                calibration={calibration}
                            />
                        </Grid>
                    }
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