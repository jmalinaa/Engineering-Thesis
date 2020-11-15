package engineeringthesis.model.jpa;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import javax.persistence.Column;
import javax.persistence.Entity;
import javax.persistence.Id;

@Data
@Entity(name = "pollution_dictionary")
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class PollutionDictionary {

    @Id
    @Column(name = "pollution_dict_id")
    private Long id;

    @Column(name = "pollution_name")
    private String name;

}