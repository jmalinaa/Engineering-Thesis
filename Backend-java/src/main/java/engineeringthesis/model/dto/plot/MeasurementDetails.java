package engineeringthesis.model.dto.plot;

import lombok.AllArgsConstructor;

import java.util.Date;

@AllArgsConstructor
public class MeasurementDetails {
    private Date time;
    private double value;
}
