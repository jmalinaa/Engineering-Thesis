package engineeringthesis.service;

import engineeringthesis.model.jpa.Measurement;
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

    public Station addStation(Station newStation) {
        Optional<Station> sameExisting = stationRepository.findByValues(newStation.getLatitude(), newStation.getLongitude(), newStation.getName(), newStation.getParentStation().getId());
        if (sameExisting.isPresent()) {
            return sameExisting.get();
        } else {
            stationRepository.save(newStation);
            return newStation;
        }
    }

    public Station createChildStation(long parentStationId) {
        Station parentStation = getStationById(parentStationId).orElseThrow(AssertionError::new);
        return addStation(Station.builder()
                .latitude(parentStation.getLatitude())
                .longitude(parentStation.getLongitude())
                .name(parentStation.getName())
                .parentStation(parentStation)
                .build());
    }
}
