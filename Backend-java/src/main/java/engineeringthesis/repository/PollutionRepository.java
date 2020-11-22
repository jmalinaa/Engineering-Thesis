package engineeringthesis.repository;

import engineeringthesis.model.jpa.Measurement;
import engineeringthesis.model.jpa.Pollution;
import org.apache.tomcat.jni.Poll;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.repository.query.Param;

import java.util.List;
import java.util.Optional;

public interface PollutionRepository extends JpaRepository<Pollution, Long> {

    List<Pollution> findAll();

    Optional<Pollution> findById(@Param("id") Long id);
}
