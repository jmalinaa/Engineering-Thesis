package engineeringthesis.model.dto.calibration;

import lombok.Data;

import java.util.HashMap;
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
