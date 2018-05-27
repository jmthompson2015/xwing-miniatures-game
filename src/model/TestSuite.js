"use strict";

var prefix = "model/";
var suffix = ".test";
var testModules = ["Ability", "ActivationAction", "ActivationPhaseTask", "Adjudicator", "Agent", "AgentReducer", "AgentSquadAction",
      "AgentSquadInitialState", "AgentSquadReducer", "AttackDice", "CardComparator", "CardInstance", "CardReducer", "CombatAction", "CombatAction2",
      "CombatPhaseTask", "DamageDealer", "DefenseDice", "EndPhaseTask", "Engine", "Environment", "EnvironmentReducer", "EventObserver", "FiringComputer",
      "InitialState", "ManeuverAction", "ManeuverComputer", "MediumAgent", "ModifyDiceAbility", "Path", "PhaseObserver", "PilotInstanceUtilities",
      "PlanningPhaseTask", "Position", "RangeRuler", "RectanglePath", "Reducer", "Selector", "ShipActionAbility", "ShipDestroyedAction", "ShipFledAction",
      "SimpleAgent", "Squad", "SquadBuilder", "TargetLock", "Weapon", "WeaponInterface",

      "DamageAbility0", "DamageAbility1", "DamageAbility2", "DamageAbility3", "DamageAbility4",
      "PilotAbility0", "PilotAbility1", "PilotAbility2", "PilotAbility3", "PilotAbility4",
      "UpgradeAbility0", "UpgradeAbility1", "UpgradeAbility2", "UpgradeAbility3", "UpgradeAbility4",

      "EnvironmentFactory", "MockAttackDice", "MockDefenseDice",
    ];

testModules = testModules.map(function(testModule)
{
   return prefix + testModule + suffix;
});
testModules.unshift("utility/Logger");

require(testModules, function(Logger)
{
   window.LOGGER = new Logger();
   LOGGER.setTraceEnabled(false);
   LOGGER.setDebugEnabled(false);
   LOGGER.setInfoEnabled(false);

   QUnit.start();
});