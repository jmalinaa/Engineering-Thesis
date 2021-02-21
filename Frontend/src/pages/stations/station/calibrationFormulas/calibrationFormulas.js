import React from 'react';

import DataTable from 'react-data-table-component';

export default function CalibrationFormulas({ calibrationResults }) {

    if (calibrationResults == null || calibrationResults.length === 0)
        return null;

    const columns = [
        { selector: 'measurementType', name: 'Typ pomiaru' },
        { selector: 'calibrationFormula', name: 'Wzór' },
    ];


    return (
        <DataTable
            columns={columns}
            data={calibrationResults}
        />
    )
}