import { makeStyles } from '@material-ui/core/styles';

export default makeStyles((theme) => ({
    colorBox: {
        marginTop: 18
    }
}));

export const colors = [
    '#1A237E',
    '#3F51B5',
    '#4A148C',
    '#BA68C8',
    '#B71C1C',
    '#F44336',
    '#194D33',
    '#4CAF50',
    '#006064',
    '#0097A7',
    '#01579B',
    '#03A9F4',
    '#E65100',
    '#FF9800',
    '#FBC02D',
    '#FFEB3B',
    '#827717',
    '#CDDC39',
    '#000000',
    '#969696',
    '#3E2723',
    '#795548',
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