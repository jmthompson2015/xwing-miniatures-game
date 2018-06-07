import Logger from "../../utility/Logger.js";

import UpgradeCard from "../../artifact/UpgradeCard.js";
import UpgradeType from "../../artifact/UpgradeType.js";

import CardImage from "../../view/CardImage.js";

window.LOGGER = new Logger();
LOGGER.setTraceEnabled(false);
LOGGER.setDebugEnabled(false);

const resourceBase = "../../../src/resource/";

class UpgradeGallery extends React.Component
{
   render()
   {
      const upgradeTypeKey = this.props.upgradeTypeKey;
      const upgradeKeys = UpgradeCard.keysByType(upgradeTypeKey);

      const cells = [];

      upgradeKeys.forEach(function(upgradeKey)
      {
         const element = React.createElement(CardImage,
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

const rows = [];

UpgradeType.keys().forEach(function(upgradeTypeKey)
{
   const upgradeType = UpgradeType.properties[upgradeTypeKey];

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

const mainPanel = ReactDOMFactories.div(
{}, rows);
ReactDOM.render(mainPanel, document.getElementById("mainPanel"));