import React from "react";

import Alert from '@material-ui/lab/Alert';
import CSVReader from 'react-csv-reader';
import DataImport from './dataImport';

import { STATION_PATH, COLUMN_NAMES_PATH } from "../../util/REST/paths";
import GET from "../../util/REST/GET";

export default function Station(props) {
    console.log("Station, props:", props);
    const stationId = props.match.params.id;
    const [stationData, setStationData] = React.useState(null);
    const [acceptableColumns, setAcceptableColumns] = React.useState(null);
    const [measurements, setMeasurements] = React.useState([]);
    const [alertMsg, setAlertMsg] = React.useState(null);

    React.useEffect(() => {
        function onStationSuccess(json) {
            console.log("Station, fetchData SUCCESS, json: ", json);
            if (json != null) {
                setStationData(json);
                setAlertMsg(null);
            }
            else {
                setStationData(null);
                setAlertMsg("Nie znaleziono danych stacji o id: " + stationId);
            }
        }
        function onStationError(error) {
            console.log("Station, fetch data error: ", error);
            if (error.message != null)
                setAlertMsg(error.message);
            else
                setAlertMsg(error);
            setStationData(null);
        }

        GET(STATION_PATH + stationId, onStationSuccess, onStationError);

        function onColumnsSuccess(json) {
            console.log("Station, fetch columns SUCCESS, json: ", json);
            if (json != null) {
                setAcceptableColumns(json);
                setAlertMsg(null);
            }
            else {
                setAcceptableColumns(null);
                setAlertMsg("Nie znaleziono nazw kolumn!");
            }
        }
        function onColumnsError(error) {
            console.log("Station, fetch columns error: ", error);
            if (error.message != null)
                setAlertMsg(error.message);
            else
                setAlertMsg(error);
            setAcceptableColumns(null);
        }
        console.log("Station, attempting to fetch columns from: ", COLUMN_NAMES_PATH);
        GET(COLUMN_NAMES_PATH, onColumnsSuccess, onColumnsError);

    }, [stationId]
    );

    const parseOptions = {
        header: true,
        dynamicTyping: true,
        skipEmptyLines: true,
        transformHeader: header =>
            header
                .toLowerCase()
                .replace(/\W/g, '_')
    }

    function handleUpload(data, fileInfo) {
        console.log("Station, handleUpload, data:", data);
        console.log("Station, handleUpload, fileInfo:", fileInfo);
        setMeasurements(data);
    }

    function handleFileLoadError(error) {
        console.log("Station, handleFileLoadError, error:", error);
        setAlertMsg(error);
    }

    function handleSubmit(columnMappings, data) {
        console.log("Station, handleSubmit, columnMappings: ", columnMappings);
        console.log("Station, handleSubmit, data: ", data);
    }

    console.log("Station, stationData:", stationData);
    console.log("Station, columnNames:", acceptableColumns);
    console.log("Station, measurements:", measurements);
    console.log("Station, alertMsg:", alertMsg);

    return (
        <div>
            <h1>Stacja {stationData != null && stationData.name}</h1>
            {stationData != null && alertMsg == null &&
                <div>
                    <h2>Długość geograficzna: {stationData.longitude}</h2>
                    <h2>Szerokość geograficzna: {stationData.latitude}</h2>
                    <h2>Unikalny identyfikator stacji: {stationData.id}</h2>
                    <CSVReader
                        cssClass="csv-reader-input"
                        label="Wczytaj plik z danymi stacji "
                        onFileLoaded={handleUpload}
                        onError={handleFileLoadError}
                        parserOptions={parseOptions}
                        inputStyle={{ color: 'red' }}
                    />
                    {measurements.length > 0 && acceptableColumns != null &&
                        <DataImport
                            acceptableColumns={acceptableColumns}
                            data={measurements}
                            handleSubmit={handleSubmit}
                        />

                    }
                </div>
            }
            {alertMsg != null &&
                <Alert severity="warning">{alertMsg}</Alert>
            }
        </div>
    );
}
