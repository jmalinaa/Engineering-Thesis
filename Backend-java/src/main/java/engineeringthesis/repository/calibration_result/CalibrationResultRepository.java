package engineeringthesis.repository.calibration_result;

import engineeringthesis.model.jpa.CalibrationResult;
import engineeringthesis.model.jpa.Station;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import java.util.Optional;

public interface CalibrationResultRepository extends JpaRepository<CalibrationResult, Long>, CalibrationResultRepositoryCustom {

    @Query(value = "SELECT * FROM calibration_result cr JOIN station s on s.id = cr.station_id " +
            "WHERE cr.measurement_type = :measurementType AND s.id = :stationId", nativeQuery = true)
    Optional<CalibrationResult> findByValues(@Param("measurementType") String measurementType,
                                             @Param("stationId") Long stationId);

}
