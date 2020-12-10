package engineeringthesis.model.dto.calibration;

import lombok.AllArgsConstructor;
import lombok.Getter;

import java.util.Date;

@Getter
@AllArgsConstructor
public class MeasurementsCompare {

    private final long m1;
    private final long m2;
    private final Date time1;
    private final Date time2;
    private final Integer seconds;
}
