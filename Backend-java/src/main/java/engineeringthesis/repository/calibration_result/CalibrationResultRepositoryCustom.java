package engineeringthesis.repository.calibration_result;

import engineeringthesis.model.dto.CalibrationResultDTO;

import java.util.List;

public interface CalibrationResultRepositoryCustom {

    List<CalibrationResultDTO> getAllForStation(Long stationId);
}
