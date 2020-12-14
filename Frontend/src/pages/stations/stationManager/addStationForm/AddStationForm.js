import React from 'react';

import Input from '@material-ui/core/Input';
import Grid from '@material-ui/core/Grid';

export default function AddStationForm(props) {
    const preset = props.preset;

    const [latitude, setLatitude] = React.useState(preset != null ? preset.lat : '')
    const [longitude, setLongitude] = React.useState(preset != null ? preset.lng : '')

    const fabricatedEvent = {
        target: {
            value: latitude
        }
    }
    props.changeLatitudeHandler(fabricatedEvent);
    fabricatedEvent.target.value = longitude;
    props.changeLongitudeHandler(fabricatedEvent);

    return (
        <Grid container spacing={2} direction='column'>
            <Input
                placeholder="Nazwa"
                onChange={props.changeNameHandler}
            />
            <Input
                placeholder="Szerokość geograficzna"
                onChange={evt => {
                    props.changeLatitudeHandler(evt);
                    setLatitude(evt.target.value)
                }}
                value={latitude}
            />
            <Input
                placeholder="Długość geograficzna"
                onChange={evt => {
                    props.changeLongitudeHandler(evt);
                    setLongitude(evt.target.value)
                }}
                value={longitude}
            />
        </Grid>
    )
}