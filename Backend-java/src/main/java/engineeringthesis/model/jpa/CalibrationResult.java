package engineeringthesis.model.jpa;

import engineeringthesis.model.jpa.enums.PollutionMeasurementType;
import engineeringthesis.model.jpa.enums.WeatherMeasurementType;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import javax.persistence.*;

@Data
@Entity(name = "calibration_result")
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class CalibrationResult {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "id")
    private Long id;

    @Enumerated(EnumType.STRING)
    @Column(name = "measurement_type")
    private PollutionMeasurementType measurementType;

    @Column(name = "calibration_formula")
    private String calibrationFormula;

    @ManyToOne
    @JoinColumn(name = "station_id", referencedColumnName = "id", unique = true)
    private Station station;

}
