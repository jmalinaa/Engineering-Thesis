package engineeringthesis.model.dto;

import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

import java.util.List;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
public class StationDetails {

    private Long id;
    private Double latitude;
    private Double longitude;
    private String name;
    private List<CalibrationResultDTO> calibrationResults;
}