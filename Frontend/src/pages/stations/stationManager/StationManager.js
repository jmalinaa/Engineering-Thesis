import React from 'react';
import Button from '@material-ui/core/Button';
import Dialog from '@material-ui/core/Dialog';
import DialogActions from '@material-ui/core/DialogActions';
import DialogContent from '@material-ui/core/DialogContent';
import DialogContentText from '@material-ui/core/DialogContentText';
import DialogTitle from '@material-ui/core/DialogTitle';
import AddStationForm from './addStationForm/AddStationForm';


export default function StationManager({ handleSubmit, handleClose, open, ...props }) {

    const [name, setName] = React.useState(null);
    const [longitude, setLongitude] = React.useState(null);
    const [latitude, setLatitude] = React.useState(null);

    function changeNameHandler(event) {
        setName(event.target.value);
    }

    function changeLongitudeHandler(event) {
        setLongitude(event.target.value)
    }

    function changeLatitudeHandler(event) {
        setLatitude(event.target.value)
    }

    function handleSubmitWrapper() {
        const stationData = {
            name: name,
            longitude: longitude,
            latitude: latitude
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