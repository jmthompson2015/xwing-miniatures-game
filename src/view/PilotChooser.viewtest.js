import Logger from "../utility/Logger.js";

import Faction from "../artifact/Faction.js";
import PilotCard from "../artifact/PilotCard.js";
import Ship from "../artifact/Ship.js";

import PilotChooser from "./PilotChooser.js";

window.LOGGER = new Logger();
LOGGER.setTraceEnabled(false);
LOGGER.setDebugEnabled(false);

const resourceBase = "../resource/";
const factionKey = Faction.IMPERIAL;
const faction = Faction.properties[factionKey];
const ship = Ship.properties[Ship.TIE_FIGHTER];

const element1 = React.createElement(PilotChooser,
{
   faction: faction,
   onChange: pilotChanged,
   resourceBase: resourceBase,
   ship: ship,
});
ReactDOM.render(element1, document.getElementById("pilotChooserPanel1"));

const element2 = React.createElement(PilotChooser,
{
   faction: faction,
   index: 2,
   initialPilot: PilotCard.properties[PilotCard.HOWLRUNNER],
   onChange: pilotChanged,
   resourceBase: resourceBase,
   ship: ship,
});
ReactDOM.render(element2, document.getElementById("pilotChooserPanel2"));

const element3 = React.createElement(PilotChooser,
{
   faction: faction,
   index: 3,
   initialPilot: PilotCard.properties[PilotCard.GOZANTI_CLASS_CRUISER],
   onChange: pilotChanged,
   resourceBase: resourceBase,
   ship: Ship.properties[Ship.GOZANTI_CLASS_CRUISER],
});
ReactDOM.render(element3, document.getElementById("pilotChooserPanel3"));

const element4 = React.createElement(PilotChooser,
{
   faction: faction,
   index: 4,
   initialPilot: PilotCard.properties[PilotCard.RAIDER_CLASS_CORVETTE],
   onChange: pilotChanged,
   resourceBase: resourceBase,
   ship: Ship.properties[Ship.RAIDER_CLASS_CORVETTE],
});
ReactDOM.render(element4, document.getElementById("pilotChooserPanel4"));

function pilotChanged(event, pilot, index)
{
   LOGGER.info("pilotChanged() pilot = " + (pilot ? pilot.key : pilot) + " index = " + index);
}