"use strict";

define(["common/js/InputValidator", "artifact/js/DiceModification", "model/js/AttackDice", "model/js/CardAction", "model/js/DefenseDice", "model/js/Selector", "model/js/TargetLock"],
   function(InputValidator, DiceModification, AttackDice, CardAction, DefenseDice, Selector, TargetLock)
   {
      var ModifyDiceAbility = {};

      ModifyDiceAbility.ATTACK_KEY = "modifyAttackDice";
      ModifyDiceAbility.DEFENSE_KEY = "modifyDefenseDice";

      ////////////////////////////////////////////////////////////////////////
      ModifyDiceAbility[ModifyDiceAbility.ATTACK_KEY] = {};

      ModifyDiceAbility[ModifyDiceAbility.ATTACK_KEY][DiceModification.ATTACK_SPEND_FOCUS] = {
         // Spend a focus token to change all focus results to hit results on attack dice.
         condition: function(store, token)
         {
            var attacker = getActiveToken(store);
            var attackDice = getAttackDice(attacker);
            return isActiveToken(store, token) && token.focusCount() > 0 && attackDice.focusCount() > 0;
         },
         consequent: function(store, token, callback)
         {
            var attacker = getActiveToken(store);
            var attackDice = getAttackDice(attacker);
            attackDice.spendFocusToken();
            store.dispatch(CardAction.addFocusCount(attacker, -1));
            callback();
         },
      };

      ModifyDiceAbility[ModifyDiceAbility.ATTACK_KEY][DiceModification.ATTACK_SPEND_TARGET_LOCK] = {
         // Spend a target lock on the defender to reroll any number of attack dice.
         condition: function(store, token)
         {
            var attacker = getActiveToken(store);
            var defender = getDefender(attacker);
            var targetLock = (defender ? TargetLock.getFirst(store, attacker, defender) : undefined);
            return isActiveToken(store, token) && defender && targetLock !== undefined;
         },
         consequent: function(store, token, callback)
         {
            var attacker = getActiveToken(store);
            var attackDice = getAttackDice(attacker);
            var defender = getDefender(attacker);
            attackDice.spendTargetLock();
            var targetLock = TargetLock.getFirst(store, attacker, defender);
            targetLock.delete();
            callback();
         },
      };

      ////////////////////////////////////////////////////////////////////////
      ModifyDiceAbility[ModifyDiceAbility.DEFENSE_KEY] = {};

      ModifyDiceAbility[ModifyDiceAbility.DEFENSE_KEY][DiceModification.DEFENSE_SPEND_EVADE] = {
         // Spend an evade token to add one additional evade result to defense dice.
         condition: function(store, token)
         {
            var attacker = getActiveToken(store);
            var defender = getDefender(attacker);
            return token.equals(defender) && token.evadeCount() > 0;
         },
         consequent: function(store, token, callback)
         {
            var attacker = getActiveToken(store);
            var defender = getDefender(attacker);
            var defenseDice = getDefenseDice(attacker);
            defenseDice.spendEvadeToken();
            store.dispatch(CardAction.addEvadeCount(defender, -1));
            callback();
         },
      };

      ModifyDiceAbility[ModifyDiceAbility.DEFENSE_KEY][DiceModification.DEFENSE_SPEND_FOCUS] = {
         // Spend a focus token to change all focus results to evade results on defense dice.
         condition: function(store, token)
         {
            var attacker = getActiveToken(store);
            var defender = getDefender(attacker);
            var defenseDice = getDefenseDice(attacker);
            return token.equals(defender) && token.focusCount() > 0 && defenseDice.focusCount() > 0;
         },
         consequent: function(store, token, callback)
         {
            var attacker = getActiveToken(store);
            var defender = getDefender(attacker);
            var defenseDice = getDefenseDice(attacker);
            defenseDice.spendFocusToken();
            store.dispatch(CardAction.addFocusCount(defender, -1));
            callback();
         },
      };

      ////////////////////////////////////////////////////////////////////////
      function getActiveToken(store)
      {
         InputValidator.validateNotNull("store", store);

         var environment = store.getState().environment;

         return environment.activeCardInstance();
      }

      function getAttackDice(attacker)
      {
         InputValidator.validateNotNull("attacker", attacker);

         var store = attacker.store();
         var combatAction = getCombatAction(attacker);
         var attackDiceClass = (combatAction ? combatAction.attackDiceClass() : AttackDice);

         return attackDiceClass.get(store, attacker.id());
      }

      function getCombatAction(attacker)
      {
         InputValidator.validateNotNull("attacker", attacker);

         return Selector.combatAction(attacker.store().getState(), attacker);
      }

      function getDefender(attacker)
      {
         InputValidator.validateNotNull("attacker", attacker);

         var combatAction = getCombatAction(attacker);

         return (combatAction ? combatAction.defender() : undefined);
      }

      function getDefenseDice(attacker)
      {
         InputValidator.validateNotNull("attacker", attacker);

         var store = attacker.store();
         var combatAction = getCombatAction(attacker);
         var defenseDiceClass = (combatAction ? combatAction.defenseDiceClass() : DefenseDice);

         return defenseDiceClass.get(store, attacker.id());
      }

      function isActiveToken(store, token)
      {
         var activeToken = getActiveToken(store);

         return token.equals(activeToken);
      }

      ModifyDiceAbility.toString = function()
      {
         return "ModifyDiceAbility";
      };

      return ModifyDiceAbility;
   });
