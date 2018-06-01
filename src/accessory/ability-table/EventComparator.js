import StringUtilities from "../../utility/StringUtilities.js";

import Event from "../../artifact/Event.js";
import Phase from "../../artifact/Phase.js";

var EventComparator = function(eventA, eventB)
{
   var valueA = createValue(eventA);
   var valueB = createValue(eventB);

   var answer = -1;
   if (valueA === valueB)
   {
      answer = 0;
   }
   else if (valueA > valueB)
   {
      answer = 1;
   }

   return answer;
};

function createValue(event)
{
   var answer = event;
   var key = event.substring(event.indexOf(".") + 1);

   if (event.startsWith("Event"))
   {
      answer = "Event" + StringUtilities.pad(Event.keys().indexOf(key), 2);
   }
   else if (event.startsWith("Phase"))
   {
      answer = "Phase" + StringUtilities.pad(Phase.keys().indexOf(key), 2);
   }

   return answer;
}

export default EventComparator;