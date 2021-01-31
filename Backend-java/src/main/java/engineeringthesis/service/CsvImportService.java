package engineeringthesis.service;

import au.com.bytecode.opencsv.CSVReader;
import engineeringthesis.model.jpa.Measurement;
import engineeringthesis.model.jpa.Pollution;
import engineeringthesis.model.jpa.Station;
import engineeringthesis.model.jpa.Weather;
import engineeringthesis.model.jpa.enums.PollutionMeasurementType;
import engineeringthesis.model.jpa.enums.WeatherMeasurementType;
import engineeringthesis.util.DateUtil;
import lombok.extern.java.Log;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;

import java.io.IOException;
import java.io.InputStreamReader;
import java.io.Reader;
import java.util.Map;

@Log
@Service
public class CsvImportService {

    @Autowired
    private MeasurementService measurementService;

    @Autowired
    private StationService stationService;

    @Autowired
    private WeatherService weatherService;

    @Autowired
    private PollutionService pollutionService;

    public void importMeasurementsCsv(MultipartFile file, long stationId, int timeColumnNo,
                                      Map<String, Integer> weatherColumnsNamesAndNos,
                                      Map<String, Integer> pollutionColumnsNamesAndNos) throws IOException {
        log.info(String.format("importMeasurementCsv invoked for stationId: %d", stationId));
        Station station = stationService.getStationById(stationId).orElseThrow();
        Reader reader = new InputStreamReader(file.getInputStream());
        CSVReader csvReader = new CSVReader(reader);
        String[] line;
        csvReader.readNext(); //skip fisrt line with column names
        while ((line = csvReader.readNext()) != null) {
            parseLine(line, station, timeColumnNo, weatherColumnsNamesAndNos, pollutionColumnsNamesAndNos);
        }
        reader.close();
        csvReader.close();
    }

    private void parseLine(String[] line, Station station, int timeColumnNo,
                           Map<String, Integer> weatherColumnsNamesAndNos,
                           Map<String, Integer> pollutionColumnsNamesAndNos) {

        Measurement measurement = Measurement.builder()
                .station(station)
                .time(DateUtil.parseDate(line[timeColumnNo]))
                .build();

        measurement.setId(measurementService.addMeasurement(measurement));

        weatherColumnsNamesAndNos.forEach(
                (name, columnNo) -> {
                    String value = line[columnNo];
                    if(!value.equalsIgnoreCase("")) {
                        weatherService.addWeather(
                                Weather.builder()
                                        .measurement(measurement)
                                        .measurementType(WeatherMeasurementType.valueOf(name))
                                        .measurementValue(Double.valueOf(value))
                                        .build());
                    }
                });

        pollutionColumnsNamesAndNos.forEach(
                (name, columnNo) -> {
                    String value = line[columnNo];
                    if (!value.equalsIgnoreCase("")) {

                        pollutionService.addPollution(
                                Pollution.builder()
                                        .measurement(measurement)
                                        .measurementType(PollutionMeasurementType.findByValue(name))
                                        .measurementValue(Double.valueOf(line[columnNo]))
                                        .build());
                    }
                });
    }
}

