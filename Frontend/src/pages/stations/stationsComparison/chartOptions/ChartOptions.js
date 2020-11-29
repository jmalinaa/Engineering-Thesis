import React from "react";

import FormLabel from '@material-ui/core/FormLabel';
import FormControl from '@material-ui/core/FormControl';
import FormGroup from '@material-ui/core/FormGroup';
import FormControlLabel from '@material-ui/core/FormControlLabel';
import FormHelperText from '@material-ui/core/FormHelperText';
import PropTypes from 'prop-types';

export default function ChartOptions({ asCheckBoxes, onMeasurementTypesChange,
    asTimePeriod, onTimePeriodChange, ...props }) {

    return (

        <FormGroup column>

            {asCheckBoxes.map(label, index) =>
            <FormControlLabel
                control={<Checkbox checked={state.checkedA} onChange={handleChange} name="checkedA" />}
                label="Secondary"
            />
            }


            <FormControlLabel
                control={
                    <Checkbox
                        checked={state.checkedB}
                        onChange={handleChange}
                        name="checkedB"
                        color="primary"
                    />
                }
                label="Primary"
            />
        </FormGroup>
    )
}

ChartOptions.propTypes = {
    asCheckboxes = PropTypes.arrayOf(PropTypes.string),
    onMeasurementTypesChange = PropTypes.func,
    // asTimePeriod = TODO co? - do ustalenia
    onTimePeriodChange = PropTypes.func,
}