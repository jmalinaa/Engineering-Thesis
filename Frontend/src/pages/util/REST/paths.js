export const BASE_PATH = 'http://127.0.0.1:8080/';
export const ALL_STATIONS_PATH = BASE_PATH + "stations/";
export const STATION_PATH = BASE_PATH + "stations/";        //@GetMapping(path = "/stations/{id}")
export const ADD_STATION_PATH = ALL_STATIONS_PATH + "add/";
export const ALL_MEASUREMENTS_PATH = BASE_PATH + "measurements/";
export const COLUMN_NAMES_PATH = ALL_MEASUREMENTS_PATH + "columnNames";
export const IMPORT_MEASUREMENTS_FILE_PATH = ALL_MEASUREMENTS_PATH + 'import';
export const CALIBRATION_PATH = BASE_PATH + '/calibration/12&13';