package engineeringthesis.service;

import engineeringthesis.model.jpa.Measurement;
import engineeringthesis.model.jpa.Pollution;
import engineeringthesis.model.jpa.Station;
import engineeringthesis.model.jpa.Weather;
import engineeringthesis.model.jpa.enums.PollutionMeasurementType;
import engineeringthesis.model.jpa.enums.WeatherMeasurementType;
import lombok.extern.java.Log;
import org.apache.poi.ss.usermodel.Row;
import org.apache.poi.ss.usermodel.Sheet;
import org.apache.poi.ss.usermodel.Workbook;
import org.apache.poi.xssf.usermodel.XSSFWorkbook;
import org.apache.xmlbeans.impl.regex.ParseException;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;

import java.io.IOException;
import java.util.*;

@Log
@Service
public class XlsImportService {

    @Autowired
    private MeasurementService measurementService;

    @Autowired
    private StationService stationService;

    @Autowired
    private WeatherService weatherService;

    @Autowired
    private PollutionService pollutionService;

    public void importMeasurementsXls(MultipartFile file, long stationId, List<String> columnsList) throws IOException {
        try {
            Workbook offices = new XSSFWorkbook(file.getInputStream());
            Iterator<Sheet> worksheets = offices.sheetIterator();
            worksheets.forEachRemaining(ws -> parseSheet(ws, stationId, columnsList));
        } catch (IOException e) {
            throw new IOException(e);
        }
    }

    private void parseSheet(Sheet worksheet, long stationId, List<String> columnsList) {
        Station station = stationService.getStationById(stationId).orElseThrow();

        int timeColumnNo = getTimeColumnNo(columnsList);
        Map<String, Integer> weatherMeasurementsColumnsNos = getWeatherNamesWithColumnNos(columnsList);
        Map<String, Integer> pollutionMeasurementsColumnsNos = getPollutionNamesWithColumnNos(columnsList);

        Iterator<Row> rows = worksheet.rowIterator();
        rows.next();
        rows.forEachRemaining(row ->
                parseRow(row, station, timeColumnNo, weatherMeasurementsColumnsNos, pollutionMeasurementsColumnsNos));
    }

    private void parseRow(Row row, Station station, int timeColumnNo,
                          Map<String, Integer> weatherColumnsNamesAndNos,
                          Map<String, Integer> pollutionColumnsNamesAndNos) {
        Measurement measurement = Measurement.builder()
                .station(station)
                .time(row.getCell(timeColumnNo).getDateCellValue())
                .build();

        measurement.setId(measurementService.addMeasurement(measurement));

        weatherColumnsNamesAndNos.forEach(
                (name, columnNo) -> weatherService.addWeather(
                        Weather.builder()
                                .measurement(measurement)
                                .measurementType(WeatherMeasurementType.valueOf(name))
                                .measurementValue(row.getCell(columnNo).getNumericCellValue())
                                .build()));

        pollutionColumnsNamesAndNos.forEach(
                (name, columnNo) -> pollutionService.addPollution(
                        Pollution.builder()
                                .measurement(measurement)
                                .measurementType(PollutionMeasurementType.valueOf(name))
                                .measurementValue(row.getCell(columnNo).getNumericCellValue())
                                .build()));
    }

    private int getTimeColumnNo(List<String> columnsList) {
        for (int i = 0; i < columnsList.size(); i++) {
            if (columnsList.get(i).equalsIgnoreCase("TIME")) {
                return i;
            }
        }
        throw new IllegalArgumentException();
    }

    private Map<String, Integer> getWeatherNamesWithColumnNos(List<String> columnsList) {
        List<String> weatherMeasurementTypes = WeatherMeasurementType.getListOfNames();
        return matchNamesWithColumnNos(columnsList, weatherMeasurementTypes);
    }

    private Map<String, Integer> getPollutionNamesWithColumnNos(List<String> columnsList) {
        List<String> pollutionMeasurementTypes = PollutionMeasurementType.getListOfNames();
        return matchNamesWithColumnNos(columnsList, pollutionMeasurementTypes);
    }

    private Map<String, Integer> matchNamesWithColumnNos(List<String> columnsList, List<String> columnNamesToFind) {
        Map<String, Integer> namesWithColumnNos = new HashMap<>();
        for (int i = 0; i < columnsList.size(); i++) {
            if (columnNamesToFind.contains(columnsList.get(i))) {
                namesWithColumnNos.put(columnsList.get(i), i);
            }
        }
        return namesWithColumnNos;
    }
}