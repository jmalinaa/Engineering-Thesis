import { makeStyles } from '@material-ui/core/styles';

export default makeStyles((theme) => ({
    colorBox: {
        marginTop: 18
    }
}));

export const colors = [
    '#1A237E',
    '#3F51B5',
    '#586FED',

    '#4A148C',
    '#BA68C8',
    '#8C145E',
    
    '#B71C1C',
    '#F44336',
    '#780D05',

    '#194D33',
    '#4CAF50',
    '#69F56F',

    '#006064',
    '#0097A7',
    '#00DDF5',

    '#003259',
    '#01579B',
    '#03A9F4',

    '#993600',
    '#E65100',
    '#FF9800',

    '#9E8034',
    '#FBC02D',
    '#FFEB3B',

    '#827717',
    '#CDDC39',
    '#E8FF00',

    '#000000',
    '#636363',
    '#969696',

    '#3E2723',
    '#795548',
    '#B8826E',
]

export function createLinesStyles(measurementType, station, color) {
    const res = {};
    res[measurementType] = {    //eg. for 'PM10' it will  create field res.PM10 of following content:
        normal: { stroke: color, fill: "none", strokeWidth: 2 }
    }
    res.station = station;
    res.measurementType = measurementType;
    res.color = color;
    return res;


}