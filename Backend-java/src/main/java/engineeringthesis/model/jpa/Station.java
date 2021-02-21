package engineeringthesis.model.jpa;

import lombok.*;

import javax.persistence.*;

@Data
@Entity(name = "station")
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class Station {

    @Id
    @GeneratedValue (strategy = GenerationType.IDENTITY)
    @Column(name = "id")
    private Long id;

    @Column(name = "latitude")
    private Double latitude;

    @Column(name = "longitude")
    private Double longitude;

    @Column(name = "name")
    private String name;

    @OneToOne
    @JoinColumn(name = "parent_id", referencedColumnName = "id", unique = true)
    private Station parentStation;

    @ToString.Exclude
    @OneToOne(targetEntity = Station.class, fetch = FetchType.LAZY, mappedBy = "parentStation", cascade = CascadeType.REMOVE)
    private Station childStation;
}
