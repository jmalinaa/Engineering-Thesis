package engineeringthesis.controller;

import com.google.gson.Gson;
import engineeringthesis.service.CalibrationService;
import lombok.extern.java.Log;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RestController;

@Log
@RestController
public class CalibrationController {

    @Autowired
    private CalibrationService calibrationService;

    @Autowired
    private Gson gson;

    @GetMapping(path = "/calibration/{stationId1}&{stationId2}")
    public ResponseEntity<String> getCalibration(@PathVariable("stationId1") long stationId1, @PathVariable("stationId2") long stationId2) {
        log.info("getCalibration invoked");
        return new ResponseEntity<>(gson.toJson(calibrationService.getCalibration(stationId1, stationId2)), HttpStatus.OK);
    }
}
