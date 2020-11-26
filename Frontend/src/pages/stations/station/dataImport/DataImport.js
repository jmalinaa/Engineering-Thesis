import React from "react";

import Button from '@material-ui/core/Button';
import DataTable from 'react-data-table-component';
import FormControl from '@material-ui/core/FormControl';
import FormHelperText from '@material-ui/core/FormHelperText';
import InputLabel from '@material-ui/core/InputLabel';
import MenuItem from '@material-ui/core/MenuItem';
import Select from '@material-ui/core/Select';

import { makeStyles } from '@material-ui/core/styles';
import PropTypes from 'prop-types';
import useField from '../../../../materialUiWrappers/useField';

const useStyles = makeStyles((theme) => ({  //TODO extract this
    formControl: {
        margin: theme.spacing(1),
        minWidth: 120,
    },
    selectEmpty: {
        marginTop: theme.spacing(2),
    },
}));

export default function DataImport({ data, acceptableColumns, handleSubmit, ...props }) {
    const classes = useStyles();
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

    function createSelectFields(data) {
        const fileColumns = [];
        data[0]
            .map((columnNameInFile, index) => {
                fileColumns.push(
                    {
                        name:
                            <FormControl className={classes.formControl} error={columnMappings[index] === ''}>
                                <InputLabel id="demo-simple-select-label" > {columnNameInFile}</InputLabel >
                                <Select
                                    labelId="demo-simple-select-label"
                                    id="demo-simple-select"
                                    value={columnMappings[index]}
                                    onChange={event => onChange(event, index)}
                                >
                                    {acceptableColumns.map((column, index) =>
                                        <MenuItem value={column} key={index}>{column}</MenuItem>
                                    )}
                                </Select>
                                {columnMappings[index] === '' &&
                                    <FormHelperText>Wypełnij pole</FormHelperText>
                                }
                            </FormControl>,
                        selector: row => row[index]
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
            <Button
                disabled={columnMappings.includes('')}
                onClick={() => handleSubmit(columnMappings, data)}
                color="primary"
            >
                Zatwierdź
            </Button>
        </div>


    )
}

DataImport.propTypes = {
    data: PropTypes.array,
    acceptableColumns: PropTypes.arrayOf(PropTypes.string),
    handleSubmit: PropTypes.func
}