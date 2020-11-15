package engineeringthesis.repository;

import engineeringthesis.model.jpa.Station;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface StationRepository extends JpaRepository<Station, Long> {

    @Query(value = "SELECT * FROM station", nativeQuery = true)
    List<Station> findAllStations();

}

