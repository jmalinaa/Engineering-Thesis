import React from "react";

import Button from '@material-ui/core/Button';
import DataTable from 'react-data-table-component';
import FormControl from '@material-ui/core/FormControl';
import InputLabel from '@material-ui/core/InputLabel';
import Select from '@material-ui/core/Select';
import Tooltip from "@material-ui/core/Tooltip";

import makeStyles from './styles';
import PropTypes from 'prop-types';

export default function DataImport({ data, acceptableColumns, handleSubmit, ...props }) {
    const classes = makeStyles();
    const [refershValue, setRefreshValue] = React.useState(0);

    function refresh() {
        setRefreshValue(refershValue + 1);
    }

    const fields = [];
    Object.keys(data[0]).map(columnNameInFile => fields.push(''));

    //columnMappings[0] equal "TIME" means that in first column there is timestamp etc.
    const [columnMappings] = React.useState(fields);    //can't be re-set because select relies on it

    function onChange(event, index) {
        const newFieldContent = event.target.value;
        console.log("DataImport, onChange column mapping: ", index, newFieldContent);
        columnMappings[index] = newFieldContent;
        console.log("DataImport, onChange fields: ", fields);
        console.log("DataImport, onChange columnMappings: ", columnMappings);
        refresh();
    }

    function countNonEmpty(array) {
        let counter = 0;
        for (let element of array)
            if (element !== '')
                counter++;
        return counter;
    }

    function noDuplicates(array) {
        for (let i = 0; i < array.length; i++) {
            if (array[i] === '')
                continue;
            for (let j = i + 1; j < array.length; j++)
                if (array[i] === array[j])
                    return false;
        }
        return true;
    }

    function mappingsValid() {
        if (!columnMappings.includes('Czas'))
            return false;
        if (countNonEmpty(columnMappings) < 2)
            return false;
        return noDuplicates(columnMappings);
    }

    function createSelectFields(data) {
        const fileColumns = [];
        data[0]
            .forEach((columnNameInFile, index) => {
                fileColumns.push(
                    {
                        name:
                            <FormControl className={classes.formControl}>
                                <InputLabel> {columnNameInFile}</InputLabel >
                                <Select
                                    native
                                    value={columnMappings[index]}
                                    onChange={event => onChange(event, index)}
                                >
                                    <option value="" />
                                    {acceptableColumns.map((column, index) =>
                                        <option value={column} key={index}>{column}</option>
                                    )}
                                </Select>
                            </FormControl>,
                        selector: row => row[index] //ATTENTION! This is quite hack-ish, causes warning which can be ignored
                    })
            });
        return fileColumns;
    }

    return (
        <div>
            <DataTable
                pagination
                highlightOnHover
                columns={createSelectFields(data)}
                data={data}
            />
            <Tooltip
                title={mappingsValid() ? '' : "Co najmniej dwie kolumny muszą być nieignorowane, z czego jedną musi być czas!"}
                enterDelay={0}
            >
                <Button
                    disabled={!mappingsValid()}
                    onClick={!mappingsValid() ? undefined : () => handleSubmit(columnMappings, data)}
                    color="primary"
                    component={!mappingsValid() ? "div" : undefined}
                    className={classes.button}
                >
                    Zatwierdź
                </Button>
            </Tooltip>
        </div>


    )
}

DataImport.propTypes = {
    data: PropTypes.array,
    acceptableColumns: PropTypes.arrayOf(PropTypes.string),
    handleSubmit: PropTypes.func
}