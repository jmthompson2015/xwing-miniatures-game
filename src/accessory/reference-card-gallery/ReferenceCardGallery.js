import Logger from "../../utility/Logger.js";

import ReferenceCard from "../../artifact/ReferenceCard.js";

import CardImage from "../../view/CardImage.js";

window.LOGGER = new Logger();
LOGGER.setTraceEnabled(false);
LOGGER.setDebugEnabled(false);

const resourceBase = "../../";
const referenceKeys = ReferenceCard.keys();

const rows = referenceKeys.map(function(referenceKey)
{
   return React.createElement(CardImage,
   {
      key: "referenceCard" + referenceKey,
      card: ReferenceCard.properties[referenceKey],
      resourceBase: resourceBase,
      width: 200,
   });
});

const mainPanel = ReactDOMFactories.div(
{}, rows);
ReactDOM.render(mainPanel, document.getElementById("mainPanel"));