package engineeringthesis.service;

import engineeringthesis.model.jpa.Station;
import engineeringthesis.repository.StationRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class StationService {

    @Autowired
    public StationRepository stationRepository;

    public List<Station> getAll() {
        return stationRepository.findAllStations();
    }
}
