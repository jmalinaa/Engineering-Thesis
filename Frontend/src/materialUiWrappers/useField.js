import React from "react";

import createFieldContent from './createFieldContent';

export default function useField(value) {   //TODO add optionals: validation flag and error messages
    let initialValue = value;
    if (value == null)
        initialValue = '';
    const [get, set] = React.useState(createFieldContent(initialValue))
    return({
        get: get,
        set: set
    })  //TODO how about validators?
}