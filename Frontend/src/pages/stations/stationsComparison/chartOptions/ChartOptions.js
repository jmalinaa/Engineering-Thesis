import React from "react";

import CheckBox from '@material-ui/core/CheckBox';
import FormLabel from '@material-ui/core/FormLabel';
import FormControl from '@material-ui/core/FormControl';
import FormGroup from '@material-ui/core/FormGroup';
import FormControlLabel from '@material-ui/core/FormControlLabel';
import FormHelperText from '@material-ui/core/FormHelperText';
import PropTypes from 'prop-types';

export default function ChartOptions({ asCheckBoxes, onCheckBoxesChange, asTimePeriod, onTimePeriodChange, ...props }) {
    
    let checkBoxFields = new Array(asCheckBoxes.length).fill(false);

    const [checkBoxesValues] = React.useState(checkBoxFields);    //keep in mind this is just the initial values
    const [refershValue, setRefreshValue] = React.useState(0);

    function refresh() {
        setRefreshValue(refershValue + 1);
    }

    function onCheckBoxChange(index, checked) {
        console.log("ChartOptions, onCheckBoxChange: ", index, checked);
        checkBoxesValues[index] = checked;
        onCheckBoxesChange(checkBoxesValues);
        refresh();
    }
//TODO jeszcze czas!
    return (

        <FormGroup>
            {asCheckBoxes.map((label, index) =>
                <FormControlLabel
                    control={<CheckBox
                        checked={checkBoxesValues[index]}
                        onChange={(event, checked) => onCheckBoxChange(index, checked)} 
                        key={index}
                        />
                    }
                    label={label}
                />
            )}

        </FormGroup>
    )
}

ChartOptions.propTypes = {
    asCheckboxes: PropTypes.arrayOf(PropTypes.string),
    onCheckBoxesChange: PropTypes.func,
    // asTimePeriod: TODO co to będzie? - do ustalenia
    onTimePeriodChange: PropTypes.func,
}