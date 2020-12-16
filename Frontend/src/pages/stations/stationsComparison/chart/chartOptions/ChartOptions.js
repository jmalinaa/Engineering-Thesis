import React from "react";

import CheckBox from '@material-ui/core/CheckBox';
import FormGroup from '@material-ui/core/FormGroup';
import FormControlLabel from '@material-ui/core/FormControlLabel';
import TextField from '@material-ui/core/TextField';
import PropTypes from 'prop-types';

import makeStyles from './styles';

export default function ChartOptions({ asCheckBoxes, onCheckBoxesChange, asTimePeriod, onTimePeriodManualChange, ...props }) {

    const classes = makeStyles();

    let checkBoxFields = new Array(asCheckBoxes.length).fill(false);

    const [checkBoxesValues] = React.useState(checkBoxFields);  //keep in mind this is just the initial values
    const [dateTimeValues, setDateTimeValues] = React.useState([]);
    const [refershValue, setRefreshValue] = React.useState(0);

    function refresh() {
        setRefreshValue(refershValue + 1);
    }

    if (dateTimeValues.length < 2 && asTimePeriod != null) {
        setDateTimeValues(asTimePeriod);
        // dateTimeValues[0] = asTimePeriod[0];
        // dateTimeValues[1] = asTimePeriod[1];
    }
    if (asTimePeriod != null && timePeriodsDiffer(dateTimeValues, asTimePeriod)) {
        setDateTimeValues(asTimePeriod);
    }

    function onCheckBoxChange(index, checked) {
        console.log("ChartOptions, onCheckBoxChange: ", index, checked);
        checkBoxesValues[index] = checked;
        onCheckBoxesChange(checkBoxesValues);
        refresh();
    }

    function setDateFromString(dateObject, newDateAsString) {
        let [fullYear, month, day] = newDateAsString.split('-');
        if (!isBlankString(fullYear) && !isBlankString(month) && !isBlankString(day)) {
            dateObject.setFullYear(fullYear);
            dateObject.setMonth(month - 1, day);    //months are 0-base indexed
        }
    }

    function setTimeFromString(dateObject, newTime) {
        let [hours, minutes] = newTime.split(':');
        hours = hours != null && hours != '' ? hours : '00'
        minutes = minutes != null && minutes != '' ? minutes : '00'
        dateObject.setHours(hours, minutes);
    }

    function onDateChange(index, newDate) {
        console.log("ChartOptions, onDateChange: ", index, newDate);
        setDateFromString(dateTimeValues[index], newDate);  //not a state change!
        onTimePeriodManualChange(dateTimeValues);
        refresh();
    }

    function onTimeChange(index, value) {
        console.log("ChartOptions, onTimeChange: ", index, value);
        setTimeFromString(dateTimeValues[index], value);    //not a state change!
        onTimePeriodManualChange(dateTimeValues);
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

    //TODO dodać możliwość wybrania typu wykresu
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

function isBlankString(string) {
    return string == null || string == '';
}

function timePeriodsDiffer(tr1, tr2) {
    if (tr1 == tr2)
        return false
    if (tr1 == null && tr2 != null)
        return true;
    if (tr1 != null && tr2 == null)
        return true;
    if (tr1.length != tr2. length)
        return true;
    const begin1 = tr1[0].valueOf();           //returns number of milliseconds since "begginning of time"
    if (begin1 !== tr2[0].valueOf())
        return true
    const end1 = tr1[1].valueOf();
    if (end1 !== tr2[1].valueOf())
        return true;
    return false;
}

ChartOptions.propTypes = {
    asCheckboxes: PropTypes.arrayOf(PropTypes.string),
    onCheckBoxesChange: PropTypes.func,
    // asTimePeriod: TODO co to będzie? - do ustalenia
    onTimePeriodManualChange: PropTypes.func,
}