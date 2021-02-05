package engineeringthesis.model.jpa.enums;


import lombok.AllArgsConstructor;
import lombok.Getter;

import java.util.ArrayList;
import java.util.Arrays;
import java.util.List;
import java.util.stream.Collectors;

@Getter
@AllArgsConstructor
public enum PollutionMeasurementType {

    PM1("Pył PM1"),
    PM25("Pył PM2,5"),
    PM10("Pył PM10");

    private final String value;

    public static List<String> getListOfNames() {
        List<String> names = new ArrayList<>();
        for(PollutionMeasurementType pmt : PollutionMeasurementType.values()) {
            names.add(pmt.getValue());
        }
        return names;
    }

    public static List<String> getListOfEnums() {
        List<String> names = new ArrayList<>();
        for(PollutionMeasurementType pmt : PollutionMeasurementType.values()) {
            names.add(pmt.name());
        }
        return names;
    }

    public static PollutionMeasurementType findByValue(String value) {
        List<PollutionMeasurementType> res = Arrays.stream(PollutionMeasurementType.values())
                .filter(pmt -> pmt.getValue().equalsIgnoreCase(value))
                .collect(Collectors.toList());
        return res.size() > 0 ? res.get(0) : null;
    }

}
