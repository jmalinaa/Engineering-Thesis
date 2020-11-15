package engineeringthesis.repository;

import engineeringthesis.model.jpa.Station;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface StationRepository extends JpaRepository<Station, Long> {

    List<Station> findAll();

    Optional<Station> findById(@Param("id")Long id);

}

