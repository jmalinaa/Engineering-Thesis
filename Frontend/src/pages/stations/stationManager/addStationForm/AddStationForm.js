import React from 'react';

import Input from '@material-ui/core/Input';
import Grid from '@material-ui/core/Grid';

export default function AddStationForm(props) {
    return(
        <Grid container spacing={2} direction='column'>
            <Input placeholder="Nazwa" onChange={props.changeNameHandler} />
            <Input placeholder="Długość geograficzna" onChange={props.changeLongitudeHandler} />
            <Input placeholder="Szerokość geograficzna" onChange={props.changeLatitudeHandler} />
        </Grid>
    )
}