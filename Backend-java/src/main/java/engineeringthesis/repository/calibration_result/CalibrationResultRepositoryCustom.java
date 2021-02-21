package engineeringthesis.repository.calibration_result;

import engineeringthesis.model.jpa.CalibrationResult;

import java.util.List;

public interface CalibrationResultRepositoryCustom {

    List<CalibrationResult> getAllForStation(Long stationId);
}
