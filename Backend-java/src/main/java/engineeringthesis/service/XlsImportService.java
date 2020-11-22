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
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;

import java.io.IOException;
import java.util.Iterator;
import java.util.Map;

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

    public void importMeasurementsXls(MultipartFile file, long stationId, int timeColumnNo,
                                      Map<String, Integer> weatherColumnsNamesAndNos,
                                      Map<String, Integer> pollutionColumnsNamesAndNos) throws IOException {
        log.info(String.format("importMeasurementXls invoked for stationId: %d", stationId));
        try {
            Workbook offices = new XSSFWorkbook(file.getInputStream());
            Iterator<Sheet> worksheets = offices.sheetIterator();
            worksheets.forEachRemaining(ws ->
                    parseSheet(ws, stationId, timeColumnNo, weatherColumnsNamesAndNos, pollutionColumnsNamesAndNos));
        } catch (IOException e) {
            throw new IOException(e);
        }
    }

    private void parseSheet(Sheet worksheet, long stationId, int timeColumnNo,
                            Map<String, Integer> weatherColumnsNamesAndNos,
                            Map<String, Integer> pollutionColumnsNamesAndNos) {
        Station station = stationService.getStationById(stationId).orElseThrow();

        Iterator<Row> rows = worksheet.rowIterator();
        rows.next();
        rows.forEachRemaining(row ->
                parseRow(row, station, timeColumnNo, weatherColumnsNamesAndNos, pollutionColumnsNamesAndNos));
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
}