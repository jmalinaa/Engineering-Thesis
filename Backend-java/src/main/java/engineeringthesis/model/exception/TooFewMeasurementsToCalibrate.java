package engineeringthesis.model.exception;

public class TooFewMeasurementsToCalibrate extends Exception{

    public TooFewMeasurementsToCalibrate() {
        super("Zbyt mało pomiarów do przeprowadzenia kalibracji");
    }
}
