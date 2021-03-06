package engineeringthesis.service;

import engineeringthesis.model.jpa.Measurement;
import engineeringthesis.model.jpa.Pollution;
import engineeringthesis.model.jpa.Station;
import engineeringthesis.model.jpa.Weather;
import engineeringthesis.model.jpa.enums.PollutionMeasurementType;
import engineeringthesis.model.jpa.enums.WeatherMeasurementType;
import engineeringthesis.util.DateUtil;
import lombok.extern.java.Log;
import org.apache.poi.ss.usermodel.*;
import org.apache.poi.xssf.usermodel.XSSFWorkbook;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;

import java.io.IOException;
import java.util.Date;
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
            Workbook workbook = new XSSFWorkbook(file.getInputStream());
            parseSheet(workbook.getSheetAt(0), stationId, timeColumnNo, weatherColumnsNamesAndNos, pollutionColumnsNamesAndNos);
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
                .time(getTimeCellValue(row, timeColumnNo))
                .build();

        measurement.setId(measurementService.addMeasurement(measurement));

        weatherColumnsNamesAndNos.forEach(
                (name, columnNo) -> {
                    Double val = getDoubleCellValue(row, columnNo);
                    if (val != null) {
                        weatherService.addWeather(Weather.builder()
                                .measurement(measurement)
                                .measurementType(WeatherMeasurementType.findByValue(name))
                                .measurementValue(val)
                                .build());
                    }
                });

        pollutionColumnsNamesAndNos.forEach(
                (name, columnNo) -> {
                    Double val = getDoubleCellValue(row, columnNo);
                    if (val != null) {
                        pollutionService.addPollution(
                                Pollution.builder()
                                        .measurement(measurement)
                                        .measurementType(PollutionMeasurementType.findByValue(name))
                                        .measurementValue(val)
                                        .build());
                    }
                });
    }

    private Date getTimeCellValue(Row row, int timeColumnNo) {
        DataFormatter dataFormatter = new DataFormatter();
        String cellStringValue = dataFormatter.formatCellValue(row.getCell(timeColumnNo));
        return DateUtil.parseDate(cellStringValue);
    }

    private Double getDoubleCellValue(Row row, int columnNo) {
        Cell c = row.getCell(columnNo);
        if (c != null) {
            if (c.getCellType() == CellType.NUMERIC) {
                return c.getNumericCellValue();
            } else if (c.getCellType() == CellType.STRING) {
                return Double.valueOf(c.getStringCellValue());
            } else {
                log.info(c.getCellType().name());
            }
        }
        return null;
    }
}