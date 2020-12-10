package engineeringthesis.model.dto.calibration;

import lombok.Builder;
import lombok.Data;

import java.util.List;

@Data
@Builder
public class CorrelationResult {

    private List<String> columnNames;
    private List<String> rowNames;
    private double[][] correlationValues;
}
