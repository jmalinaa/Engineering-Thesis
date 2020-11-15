package engineeringthesis.model.jpa;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import javax.persistence.Column;
import javax.persistence.Entity;
import javax.persistence.Id;

@Data
@Entity(name = "weather_dictionary")
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class WeatherDictionary {

    @Id
    @Column(name = "weather_dict_id")
    private Long id;

    @Column(name = "component_name")
    private String name;

}