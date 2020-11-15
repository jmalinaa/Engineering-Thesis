package engineeringthesis.controller;

import com.google.gson.Gson;
import engineeringthesis.model.jpa.Station;
import engineeringthesis.service.StationService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.List;

@RestController
public class Controller {

    @Autowired
    public StationService stationService;

    @Autowired
    private Gson gson;

    @GetMapping(path = "/stations")
    public ResponseEntity<String> getStations() {
        List<Station> stations;

        stations = stationService.getAll();

        return new ResponseEntity<>(gson.toJson(stations), HttpStatus.OK);
    }
}
