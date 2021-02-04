package engineeringthesis.controller;

import com.google.gson.Gson;
import com.google.gson.reflect.TypeToken;
import engineeringthesis.model.dto.plot.StationMeasurements;
import engineeringthesis.model.jpa.enums.PollutionMeasurementType;
import engineeringthesis.model.jpa.enums.WeatherMeasurementType;
import engineeringthesis.service.FileImportService;
import engineeringthesis.service.MeasurementService;
import lombok.extern.java.Log;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpHeaders;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

import java.util.ArrayList;
import java.util.List;

@Log
@RestController
public class MeasurementController {

    @Autowired
    private MeasurementService measurementService;

    @Autowired
    private FileImportService fileImportService;

    @Autowired
    private Gson gson;

    @GetMapping(path = "/measurements")
    public ResponseEntity<String> getMeasurements() {
        log.info("getMeasurements invoked");
        return new ResponseEntity<>(gson.toJson(measurementService.getAllMeasurements()), HttpStatus.OK);
    }

    @GetMapping(path = "/measurements/{id}")
    public ResponseEntity<String> getMeasurementsByStationId(@PathVariable("id") long id) {
        log.info(String.format("getMeasurements invoked for id: %d", id));
        List<StationMeasurements> stationMeasurements = measurementService.getMeasurementByStationId(id);
        if (!stationMeasurements.isEmpty()) {
            return new ResponseEntity<>(gson.toJson(stationMeasurements), getHeader(), HttpStatus.OK);
        } else {
            return new ResponseEntity<>(HttpStatus.NOT_FOUND);
        }
    }

    @PostMapping(path = "/measurements/import")
    public ResponseEntity<String> importMeasurements(@RequestParam("file") MultipartFile file,
                                                     @RequestParam("stationId") long stationId,
                                                     @RequestParam("columns") String columns) {
        log.info(String.format("importMeasurements invoked for stationId: %d and columns: %s", stationId, columns));
        List<String> columnsList = gson.fromJson(columns, new TypeToken<ArrayList<String>>() {
        }.getType());
        return fileImportService.importFile(file, stationId, columnsList);
    }

    @GetMapping(path = "/measurements/columnNames")
    public ResponseEntity<String> getColumnNames() {
        log.info("getColumnNames invoked");
        List<String> columnNames = new ArrayList<>();
        columnNames.addAll(PollutionMeasurementType.getListOfNames());
        columnNames.addAll(WeatherMeasurementType.getListOfNames());
        columnNames.add("Czas");

        return new ResponseEntity<>(gson.toJson(columnNames), getHeader(), HttpStatus.OK);
    }

    private HttpHeaders getHeader() {
        HttpHeaders responseHeaders = new HttpHeaders();
        responseHeaders.set("Content-Type", "application/json; charset=utf-8");
        return responseHeaders;
    }
}
