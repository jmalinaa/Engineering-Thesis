package engineeringthesis.repository.measurement;

import engineeringthesis.model.dto.calibration.MeasurementsCompare;

import java.util.List;

public interface MeasurementRepositoryCustom {

    List<MeasurementsCompare> getTimePairs(long referenceStationId, long stationToCalibrateId);

    List<String> getMeasurementTypesByStationId(long stationId);

    List<Object[]> getPollutionAndWeatherForMeasurements(long measurement1Id, long measurement2Id);
}
