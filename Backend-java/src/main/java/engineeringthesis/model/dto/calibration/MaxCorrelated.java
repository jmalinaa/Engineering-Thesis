package engineeringthesis.model.dto.calibration;

import lombok.AllArgsConstructor;
import lombok.Getter;

@Getter
@AllArgsConstructor
public class MaxCorrelated {

    private final boolean fromReferenceStation;
    private final String rowName;
    private final int colNum;
}
