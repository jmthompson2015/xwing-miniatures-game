import Logger from "../../utility/Logger.js";

import ConditionCard from "../../artifact/ConditionCard.js";

import CardImage from "../../view/CardImage.js";

// require(["create-react-class", "react", "react-dom", "react-dom-factories", "utility/Logger", "artifact/ConditionCard", "view/CardImage"],
//   function(createReactClass, React, ReactDOM, ReactDOMFactories, Logger, ConditionCard, CardImage)

window.LOGGER = new Logger();
LOGGER.setTraceEnabled(false);
LOGGER.setDebugEnabled(false);

var resourceBase = "../../../src/resource/";

var ConditionGallery = createReactClass(
{
   render: function()
   {
      var conditionKeys = this.props.conditionKeys;

      var cells = [];

      conditionKeys.forEach(function(conditionKey)
      {
         var element = React.createElement(CardImage,
         {
            key: "conditionInstance" + conditionKey,
            card: ConditionCard.properties[conditionKey],
            resourceBase: resourceBase,
            width: 135,
         });
         cells.push(element);
      });

      return ReactDOMFactories.div(
      {}, cells);
   },
});

var rows = [];

rows.push(React.createElement(ConditionGallery,
{
   key: "conditionGallery" + rows.length,
   conditionKeys: ConditionCard.keys(),
}));

var mainPanel = ReactDOMFactories.div(
{}, rows);
ReactDOM.render(mainPanel, document.getElementById("mainPanel"));