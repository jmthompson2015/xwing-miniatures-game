import Logger from "../utility/Logger.js";

import Faction from "../artifact/Faction.js";
import PilotCard from "../artifact/PilotCard.js";
import Ship from "../artifact/Ship.js";

import PilotChooser from "./PilotChooser.js";

window.LOGGER = new Logger();
LOGGER.setTraceEnabled(false);
LOGGER.setDebugEnabled(false);

var resourceBase = "../resource/";
var factionKey = Faction.IMPERIAL;
var faction = Faction.properties[factionKey];
var ship = Ship.properties[Ship.TIE_FIGHTER];

var element1 = React.createElement(PilotChooser,
{
   faction: faction,
   onChange: pilotChanged,
   resourceBase: resourceBase,
   ship: ship,
});
ReactDOM.render(element1, document.getElementById("pilotChooserPanel1"));

var element2 = React.createElement(PilotChooser,
{
   faction: faction,
   index: 2,
   initialPilotCard: PilotCard.properties[PilotCard.HOWLRUNNER],
   onChange: pilotChanged,
   resourceBase: resourceBase,
   ship: ship,
});
ReactDOM.render(element2, document.getElementById("pilotChooserPanel2"));

var element3 = React.createElement(PilotChooser,
{
   faction: faction,
   index: 3,
   initialPilotCard: PilotCard.properties[PilotCard.GOZANTI_CLASS_CRUISER],
   onChange: pilotChanged,
   resourceBase: resourceBase,
   ship: Ship.properties[Ship.GOZANTI_CLASS_CRUISER],
});
ReactDOM.render(element3, document.getElementById("pilotChooserPanel3"));

var element4 = React.createElement(PilotChooser,
{
   faction: faction,
   index: 4,
   initialPilotCard: PilotCard.properties[PilotCard.RAIDER_CLASS_CORVETTE],
   onChange: pilotChanged,
   resourceBase: resourceBase,
   ship: Ship.properties[Ship.RAIDER_CLASS_CORVETTE],
});
ReactDOM.render(element4, document.getElementById("pilotChooserPanel4"));

function pilotChanged(event, pilot, index)
{
   LOGGER.info("pilotChanged() pilot = " + (pilot ? pilot.key : pilot) + " index = " + index);
}