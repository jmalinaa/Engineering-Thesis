package engineeringthesis.controller;

import com.google.gson.Gson;
import engineeringthesis.model.jpa.Station;
import engineeringthesis.repository.StationRepository;
import engineeringthesis.service.StationService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Optional;

@RestController
public class StationController {

    @Autowired
    public StationService stationService;

    @Autowired
    private Gson gson;

    @GetMapping(path = "/stations")
    public ResponseEntity<String> getStations() {

        return new ResponseEntity<>(gson.toJson(stationService.getAllStations()), HttpStatus.OK);
    }

    @GetMapping(path = "/stations/{id}")
    public ResponseEntity<String> getStation(@PathVariable("id") long id) {
        Optional<Station> station = stationService.getStationById(id);
        if(station.isPresent()) {
            return new ResponseEntity<>(gson.toJson(station.get()), HttpStatus.OK);
        } else {
            return new ResponseEntity<>(HttpStatus.NOT_FOUND);
        }
    }

    @PostMapping(path = "/stations/add")
    public ResponseEntity<String> addStation(@RequestBody String station) {
        Station newStation = gson.fromJson(station, Station.class);
        stationService.addStation(newStation);
        return new ResponseEntity<>(HttpStatus.OK);
    }
}
