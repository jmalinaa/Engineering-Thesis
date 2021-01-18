package engineeringthesis.service;

import engineeringthesis.model.dto.plot.MeasurementDetails;
import engineeringthesis.model.dto.plot.StationMeasurements;
import engineeringthesis.model.jpa.Pollution;
import engineeringthesis.model.jpa.enums.PollutionMeasurementType;
import engineeringthesis.repository.PollutionRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import javax.persistence.EntityManager;
import javax.persistence.PersistenceContext;
import java.util.ArrayList;
import java.util.List;

@Service
public class PollutionService {

    @PersistenceContext
    private EntityManager em;

    @Autowired
    public PollutionRepository pollutionRepository;

    public void addPollution(Pollution newPollution) {
        if (pollutionRepository.findByValues(newPollution.getMeasurement().getId(), newPollution.getMeasurementType().name())
                .isEmpty()) {
            pollutionRepository.save(newPollution);
        }
    }

    public List<StationMeasurements> getAllMeasurementsForStation(long stationId) {
        List<StationMeasurements> stationMeasurements = new ArrayList<>();
        for (PollutionMeasurementType pollutionType : PollutionMeasurementType.values()) {
            List<MeasurementDetails> md = getMeasurementsByStationIdAndMeasurementType(stationId, pollutionType);
            if (!md.isEmpty()) {
                StationMeasurements newStationMeasurement = new StationMeasurements(pollutionType.name(), md);
                stationMeasurements.add(newStationMeasurement);
            }
        }
        return stationMeasurements;
    }

    private List<MeasurementDetails> getMeasurementsByStationIdAndMeasurementType(long stationId, PollutionMeasurementType measurementType) {
        return em.createQuery(
                "SELECT new engineeringthesis.model.dto.plot.MeasurementDetails(m.time, p.measurementValue) FROM pollution p JOIN p.measurement m WHERE m.station.id = :stationId AND p.measurementType = :measurementType",
                MeasurementDetails.class)
                .setParameter("stationId", stationId)
                .setParameter("measurementType", measurementType)
                .getResultList();
    }
}
