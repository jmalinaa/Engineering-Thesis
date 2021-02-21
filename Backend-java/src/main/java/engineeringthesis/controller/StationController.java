package engineeringthesis.controller;

import com.google.gson.Gson;
import engineeringthesis.model.dto.StationDTO;
import engineeringthesis.model.dto.StationDetails;
import engineeringthesis.model.jpa.Station;
import engineeringthesis.service.StationService;
import lombok.extern.java.Log;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpHeaders;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.Optional;

@Log
@RestController
public class StationController {

    @Autowired
    public StationService stationService;

    @Autowired
    private Gson gson;

    @GetMapping(path = "/stations")
    public ResponseEntity<String> getStations() {
        log.info("getStations invoked");

        return new ResponseEntity<>(gson.toJson(stationService.getAllStationDtos()), getHeader(), HttpStatus.OK);
    }

    @GetMapping(path = "/stations/{id}")
    public ResponseEntity<String> getStation(@PathVariable("id") long id) {
        log.info(String.format("getStation invoked for id: %d", id));
        Optional<StationDetails> station = stationService.getStationDetailsById(id);
        if(station.isPresent()) {
            return new ResponseEntity<>(gson.toJson(station.get()), getHeader(), HttpStatus.OK);
        } else {
            return new ResponseEntity<>(HttpStatus.NOT_FOUND);
        }
    }

    @PostMapping(path = "/stations/add")
    public ResponseEntity<String> addStation(@RequestBody String station) {
        log.info(String.format("addStation invoked for station: %s", station));
        Station newStation = gson.fromJson(station, Station.class);
        stationService.addStation(newStation);
        return new ResponseEntity<>(HttpStatus.OK);
    }

    private HttpHeaders getHeader() {
        HttpHeaders responseHeaders = new HttpHeaders();
        responseHeaders.set("Content-Type", "application/json; charset=utf-8");
        return responseHeaders;
    }
}
