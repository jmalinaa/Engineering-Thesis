package engineeringthesis.service;

import com.numericalmethod.suanshu.stats.test.timeseries.adf.AugmentedDickeyFuller;
import engineeringthesis.model.dto.calibration.CalibrationResult;
import engineeringthesis.model.dto.calibration.CorrelationResult;
import engineeringthesis.model.dto.calibration.MeasurementsCompare;
import engineeringthesis.repository.measurement.MeasurementRepository;
import org.apache.commons.math3.stat.correlation.SpearmansCorrelation;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import javax.persistence.EntityManager;
import javax.persistence.PersistenceContext;
import java.util.Date;
import java.util.List;

@Service
public class CalibrationService {

    @PersistenceContext
    private EntityManager em;

    @Autowired
    private MeasurementRepository measurementRepository;

    public CalibrationResult getCalibration(long stationId1, long stationId2) {
        List<String> station1MeasurementTypes = measurementRepository.getMeasurementTypesNoByStationId(stationId1);
        List<String> station2MeasurementTypes = measurementRepository.getMeasurementTypesNoByStationId(stationId2);
        List<MeasurementsCompare> measurements = measurementRepository.getTimePairs(stationId1, stationId2);

        double[][] station1data = new double[station1MeasurementTypes.size()][measurements.size()];
        double[][] station2data = new double[station2MeasurementTypes.size()][measurements.size()];
        Date[] dates = new Date[measurements.size()];

        int i = 0;
        for (MeasurementsCompare m : measurements) {
            dates[i] = m.getTime1(); //DateUtil.getDateBeetwen(m.getTime1(), m.getTime2());
            for (Object[] ob : measurementRepository.getPollutionAndWeatherForMeasurements(m.getM1(), m.getM2())) {
                int row1 = station1MeasurementTypes.indexOf(String.valueOf(ob[0]));
                int row2 = station2MeasurementTypes.indexOf(String.valueOf(ob[0]));
                Object o1 = ob[1];
                Object o2 = ob[2];
                if (o1 != null) {
                    station1data[row1][i] = (double) ob[1];
                }
                if (o2 != null) {
                    station2data[row2][i] = (double) ob[2];
                }
            }
            i++;
        }

        double[][] correlationValues = findCorrelationValues(station1data, station2data);
        CorrelationResult correlationResult = CorrelationResult.builder()
                .columnNames(station2MeasurementTypes)
                .rowNames(station1MeasurementTypes)
                .correlationValues(correlationValues)
                .build();

        adf(station1data, station2data);

        return CalibrationResult.builder()
                .correlationResult(correlationResult)
                .build();
    }

    private double[][] findCorrelationValues(double[][] station1data, double[][] station2data) {
        SpearmansCorrelation correlation = new SpearmansCorrelation();
        double[][] correlationArray = new double[station1data.length][station2data.length];
        for (int i = 0; i < station1data.length; i++) {
            for (int j = 0; j < station2data.length; j++) {
                double coef = correlation.correlation(station1data[i], station2data[j]);
                correlationArray[i][j] = coef;
            }
        }
        return correlationArray;
    }

    private void adf(double[][] station1data, double[][] station2data) {
        for (int i = 0; i < station1data.length; i++) {
            AugmentedDickeyFuller adf = new AugmentedDickeyFuller(station1data[i]);
            String alt = adf.getAlternativeHypothesis();
            String nl = adf.getNullHypothesis();
            double p = adf.pValue();
            double statistics = adf.statistics();
            int x = 1;
        }
        for (int i = 0; i < station2data.length; i++) {
            AugmentedDickeyFuller adf = new AugmentedDickeyFuller(station2data[i]);
            String alt = adf.getAlternativeHypothesis();
            String nl = adf.getNullHypothesis();
            double p = adf.pValue();
            double statistics = adf.statistics();
            int x = 1;
        }
    }
}
