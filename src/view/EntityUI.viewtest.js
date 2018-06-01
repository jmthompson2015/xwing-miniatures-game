import Logger from "../utility/Logger.js";

import DamageCard from "../artifact/DamageCard.js";
import Maneuver from "../artifact/Maneuver.js";
import PilotCard from "../artifact/PilotCard.js";
import Ship from "../artifact/Ship.js";
import ShipAction from "../artifact/ShipAction.js";
import UpgradeCard from "../artifact/UpgradeCard.js";

import EntityUI from "./EntityUI.js";
import InputPanel from "./InputPanel.js";

window.LOGGER = new Logger();
LOGGER.setTraceEnabled(false);
LOGGER.setDebugEnabled(false);

var resourceBase = "../resource/";

var damage = DamageCard.properties[DamageCard.CONSOLE_FIRE];
var pilot0 = PilotCard.properties[PilotCard.DARTH_VADER];
var pilot1 = PilotCard.properties[PilotCard.LUKE_SKYWALKER];
var pilot2 = PilotCard.properties[PilotCard.DENGAR];
var ship = Ship.properties[Ship.YT_1300];
var shipAction0 = ShipAction.properties[ShipAction.BARREL_ROLL];
var context0 = {
   maneuverKey: Maneuver.BARREL_ROLL_LEFT_1_STANDARD,
};
var shipAction1 = ShipAction.properties[ShipAction.BOOST];
var context1 = {
   maneuverKey: Maneuver.BANK_RIGHT_1_STANDARD,
};
var shipAction2 = ShipAction.properties[ShipAction.EVADE];
var upgrade0 = UpgradeCard.properties[UpgradeCard.VETERAN_INSTINCTS];
var upgrade1 = UpgradeCard.properties[UpgradeCard.LANDO_CALRISSIAN];
var upgrade2 = UpgradeCard.properties[UpgradeCard.ION_PROJECTOR];
var entities = [damage, pilot0, pilot1, pilot2, ship, shipAction0, shipAction1, shipAction2, upgrade0, upgrade1, upgrade2];
var contexts = [undefined, undefined, undefined, undefined, undefined, context0, context1, undefined, undefined, undefined, undefined];

var showIcon, showLabel, showImplemented;

for (var j = 0; j < 5; j++)
{
   var input = undefined;

   switch (j)
   {
      case 0:
         input = ReactDOMFactories.input(
         {
            name: "testInput",
            type: InputPanel.Type.RADIO,
         });
         break;
      case 1:
         showIcon = true;
         showLabel = true;
         showImplemented = true;
         break;
      case 2:
         showIcon = false;
         showLabel = true;
         showImplemented = true;
         break;
      case 3:
         showIcon = true;
         showLabel = false;
         showImplemented = true;
         break;
      case 4:
         showIcon = true;
         showLabel = true;
         showImplemented = false;
         break;
   }

   var rows = entities.map(function(entity, i)
   {
      var element = React.createElement(EntityUI,
      {
         key: "childDiv" + i,
         context: contexts[i],
         entity: entity,
         panelClass: "dtc",
         resourceBase: resourceBase,
         showIcon: showIcon,
         showLabel: showLabel,
         showImplemented: showImplemented,
      });
      return ReactDOMFactories.div(
      {
         key: "inputRow" + i,
         className: "dtr mv1",
      }, ReactDOMFactories.div(
      {
         key: "inputCell" + i,
         className: "dtc mv1 pr1 v-mid",
      }, input), element);
   });

   ReactDOM.render(ReactDOMFactories.div(
   {
      className: "bg-near-white dt f6 mb1",
   }, rows), document.getElementById("panel" + j));

   var rows = entities.map(function(entity, i)
   {
      var element = React.createElement(EntityUI,
      {
         key: "childDiv" + i,
         context: contexts[i],
         entity: entity,
         resourceBase: resourceBase,
         showIcon: showIcon,
         showLabel: showLabel,
         showImplemented: showImplemented,
      });
      return ReactDOMFactories.tr(
      {
         key: "inputRow" + i,
         className: "dtr",
      }, ReactDOMFactories.td(
      {
         key: "inputCell" + i,
         className: "dtc pr1 v-mid",
      }, input), ReactDOMFactories.td(
      {
         key: "elementCell" + i,
      }, element));
   });

   ReactDOM.render(ReactDOMFactories.table(
   {
      className: "bg-near-white dt f6 mb1",
   }, ReactDOMFactories.tbody(
   {}, rows)), document.getElementById("panel2" + j));
}