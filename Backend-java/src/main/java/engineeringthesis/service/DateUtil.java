package engineeringthesis.service;

import com.joestelmach.natty.DateGroup;
import com.joestelmach.natty.Parser;

import java.sql.Date;
import java.util.List;

public class DateUtil {

    public static Date parseDate(String timeCell) {
        Parser parser = new Parser();
        List<DateGroup> group = parser.parse(timeCell);
        java.util.Date date = group.get(0).getDates().get(0);
        return new Date(date.getTime());
    }
}
