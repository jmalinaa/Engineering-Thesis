package engineeringthesis.model.dto.plot;

import lombok.AllArgsConstructor;

import java.util.List;

@AllArgsConstructor
public class StationMeasurements {
    private String measurementType;
    private List<MeasurementDetails> measurements;
}
