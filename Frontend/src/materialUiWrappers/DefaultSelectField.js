import React from "react";

import InputLabel from '@material-ui/core/InputLabel';
import MenuItem from '@material-ui/core/MenuItem';
import Select from '@material-ui/core/Select';

import createFieldContent from './createFieldContent';

export default function DefaultSelectField({field, selectableValues, label, ...props}) {


    function onChange(event) {
        const newFieldContent = createFieldContent(event.target.value);
        field.set(newFieldContent);
    }

    return (
        <div>
            <InputLabel id="demo-simple-select-label" > {label}</InputLabel >
            <Select
                labelId="demo-simple-select-label"
                id="demo-simple-select"
                value={field.get.value}
                onChange={onChange}
            >
                {selectableValues.map((selectableValue, index) =>
                    <MenuItem value={selectableValue} key={index}>{selectableValue}</MenuItem>
                )}
            </Select>
        </div>
    )
}

