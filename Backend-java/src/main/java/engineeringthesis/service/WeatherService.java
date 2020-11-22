package engineeringthesis.service;

import engineeringthesis.model.jpa.Weather;
import engineeringthesis.repository.WeatherRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Optional;

@Service
public class WeatherService {

    @Autowired
    public WeatherRepository weatherRepository;

    public List<Weather> getAllWeathers() {
        return weatherRepository.findAll();
    }

    public Optional<Weather> getWeatherById(Long id) {
        return weatherRepository.findById(id);
    }

    public void addWeather(Weather newWeather) {
        if (weatherRepository.findByValues(newWeather.getMeasurement().getId(),
                newWeather.getMeasurementType().name(), newWeather.getMeasurementValue()).isEmpty()) {
            weatherRepository.save(newWeather);
        }
    }
}
