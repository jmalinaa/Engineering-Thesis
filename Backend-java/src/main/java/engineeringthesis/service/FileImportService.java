package engineeringthesis.service;

import engineeringthesis.model.jpa.enums.PollutionMeasurementType;
import engineeringthesis.model.jpa.enums.WeatherMeasurementType;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;

import java.io.IOException;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

@Service
public class FileImportService {

    @Autowired
    private XlsImportService xlsImportService;

    @Autowired
    private CsvImportService csvImportService;

    public ResponseEntity<String> importFile(MultipartFile file, long stationId, List<String> columnsList) {
        int timeColumnNo = getTimeColumnNo(columnsList);
        Map<String, Integer> weatherColumnsNamesAndNos = getWeatherNamesWithColumnNos(columnsList);
        Map<String, Integer> pollutionColumnsNamesAndNos = getPollutionNamesWithColumnNos(columnsList);

        try {
            String extension = file.getOriginalFilename().split("\\.")[1];
            if (extension.equalsIgnoreCase("csv")) {
                csvImportService.importMeasurementsCsv(file, stationId, timeColumnNo, weatherColumnsNamesAndNos, pollutionColumnsNamesAndNos);
            } else if (extension.equalsIgnoreCase("xls")
                    || extension.equalsIgnoreCase("xlsx")) {
                xlsImportService.importMeasurementsXls(file, stationId, timeColumnNo, weatherColumnsNamesAndNos, pollutionColumnsNamesAndNos);
            } else {
                return new ResponseEntity<>("Bad file fomrat", HttpStatus.BAD_REQUEST);
            }
        } catch (IllegalArgumentException | IOException e) {
            return new ResponseEntity<>(e.getMessage(), HttpStatus.INTERNAL_SERVER_ERROR);
        }
        return new ResponseEntity<>(HttpStatus.OK);
    }

    private int getTimeColumnNo(List<String> columnsList) {
        for (int i = 0; i < columnsList.size(); i++) {
            if (columnsList.get(i).equalsIgnoreCase("Czas")) {
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
