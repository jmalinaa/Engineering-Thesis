package engineeringthesis.model.dto.calibration;

import lombok.Data;

import java.util.HashMap;
import java.util.Map;

@Data
public class CalibrationResultDetails {

    public CalibrationResultDetails() {
        this.meanAndMaxDiffMap = new HashMap<>();
    }

    private CorrelationResult correlationResultForReferenceStation;
    private Map<String, PairOfIds> sameMeasurementTypes;
    private Map<String, MeanAndMaxDiff> meanAndMaxDiffMap;
}
