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

const resourceBase = "../resource/";

const damage = DamageCard.properties[DamageCard.CONSOLE_FIRE];
const pilot0 = PilotCard.properties[PilotCard.DARTH_VADER];
const pilot1 = PilotCard.properties[PilotCard.LUKE_SKYWALKER];
const pilot2 = PilotCard.properties[PilotCard.DENGAR];
const ship = Ship.properties[Ship.YT_1300];
const shipAction0 = ShipAction.properties[ShipAction.BARREL_ROLL];
const context0 = {
   maneuverKey: Maneuver.BARREL_ROLL_LEFT_1_STANDARD,
};
const shipAction1 = ShipAction.properties[ShipAction.BOOST];
const context1 = {
   maneuverKey: Maneuver.BANK_RIGHT_1_STANDARD,
};
const shipAction2 = ShipAction.properties[ShipAction.EVADE];
const upgrade0 = UpgradeCard.properties[UpgradeCard.VETERAN_INSTINCTS];
const upgrade1 = UpgradeCard.properties[UpgradeCard.LANDO_CALRISSIAN];
const upgrade2 = UpgradeCard.properties[UpgradeCard.ION_PROJECTOR];
const entities = [damage, pilot0, pilot1, pilot2, ship, shipAction0, shipAction1, shipAction2, upgrade0, upgrade1, upgrade2];
const contexts = [undefined, undefined, undefined, undefined, undefined, context0, context1, undefined, undefined, undefined, undefined];

let showIcon, showLabel, showImplemented;

for (let j = 0; j < 5; j++)
{
   let input;

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

   let rows = entities.map(function(entity, i)
   {
      const element = React.createElement(EntityUI,
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

   rows = entities.map(function(entity, i)
   {
      const element = React.createElement(EntityUI,
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