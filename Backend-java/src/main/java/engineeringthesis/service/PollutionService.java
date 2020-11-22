package engineeringthesis.service;

import engineeringthesis.model.jpa.Pollution;
import engineeringthesis.repository.PollutionRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Optional;

@Service
public class PollutionService {

    @Autowired
    public PollutionRepository pollutionRepository;

    public List<Pollution> getAllPollutions() {
        return pollutionRepository.findAll();
    }


    public Optional<Pollution> getPollutionById(Long id) {
        return pollutionRepository.findById(id);
    }

    public long addPollution(Pollution newPollution) {
        pollutionRepository.save(newPollution);
        return newPollution.getId();
    }
}
