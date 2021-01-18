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

    Optional<Station> findById(@Param("id") Long id);

    @Query(value = "SELECT * FROM station s WHERE s.latitude = :latitude AND s.longitude = :longitude AND s.name = :name AND s.parent_id = :parentId", nativeQuery = true)
    Optional<Station> findByValues(@Param("latitude") Double latitude, @Param("longitude") Double longitude,
                                   @Param("name") String name, @Param("parentId") Long parentId);


}

