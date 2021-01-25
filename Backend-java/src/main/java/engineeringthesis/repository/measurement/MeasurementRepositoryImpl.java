package engineeringthesis.repository.measurement;

import engineeringthesis.model.dto.calibration.MeasurementsCompare;
import engineeringthesis.model.jpa.*;
import engineeringthesis.repository.AbstractRepository;
import org.springframework.stereotype.Repository;

import javax.persistence.criteria.*;
import java.sql.Time;
import java.util.List;

@Repository
public class MeasurementRepositoryImpl extends AbstractRepository implements MeasurementRepositoryCustom {

    public List<MeasurementsCompare> getTimePairs(long referenceStationId, long stationToCalibrateId) {
        CriteriaQuery<MeasurementsCompare> cq = cb.createQuery(MeasurementsCompare.class);
        Root<Measurement> root1 = cq.from(Measurement.class);
        Root<Measurement> root2 = cq.from(Measurement.class);
        Join<Measurement, Station> referenceStation = root1.join(Measurement_.station);
        Join<Measurement, Station> stationToCalibrate = root2.join(Measurement_.station);

        //Subquery to check if there is any calibration result for this timestamp
        Subquery<Long> sub = cq.subquery(Long.class);
        Root<Measurement> subRoot = sub.from(Measurement.class);
        Join<Measurement, Station> subStation = subRoot.join(Measurement_.station);
        Join<Station, Station> subStationParent = subStation.join(Station_.parentStation);
        sub.select(subRoot.get(Measurement_.id));
        sub.where(cb.and(
                cb.equal(root2.get(Measurement_.time), subRoot.get(Measurement_.time)),
                cb.equal(subStationParent.get(Station_.id), stationToCalibrate.get(Station_.id))));

        Expression<Time> timeDiff = cb.function(
                "TIMEDIFF",
                Time.class,
                root1.get(Measurement_.time),
                root2.get(Measurement_.time));
        Expression<Integer> timeToSec = cb.function(
                "TIME_TO_SEC",
                Integer.class,
                timeDiff);

        cq.select(cb.construct(
                MeasurementsCompare.class,
                root1.get(Measurement_.id),
                root2.get(Measurement_.id),
                root1.get(Measurement_.time),
                root2.get(Measurement_.time),
                timeToSec
        ));

        cq.where(
                cb.and(
                        cb.lessThanOrEqualTo(timeToSec, 300),
                        cb.greaterThanOrEqualTo(timeToSec, -300),
                        cb.equal(referenceStation.get(Station_.id), referenceStationId),
                        cb.equal(stationToCalibrate.get(Station_.id), stationToCalibrateId),
                        cb.not(cb.exists(sub))));
        cq.orderBy();
        return entityManager.createQuery(cq).getResultList();
    }

    public List<String> getMeasurementTypesByStationId(long stationId) {
        return entityManager.createNativeQuery(
                "SELECT DISTINCT px.measurement_type " +
                            "FROM pollution px " +
                            "JOIN measurement m on px.measurement_id = m.id " +
                            "WHERE m.station_id = :sId " +
                        "UNION " +
                        "SELECT DISTINCT wx.measurement_type " +
                            "FROM weather wx " +
                            "JOIN measurement m on wx.measurement_id = m.id " +
                            "WHERE m.station_id = :sId")
                .setParameter("sId", stationId)
                .getResultList();
    }

    public List<Object[]> getPollutionAndWeatherForMeasurements(long measurement1Id, long measurement2Id) {
        return entityManager.createNativeQuery(
                     "SELECT DISTINCT px.measurement_type as type, " +
                        "       (SELECT p.measurement_value FROM pollution p WHERE p.measurement_id = :m1id AND p.measurement_type = type), " +
                        "       (SELECT p.measurement_value FROM pollution p WHERE p.measurement_id = :m2id AND p.measurement_type = type) " +
                        "from pollution px WHERE px.measurement_id = :m1id OR px.measurement_id = :m2id " +
                        "UNION " +
                        "SELECT DISTINCT wx.measurement_type as type, " +
                        "                (SELECT w.measurement_value FROM weather w WHERE w.measurement_id = :m1id AND w.measurement_type = type), " +
                        "                (SELECT w.measurement_value FROM weather w WHERE w.measurement_id = :m2id AND w.measurement_type = type) " +
                        "from weather wx WHERE wx.measurement_id = :m1id OR wx.measurement_id = :m2id")
                .setParameter("m1id", measurement1Id)
                .setParameter("m2id", measurement2Id)
                .getResultList();
    }
}
