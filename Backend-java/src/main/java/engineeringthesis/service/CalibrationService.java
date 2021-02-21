package engineeringthesis.service;

import com.github.rcaller.rstuff.RCaller;
import com.github.rcaller.rstuff.RCallerOptions;
import com.github.rcaller.rstuff.RCode;
import engineeringthesis.model.dto.calibration.*;
import engineeringthesis.model.exception.TooFewMeasurementsToCalibrate;
import engineeringthesis.model.jpa.CalibrationResult;
import engineeringthesis.model.jpa.Measurement;
import engineeringthesis.model.jpa.Pollution;
import engineeringthesis.model.jpa.Station;
import engineeringthesis.model.jpa.enums.PollutionMeasurementType;
import engineeringthesis.repository.measurement.MeasurementRepository;
import org.apache.commons.math3.stat.correlation.SpearmansCorrelation;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.math.BigDecimal;
import java.math.RoundingMode;
import java.util.ArrayList;
import java.util.HashMap;
import java.util.List;
import java.util.Map;
import java.util.stream.Collectors;

@Service
public class CalibrationService {

    @Autowired
    private MeasurementRepository measurementRepository;
    @Autowired
    private MeasurementService measurementService;
    @Autowired
    private PollutionService pollutionService;
    @Autowired
    private StationService stationService;

    private static final double P_VALUE = 0.05;
    private final CalibrationResultDetails result = new CalibrationResultDetails();
    private double[][] referenceStationData;
    private double[][] stationToCalibrateData;
    private List<String> referenceStationMeasurementTypes;
    private List<String> stationToCalibrateMeasurementTypes;
    private List<MeasurementsCompare> measurements;
    private double[] formulaCoefs;

    public CalibrationResultDetails getCalibration(long referenceStationId, long stationToCalibrateId) throws TooFewMeasurementsToCalibrate {
        referenceStationMeasurementTypes = measurementRepository.getMeasurementTypesByStationId(referenceStationId);
        stationToCalibrateMeasurementTypes = measurementRepository.getMeasurementTypesByStationId(stationToCalibrateId);
        result.setSameMeasurementTypes(prepareMapOfSameMeasurementTypes());

        measurements = measurementRepository.getTimePairs(referenceStationId, stationToCalibrateId);
        checkNumberOfMeasurements();

        referenceStationData = new double[referenceStationMeasurementTypes.size()][measurements.size()];
        stationToCalibrateData = new double[stationToCalibrateMeasurementTypes.size()][measurements.size()];
        fetchMeasurementsData();
        Map<String, double[]> measurementDifferencesMap = prepareMeasurementDifferencesData();

        Station newStation = stationService.createChildStation(stationToCalibrateId);
        List<MaxCorrelated> maxCorrelated = findCorrelationValues(measurementDifferencesMap);

        for (MaxCorrelated mc : maxCorrelated) {
            double[] diffArray = measurementDifferencesMap.get(mc.getDifferencesMapKeyName());
            double[] correlatedValues;

            correlatedValues = referenceStationData[mc.getReferenceDataColNum()];

            double[] varResult = prepareResult(diffArray, correlatedValues);
            saveResults(newStation, varResult, mc);
        }

        return result;
    }

    private void checkNumberOfMeasurements() throws TooFewMeasurementsToCalibrate {
        if (measurements.size() < 12) {
            throw new TooFewMeasurementsToCalibrate();
        }
    }

    private void fetchMeasurementsData() {
        int i = 0;
        for (MeasurementsCompare m : measurements) {
            for (Object[] measurementsData : measurementRepository.getPollutionAndWeatherForMeasurements(m.getM1(), m.getM2())) {
                int row1 = referenceStationMeasurementTypes.indexOf(String.valueOf(measurementsData[0]));
                int row2 = stationToCalibrateMeasurementTypes.indexOf(String.valueOf(measurementsData[0]));
                Object referenceStationMeasurementValue = measurementsData[1];
                Object stationToCalibrateMeasurementValue = measurementsData[2];
                if (referenceStationMeasurementValue != null) {
                    referenceStationData[row1][i] = (double) referenceStationMeasurementValue;
                }
                if (stationToCalibrateMeasurementValue != null) {
                    stationToCalibrateData[row2][i] = (double) stationToCalibrateMeasurementValue;
                }
            }
            i++;
        }
    }

    private Map<String, PairOfIds> prepareMapOfSameMeasurementTypes() {
        Map<String, PairOfIds> sameMeasurementTypeMap = new HashMap<>();
        for (int rId = 0; rId < referenceStationMeasurementTypes.size(); rId++) {
            for (int cId = 0; cId < stationToCalibrateMeasurementTypes.size(); cId++) {
                if (referenceStationMeasurementTypes.get(rId).equalsIgnoreCase(stationToCalibrateMeasurementTypes.get(cId))) {
                    sameMeasurementTypeMap.put(referenceStationMeasurementTypes.get(rId), new PairOfIds(rId, cId));
                }
            }
        }
        return sameMeasurementTypeMap;
    }

