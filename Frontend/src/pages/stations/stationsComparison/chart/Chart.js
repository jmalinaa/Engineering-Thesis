import React from "react";

import Alert from '@material-ui/lab/Alert';
import Box from '@material-ui/core/Box';
import Grid from '@material-ui/core/Grid';
import { Charts, ChartContainer, ChartRow, YAxis, LineChart } from "react-timeseries-charts";
import ChartOptions from './chartOptions';

import { colors } from './styles';
import { createLinesStyles } from './styles';
import makeStyles from './styles';
import moment from 'moment';
import { TimeSeries } from "pondjs";

export default function Chart({
    measurementTypes, station1MeasurementData, station2MeasurementData, station3MeasurementData,
    pickedTimeRange, onTimePeriodManualChange, stationIds, seriesList, setSeriesList, ...props }) {

    const styles = makeStyles();
    const [chartColumns, setChartColumns] = React.useState([]);
    const [stylesList, setStylesList] = React.useState([]);

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
            let time = moment.utc(measurement.time, "LLL");
            let value = measurement.value;
            return [time.toDate().valueOf(), value]
        })
        return ({
            name: name,
            columns: ["time", type],
            points: points
        })
    }

    function onMeasurementTypesChange(typesBitmap) {
        let newDataList = [];
        let newStylesList = [];
        let measurementTypesToDraw = []
        typesBitmap.forEach((bit, index) => {
            if (bit) {
                const measurementType = measurementTypes[index];
                measurementTypesToDraw.push(measurementType);
                newDataList.push(createDataStructForType(station1MeasurementData, measurementType, stationIds[0]))
                newDataList.push(createDataStructForType(station2MeasurementData, measurementType, stationIds[1]))
                newStylesList.push(createLinesStyles(measurementType, stationIds[0], colors[index * 3]))
                newStylesList.push(createLinesStyles(measurementType, stationIds[1], colors[index * 3 + 1]))
                if (station3MeasurementData != null) {
                    newDataList.push(createDataStructForType(station3MeasurementData, measurementType, stationIds[2]))
                    newStylesList.push(createLinesStyles(measurementType, stationIds[2], colors[index * 3 + 2]))
                }
            }
        })
        setChartColumns(measurementTypesToDraw);
        console.log("Chart, onMeasurementTypesChange, newDataList:", newDataList);

        let newSeriesList = newDataList.map(data => new TimeSeries(data))
        setSeriesList(newSeriesList);
        setStylesList(newStylesList);
    }

    function pickValueRanges(pickedTimeRange) {
        let seriesHavingTimerange = seriesList.filter(series => series.timerange() != null)
        if (seriesHavingTimerange == null)
            return null;
        let min = 0;
        let max = 0;
        seriesHavingTimerange.forEach(series => {
            const croppedSeries = series.crop(pickedTimeRange); //http://software.es.net/pond/#crop
            const valuesColumns = croppedSeries.columns().filter(column => column !== "time");
            min = Math.min(min, croppedSeries.min(valuesColumns.join(',')))
            max = Math.max(max, croppedSeries.max(valuesColumns.join(',')))    //http://software.es.net/pond/#max
        })
        return { min: min, max: max }
    }

    let valueRanges = pickValueRanges(pickedTimeRange)

    console.log("Chart, chartColumns:", chartColumns);
    if (pickedTimeRange != null)
        console.log("StationComparison, pickedTimeRange:", pickedTimeRange.toString());

    return (
        <Grid container direction='row' spacing={2} >
            {measurementTypes != null &&
                <Grid item xs={2}>
                    <ChartOptions
                        asCheckBoxes={measurementTypes}
                        onCheckBoxesChange={onMeasurementTypesChange}
                        asTimePeriod={pickedTimeRange != null ? [pickedTimeRange.begin(), pickedTimeRange.end()] : null}
                        onTimePeriodManualChange={onTimePeriodManualChange}
                        colorsList={colors}
                    />
                </Grid>
            }
            {seriesList.length > 0 && pickedTimeRange != null &&
                <Grid item xs={9} container direction='column'>
                    <ChartContainer timeRange={pickedTimeRange} showGrid width={1600}>
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
                    <Grid container direction='row'>
                        {stylesList.map((style, index) =>
                            <Grid item xs={3} container direction='row' key={index}>
                                <Grid item xs={2}>
                                    <Box bgcolor={style.color} color={style.color} className={styles.colorBox}>
                                        ' '
                                </Box>
                                </Grid>
                                <Grid item>
                                    <h4>Stacja {style.station}, {style.measurementType}</h4>
                                </Grid>
                            </Grid>
                        )}
                    </Grid>
                </Grid>
            }
            {seriesList.length > 0 && pickedTimeRange == null &&
                <Alert severity="warning">Nieprawidłowy zakres czasu lub brak pomiarów żądanego typu.</Alert>
            }
        </Grid>
    )
}