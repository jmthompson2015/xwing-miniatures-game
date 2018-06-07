import Logger from "../../utility/Logger.js";

import Faction from "../../artifact/Faction.js";
import PilotCard from "../../artifact/PilotCard.js";

import CardImage from "../../view/CardImage.js";

window.LOGGER = new Logger();
LOGGER.setTraceEnabled(false);
LOGGER.setDebugEnabled(false);

const resourceBase = "../../../src/";

class PilotCardGallery extends React.Component
{
   render()
   {
      const factionKey = this.props.factionKey;
      const isStrict = true;
      const pilotKeys = PilotCard.keysByFaction(factionKey, isStrict);

      const cells = [];

      pilotKeys.forEach(function(pilotKey)
      {
         if ([PilotCard.CR90_CORVETTE, PilotCard.RAIDER_CLASS_CORVETTE].includes(pilotKey))
         {
            const element = React.createElement(CardImage,
            {
               key: "pilotInstance" + pilotKey + ".fore",
               card: PilotCard.properties[pilotKey].fore,
               resourceBase: resourceBase,
               width: 200,
            });
            cells.push(element);
            const element0 = React.createElement(CardImage,
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
            const element1 = React.createElement(CardImage,
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
   }
}

const rows = [];

Faction.keys().forEach(function(factionKey)
{
   const faction = Faction.properties[factionKey];

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

const mainPanel = ReactDOMFactories.div(
{}, rows);
ReactDOM.render(mainPanel, document.getElementById("mainPanel"));