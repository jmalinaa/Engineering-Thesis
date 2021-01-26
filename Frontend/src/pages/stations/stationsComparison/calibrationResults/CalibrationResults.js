import React from "react";

import DataTable from 'react-data-table-component';

export default function CorrelationTable({ correlation, ...props }) {

    const columnNames = correlation.columnNames;
    const columns = createColumns(columnNames)
    const rows = correlation.values.map(valuesRow => convertToObject(valuesRow, columnNames));

    console.log('CorrelationTable, columns', columns);
    console.log('CorrelationTable, rows', rows);

    return (
        <DataTable
            title='Wyniki korelacji'
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