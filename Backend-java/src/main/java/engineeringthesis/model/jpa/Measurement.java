package engineeringthesis.model.jpa;

import lombok.*;

import javax.persistence.*;
import java.util.ArrayList;
import java.util.Date;
import java.util.List;

@Data
@Entity(name = "measurement")
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class Measurement {

    @Id
    @GeneratedValue (strategy = GenerationType.IDENTITY)
    @Column(name = "id")
    private Long id;

    @Column(name = "time_utc")
    private Date time;

    @ManyToOne
    @JoinColumn(name = "station_id")
    private Station station;

    @ToString.Exclude
    @EqualsAndHashCode.Exclude
    @OneToMany(targetEntity = Pollution.class, mappedBy = "measurement")
    private List<Pollution> pollution = new ArrayList<>();

    @ToString.Exclude
    @EqualsAndHashCode.Exclude
    @OneToMany(targetEntity = Weather.class, mappedBy = "measurement", fetch = FetchType.EAGER)
    private List<Weather> weather = new ArrayList<>();
}
