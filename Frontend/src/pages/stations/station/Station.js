import React from "react";

import Alert from '@material-ui/lab/Alert';

import { STATION_PATH } from "../../util/REST/paths";
import GET from "../../util/REST/GET";

export default function Station(props) {
    console.log("Station, props:", props);
    const stationId = props.match.params.id;
    const [data, setData] = React.useState(null);
    const [alertMsg, setAlertMsg] = React.useState(null);

    React.useEffect(() => {
        function onSuccess(json) {
            console.log("Station, fetchData SUCCESS, json: ", json);
            if (json != null && json.length > 0) {
                setData(json[0]);   //it's a list with 0 or one element since station id is unique
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

        GET(STATION_PATH + "/" + stationId, onSuccess, onError);

    }, [stationId]
    );

    console.log("Station, data:", data);
    console.log("Station, alertMsg:", alertMsg);

    return (
        <div>
            <h1>Station {stationId}</h1>
            {data != null && alertMsg == null &&
                <div>
                    <h2>Długość geograficzna: {data.longitude}</h2>
                    <h2>Szerokość geograficzna: {data.latitude}</h2>
                    <h2>Nazwa stacji: {data.station_name}</h2>
                </div>
            }
            {alertMsg != null &&
                <Alert severity="warning">{alertMsg}</Alert>
            }
        </div>
    );
}