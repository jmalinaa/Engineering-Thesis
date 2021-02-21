package engineeringthesis.mapper;

import engineeringthesis.model.dto.StationDTO;
import engineeringthesis.model.dto.StationDetails;
import engineeringthesis.model.jpa.Station;
import org.mapstruct.Mapper;
import org.mapstruct.Mapping;
import org.mapstruct.Named;
import org.mapstruct.factory.Mappers;

@Mapper
public interface StationMapper {
    StationMapper INSTANCE = Mappers.getMapper(StationMapper.class);

    StationDetails toDetails(Station station);

    @Mapping(target="parentId", source="station", qualifiedByName = "parentIdMapper")
    @Mapping(target="childId", source="station", qualifiedByName = "childIdMapper")
    StationDTO toDTO(Station station);

    @Named("parentIdMapper")
    default Long parentIdMapper(Station station) {
        return station.getParentStation() != null ? station.getParentStation().getId() : null;
    }

    @Named("childIdMapper")
    default Long childIdMapper(Station station) {
        return station.getChildStation() != null ? station.getChildStation().getId() : null;
    }
}
