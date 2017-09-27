"use strict";

define(["artifact/js/ShipAction"], function(ShipAction)
{
   var DiceModification = {
      ATTACK_SPEND_FOCUS: "attackSpendFocus",
      ATTACK_SPEND_TARGET_LOCK: "attackSpendTargetLock",
      DEFENSE_SPEND_EVADE: "defenseSpendEvade",
      DEFENSE_SPEND_FOCUS: "defenseSpendFocus",

      properties:
      {
         "attackSpendFocus":
         {
            name: "Spend a Focus token",
            description: "Spend a focus token to change all focus results to hit results on attack dice.",
            shipActionKey: ShipAction.FOCUS,
            isImplemented: true,
            key: "attackSpendFocus",
         },
         "attackSpendTargetLock":
         {
            name: "Spend Target Lock tokens",
            description: "Spend a target lock on the defender to reroll any number of attack dice.",
            shipActionKey: ShipAction.TARGET_LOCK,
            isImplemented: true,
            key: "attackSpendTargetLock",
         },
         "defenseSpendEvade":
         {
            name: "Spend an Evade token",
            description: "Spend an evade token to add one additional evade result to defense dice.",
            shipActionKey: ShipAction.EVADE,
            isImplemented: true,
            key: "defenseSpendEvade",
         },
         "defenseSpendFocus":
         {
            name: "Spend a Focus token",
            description: "Spend a focus token to change all focus results to evade results on defense dice.",
            shipActionKey: ShipAction.FOCUS,
            isImplemented: true,
            key: "defenseSpendFocus",
         },
      },
   };

   DiceModification.keys = function()
   {
      return Object.keys(DiceModification.properties);
   };

   DiceModification.toString = function()
   {
      return "DiceModification";
   };

   DiceModification.values = function()
   {
      return Object.values(DiceModification.properties);
   };

   DiceModification.keys().forEach(function(modificationKey)
   {
      var modification = DiceModification.properties[modificationKey];
      modification.xwingType = DiceModification;
      modification.shipAction = ShipAction.properties[modification.shipActionKey];
   });

   if (Object.freeze)
   {
      Object.freeze(DiceModification);
   }

   return DiceModification;
});
