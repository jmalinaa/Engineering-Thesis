package engineeringthesis.service;

import engineeringthesis.model.dto.plot.StationMeasurements;
import engineeringthesis.model.jpa.Measurement;
import engineeringthesis.repository.measurement.MeasurementRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.ArrayList;
import java.util.List;
import java.util.Optional;

@Service
public class MeasurementService {

    @Autowired
    MeasurementRepository measurementRepository;

    @Autowired
    PollutionService pollutionService;

    @Autowired
    WeatherService weatherService;

    public List<Measurement> getAllMeasurements() {
        return measurementRepository.findAll();
    }

    public List<StationMeasurements> getMeasurementByStationId(long stationId) {
        List<StationMeasurements> stationMeasurements = new ArrayList<>();
        stationMeasurements.addAll(pollutionService.getAllMeasurementsForStation(stationId));
        stationMeasurements.addAll(weatherService.getAllMeasurementsForStation(stationId));
        return stationMeasurements;
    }

    public long addMeasurement(Measurement newMeasurement) {
        Optional<Measurement> sameExisting = measurementRepository.findByValues(newMeasurement.getStation().getId(), newMeasurement.getTime());
        if (sameExisting.isPresent()) {
            return sameExisting.get().getId();
        } else {
            measurementRepository.save(newMeasurement);
            return newMeasurement.getId();
        }
    }
}
