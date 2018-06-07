import StringUtilities from "../../utility/StringUtilities.js";

import Event from "../../artifact/Event.js";
import Phase from "../../artifact/Phase.js";

const EventComparator = function(eventA, eventB)
{
   const valueA = createValue(eventA);
   const valueB = createValue(eventB);

   let answer = -1;
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
   let answer = event;
   const key = event.substring(event.indexOf(".") + 1);

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