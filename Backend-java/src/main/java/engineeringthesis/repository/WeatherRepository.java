package engineeringthesis.repository;

import engineeringthesis.model.jpa.Weather;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.repository.query.Param;

import java.util.List;
import java.util.Optional;

public interface WeatherRepository extends JpaRepository<Weather, Long> {

    List<Weather> findAll();

    Optional<Weather> findById(@Param("id") Long id);
}
