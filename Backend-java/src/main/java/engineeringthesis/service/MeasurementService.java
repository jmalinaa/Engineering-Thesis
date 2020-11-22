package engineeringthesis.service;

import engineeringthesis.model.jpa.Measurement;
import engineeringthesis.repository.MeasurementRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Optional;

@Service
public class MeasurementService {

    @Autowired
    public MeasurementRepository measurementRepository;

    public List<Measurement> getAllMeasurements() {
        return measurementRepository.findAll();
    }


    public Optional<Measurement> getMeasurementById(Long id) {
        return measurementRepository.findById(id);
    }

    public long addMeasurement(Measurement newMeasurement) {
        Optional<Measurement> sameExisting = measurementRepository.findByValues(newMeasurement.getStation().getId(), newMeasurement.getTime());
        if(sameExisting.isPresent()) {
            return sameExisting.get().getId();
        } else {
            measurementRepository.save(newMeasurement);
            return newMeasurement.getId();
        }
    }
}
