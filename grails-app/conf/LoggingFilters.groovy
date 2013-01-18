import java.text.DateFormat
import java.text.SimpleDateFormat

/**
 * The <i>LoggingFilters</i> class is a simple version of request logging
 *
 * @author Jeff Risberg, Spoorthy Ananthaiah
 * @since 10/16/10
 */
class LoggingFilters {

  def filters = {
    all(controller:'*', action:'*') {
      before = {
        Date now = new Date()
        DateFormat dateF = new SimpleDateFormat("MM/dd/yy HH:mm:ss")

        println "---> " + dateF.format(now) + " " + controllerName + " " + actionName + " " + request.getMethod()
      }
      after = {
        Date now = new Date()
        DateFormat dateF = new SimpleDateFormat("MM/dd/yy HH:mm:ss")

        println "<--- " + dateF.format(now) + " " + controllerName + " " + actionName
      }
      afterView = {
      }
    }
  }
}
