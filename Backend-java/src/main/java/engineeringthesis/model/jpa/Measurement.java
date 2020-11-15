package engineeringthesis.model.jpa;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import javax.persistence.*;
import java.util.Date;

@Data
@Entity(name = "measurement")
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class Measurement {

    @Id
    @Column(name = "measurement_id")
    private Long id;

    @Column(name = "time_utc")
    private Date time;

    @ManyToOne
    @JoinColumn(name = "station_id", referencedColumnName = "station_id")
    private Station station;
}
