import React from "react";

import Alert from '@material-ui/lab/Alert';
import ReactFileReader from 'react-file-reader';
import readXlsxFile from 'read-excel-file'
import DataImport from './dataImport';

import {
    STATION_PATH,
    COLUMN_NAMES_PATH,
    IMPORT_MEASUREMENTS_FILE_PATH
} from "../../util/REST/paths";
import GET from "../../util/REST/GET";
import * as Papa from 'papaparse';
import MeasurementDataDisplay from "./measurementDataDisplay/MeasurementDataDisplay";
import CalibrationFormulas from "./calibrationFormulas";


export default function Station(props) {
    console.log("Station, props:", props);
    const stationId = props.match.params.id;
    const [stationData, setStationData] = React.useState(null);
    const [isCalibrable, setCalibrable] = React.useState(null); //indicates if it's possible to import new data
    const [acceptableColumns, setAcceptableColumns] = React.useState(null); //TODO może możliwość ignorowania kolumn?
    const [measurements, setMeasurements] = React.useState([]);
    const [uploadedFile, setUploadedFile] = React.useState(null);
    const [alertMsg, setAlertMsg] = React.useState(null);
    const [infoMsg, setInfoMsg] = React.useState(null);
    const [successMsg, setSuccessMsg] = React.useState(null);

    React.useEffect(() => {
        function onStationSuccess(json) {
            console.log("Station, fetchData SUCCESS, json: ", json);
            if (json != null) {
                setStationData(json);
                setCalibrable(json.parentId == null);
            }
            else {
                setStationData(null);
                setCalibrable(null);
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

    function handleUpload(filesList) {
        setSuccessMsg(null);
        setMeasurements([]);
        const file = filesList[0];      //assuming multipleFiles={false}
        setUploadedFile(file);
        const fileName = file.name;
        console.log("Station, handleUpload, file:", file);
        console.log("Station, handleUpload, fileName:", fileName);
        if (fileName.endsWith('.csv')) {
            console.log("Station, handleUpload, it's a CSV");
            Papa.parse(file, {
                complete: function (results) {
                    console.log("Station, handleUpload, Papa parse result:", results);
                    setMeasurements(results.data);
                },
                error: function (error, file, inputElem, reason) {
                    handleFileLoadError(
                        'Error while parsing CSV file in row ' + error.row + ': ' + error.message + ' Reason: ' + reason
                    );
                }
            })
        }
        if (fileName.endsWith('.xls') || fileName.endsWith('.xlsx')) {
            console.log("Station, handleUpload, it's an Excel file");
            readXlsxFile(file).then(rows => {
                console.log("Station, handleUpload, rows: ", rows);
                setMeasurements(rows);
            }, handleFileLoadError);
        }
    }

    function handleFileLoadError(error) {
        console.log("Station, handleFileLoadError, error:", error);
        setAlertMsg(error.toString());
    }


    function handleOnReadyStateChanged(request) {
        if (request.readyState === XMLHttpRequest.DONE) {
            var status = request.status;
            if (status === 0 || (status >= 200 && status < 400)) {
                console.log("Import danych powiódł się ");
                setSuccessMsg("Import danych powiódł się ");
                setInfoMsg(null);
                setMeasurements([]);
                setUploadedFile(null);
            } else {
                console.log("Import danych zakończył się niepowodzeniem. Request ", request);
                setAlertMsg("Wystąpił błąd podczas wysyłania danych pomiarów. Kod odpowiedzi: " + request.status)
            }
        }
    }

    function handleSubmit(columnMappings, data) {
        console.log("Station, handleSubmit, columnMappings: ", columnMappings);
        console.log("Station, handleSubmit, data: ", data);
        console.log("Station, handleSubmit, file: ", uploadedFile);
        var formData = new FormData();

        formData.append("file", uploadedFile);
        formData.append("stationId", stationId);
        formData.append("columns", JSON.stringify(columnMappings));

        var request = new XMLHttpRequest();
        request.onreadystatechange = () => handleOnReadyStateChanged(request);
        request.open("POST", IMPORT_MEASUREMENTS_FILE_PATH, true);
        request.send(formData);
        setInfoMsg("Import w toku");
    }

    console.log("Station, stationData:", stationData);
    console.log("Station, columnNames:", acceptableColumns);
    console.log("Station, measurements:", measurements);
    console.log("Station, alertMsg:", alertMsg);

    //TODO dodać dane z czujnika w tabeli

    return (
        <div>
            <h1>Stacja {stationData != null && stationData.name}</h1>
            {stationData != null && alertMsg == null && infoMsg == null &&
                <div>
                    <h2>Szerokość geograficzna: {stationData.latitude}</h2>
                    <h2>Długość geograficzna: {stationData.longitude}</h2>
                    <h2>Unikalny identyfikator stacji: {stationData.id}</h2>
                    {stationData.calibrationResults != null &&
                        <CalibrationFormulas
                            calibrationResults={stationData.calibrationResults}
                        />
                    }
                    {isCalibrable &&
                        <ReactFileReader
                            handleFiles={handleUpload}
                            multipleFiles={false}
                            fileTypes={'.xlsx,.xls,.csv'}
                        >
                            <button className='btn'>Wczytaj plik z danymi stacji </button>
                        </ReactFileReader>
                    }
                    {measurements.length > 0 &&
                        acceptableColumns != null &&
                        successMsg == null &&
                        <DataImport
                            acceptableColumns={acceptableColumns}
                            data={measurements}
                            handleSubmit={handleSubmit}
                        />
                    }
                </div>
            }
            {stationData != null && alertMsg == null &&
                <MeasurementDataDisplay
                    stationId={stationId}
                />
            }
            {infoMsg != null &&
                <Alert severity="info">{infoMsg}</Alert>
            }
            {alertMsg != null &&
                <Alert severity="warning">{alertMsg}</Alert>
            }
            {successMsg != null &&
                <Alert severity="success">{successMsg}</Alert>
            }
        </div>
    );
}
