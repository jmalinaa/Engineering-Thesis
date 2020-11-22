package engineeringthesis.repository;

import engineeringthesis.model.jpa.Measurement;
import engineeringthesis.model.jpa.Pollution;
import org.apache.tomcat.jni.Poll;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import java.util.List;
import java.util.Optional;

public interface PollutionRepository extends JpaRepository<Pollution, Long> {

    List<Pollution> findAll();

    Optional<Pollution> findById(@Param("id") Long id);

    @Query(value = "SELECT * FROM pollution p WHERE p.measurement_id = :measurementId AND p.measurement_type = :measurementType AND p.measurement_value = :measurementValue", nativeQuery = true)
    Optional<Pollution> findByValues(@Param("measurementId") long measurementId, @Param("measurementType") String measurementType, @Param("measurementValue") double measurementValue);
}
