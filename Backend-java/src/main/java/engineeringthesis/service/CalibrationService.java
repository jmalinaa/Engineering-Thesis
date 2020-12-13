package engineeringthesis.service;

import com.github.rcaller.rstuff.RCaller;
import com.github.rcaller.rstuff.RCallerOptions;
import com.github.rcaller.rstuff.RCode;
import engineeringthesis.model.dto.calibration.CalibrationResult;
import engineeringthesis.model.dto.calibration.CorrelationResult;
import engineeringthesis.model.dto.calibration.MeasurementsCompare;
import engineeringthesis.repository.measurement.MeasurementRepository;
import engineeringthesis.util.RUtils;
import org.apache.commons.math3.stat.correlation.SpearmansCorrelation;
import org.renjin.script.RenjinScriptEngine;
import org.renjin.script.RenjinScriptEngineFactory;
import org.renjin.sexp.ListVector;
import org.renjin.sexp.SEXP;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import javax.persistence.EntityManager;
import javax.persistence.PersistenceContext;
import javax.script.ScriptEngine;
import javax.script.ScriptEngineManager;
import javax.script.ScriptException;
import java.io.IOException;
import java.net.URISyntaxException;
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

        CorrelationResult correlationResult = findCorrelationValues(station1data, station2data);
        correlationResult.setColumnNames(station2MeasurementTypes);
        correlationResult.setRowNames(station1MeasurementTypes);

        //double[][] dataFrame = prepareDf(correlationResult.getMaxRow(), correlationResult.getMaxCol(), station1data, station2data);

        try {
            adf(station1data, station2data);
        } catch (ScriptException e) {
            e.printStackTrace();
        }

        try {
            var(station1data[correlationResult.getMaxRow()], station2data[correlationResult.getMaxCol()]);
        } catch (IOException | URISyntaxException e) {
            e.printStackTrace();
        }

        return CalibrationResult.builder()
                .correlationResult(correlationResult)
                .build();
    }

    private CorrelationResult findCorrelationValues(double[][] station1data, double[][] station2data) {
        SpearmansCorrelation correlation = new SpearmansCorrelation();
        double[][] correlationArray = new double[station1data.length][station2data.length];
        double maxCorrel = 0.0;
        int maxRow = 0;
        int maxCol = 0;
        for (int i = 0; i < station1data.length; i++) {
            for (int j = 0; j < station2data.length; j++) {
                double coef = correlation.correlation(station1data[i], station2data[j]);
                if (coef > maxCorrel) {
                    maxCorrel = coef;
                    maxRow = i;
                    maxCol = j;
                }
                correlationArray[i][j] = coef;
            }
        }
        return CorrelationResult.builder().correlationValues(correlationArray)
                .maxRow(maxRow)
                .maxCol(maxCol)
                .build();

    }

    private void adf(double[][] station1data, double[][] station2data) throws ScriptException {
        RenjinScriptEngineFactory factory = new RenjinScriptEngineFactory();
        ScriptEngine engine = factory.getScriptEngine();
        for (int i = 0; i < station1data.length; i++) {
            engine.put("input", station1data[i]);
            SEXP res = (SEXP) engine.eval("PP.test(input)");
            System.out.println(res.getClass());
        }
        for (int j = 0; j < station2data.length; j++) {
            engine.put("input", station2data[j]);
            SEXP res = (SEXP) engine.eval("PP.test(input)");
            System.out.println(res.getClass());
        }

    }

    private void var(double[] input1,double[] input2) throws IOException, URISyntaxException {
       // String fileContent = RUtils.getVarScriptContent();
        RCode code = RCode.create();
        code.addDoubleArray("input1", input1);
        code.addDoubleArray("input2", input2);
        //code.addRCode(fileContent);
        code.addRCode("library(vars)");
        code.addRCode("v1 <- cbind(input1, input2)");
        code.addRCode("model <- VAR(v1, p = 2, type = 'const', season = NULL, exog = NULL)");
        code.addRCode("res <- summary(model)");
        RCaller caller = RCaller.create(code, RCallerOptions.create());
        caller.runAndReturnResult("res");
        double[] res = caller.getParser().getAsDoubleArray("res");

//        RenjinScriptEngineFactory factory = new RenjinScriptEngineFactory();
//        ScriptEngine engine = factory.getScriptEngine();
//        engine.eval("library(vars)");
//        engine.put("input1", input1);
//        engine.put("input2", input2);
//        engine.eval("v1 <- cbind(input1, input2)");
//        engine.eval("Model1 <- VAR(v1, p = 2, type = 'const', season = NULL, exog = NULL)");
//        SEXP res = (SEXP) engine.eval("summary(Model1)");
//        System.out.println(res.getClass());
    }
}
