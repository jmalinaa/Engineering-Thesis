import React from 'react';
import Alert from '@material-ui/lab/Alert';
import Button from '@material-ui/core/Button';
import Dialog from '@material-ui/core/Dialog';
import DialogActions from '@material-ui/core/DialogActions';
import DialogContent from '@material-ui/core/DialogContent';
import DialogTitle from '@material-ui/core/DialogTitle';
import PropTypes from 'prop-types';


export default function ConfirmationDialog({open, message, severity, handleClose, ...props}) {


    return (
        <div>
            <Dialog open={open} onClose={handleClose}>
                <DialogTitle id="form-dialog-title">Wynik operacji:</DialogTitle>
                <DialogContent>
                    <Alert severity={severity}>
                        {message}
                    </Alert>
                </DialogContent>
                <DialogActions>
                    <Button onClick={handleClose} color="primary">
                        OK
                    </Button>
                </DialogActions>
            </Dialog>
        </div>
    );
}

ConfirmationDialog.propTypes = {
    open: PropTypes.bool.isRequired,
    message: PropTypes.string.isRequired,
    severity: PropTypes.oneOf(['error', 'info', 'success', 'warning']),
}