import React from "react";

import Alert from '@material-ui/lab/Alert';
import CSVReader from 'react-csv-reader';
import DataTable from 'react-data-table-component';

import { STATION_PATH } from "../../util/REST/paths";
import GET from "../../util/REST/GET";

export default function Station(props) {
    console.log("Station, props:", props);
    const stationId = props.match.params.id;
    const [data, setData] = React.useState(null);
    const [measurements, setMeasurements] = React.useState([]);
    const [columns, setColumns] = React.useState([]);
    const [alertMsg, setAlertMsg] = React.useState(null);

    React.useEffect(() => {
        function onSuccess(json) {
            console.log("Station, fetchData SUCCESS, json: ", json);
            if (json != null) {
                setData(json);
                setAlertMsg(null);
            }
            else {
                setData(null);
                setAlertMsg("Nie znaleziono danych stacji o id: " + stationId);
            }
        }
        function onError(error) {
            console.log("Station, fetch data error: ", error);
            if (error.message != null)
                setAlertMsg(error.message);
            else
                setAlertMsg(error);
            setData(null);
        }

        GET(STATION_PATH + stationId, onSuccess, onError);

    }, [stationId]
    );

    const papaparseOptions = {
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
        let fileColumns = []
        Object.keys(data[0])
            .map(columnName => fileColumns.push(
                {
                    name: columnName,
                    selector: columnName
                }));
        setColumns(fileColumns);
        setMeasurements(data);
    }

    function handleError(error) {
        console.log("Station, handleError, handleError:", handleError);
    }

    console.log("Station, data:", data);
    console.log("Station, columns:", columns);
    console.log("Station, measurements:", measurements);
    console.log("Station, alertMsg:", alertMsg);

    return (
        <div>
            <h1>Stacja {data != null && data.name}</h1>
            {data != null && alertMsg == null &&
                <div>
                    <h2>Długość geograficzna: {data.longitude}</h2>
                    <h2>Szerokość geograficzna: {data.latitude}</h2>
                    <h2>Unikalny identyfikator stacji: {data.id}</h2>
                    <CSVReader
                        cssClass="csv-reader-input"
                        label="Wczytaj plik z danymi stacji "
                        onFileLoaded={handleUpload}
                        onError={handleError}
                        parserOptions={papaparseOptions}
                        inputId="ObiWan"
                        inputStyle={{ color: 'red' }}
                    />
                    <DataTable
                        pagination
                        highlightOnHover
                        columns={columns}
                        data={measurements}
                    />
                </div>
            }
            {alertMsg != null &&
                <Alert severity="warning">{alertMsg}</Alert>
            }
        </div>
    );
}
