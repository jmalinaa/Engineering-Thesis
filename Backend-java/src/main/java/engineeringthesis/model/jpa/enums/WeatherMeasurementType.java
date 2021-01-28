package engineeringthesis.model.jpa.enums;

import lombok.AllArgsConstructor;
import lombok.Getter;

import java.util.ArrayList;
import java.util.List;

@Getter
@AllArgsConstructor
public enum WeatherMeasurementType {

    TEMPERATURE("Temperatura powietrza"),
    WIND_SPEED("Prędkość wiatru"),
    WIND_DIRECTION("Kierunek wiatru"),
    PRESSURE("Cisnienie atmosferyczne"),
    HUMIDITY("Wilgotność powietrza");

    private final String value;

    public static List<String> getListOfNames() {
        List<String> names = new ArrayList<>();
        for(WeatherMeasurementType wmt : WeatherMeasurementType.values()) {
            names.add(wmt.getValue());
        }
        return names;
    }
}
