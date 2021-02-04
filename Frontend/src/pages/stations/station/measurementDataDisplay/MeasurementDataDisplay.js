import React from "react";

import Alert from '@material-ui/lab/Alert';
import DataTable from 'react-data-table-component';

import { ALL_MEASUREMENTS_PATH } from "../../../util/REST/paths";
import GET from "../../../util/REST/GET";

export default function MeasurementDataDisplay({ stationId, ...props }) {

    const [displayData, setDisplayData] = React.useState(false);
    //[{measurementType: 'type', measurements:[{time, value}, ...]}, {...} ...]
    const [measurements, setMeasurements] = React.useState(null);
    const [columns, setColumns] = React.useState(null);
    const [alertMsg, setAlertMsg] = React.useState(null);

    function processMeasurements(json) {
        const timeColumn = {
            name: "Znacznik czasowy pomiaru",
            selector: 'time'
        }
        const newColumns = [timeColumn];

        json.forEach(measurements => {
            const newColumn = {
                name: measurements.measurementType,
                selector: (row, _) => row[measurements.measurementType]
            }
            newColumns.push(newColumn)
        });

        setColumns(newColumns);

        const data = {};

        json.forEach(measurementsGroup => {
            const type = measurementsGroup.measurementType;
            measurementsGroup.measurements.forEach( measurement => {
                let resultMeasurementObject = data[measurement.time];
                if (resultMeasurementObject != null)
                    resultMeasurementObject[type] = measurement.value;
                else{ 
                    resultMeasurementObject = {};
                    resultMeasurementObject[type] = measurement.value;
                    data[measurement.time] = resultMeasurementObject;
                }
            })
        })
        //at this point cosnt data should be a map: time -> measurements done at this time
        //where measurements is also a map: measurementType -> value of the measurement of this type at that time
        
        console.log("MeasurementDataDisplay, processMeasurements map time -> measurements: ", data);
        
        const processedData = Object.entries(data).map((entry) => {
            const time = entry[0];
            const values = entry[1];
            values['time'] = time;
            return values;
        });
        console.log("MeasurementDataDisplay, processMeasurements processedData: ", processedData);
        return processedData;
    }

    function fetchMeasurementsData() {
        function onMeasurementsSuccess(json) {
            console.log("MeasurementDataDisplay, fetchData SUCCESS, json: ", json);
            if (json != null) {
                const processedData = processMeasurements(json);
                setMeasurements(processedData);
                setAlertMsg(null);
            }
            else {
                setMeasurements(null);
                setAlertMsg("Nie znaleziono danych pomiarowych stacji o id: " + stationId);
            }
        }

        function onMeasurementsError(error) {
            console.log("MeasurementDataDisplay, fetch data error: ", error);
            if (error.message != null)
                setAlertMsg(error.message);
            else
                setAlertMsg(error);
            setMeasurements(null);
        }

        GET(ALL_MEASUREMENTS_PATH + stationId, onMeasurementsSuccess, onMeasurementsError);
    }


    //setState() does not immediately mutate this.state but creates a pending state transition. 
    //Accessing this.state after calling this method can potentially return the existing value. 
    function onButtonClicked() {
        const newDisplayDataFlag = !displayData; 
        if (newDisplayDataFlag && measurements == null) 
            fetchMeasurementsData();
        
        setDisplayData(!displayData);
    }

    console.log("MeasurementDataDisplay, columns: ", columns);
    console.log("MeasurementDataDisplay, measurements: ", measurements);

    return (
        <div>
            <button
                className='btn'
                onClick={onButtonClicked}
            >
                { displayData ? 'Ukryj dane pomiarowe stacji' : 'Pokaż dane pomiarowe stacji'}
            </button>
            {displayData && measurements != null && alertMsg == null &&
                <DataTable
                    pagination
                    columns={columns}
                    data={measurements}
                />
            }
            {alertMsg != null &&
                <Alert severity="warning">{alertMsg}</Alert>
            }
        </div>
    )
}