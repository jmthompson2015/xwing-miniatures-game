import Logger from "../../utility/Logger.js";

import Faction from "../../artifact/Faction.js";
import ShipFaction from "../../artifact/ShipFaction.js";

import Action from "../../model/Action.js";
import Agent from "../../model/Agent.js";
import Reducer from "../../model/Reducer.js";

import ReactUtilities from "../../view/ReactUtilities.js";
import ShipCardUI from "../../view/ShipCardUI.js";

window.LOGGER = new Logger();
LOGGER.setTraceEnabled(false);
LOGGER.setDebugEnabled(false);

const store = Redux.createStore(Reducer.root);
const resourceBase = "../../../src/resource/";
store.dispatch(Action.setResourceBase(resourceBase));

class ShipGallery extends React.Component
{
   render()
   {
      const factionKey = this.props.factionKey;
      const isStrict = true;
      const shipFactionKeys = ShipFaction.keysByFaction(factionKey, isStrict);
      const agent = new Agent(store, "Agent");

      const cells = [];
      const excludes = [ShipFaction.IMPERIAL_TIE_BOMBER_V2,
              ShipFaction.IMPERIAL_TIE_DEFENDER_V2,
              ShipFaction.IMPERIAL_TIE_INTERCEPTOR_V2,
              ShipFaction.IMPERIAL_TIE_INTERCEPTOR_V3,
              ShipFaction.REBEL_A_WING_V2,
              ShipFaction.REBEL_B_WING_V2,
              ShipFaction.RESISTANCE_T_70_X_WING_V2,
              ShipFaction.SCUM_KIHRAXZ_FIGHTER_V2,
              ShipFaction.SCUM_M3_A_INTERCEPTOR_V2,
              ShipFaction.SCUM_STAR_VIPER_V2,
            ];

      shipFactionKeys.forEach(function(shipFactionKey)
      {
         if (!excludes.includes(shipFactionKey))
         {
            const shipFaction = ShipFaction.properties[shipFactionKey];
            const element = React.createElement(ShipCardUI,
            {
               key: "instance" + shipFactionKey,
               agent: agent,
               resourceBase: resourceBase,
               shipFaction: shipFaction,
            });
            cells.push(element);
         }
      });

      return ReactUtilities.createFlexboxWrap(cells);
   }
}

ShipGallery.propTypes = {
   factionKey: PropTypes.string.isRequired,
};

const rows = [];

Faction.keys().forEach(function(factionKey)
{
   const faction = Faction.properties[factionKey];
   rows.push(ReactDOMFactories.h2(
   {
      key: "title" + factionKey,
   }, faction.name));
   const element = React.createElement(ShipGallery,
   {
      key: "gallery" + factionKey,
      factionKey: factionKey,
   });
   rows.push(element);
});

const mainPanel = ReactDOMFactories.div(
{}, rows);
ReactDOM.render(mainPanel, document.getElementById("mainPanel"));