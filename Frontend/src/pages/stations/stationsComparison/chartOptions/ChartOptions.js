import React from "react";

import CheckBox from '@material-ui/core/CheckBox';
import FormLabel from '@material-ui/core/FormLabel';
import FormControl from '@material-ui/core/FormControl';
import FormGroup from '@material-ui/core/FormGroup';
import FormControlLabel from '@material-ui/core/FormControlLabel';
import TextField from '@material-ui/core/TextField';
import PropTypes from 'prop-types';

import makeStyles from './styles';

export default function ChartOptions({ asCheckBoxes, onCheckBoxesChange, asTimePeriod, onTimePeriodChange, ...props }) {

    const classes = makeStyles();

    let checkBoxFields = new Array(asCheckBoxes.length).fill(false);

    const [checkBoxesValues] = React.useState(checkBoxFields);  //keep in mind this is just the initial values
    const [dateTimeValues] = React.useState([]);
    const [refershValue, setRefreshValue] = React.useState(0);

    function refresh() {
        setRefreshValue(refershValue + 1);
    }

    if (dateTimeValues.length < 2 && asTimePeriod != null) {
        dateTimeValues[0] = asTimePeriod[0];
        dateTimeValues[1] = asTimePeriod[1];
    }

    function onCheckBoxChange(index, checked) {
        console.log("ChartOptions, onCheckBoxChange: ", index, checked);
        checkBoxesValues[index] = checked;
        onCheckBoxesChange(checkBoxesValues);
        refresh();
    }

    function setDateFromString(dateObject, newDateAsString) {
        let [fullYear, month, day] = newDateAsString.split('-');
        dateObject.setFullYear(fullYear);
        dateObject.setMonth(month, day);
    }

    function setTimeFromString(dateObject, newTime) {
        let [hours, minutes] = newTime.split(':')
        dateObject.setHours(hours, minutes);
    }

    function onDateChange(index, newDate) {
        console.log("ChartOptions, onDateChange: ", index, newDate);
        setDateFromString(dateTimeValues[index], newDate);
        onTimePeriodChange(dateTimeValues);
        refresh();
    }

    function onTimeChange(index, value) {
        console.log("ChartOptions, onTimeChange: ", index, value);
        setTimeFromString(dateTimeValues[index], value);
        onTimePeriodChange(dateTimeValues);
        refresh();
    }

    function dateToString(dateObject) {
        let res = "" + dateObject.getFullYear() + "-";
        let month = (dateObject.getMonth() + 1);      //months have 0-based indexing
        if (month < 10)
            month = "0" + month;
        res += month + "-"
        let dayOfMoth = dateObject.getDate();
        if (dayOfMoth < 10)
            dayOfMoth = "0" + dayOfMoth;
        return res += dayOfMoth;
    }

    function timeToString(dateObject) {
        let hours = dateObject.getHours();
        if (hours < 10)
            hours = '0' + hours;

        let minutes = dateObject.getMinutes();
        if (minutes < 10)
            minutes = '0' + minutes;

        return "" + hours + ":" + minutes;
    }

    let beginDate = null;
    let beginTime = null;
    let endDate = null;
    let endTime = null;
    // let beginDate = asTimePeriod != null ? asTimePeriod[0] : null;
    // let endDate = asTimePeriod != null ? asTimePeriod[1] : null;

    if (dateTimeValues != null) {
        if (dateTimeValues[0] != null) {
            beginDate = dateTimeValues[0];
            beginTime = dateTimeValues[0];
        }
        if (dateTimeValues[1] != null) {
            endDate = dateTimeValues[1];
            endTime = dateTimeValues[1];
        }
    }

    if (beginDate != null)
        beginDate = dateToString(beginDate);
    if (beginTime != null)
        beginTime = timeToString(beginTime);
    if (endDate != null)
        endDate = dateToString(endDate);
    if (endTime != null)
        endTime = timeToString(endTime);

    console.log("ChartOptions, asTimePeriod: ", asTimePeriod);
    console.log("ChartOptions, beginDate: ", beginDate);
    console.log("ChartOptions, beginTime: ", beginTime);
    console.log("ChartOptions, endDate: ", endDate);
    console.log("ChartOptions, endTime: ", endTime);

    //TODO jeszcze czas!
    return (

        <FormGroup>
            {asCheckBoxes.map((label, index) =>
                <FormControlLabel
                    key={index}
                    control={<CheckBox
                        checked={checkBoxesValues[index]}
                        onChange={(event, checked) => onCheckBoxChange(index, checked)}
                    />
                    }
                    label={label}
                />
            )}
            {asTimePeriod != null &&
                <TextField
                    id="date-begin"
                    label="Początek zakresu - data"
                    type="date"
                    defaultValue={beginDate}
                    onChange={(event) => onDateChange(0, event.target.value)}
                    className={classes.textField}
                    InputLabelProps={{
                        shrink: true,
                    }}
                />
            }
            {asTimePeriod != null &&
                <TextField
                    id="time"
                    label="Początek zakresu - godzina"
                    type="time"
                    defaultValue={beginTime}
                    onChange={(event) => onTimeChange(0, event.target.value)}
                    className={classes.textField}
                    InputLabelProps={{
                        shrink: true,
                    }}
                    inputProps={{
                        step: 300, // 5 min
                    }}
                />
            }
            {asTimePeriod != null &&
                <TextField
                    id="date-end"
                    label="Koniec zakresu - data"
                    type="date"
                    defaultValue={endDate}
                    onChange={(event) => onDateChange(1, event.target.value)}
                    className={classes.textField}
                    InputLabelProps={{
                        shrink: true,
                    }}
                />
            }
            {asTimePeriod != null &&
                <TextField
                    id="time"
                    label="Koniec zakresu - godzina"
                    type="time"
                    defaultValue={endTime}
                    onChange={(event) => onTimeChange(1, event.target.value)}
                    className={classes.textField}
                    InputLabelProps={{
                        shrink: true,
                    }}
                    inputProps={{
                        step: 300, // 5 min
                    }}
                />
            }


        </FormGroup>
    )
}

ChartOptions.propTypes = {
    asCheckboxes: PropTypes.arrayOf(PropTypes.string),
    onCheckBoxesChange: PropTypes.func,
    // asTimePeriod: TODO co to będzie? - do ustalenia
    onTimePeriodChange: PropTypes.func,
}