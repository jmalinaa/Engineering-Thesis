import React from 'react';

import DataTable from 'react-data-table-component';

export default function CalibrationFormulas({ calibrationResults }) {

    if (calibrationResults == null || calibrationResults.length === 0)
        return null;

    const columns = [
        { selector: 'measurementType', name: 'Typ pomiaru', width:'120px'},
        { selector: 'calibrationFormula', name: 'Wzór',  compact:true, wrap:true },
    ];


    return (
        <DataTable
            columns={columns}
            data={calibrationResults}
        />
    )
}