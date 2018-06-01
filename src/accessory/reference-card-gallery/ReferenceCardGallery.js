import Logger from "../../utility/Logger.js";

import ReferenceCard from "../../artifact/ReferenceCard.js";

import CardImage from "../../view/CardImage.js";

// require(["create-react-class", "react", "react-dom", "react-dom-factories", "utility/Logger", "artifact/ReferenceCard", "view/CardImage"],
//   function(createReactClass, React, ReactDOM, ReactDOMFactories, Logger, ReferenceCard, CardImage)

window.LOGGER = new Logger();
LOGGER.setTraceEnabled(false);
LOGGER.setDebugEnabled(false);

// var resourceBase = "../../../src/resource/";
var resourceBase = "../../";
var referenceKeys = ReferenceCard.keys();

var rows = referenceKeys.map(function(referenceKey)
{
   return React.createElement(CardImage,
   {
      key: "referenceCard" + referenceKey,
      card: ReferenceCard.properties[referenceKey],
      resourceBase: resourceBase,
      width: 200,
   });
});

var mainPanel = ReactDOMFactories.div(
{}, rows);
ReactDOM.render(mainPanel, document.getElementById("mainPanel"));