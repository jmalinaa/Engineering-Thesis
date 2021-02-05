package engineeringthesis.repository.station;

import engineeringthesis.model.dto.StationDTO;
import engineeringthesis.model.jpa.Station;
import engineeringthesis.model.jpa.Station_;
import engineeringthesis.repository.AbstractRepository;

import javax.persistence.criteria.CriteriaQuery;
import javax.persistence.criteria.Join;
import javax.persistence.criteria.JoinType;
import javax.persistence.criteria.Root;
import java.util.List;

public class StationRepositoryImpl extends AbstractRepository implements StationRepositoryCustom {

    @Override
    public List<StationDTO> getAllStationDtos() {
        CriteriaQuery<StationDTO> cq = cb.createQuery(StationDTO.class);
        Root<Station> root = cq.from(Station.class);
        Join<Station, Station> parent = root.join(Station_.parentStation, JoinType.LEFT);
        Join<Station, Station> child = root.join(Station_.childStation, JoinType.LEFT);

        cq.select(cb.construct(
                StationDTO.class,
                root.get(Station_.id),
                root.get(Station_.latitude),
                root.get(Station_.longitude),
                root.get(Station_.name),
                parent.get(Station_.id),
                child.get(Station_.id)
        ));

        return entityManager.createQuery(cq).getResultList();
    }
}
