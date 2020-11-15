package engineeringthesis.model.jpa;

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
    @Column(name = "weather_id")
    private Long id;

    @Column(name = "measurement_value")
    private Double measurementValue;

    @ManyToOne
    @JoinColumn(name = "measurement_id", referencedColumnName = "measurement_id")
    private Measurement measurement;

    @ManyToOne
    @JoinColumn(name = "weather_dict_id", referencedColumnName = "weather_dict_id")
    private WeatherDictionary weatherDictionary;

}