import React from 'react';
import Button from '@material-ui/core/Button';
import Dialog from '@material-ui/core/Dialog';
import DialogActions from '@material-ui/core/DialogActions';
import DialogContent from '@material-ui/core/DialogContent';
import DialogContentText from '@material-ui/core/DialogContentText';
import DialogTitle from '@material-ui/core/DialogTitle';
import AddStationForm from './addStationForm/AddStationForm';


export default function StationManager({ handleSubmit, handleClose, open, newStationLocation, ...props }) {

    const [nameKeeper] = React.useState({});        //no need for setters, these are just data-keepers
    const [longitudeKeeper] = React.useState({});   
    const [latitudeKeeper] = React.useState({});

    function changeNameHandler(event) {
        nameKeeper.name = event.target.value;
    }

    function changeLongitudeHandler(event) {
        longitudeKeeper.longitude = event.target.value;
    }

    function changeLatitudeHandler(event) {
        latitudeKeeper.latitude = event.target.value;
    }

    function handleSubmitWrapper() {
        const stationData = {
            name: nameKeeper.name,
            longitude: longitudeKeeper.longitude,
            latitude: latitudeKeeper.latitude
        }
        handleSubmit(stationData);
    }

    // TODO dodać mapę zamiast wpisywania lokalizacji ręcznie
    // TODO dodać powiadomienie o sukcesie lub niepowodzeniu
    return (
        <div>
            <Dialog open={open} onClose={handleClose}>
                <DialogTitle id="form-dialog-title">Dodawanie nowej stacji</DialogTitle>
                <DialogContent>
                    <DialogContentText>
                        Wpisz dane nowej stacji:
                    </DialogContentText>
                    <AddStationForm
                        changeNameHandler={changeNameHandler}
                        changeLongitudeHandler={changeLongitudeHandler}
                        changeLatitudeHandler={changeLatitudeHandler}
                        preset={newStationLocation}
                    />
                </DialogContent>
                <DialogActions>
                    <Button onClick={handleClose} color="primary">
                        Anuluj
                    </Button>
                    <Button onClick={handleSubmitWrapper} color="primary">
                        Zatwierdź
                    </Button>
                </DialogActions>
            </Dialog>
        </div>
    );
}