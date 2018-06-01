import Logger from "../utility/Logger.js";

import DamageCard from "../artifact/DamageCard.js";
import Phase from "../artifact/Phase.js";
import PilotCard from "../artifact/PilotCard.js";
import ShipAction from "../artifact/ShipAction.js";
import UpgradeCard from "../artifact/UpgradeCard.js";

import Ability from "../model/Ability.js";
import DamageAbility2 from "../model/DamageAbility2.js";
import EnvironmentFactory from "../model/EnvironmentFactory.js";
import PilotAbility2 from "../model/PilotAbility2.js";
import ShipActionAbility from "../model/ShipActionAbility.js";
import UpgradeAbility2 from "../model/UpgradeAbility2.js";

import AbilityChooser from "./AbilityChooser.js";

// require(["react", "react-dom", "utility/Logger", "model/Ability", "artifact/DamageCard",
// 		"artifact/Phase", "artifact/PilotCard", "artifact/ShipAction", "artifact/UpgradeCard",
// 		"model/DamageAbility2", "model/PilotAbility2", "model/ShipActionAbility", "model/UpgradeAbility2", "model/EnvironmentFactory",
// 		"view/AbilityChooser"
// 	],
// 	function(React, ReactDOM, Logger, Ability, DamageCard,
// 		Phase, PilotCard, ShipAction, UpgradeCard,
// 		DamageAbility2, PilotAbility2, ShipActionAbility, UpgradeAbility2, EnvironmentFactory,
// 		AbilityChooser)

window.LOGGER = new Logger();
LOGGER.setTraceEnabled(false);
LOGGER.setDebugEnabled(false);

var resourceBase = "../resource/";
var damageKeys = [DamageCard.CONSOLE_FIRE, DamageCard.MINOR_HULL_BREACH];
var damages = damageKeys.map(function(damageKey)
{
   return new Ability(DamageCard, damageKey, DamageAbility2, Phase.ACTIVATION_EXECUTE_MANEUVER);
});
var pilotKeys = [PilotCard.AIREN_CRACKEN, PilotCard.BOSSK, PilotCard.CAPTAIN_YORR];
var pilots = pilotKeys.map(function(pilotKey)
{
   return new Ability(PilotCard, pilotKey, PilotAbility2, Phase.ACTIVATION_EXECUTE_MANEUVER);
});
var shipActionKeys = [ShipAction.EVADE, ShipAction.FOCUS];
var shipActions = shipActionKeys.map(function(shipActionKey)
{
   return new Ability(ShipAction, shipActionKey, ShipActionAbility, ShipActionAbility.ABILITY_KEY);
});
var upgradeKeys = [UpgradeCard.LIGHTNING_REFLEXES, UpgradeCard.TIE_X7];
var upgrades = upgradeKeys.map(function(upgradeKey)
{
   return new Ability(UpgradeCard, upgradeKey, UpgradeAbility2, Phase.ACTIVATION_EXECUTE_MANEUVER);
});

var environment = EnvironmentFactory.createCoreSetEnvironment();
// var store = environment.store();
var token = environment.pilotInstances()[2]; // X-Wing

var element = React.createElement(AbilityChooser,
{
   damages: damages,
   resourceBase: resourceBase,
   onChange: callback,
   pilots: pilots,
   shipActions: shipActions,
   token: token,
   upgrades: upgrades,
});
ReactDOM.render(element, document.getElementById("inputPanel"));

function callback(pilotKey, upgradeKey, isAccepted)
{
   LOGGER.info("pilotKey = " + pilotKey + " upgradeKey = " + upgradeKey + " isAccepted ? " + isAccepted);
}