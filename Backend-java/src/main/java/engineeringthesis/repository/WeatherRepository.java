package engineeringthesis.repository;

import engineeringthesis.model.jpa.Pollution;
import engineeringthesis.model.jpa.Weather;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import java.util.List;
import java.util.Optional;

public interface WeatherRepository extends JpaRepository<Weather, Long> {

    List<Weather> findAll();

    Optional<Weather> findById(@Param("id") Long id);

    @Query(value = "SELECT * FROM weather w WHERE w.measurement_id = :measurementId AND w.measurement_type = :measurementType AND w.measurement_value = :measurementValue", nativeQuery = true)
    Optional<Weather> findByValues(@Param("measurementId") long measurementId, @Param("measurementType") String measurementType, @Param("measurementValue") double measurementValue);
}
