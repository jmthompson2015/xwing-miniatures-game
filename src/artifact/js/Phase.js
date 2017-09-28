"use strict";

define(function()
{
   var Phase = {
      SETUP: "setup",

      PLANNING_START: "planningStart",
      PLANNING_END: "planningEnd",

      ACTIVATION_START: "activationStart",
      ACTIVATION_REVEAL_DIAL: "activationRevealDial",
      ACTIVATION_SET_TEMPLATE: "activationSetTemplate",
      ACTIVATION_EXECUTE_MANEUVER: "activationExecuteManeuver",
      ACTIVATION_CHECK_PILOT_STRESS: "activationCheckPilotCardStress",
      ACTIVATION_CLEAN_UP: "activationCleanUp",
      ACTIVATION_GAIN_ENERGY: "activationGainEnergy",
      ACTIVATION_ALLOCATE_ENERGY: "activationAllocateEnergy",
      ACTIVATION_USE_ENERGY: "activationUseEnergy",
      ACTIVATION_PERFORM_ACTION: "activationPerformAction",
      ACTIVATION_END: "activationEnd",

      COMBAT_START: "combatStart",
      COMBAT_DECLARE_TARGET: "combatDeclareTarget",
      COMBAT_ROLL_ATTACK_DICE: "combatRollAttackDice",
      COMBAT_MODIFY_ATTACK_DICE: "combatModifyAttackDice",
      COMBAT_ROLL_DEFENSE_DICE: "combatRollDefenseDice",
      COMBAT_MODIFY_DEFENSE_DICE: "combatModifyDefenseDice",
      COMBAT_COMPARE_RESULTS: "combatCompareResults",
      COMBAT_NOTIFY_DAMAGE: "combatNotifyDamage",
      COMBAT_DEAL_DAMAGE: "combatDealDamage",
      COMBAT_AFTER_DEAL_DAMAGE: "combatAfterDealDamage",
      COMBAT_END: "combatEnd",

      END_START: "endStart",
      END_CLEAN_UP: "endCleanUp",
      END_ROUND_END: "endRoundEnd",
      END_END: "endEnd",

      properties:
      {
         "setup":
         {
            name: "Setup",
            key: "setup",
         },
         "planningStart":
         {
            name: "Planning (start)",
            key: "planningStart",
         },
         "planningEnd":
         {
            name: "Planning (end)",
            key: "planningEnd",
         },
         "activationStart":
         {
            name: "Activation (start)",
            key: "activationStart",
         },
         "activationRevealDial":
         {
            name: "Activation (reveal dial)",
            key: "activationRevealDial",
         },
         "activationSetTemplate":
         {
            name: "Activation (set template)",
            key: "activationSetTemplate",
         },
         "activationExecuteManeuver":
         {
            name: "Activation (execute maneuver)",
            key: "activationExecuteManeuver",
         },
         "activationCheckPilotCardStress":
         {
            name: "Activation (check pilot stress)",
            key: "activationCheckPilotCardStress",
         },
         "activationCleanUp":
         {
            name: "Activation (clean up)",
            key: "activationCleanUp",
         },
         "activationGainEnergy":
         {
            name: "Activation (gain energy)",
            key: "activationGainEnergy",
         },
         "activationAllocateEnergy":
         {
            name: "Activation (allocate energy)",
            key: "activationAllocateEnergy",
         },
         "activationUseEnergy":
         {
            name: "Activation (use energy)",
            key: "activationUseEnergy",
         },
         "activationPerformAction":
         {
            name: "Activation (perform action)",
            key: "activationPerformAction",
         },
         "activationEnd":
         {
            name: "Activation (end)",
            key: "activationEnd",
         },
         "combatStart":
         {
            name: "Combat (start)",
            key: "combatStart",
         },
         "combatDeclareTarget":
         {
            name: "Combat (declare target)",
            key: "combatDeclareTarget",
         },
         "combatRollAttackDice":
         {
            name: "Combat (roll attack dice)",
            key: "combatRollAttackDice",
         },
         "combatModifyAttackDice":
         {
            name: "Combat (modify attack dice)",
            key: "combatModifyAttackDice",
         },
         "combatRollDefenseDice":
         {
            name: "Combat (roll defense dice)",
            key: "combatRollDefenseDice",
         },
         "combatModifyDefenseDice":
         {
            name: "Combat (modify defense dice)",
            key: "combatModifyDefenseDice",
         },
         "combatCompareResults":
         {
            name: "Combat (compare results)",
            key: "combatCompareResults",
         },
         "combatNotifyDamage":
         {
            name: "Combat (notify damage)",
            key: "combatNotifyDamage",
         },
         "combatDealDamage":
         {
            name: "Combat (deal damage)",
            key: "combatDealDamage",
         },
         "combatAfterDealDamage":
         {
            name: "Combat (after deal damage)",
            key: "combatAfterDealDamage",
         },
         "combatEnd":
         {
            name: "Combat (end)",
            key: "combatEnd",
         },
         "endStart":
         {
            name: "End (start)",
            key: "endStart",
         },
         "endCleanUp":
         {
            name: "End (clean up)",
            key: "endCleanUp",
         },
         "endRoundEnd":
         {
            name: "End (round end)",
            key: "endRoundEnd",
         },
         "endEnd":
         {
            name: "End (end)",
            key: "endEnd",
         },
      },
   };

   Phase.keys = function()
   {
      return Object.keys(Phase.properties);
   };

   Phase.toString = function()
   {
      return "Phase";
   };

   Phase.values = function()
   {
      return Object.values(Phase.properties);
   };

   if (Object.freeze)
   {
      Object.freeze(Phase);
   }

   return Phase;
});
