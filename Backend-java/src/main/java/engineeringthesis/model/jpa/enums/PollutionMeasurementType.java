package engineeringthesis.model.jpa.enums;


import lombok.AllArgsConstructor;
import lombok.Getter;

import java.util.ArrayList;
import java.util.List;

@Getter
@AllArgsConstructor
public enum PollutionMeasurementType {

    PM1("Pył PM1"),
    PM25("Pył PM2.5"),
    PM10("Pył PM10");

    private final String value;

    public static List<String> getListOfNames() {
        List<String> names = new ArrayList<>();
        for(PollutionMeasurementType pmt : PollutionMeasurementType.values()) {
            names.add(pmt.name());
        }
        return names;
    }
}
