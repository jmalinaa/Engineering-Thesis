package engineeringthesis.model.dto;

import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
public class CalibrationResultDTO {

    private long id;
    private String measurementType;
    private String calibrationFormula;
}
