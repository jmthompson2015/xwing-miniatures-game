import Logger from "../../utility/Logger.js";

import Faction from "../../artifact/Faction.js";
import ShipFaction from "../../artifact/ShipFaction.js";

import Action from "../../model/Action.js";
import Agent from "../../model/Agent.js";
import Reducer from "../../model/Reducer.js";

import ReactUtilities from "../../view/ReactUtilities.js";
import ShipCardUI from "../../view/ShipCardUI.js";

// require(["create-react-class", "prop-types", "react", "react-dom", "react-dom-factories", "redux", "utility/Logger",
//     "artifact/ShipFaction", "artifact/Faction", "model/Action", "model/Agent", "model/Reducer", "view/ReactUtilities",
//     "view/ShipCardUI"
//   ],
//   function(createReactClass, PropTypes, React, ReactDOM, ReactDOMFactories, Redux, Logger, ShipFaction, Faction, Action, Agent, Reducer, ReactUtilities, ShipCardUI)

window.LOGGER = new Logger();
LOGGER.setTraceEnabled(false);
LOGGER.setDebugEnabled(false);

var store = Redux.createStore(Reducer.root);
var resourceBase = "../../../src/resource/";
store.dispatch(Action.setResourceBase(resourceBase));

var ShipGallery = createReactClass(
{
   propTypes:
   {
      factionKey: PropTypes.string.isRequired,
   },
   render: function()
   {
      var factionKey = this.props.factionKey;
      var isStrict = true;
      var shipFactionKeys = ShipFaction.keysByFaction(factionKey, isStrict);
      var agent = new Agent(store, "Agent");

      var cells = [];
      var excludes = [ShipFaction.IMPERIAL_TIE_BOMBER_V2,
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
            var shipFaction = ShipFaction.properties[shipFactionKey];
            var element = React.createElement(ShipCardUI,
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
   },
});

var rows = [];

Faction.keys().forEach(function(factionKey)
{
   var faction = Faction.properties[factionKey];
   rows.push(ReactDOMFactories.h2(
   {
      key: "title" + factionKey,
   }, faction.name));
   var element = React.createElement(ShipGallery,
   {
      key: "gallery" + factionKey,
      factionKey: factionKey,
   });
   rows.push(element);
});

var mainPanel = ReactDOMFactories.div(
{}, rows);
ReactDOM.render(mainPanel, document.getElementById("mainPanel"));