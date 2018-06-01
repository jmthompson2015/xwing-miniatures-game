import Logger from "../../utility/Logger.js";

import UpgradeCard from "../../artifact/UpgradeCard.js";
import UpgradeType from "../../artifact/UpgradeType.js";

import CardImage from "../../view/CardImage.js";

// require(["create-react-class", "react", "react-dom", "react-dom-factories",
//     "utility/Logger", "artifact/UpgradeCard", "artifact/UpgradeType", "view/CardImage"
//   ],
//   function(createReactClass, React, ReactDOM, ReactDOMFactories, Logger, UpgradeCard, UpgradeType, CardImage)

window.LOGGER = new Logger();
LOGGER.setTraceEnabled(false);
LOGGER.setDebugEnabled(false);

var resourceBase = "../../../src/resource/";

var UpgradeGallery = createReactClass(
{
   render: function()
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
   },
});

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