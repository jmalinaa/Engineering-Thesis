package engineeringthesis.repository;

import engineeringthesis.model.jpa.Measurement;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.repository.query.Param;

import java.util.List;
import java.util.Optional;

public interface MeasurementRepository extends JpaRepository<Measurement, Long> {

    List<Measurement> findAll();

    Optional<Measurement> findById(@Param("id") Long id);
}