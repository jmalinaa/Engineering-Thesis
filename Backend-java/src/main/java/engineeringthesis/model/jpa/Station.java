package engineeringthesis.model.jpa;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import javax.persistence.Column;
import javax.persistence.Entity;
import javax.persistence.Id;

@Data
@Entity(name = "station")
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class Station {

    @Id
    @Column(name = "station_id")
    private Long id;

    @Column(name = "latitude")
    private Double latitude;

    @Column(name = "longitude")
    private Double longnitude;

    @Column(name = "station_name")
    private String stationName;
}
