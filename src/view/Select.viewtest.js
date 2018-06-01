import Logger from "../utility/Logger.js";

import Select from "./Select.js";

window.LOGGER = new Logger();
LOGGER.setTraceEnabled(false);
LOGGER.setDebugEnabled(false);

var values = ["zero", "one", "two"];
var labelFunction = function(value)
{
   return value.toUpperCase();
};
var initialSelectedValue = values[1];
var select = React.createElement(Select,
{
   values: values,
   labelFunction: labelFunction,
   initialSelectedValue: initialSelectedValue,
   onChange: myOnChange,
   clientProps:
   {
      "data-myprop": "something",
   }
});
ReactDOM.render(select, document.getElementById("testPanel"));

function myOnChange(event)
{
   LOGGER.info("event = " + event);
   LOGGER.info("event = " + Object.getOwnPropertyNames(event));
   LOGGER.info("event.currentTarget = " + event.currentTarget);
   LOGGER.info("event.currentTarget = " + Object.getOwnPropertyNames(event.currentTarget));
   LOGGER.info("event.currentTarget.constructor = " + event.currentTarget.constructor);
   LOGGER.info("event.currentTarget.constructor = " + Object.getOwnPropertyNames(event.currentTarget.constructor));
   LOGGER.info("event.currentTarget.constructor.prototype = " + event.currentTarget.constructor.prototype);
   LOGGER.info("event.currentTarget.constructor.prototype = " + Object.getOwnPropertyNames(event.currentTarget.constructor.prototype));
   LOGGER.info("event.currentTarget.dataset.myprop = " + event.currentTarget.dataset.myprop);

   var selectedValue = event.target.value;
   LOGGER.info("myOnChange() selectedValue = " + selectedValue);
}