package engineeringthesis.controller;

import com.google.gson.Gson;
import com.google.gson.reflect.TypeToken;
import engineeringthesis.model.jpa.Measurement;
import engineeringthesis.model.jpa.enums.PollutionMeasurementType;
import engineeringthesis.model.jpa.enums.WeatherMeasurementType;
import engineeringthesis.service.MeasurementService;
import engineeringthesis.service.XlsImportService;
import lombok.extern.java.Log;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

import java.io.IOException;
import java.util.ArrayList;
import java.util.List;
import java.util.Optional;

@Log
@RestController
public class MeasurementController {

    @Autowired
    private MeasurementService measurementService;

    @Autowired
    private XlsImportService xlsImportService;

    @Autowired
    private Gson gson;

    @GetMapping(path = "/measurements")
    public ResponseEntity<String> getMeasurements() {
        log.info("getMeasurements invoked");
        return new ResponseEntity<>(gson.toJson(measurementService.getAllMeasurements()), HttpStatus.OK);
    }

    @GetMapping(path = "/measurements/{id}")
    public ResponseEntity<String> getMeasurement(@PathVariable("id") long id) {
        log.info(String.format("getMeasurements invoked for id: %d", id));
        Optional<Measurement> measurement = measurementService.getMeasurementById(id);
        if (measurement.isPresent()) {
            return new ResponseEntity<>(gson.toJson(measurement.get()), HttpStatus.OK);
        } else {
            return new ResponseEntity<>(HttpStatus.NOT_FOUND);
        }
    }

    @PostMapping(path = "/measurements/import")
    public ResponseEntity<String> importMeasurements(@RequestParam("file") MultipartFile file,
                                                     @RequestParam("stationId") long stationId,
                                                     @RequestParam("columns") String columns) {
        log.info(String.format("importMeasurements invoked for stationId: %d and columns: %s", stationId, columns));
        List<String> columnsList = gson.fromJson(columns, new TypeToken<ArrayList<String>>() {}.getType());
        try {
            xlsImportService.importMeasurementsXls(file, stationId, columnsList);
        } catch (IllegalArgumentException | IOException e) {
            return new ResponseEntity<>(e.getMessage(), HttpStatus.INTERNAL_SERVER_ERROR);
        }
        return new ResponseEntity<>(HttpStatus.OK);
    }

    @GetMapping(path = "/measurements/columnNames")
    public ResponseEntity<String> getColumnNames() {
        log.info("getColumnNames invoked");
        List<String> columnNames = new ArrayList<>();
        columnNames.addAll(PollutionMeasurementType.getListOfNames());
        columnNames.addAll(WeatherMeasurementType.getListOfNames());
        columnNames.add("TIME");
        return new ResponseEntity<>(gson.toJson(columnNames), HttpStatus.OK);
    }

}
