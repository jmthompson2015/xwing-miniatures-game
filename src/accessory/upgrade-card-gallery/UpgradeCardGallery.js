import Logger from "../../utility/Logger.js";

import UpgradeCard from "../../artifact/UpgradeCard.js";
import UpgradeType from "../../artifact/UpgradeType.js";

import CardImage from "../../view/CardImage.js";

window.LOGGER = new Logger();
LOGGER.setTraceEnabled(false);
LOGGER.setDebugEnabled(false);

var resourceBase = "../../../src/resource/";

class UpgradeGallery extends React.Component
{
   render()
   {
      var upgradeTypeKey = this.props.upgradeTypeKey;
      var upgradeKeys = UpgradeCard.keysByType(upgradeTypeKey);

      var cells = [];

      upgradeKeys.forEach(function(upgradeKey)
      {
         var element = React.createElement(CardImage,
         {
            key: "upgradeInstance" + upgradeKey,
            card: UpgradeCard.properties[upgradeKey],
            resourceBase: resourceBase,
            width: 135,
         });
         cells.push(element);
      });

      return ReactDOMFactories.div(
      {}, cells);
   }
}

var rows = [];

UpgradeType.keys().forEach(function(upgradeTypeKey)
{
   var upgradeType = UpgradeType.properties[upgradeTypeKey];

   rows.push(ReactDOMFactories.h2(
   {
      key: "upgradeHeader" + rows.length,
   }, upgradeType.name));

   rows.push(React.createElement(UpgradeGallery,
   {
      key: "upgradeGallery" + rows.length,
      upgradeTypeKey: upgradeTypeKey,
   }));
});

var mainPanel = ReactDOMFactories.div(
{}, rows);
ReactDOM.render(mainPanel, document.getElementById("mainPanel"));