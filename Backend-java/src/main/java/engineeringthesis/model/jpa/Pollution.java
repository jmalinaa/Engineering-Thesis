package engineeringthesis.model.jpa;

import engineeringthesis.model.jpa.enums.PollutionMeasurementType;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import javax.persistence.*;

@Data
@Entity(name = "pollution")
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class Pollution {

    @Id
    @GeneratedValue (strategy = GenerationType.IDENTITY)
    @Column(name = "id")
    private Long id;

    @Column(name = "measurement_value")
    private Double measurementValue;

    @Enumerated(EnumType.STRING)
    @Column(name = "measurement_type")
    private PollutionMeasurementType measurementType;

    @ManyToOne
    @JoinColumn(name = "measurement_id")
    private Measurement measurement;
}