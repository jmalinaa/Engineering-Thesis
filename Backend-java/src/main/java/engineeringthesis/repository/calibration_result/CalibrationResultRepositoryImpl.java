package engineeringthesis.repository.calibration_result;

import engineeringthesis.model.dto.CalibrationResultDTO;
import engineeringthesis.model.jpa.CalibrationResult;
import engineeringthesis.model.jpa.CalibrationResult_;
import engineeringthesis.model.jpa.Station;
import engineeringthesis.model.jpa.Station_;
import engineeringthesis.repository.AbstractRepository;
import org.springframework.stereotype.Repository;

import javax.persistence.criteria.CriteriaQuery;
import javax.persistence.criteria.Join;
import javax.persistence.criteria.JoinType;
import javax.persistence.criteria.Root;
import java.util.List;

@Repository
public class CalibrationResultRepositoryImpl extends AbstractRepository implements CalibrationResultRepositoryCustom {

    @Override
    public List<CalibrationResult> getAllForStation(Long stationId) {
        CriteriaQuery<CalibrationResult> cq = cb.createQuery(CalibrationResult.class);
        Root<CalibrationResult> root = cq.from(CalibrationResult.class);
        Join<CalibrationResult, Station> station = root.join(CalibrationResult_.station, JoinType.LEFT);

        cq.where(cb.equal(station.get(Station_.id), stationId));

        return entityManager.createQuery(cq).getResultList();
    }
}
