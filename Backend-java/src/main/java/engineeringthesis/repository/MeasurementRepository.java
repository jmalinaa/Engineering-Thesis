package engineeringthesis.repository;

import engineeringthesis.model.jpa.Measurement;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import java.util.Date;
import java.util.List;
import java.util.Optional;

public interface MeasurementRepository extends JpaRepository<Measurement, Long> {

    List<Measurement> findAll();

    Optional<Measurement> findById(@Param("id") Long id);

    @Query(value = "SELECT * FROM measurement m WHERE m.station_id = :stationId AND m.time_utc = :time", nativeQuery = true)
    Optional<Measurement> findByValues(@Param("stationId") long stationId, @Param("time") Date time);
}