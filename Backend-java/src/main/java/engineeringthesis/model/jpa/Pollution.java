package engineeringthesis.model.jpa;

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

    @ManyToOne
    @JoinColumn(name = "measurement_id")
    private Measurement measurement;

    @ManyToOne
    @JoinColumn(name = "pollution_dict_id", referencedColumnName = "pollution_dict_id")
    private PollutionDictionary pollutionDictionary;

}