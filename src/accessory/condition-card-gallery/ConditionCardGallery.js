import Logger from "../../utility/Logger.js";

import ConditionCard from "../../artifact/ConditionCard.js";

import CardImage from "../../view/CardImage.js";

window.LOGGER = new Logger();
LOGGER.setTraceEnabled(false);
LOGGER.setDebugEnabled(false);

const resourceBase = "../../../src/resource/";

class ConditionGallery extends React.Component
{
   render()
   {
      const conditionKeys = this.props.conditionKeys;

      const cells = [];

      conditionKeys.forEach(function(conditionKey)
      {
         const element = React.createElement(CardImage,
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
   }
}

const rows = [];

rows.push(React.createElement(ConditionGallery,
{
   key: "conditionGallery" + rows.length,
   conditionKeys: ConditionCard.keys(),
}));

const mainPanel = ReactDOMFactories.div(
{}, rows);
ReactDOM.render(mainPanel, document.getElementById("mainPanel"));