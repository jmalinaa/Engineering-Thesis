package engineeringthesis.service;

import engineeringthesis.mapper.CalibrationResultMapper;
import engineeringthesis.mapper.StationMapper;
import engineeringthesis.model.dto.CalibrationResultDTO;
import engineeringthesis.model.dto.StationDTO;
import engineeringthesis.model.dto.StationDetails;
import engineeringthesis.model.jpa.CalibrationResult;
import engineeringthesis.model.jpa.Station;
import engineeringthesis.repository.calibration_result.CalibrationResultRepository;
import engineeringthesis.repository.station.StationRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Optional;
import java.util.stream.Collectors;

@Service
public class StationService {

    @Autowired
    public StationRepository stationRepository;

    @Autowired
    public CalibrationResultRepository calibrationResultRepository;

    public List<StationDTO> getAllStationDtos() {
        return stationRepository.getAllStationDtos();
    }

    public Optional<Station> getStationById(Long id) {
        return stationRepository.findById(id);
    }

    public Optional<StationDetails> getStationDetailsById(Long id) {
        Optional<Station> station = getStationById(id);
        if (station.isPresent()) {
            StationDetails stationDetails = StationMapper.INSTANCE.toDetails(station.get());
            List<CalibrationResultDTO> cr = calibrationResultRepository.getAllForStation(id)
                    .stream().map(CalibrationResultMapper.INSTANCE::toDTO).collect(Collectors.toList());
            stationDetails.setCalibrationResults(cr);
            return Optional.of(stationDetails);
        } else {
            return Optional.empty();
        }
    }

    public Station addStation(Station newStation) {
        Optional<Station> sameExisting = stationRepository.findByValues(newStation.getLatitude(), newStation.getLongitude(),
                newStation.getName(), newStation.getParentStation() != null ? newStation.getParentStation().getId() : null);
        if (sameExisting.isPresent()) {
            return sameExisting.get();
        } else {
            stationRepository.save(newStation);
            return newStation;
        }
    }

    public Station createChildStation(long parentStationId) {
        Station parentStation = getStationById(parentStationId).orElseThrow(AssertionError::new);
        return addStation(Station.builder()
                .latitude(parentStation.getLatitude())
                .longitude(parentStation.getLongitude())
                .name(parentStation.getName())
                .parentStation(parentStation)
                .build());
    }

    public CalibrationResult addCalibrationResult(CalibrationResult newCalibrationResult) {
        Optional<CalibrationResult> sameExisting = calibrationResultRepository.findByValues(
                newCalibrationResult.getMeasurementType().name(), newCalibrationResult.getStation().getId());
        if (sameExisting.isPresent()) {
            return sameExisting.get();
        } else {
            calibrationResultRepository.save(newCalibrationResult);
            return newCalibrationResult;
        }
    }
}
