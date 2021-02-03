package engineeringthesis.util;

import com.joestelmach.natty.DateGroup;
import com.joestelmach.natty.Parser;

import java.sql.Timestamp;
import java.util.List;

public class DateUtil {

    public static Timestamp parseDate(String timeCell) {
        Parser parser = new Parser();
        List<DateGroup> group = parser.parse(timeCell);
        java.util.Date date = group.get(0).getDates().get(0);
        return new Timestamp(date.getTime());
    }
}
