import React from "react";

import Alert from '@material-ui/lab/Alert';
import Box from '@material-ui/core/Box';
import Grid from '@material-ui/core/Grid';
import { Charts, ChartContainer, ChartRow, YAxis, LineChart } from "react-timeseries-charts";
import ChartOptions from './chartOptions';

import {
    STATION_PATH,
    COLUMN_NAMES_PATH,
    ALL_MEASUREMENTS_PATH,
} from "../../util/REST/paths";
import GET from "../../util/REST/GET";
import moment from 'moment';
import { TimeRange, TimeSeries } from "pondjs";
import makeStyles from './styles';
import { colors } from './styles';
import { createLinesStyles } from './styles';

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
    const [chartColumns, setChartColumns] = React.useState([]);
    const [seriesList, setSeriesList] = React.useState([]);
    const [stylesList, setStylesList] = React.useState([]);
    const [timeRange, setTimeRange] = React.useState(null);
    const [alertMsg, setAlertMsg] = React.useState(null);

    function findMeasurementsOfType(measurementsStructsList, type) {
        if (measurementsStructsList == null)
            return [];
        const structWithRequestedType = measurementsStructsList.find(measurementStruct => measurementStruct.measurementType === type);
        if (structWithRequestedType == null)
            return [];
        return structWithRequestedType.measurements;
    }

    function createDataStructForType(measurements, type, name) {
        let measurementsOfTheType = findMeasurementsOfType(measurements, type);
        const points = measurementsOfTheType.map(measurement => {
            // moment.locale();
            // let time = moment.utc(measurement.time, "llll");
            let time = moment.utc(measurement.time, "LLL");
            // let time = moment.utc(measurements.time, "MMM DD, YYYY, hh:mm:ss AA", true);
            let value = measurement.value;
            return [time.toDate().valueOf(), value]
        })
        return ({
            name: name,
            columns: ["time", type],
            points: points
        })
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

    function onMeasurementTypesChange(typesBitmap) {
        console.log("StationComparison, onMeasurementTypesChange, typesBitmap:", typesBitmap);
        //TODO here 
        //najpierw coś prostego, same PM10
        let newDataList = [];
        let newStylesList = [];
        let measurementTypesToDraw = []
        typesBitmap.forEach((bit, index) => {
            if (bit) {
                const measurementType = measurementTypes[index];
                measurementTypesToDraw.push(measurementType);
                newDataList.push(createDataStructForType(station1MeasurementData, measurementType, station1Id))
                newDataList.push(createDataStructForType(station2MeasurementData, measurementType, station2Id))
                newStylesList.push(createLinesStyles(measurementType, station1Id, colors[index * 2]))
                newStylesList.push(createLinesStyles(measurementType, station2Id, colors[index * 2 + 1]))
            }
        })
        setChartColumns(measurementTypesToDraw);
        console.log("StationComparison, onMeasurementTypesChange, newDataList:", newDataList);

        let newSeriesList = newDataList.map(data => new TimeSeries(data))
        setSeriesList(newSeriesList);
        setStylesList(newStylesList);
    }

    function onTimePeriodChange(newTimePeriod) {
        console.log("StationComparison, onTimePeriodChange, newTimePeriod:", newTimePeriod);
        setTimeRange(new TimeRange(...newTimePeriod));
    }


    // var timerange = new TimeRange([begin, end]);     //przyda sieprzy zawężaniu przedziału czasowego wykresu

    console.log("StationComparison, requested stations data:", station1Data, station2Data);
    console.log("StationComparison, requested stations data:", station1MeasurementData, station2MeasurementData);

    function pickTimerange() {
        if (timeRange != null)
            return timeRange;
        let seriesHavingTimerange = seriesList.find(series => series.timerange() != null)
        if (seriesHavingTimerange == null)
            return null;
        return seriesHavingTimerange.timerange();
    }

    function pickValueRanges() {
        let seriesHavingTimerange = seriesList.filter(series => series.timerange() != null)
        if (seriesHavingTimerange == null)
            return null;
        let min = 0;
        let max = 0;
        seriesHavingTimerange.forEach(series => {
            const valuesColumns = series.columns().filter(column => column !== "time");
            min = Math.min(min, series.min(valuesColumns.join(',')))
            max = Math.max(max, series.max(valuesColumns.join(',')))
        })
        return { min: min, max: max }
    }


    let pickedTimeRange = pickTimerange();
    let valueRanges = pickValueRanges()

    const chartStyle = null;

    console.log("StationComparison, seriesList:", seriesList);
    console.log("StationComparison, chartColumns:", chartColumns);
    console.log("StationComparison, timeRange:", timeRange);
    console.log("StationComparison, pickedTimeRange:", pickedTimeRange);

    //TODO może wydrębić wykresy do osobnego komponentu?
    //TODO dodać dane stacji pod tekstem 'Porównanie stacji o identyfikatorach...'

    // TODO ZORBIĆ min i max wartości pomiaru zmiennymi!
    // TODO DODAĆ CZAS
    return (
        <div>
            {alertMsg != null &&
                <Alert severity="warning">{alertMsg}</Alert>
            }
            {alertMsg == null &&
                <Grid container direction='row' spacing={2}>
                    <Grid item xs={12}>
                        <h2>Porównanie stacji o identyfikatorach {station1Id} i {station2Id}:</h2>
                    </Grid>
                    {measurementTypes != null &&
                        <Grid item xs={3}>
                            <ChartOptions
                                asCheckBoxes={measurementTypes}
                                onCheckBoxesChange={onMeasurementTypesChange}
                                asTimePeriod={pickedTimeRange != null ? [pickedTimeRange.begin(), pickedTimeRange.end()] : null}
                                onTimePeriodChange={onTimePeriodChange}
                                colorsList={colors}
                                station1Id={station1Id}
                                station2Id={station2Id}
                            />
                        </Grid>
                    }
                    {seriesList.length > 0 && pickedTimeRange != null &&
                        <Grid item xs={9} container direction='column'>
                            <ChartContainer timeRange={pickedTimeRange} width={800}>
                                <ChartRow height="200">
                                    <YAxis id="axis1"
                                        label="wartość pomiaru"
                                        min={valueRanges.min}
                                        max={valueRanges.max}
                                        width="60"
                                        type="linear"
                                        format=",.2f" />
                                    <Charts>
                                        {seriesList.map((series, index) =>
                                            <LineChart axis="axis1" series={series} columns={chartColumns} style={stylesList[index]} key={index} />
                                        )}
                                    </Charts>
                                </ChartRow>
                            </ChartContainer>
                            {stylesList.map((style, index) =>
                                <Grid container key={index}>
                                    <Grid item xs={1}>
                                        <Box bgcolor={style.color} color={style.color} className={styles.colorBox}>
                                            '   '
                                        </Box>
                                    </Grid>
                                    <Grid item>
                                        <h3>Stacja {style.station}, {style.measurementType}</h3>
                                    </Grid>
                                </Grid>
                            )}
                        </Grid>
                    }
                    {seriesList.length > 0 && pickedTimeRange == null &&
                        <Alert severity="warning">Nieprawidłowy zakres czasu lub brak pomiarów żądanego typu.</Alert>
                    }
                </Grid>
            }
        </div>
    )
}