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

window.LOGGER = new Logger();
LOGGER.setTraceEnabled(false);
LOGGER.setDebugEnabled(false);

const resourceBase = "../resource/";
const damageKeys = [DamageCard.CONSOLE_FIRE, DamageCard.MINOR_HULL_BREACH];
const damages = damageKeys.map(function(damageKey)
{
   return new Ability(DamageCard, damageKey, DamageAbility2, Phase.ACTIVATION_EXECUTE_MANEUVER);
});
const pilotKeys = [PilotCard.AIREN_CRACKEN, PilotCard.BOSSK, PilotCard.CAPTAIN_YORR];
const pilots = pilotKeys.map(function(pilotKey)
{
   return new Ability(PilotCard, pilotKey, PilotAbility2, Phase.ACTIVATION_EXECUTE_MANEUVER);
});
const shipActionKeys = [ShipAction.EVADE, ShipAction.FOCUS];
const shipActions = shipActionKeys.map(function(shipActionKey)
{
   return new Ability(ShipAction, shipActionKey, ShipActionAbility, ShipActionAbility.ABILITY_KEY);
});
const upgradeKeys = [UpgradeCard.LIGHTNING_REFLEXES, UpgradeCard.TIE_X7];
const upgrades = upgradeKeys.map(function(upgradeKey)
{
   return new Ability(UpgradeCard, upgradeKey, UpgradeAbility2, Phase.ACTIVATION_EXECUTE_MANEUVER);
});

const environment = EnvironmentFactory.createCoreSetEnvironment();
// const store = environment.store();
const token = environment.pilotInstances()[2]; // X-Wing

const element = React.createElement(AbilityChooser,
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