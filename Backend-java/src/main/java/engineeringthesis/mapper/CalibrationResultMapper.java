package engineeringthesis.mapper;

import engineeringthesis.model.dto.CalibrationResultDTO;
import engineeringthesis.model.dto.StationDTO;
import engineeringthesis.model.jpa.CalibrationResult;
import engineeringthesis.model.jpa.Station;
import engineeringthesis.model.jpa.enums.PollutionMeasurementType;
import org.mapstruct.Mapper;
import org.mapstruct.Mapping;
import org.mapstruct.Named;
import org.mapstruct.factory.Mappers;

@Mapper
public interface CalibrationResultMapper {

    CalibrationResultMapper INSTANCE = Mappers.getMapper(CalibrationResultMapper.class);

    @Mapping(target="measurementType", source="measurementType", qualifiedByName = "measurementTypeMapper")
    CalibrationResultDTO toDTO(CalibrationResult calibrationResult);

    @Named("measurementTypeMapper")
    default String measurementTypeMapper(PollutionMeasurementType mt) {
        return mt.getValue();
    }
}