    private Map<String, double[]> prepareMeasurementDifferencesData() {
        List<String> pollutionMeasurementTypes = filterPollutionMeasurementTypes(new ArrayList<>(result.getSameMeasurementTypes().keySet()));
        Map<String, double[]> diffMap = new HashMap<>();
        for (Map.Entry<String, PairOfIds> e : result.getSameMeasurementTypes().entrySet()) {
            calculateDifferencesForSingleType(diffMap, e.getKey(), pollutionMeasurementTypes,
                    referenceStationData[e.getValue().getReferenceDataColumnId()],
                    stationToCalibrateData[e.getValue().getToCalibrateDataColumnId()]);
        }
        return diffMap;
    }

    private List<String> filterPollutionMeasurementTypes(List<String> allTypes) {
        List<String> pollutionTypes = PollutionMeasurementType.getListOfEnums();
        return allTypes.stream().filter(pollutionTypes::contains).collect(Collectors.toList());
    }

    private void calculateDifferencesForSingleType(Map<String, double[]> diffMap, String name,
                                                   List<String> pollutionMeasurementTypes,
                                                   double[] referenceData, double[] dataToCalibrate) {
        int dataSize = referenceData.length;
        BigDecimal diffSum = BigDecimal.ZERO;
        double maxDiff = 0.0;
        double[] diffArray = new double[dataSize];
        boolean saveToDiffMap = pollutionMeasurementTypes.contains(name);

        for (int i = 0; i < dataSize; i++) {
            double diff = referenceData[i] - dataToCalibrate[i];
            diffSum = diffSum.add(BigDecimal.valueOf(diff));
            if (Math.abs(maxDiff) < Math.abs(diff)) {
                maxDiff = diff;
            }
            if (saveToDiffMap) {
                diffArray[i] = diff;
            }
        }
        if (saveToDiffMap) {
            diffMap.put(name, diffArray);
        }

        double meanDiff = diffSum.divide(new BigDecimal(dataSize), RoundingMode.HALF_UP).doubleValue();
        result.getMeanAndMaxDiffMap().put(name, new MeanAndMaxDiff(meanDiff, maxDiff));
    }

    private List<MaxCorrelated> findCorrelationValues(Map<String, double[]> measurementDifferencesMap) {
        SpearmansCorrelation sc = new SpearmansCorrelation();
        double[][] correlationArrayWithReference = new double[measurementDifferencesMap.size()][referenceStationData.length];
        List<MaxCorrelated> maxCorrelated = new ArrayList<>();
        int i = 0;
        for (Map.Entry<String, double[]> e : measurementDifferencesMap.entrySet()) {
            double maxCoef = 0;
            int maxCol = -1;

            for (int k = 0; k < referenceStationData.length; k++) {
                double coef = Math.abs(sc.correlation(referenceStationData[k], e.getValue()));
                correlationArrayWithReference[i][k] = coef;
                if (coef > maxCoef) {
                    maxCoef = coef;
                    maxCol = k;
                }
            }
            maxCorrelated.add(new MaxCorrelated(maxCoef, e.getKey(), maxCol));
            i++;
        }

        result.setCorrelationResultForReferenceStation(CorrelationResult.builder()
                .correlationValues(correlationArrayWithReference)
                .rowNames(new ArrayList<>(measurementDifferencesMap.keySet()))
                .columnNames(referenceStationMeasurementTypes)
                .build());

        return maxCorrelated;
    }

    private double[] prepareResult(double[] diffArray, double[] correlatedValues) {
        double diffArrayPValue = adfTest(diffArray);
        double toCalibrateArrayPValue = adfTest(correlatedValues);
        if (diffArrayPValue > P_VALUE || toCalibrateArrayPValue > P_VALUE) {
            double[] stationaryDiffArray = makeStationary(diffArray);
            double[] stationaryToCalibrateArray = makeStationary(correlatedValues);
            double[] varResult = var(stationaryToCalibrateArray, stationaryDiffArray);
            return invertTransformation(varResult);
        } else {
            return var(diffArray, correlatedValues);
        }
    }

    private double adfTest(double[] input) {
        RCode code = RCode.create();
        code.addDoubleArray("input", input);
        code.R_require("tseries");
        code.addRCode("s <- adf.test(input)");
        RCaller caller = RCaller.create(code, RCallerOptions.create());
        caller.runAndReturnResult("s");
        return caller.getParser().getAsDoubleArray("p_value")[0];
    }

