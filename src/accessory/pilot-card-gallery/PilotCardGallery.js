import Logger from "../../utility/Logger.js";

import Faction from "../../artifact/Faction.js";
import PilotCard from "../../artifact/PilotCard.js";

import CardImage from "../../view/CardImage.js";

window.LOGGER = new Logger();
LOGGER.setTraceEnabled(false);
LOGGER.setDebugEnabled(false);

var resourceBase = "../../../src/resource/";

var PilotCardGallery = createReactClass(
{
   render: function()
   {
      var factionKey = this.props.factionKey;
      var isStrict = true;
      var pilotKeys = PilotCard.keysByFaction(factionKey, isStrict);

      var cells = [];

      pilotKeys.forEach(function(pilotKey)
      {
         if ([PilotCard.CR90_CORVETTE, PilotCard.RAIDER_CLASS_CORVETTE].includes(pilotKey))
         {
            var element = React.createElement(CardImage,
            {
               key: "pilotInstance" + pilotKey + ".fore",
               card: PilotCard.properties[pilotKey].fore,
               resourceBase: resourceBase,
               width: 200,
            });
            cells.push(element);
            var element0 = React.createElement(CardImage,
            {
               key: "pilotInstance" + pilotKey + ".aft",
               card: PilotCard.properties[pilotKey].aft,
               resourceBase: resourceBase,
               width: 200,
            });
            cells.push(element0);
         }
         else
         {
            var element1 = React.createElement(CardImage,
            {
               key: "pilotInstance" + pilotKey,
               card: PilotCard.properties[pilotKey],
               resourceBase: resourceBase,
               width: 200,
            });
            cells.push(element1);
         }
      });

      return ReactDOMFactories.div(
      {}, cells);
   },
});

var rows = [];

Faction.keys().forEach(function(factionKey)
{
   var faction = Faction.properties[factionKey];

   rows.push(ReactDOMFactories.h2(
   {
      key: "pilotHeader" + rows.length,
   }, faction.name));

   rows.push(React.createElement(PilotCardGallery,
   {
      key: "pilotGallery" + rows.length,
      factionKey: factionKey,
   }));
});

var mainPanel = ReactDOMFactories.div(
{}, rows);
ReactDOM.render(mainPanel, document.getElementById("mainPanel"));