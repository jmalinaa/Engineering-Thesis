package engineeringthesis.model.dto.plot;

import lombok.AllArgsConstructor;

import java.util.List;

@AllArgsConstructor
public class StationMeasurements {
    private final String measurementType;
    private final List<MeasurementDetails> measurements;
}
