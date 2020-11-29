package engineeringthesis.model.dto;

import lombok.AllArgsConstructor;

import java.util.Date;

@AllArgsConstructor
public class MeasurementDetails {
    private Date time;
    private double value;
}
