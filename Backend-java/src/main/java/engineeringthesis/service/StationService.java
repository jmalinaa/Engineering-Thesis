package engineeringthesis.service;

import engineeringthesis.model.jpa.Station;
import engineeringthesis.repository.StationRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Optional;

@Service
public class StationService {

    @Autowired
    public StationRepository stationRepository;

    public List<Station> getAllStations() {
        return stationRepository.findAll();
    }


    public Optional<Station> getStationById(Long id) {
        return stationRepository.findById(id);
    }

    public void addStation(Station newStation) {
        stationRepository.save(newStation);
    }
}
