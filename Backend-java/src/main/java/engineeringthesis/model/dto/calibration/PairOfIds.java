package engineeringthesis.model.dto.calibration;

import lombok.AllArgsConstructor;
import lombok.Getter;

@Getter
@AllArgsConstructor
public class PairOfIds {

    private final int referenceDataColumnId;
    private final int toCalibrateDataColumnId;
}
