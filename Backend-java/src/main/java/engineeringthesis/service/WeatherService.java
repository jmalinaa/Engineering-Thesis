package engineeringthesis.service;

import engineeringthesis.model.dto.plot.MeasurementDetails;
import engineeringthesis.model.dto.plot.StationMeasurements;
import engineeringthesis.model.jpa.Weather;
import engineeringthesis.model.jpa.enums.WeatherMeasurementType;
import engineeringthesis.repository.WeatherRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import javax.persistence.EntityManager;
import javax.persistence.PersistenceContext;
import java.util.ArrayList;
import java.util.List;

@Service
public class WeatherService {

    @PersistenceContext
    private EntityManager em;

    @Autowired
    public WeatherRepository weatherRepository;

    public void addWeather(Weather newWeather) {
        if (weatherRepository.findByValues(newWeather.getMeasurement().getId(),
                newWeather.getMeasurementType().name(), newWeather.getMeasurementValue()).isEmpty()) {
            weatherRepository.save(newWeather);
        }
    }

    public List<StationMeasurements> getAllMeasurementsForStation(long stationId) {
        List<StationMeasurements> stationMeasurements = new ArrayList<>();
        for (WeatherMeasurementType weatherType : WeatherMeasurementType.values()) {
            List<MeasurementDetails> md = getMeasurementsByStationIdAndMeasurementType(stationId, weatherType);
            if (!md.isEmpty()) {
                StationMeasurements newStationMeasurement = new StationMeasurements(weatherType.name(), md);
                stationMeasurements.add(newStationMeasurement);
            }
        }
        return stationMeasurements;
    }

    private List<MeasurementDetails> getMeasurementsByStationIdAndMeasurementType(long stationId, WeatherMeasurementType measurementType) {
        return em.createQuery(
                "SELECT new engineeringthesis.model.dto.plot.MeasurementDetails(m.time, w.measurementValue) FROM weather w JOIN w.measurement m WHERE m.station.id = :stationId AND w.measurementType = :measurementType",
                MeasurementDetails.class)
                .setParameter("stationId", stationId)
                .setParameter("measurementType", measurementType)
                .getResultList();
    }
}
