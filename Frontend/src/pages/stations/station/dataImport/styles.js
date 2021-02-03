import { makeStyles } from '@material-ui/core/styles';

export default makeStyles((theme) => ({
    button: {
        "&.Mui-disabled": {
            pointerEvents: "auto"
        }
    },
    formControl: {
        margin: theme.spacing(1),
        minWidth: 120,
    },
    selectEmpty: {
        marginTop: theme.spacing(2),
    },
}));