    private double[] makeStationary(double[] input) {
        RCode code = RCode.create();
        code.addDoubleArray("input", input);
        code.addRCode("res <- diff(input)");
        RCaller caller = RCaller.create(code, RCallerOptions.create());
        caller.runAndReturnResult("res");
        return caller.getParser().getAsDoubleArray("res");
    }

    private double[] var(double[] input1, double[] input2) {
        RCode code = RCode.create();
        code.addDoubleArray("input1", input1);
        code.addDoubleArray("input2", input2);
        code.R_require("vars");
        code.addRCode("v1 <- cbind(input1, input2)");
        code.addRCode("select <- VARselect(v1, type = 'const')");
        code.addRCode("p_selected <- unname(select$selection[1])");
        code.addRCode("model <- VAR(v1, p = p_selected, type = 'const', season = NULL, exog = NULL)");
        code.addRCode("coefs <- model$varresult$input1$coefficients");
        code.addRCode("fitted <- fitted(model$varresult$input1)");
        code.addRCode("res <- list(coefs = coefs, fitted = fitted)");
        RCaller caller = RCaller.create(code, RCallerOptions.create());
        caller.runAndReturnResult("res");
        formulaCoefs = caller.getParser().getAsDoubleArray("coefs");
        return caller.getParser().getAsDoubleArray("fitted");
    }

    private double[] invertTransformation(double[] input) {
        RCode code = RCode.create();
        code.addDoubleArray("input", input);
        code.addRCode("res <- cumsum(input)");
        RCaller caller = RCaller.create(code, RCallerOptions.create());
        caller.runAndReturnResult("res");
        return caller.getParser().getAsDoubleArray("res");
    }

    private void saveResults(Station newStation, double[] varResult, MaxCorrelated maxCorrelated) {
        String measurementType = maxCorrelated.getDifferencesMapKeyName();
        int indexOfMeasuementType = stationToCalibrateMeasurementTypes.indexOf(measurementType);
        double[] toCalibrateData = stationToCalibrateData[indexOfMeasuementType];
        PollutionMeasurementType pmt = PollutionMeasurementType.valueOf(measurementType);
        int lengthDiff = toCalibrateData.length - varResult.length;

        saveCalibrationResult(pmt, newStation, maxCorrelated.getCorrelationValue(), maxCorrelated.getReferenceDataColNum());
        for (int i = 0; i < varResult.length; i++) {
            Measurement measurement = Measurement.builder()
                    .station(newStation)
                    .time(measurements.get(i + lengthDiff).getTime2())
                    .build();
            measurement.setId(measurementService.addMeasurement(measurement));

            pollutionService.addPollution(Pollution.builder()
                    .measurement(measurement)
                    .measurementType(pmt)
                    .measurementValue(calculateFinalValue(toCalibrateData, lengthDiff, varResult, i, maxCorrelated.getCorrelationValue()))
                    .build());
        }
    }

    private double calculateFinalValue(double[] toCalibrateData, int lengthDiff, double[] varResult, int i, double maxCorrelationValue) {
        return toCalibrateData[i + lengthDiff] + (maxCorrelationValue * varResult[i]);
    }

    private void saveCalibrationResult(PollutionMeasurementType pmt, Station station, double maxCorrelationValue, int maxCorrelatedColId) {
         CalibrationResult calibrationResult = CalibrationResult.builder()
                .measurementType(pmt)
                .station(station)
                .calibrationFormula(prepareCalibrationFormula(maxCorrelationValue, maxCorrelatedColId))
                .build();

         stationService.addCalibrationResult(calibrationResult);
    }

    private String prepareCalibrationFormula(double maxCorrelationValue, int maxCorrelatedColId) {
        String maxCorrelatedName = referenceStationMeasurementTypes.get(maxCorrelatedColId);
        StringBuilder b = new StringBuilder();
        b.append("skalibrowany_pomiar_n = pomiar_n + ");
        b.append(maxCorrelationValue);
        b.append(" * (");

        for (int i = 0; i < ((formulaCoefs.length -1 )/2); i++) {
            if (i != 0 ) {
                b.append(" + ");
            }
            b.append(String.format("referencyjny_pomiar_n-%d - pomiar_n-%d) * %f", i+1, i+1, formulaCoefs[(i*2)]));
            b.append(String.format(" + referencyjny_pomiar_%s_n-%d * %f", maxCorrelatedName.toLowerCase(), i+1, formulaCoefs[((i*2)+1)]));
        }
        b.append(" + ");
        b.append(formulaCoefs[formulaCoefs.length-1]);
        b.append(")");
        return b.toString();
    }
}
