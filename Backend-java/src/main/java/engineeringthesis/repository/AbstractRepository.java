package engineeringthesis.repository;
import javax.annotation.PostConstruct;
import javax.persistence.EntityManager;
import javax.persistence.PersistenceContext;
import javax.persistence.criteria.CriteriaBuilder;
import java.util.List;
import java.util.Optional;

public abstract class AbstractRepository {

    @PersistenceContext
    protected EntityManager entityManager;
    protected CriteriaBuilder cb;

    @PostConstruct
    protected  void initCriteriaBuilder(){
        cb = entityManager.getCriteriaBuilder();
    }

    protected static <R> Optional<R> checkForSingleResult(List<R> resultList) {
        if (resultList.size() > 1) {
            throw new AssertionError("More than one result found");
        } else {
            return resultList.isEmpty() ? Optional.empty() : Optional.ofNullable(resultList.get(0));
        }
    }

    protected static <R> Optional<R> singleResult(List<R> resultList) {
        return resultList.isEmpty() ? Optional.empty() : Optional.ofNullable(resultList.get(0));

    }
}