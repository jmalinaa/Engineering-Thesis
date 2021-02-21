package engineeringthesis.model.dto.calibration;

import lombok.AllArgsConstructor;
import lombok.Getter;

@Getter
@AllArgsConstructor
public class MaxCorrelated {

    private double correlationValue;
    private final String differencesMapKeyName;
    private final int referenceDataColNum;
}
