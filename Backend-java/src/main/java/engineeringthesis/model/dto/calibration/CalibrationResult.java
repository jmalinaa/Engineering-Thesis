package engineeringthesis.model.dto.calibration;

import lombok.Builder;
import lombok.Data;

@Data
@Builder
public class CalibrationResult {

    private CorrelationResult correlationResult;
}
