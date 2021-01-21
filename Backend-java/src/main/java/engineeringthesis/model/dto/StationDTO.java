package engineeringthesis.model.dto;

import lombok.*;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
public class StationDTO {

    private Long id;
    private Double latitude;
    private Double longitude;
    private String name;
    private Long parentId;
    private Long childId;
}
