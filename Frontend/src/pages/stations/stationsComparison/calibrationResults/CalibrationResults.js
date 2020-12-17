import React from "react";

import DataTable from 'react-data-table-component';

export default function CalibrationResults({ calibration, ...props }) {

    const columnNames = calibration.columnNames;
    const columns = createColumns(columnNames)
    const rows = calibration.values.map(valuesRow => convertToObject(valuesRow, columnNames));

    console.log('CalibrationResults, columns', columns);
    console.log('CalibrationResults, rows', rows);

    return (
        <DataTable
            pagination
            highlightOnHover
            columns={columns}
            data={rows}
        />
    )
}

function createColumns(columnNames) {
    return columnNames.map(columnName => ({
        selector: columnName,
        name: columnName
    }))
}

function convertToObject(row, columnNames){
    const result = {};
    row.forEach((element, index) => {
        const columnName = columnNames[index];
        result[columnName] = element;
    });
    return result;
}