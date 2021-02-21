import React from 'react';

import DataTable from 'react-data-table-component';
import Grid from '@material-ui/core/Grid';

export default function CalibrationFormulas({ calibrationResults }) {

    if (calibrationResults == null || calibrationResults.length === 0)
        return null;

    const columns = [
        { selector: 'measurementType', name: 'Typ pomiaru', width: '120px' },
        { selector: 'calibrationFormula', name: 'Wzór', compact: true, wrap: true },
    ];


    return (
        <Grid container direction='column' spacing={2}>
            <Grid item>
                <h3>Wzory do kalibracji:</h3>
            </Grid>
            <Grid item>
                <DataTable
                    noHeader
                    columns={columns}
                    data={calibrationResults}
                />
            </Grid>
        </Grid>
    )
}