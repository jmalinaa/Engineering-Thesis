package engineeringthesis.model.dto.calibration;

import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.util.HashMap;
import java.util.List;
import java.util.Map;

@Data
public class CalibrationResult {

    public CalibrationResult() {
        this.meanAndMaxDiffMap = new HashMap<>();
    }

    private CorrelationResult correlationResult;
    private Map<String, PairOfIds> sameMeasurementTypes;
    private Map<String, MeanAndMaxDiff> meanAndMaxDiffMap;
}
