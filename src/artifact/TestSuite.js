"use strict";

var prefix = "artifact/";
var suffix = ".test";
var testModules = ["AttackDiceValue", "Bearing", "CardResolver", "CardType", "ConditionCard", "Count", "DamageCard", "DamageCardTrait", "DefenseDiceValue",
      "DiceModification", "Difficulty", "Event", "Faction", "FiringArc", "Maneuver", "Phase", "PilotCard", "PlayFormat", "Range", "ReferenceCard", "Ship",
      "ShipAction", "ShipBase", "ShipFaction", "ShipState", "UpgradeCard", "UpgradeHeader", "UpgradeRestriction", "UpgradeType", "Value",
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