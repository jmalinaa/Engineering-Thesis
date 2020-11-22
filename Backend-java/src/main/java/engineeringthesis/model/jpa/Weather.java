package engineeringthesis.model.jpa;

import engineeringthesis.model.jpa.enums.WeatherMeasurementType;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import javax.persistence.*;

@Data
@Entity(name = "weather")
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class Weather {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "id")
    private Long id;

    @Column(name = "measurement_value")
    private Double measurementValue;

    @Enumerated(EnumType.STRING)
    @Column(name = "measurement_type")
    private WeatherMeasurementType measurementType;

    @ManyToOne
    @JoinColumn(name = "measurement_id")
    private Measurement measurement;
}