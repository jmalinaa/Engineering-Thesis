import React from "react";

import { MapContainer, Marker, Popup, TileLayer, useMapEvent } from "react-leaflet";
import L from 'leaflet';

delete L.Icon.Default.prototype._getIconUrl;

L.Icon.Default.mergeOptions({
    iconRetinaUrl: require('leaflet/dist/images/marker-icon-2x.png'),
    iconUrl: require('leaflet/dist/images/marker-icon.png'),
    shadowUrl: require('leaflet/dist/images/marker-shadow.png')
});

const temporaryIcon = new L.Icon({
    iconRetinaUrl: require('leaflet/dist/images/marker-icon-2x.png'),
    iconUrl: require('../../../customIcons/temporary-marker-icon.png'),
    shadowUrl: require('leaflet/dist/images/marker-shadow.png'),
    iconAnchor: [12,39],
    shadowSize: null,
    shadowAnchor: null,
})


export default function StationsMap({ stations, onTemporaryMarker, ...props }) {

    const [temporaryMarker, setTemporaryMarker] = React.useState(null);

    function MyComponent() {
        const map = useMapEvent('click', event => {
            console.log('StationsMap, event: ', event);
            onTemporaryMarker(event.latlng);
            setTemporaryMarker(event.latlng);
        })
        return null
    }



    return (
        <MapContainer center={[50.05, 19.9]} zoom={13} scrollWheelZoom={true}>
            <TileLayer
                attribution='&copy; <a href="http://osm.org/copyright">OpenStreetMap</a> contributors'
                url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
            />
            {stations.map((station, index) =>
                <Marker position={[station.latitude, station.longitude]} key={index}>
                    <Popup>
                        {station.name}, ID: {station.id}: [{station.latitude}, {station.longitude}]
                    </Popup>
                </Marker>
            )}
            {temporaryMarker != null &&
                <Marker position={[temporaryMarker.lat, temporaryMarker.lng]} icon={temporaryIcon}>
                    <Popup>
                        [{temporaryMarker.lat}, {temporaryMarker.lng}] <p />
                        Kliknij przycisk dodawania stacji aby dodać tutaj nową stację
                    </Popup>
                </Marker>
            }
            <MyComponent />
        </MapContainer>
    )
}