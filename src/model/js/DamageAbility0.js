/*
 * Provides damage abilities for Events.
 */
"use strict";

define(["common/js/InputValidator",
  "artifact/js/AttackDiceValue", "artifact/js/DamageCard", "artifact/js/Difficulty", "artifact/js/Event", "artifact/js/Maneuver",
  "model/js/ActivationAction", "model/js/AttackDice"],
   function(InputValidator,
      AttackDiceValue, DamageCard, Difficulty, Event, Maneuver,
      ActivationAction, AttackDice)
   {
      var DamageAbility0 = {};

      ////////////////////////////////////////////////////////////////////////
      DamageAbility0[Event.AFTER_EXECUTE_MANEUVER] = {};

      DamageAbility0[Event.AFTER_EXECUTE_MANEUVER][DamageCard.LOOSE_STABILIZER_V2] = {
         // After you execute a white maneuver, receive 1 stress token.
         condition: function(store, token)
         {
            var maneuver = getManeuver(token);
            return isEventToken(store, token) && token.isCriticallyDamagedWith(DamageCard.LOOSE_STABILIZER_V2) && maneuver !== undefined && maneuver.difficultyKey === Difficulty.STANDARD;
         },
         consequent: function(store, token, callback)
         {
            token.receiveStress(callback);
         },
      };

      DamageAbility0[Event.AFTER_EXECUTE_MANEUVER][DamageCard.MINOR_HULL_BREACH] = {
         // After executing a red maneuver, roll 1 attack die. On a Hit result, suffer 1 damage.
         condition: function(store, token)
         {
            var maneuver = getManeuver(token);
            return isEventToken(store, token) && token.isCriticallyDamagedWith(DamageCard.MINOR_HULL_BREACH) && maneuver !== undefined && maneuver.difficultyKey === Difficulty.HARD;
         },
         consequent: function(store, token, callback)
         {
            if (AttackDice.rollRandomValue() === AttackDiceValue.HIT)
            {
               var environment = store.getState().environment;
               token.receiveDamage(environment.drawDamage());
            }
            callback();
         },
      };

      ////////////////////////////////////////////////////////////////////////
      DamageAbility0[Event.RECEIVE_CRITICAL_DAMAGE] = {};

      DamageAbility0[Event.RECEIVE_CRITICAL_DAMAGE][DamageCard.MAJOR_EXPLOSION_V2] = {
         // Roll 1 attack die. On a Hit result, suffer 1 critical damage. Then flip this card facedown.
         condition: function(store, token)
         {
            return isEventToken(store, token) && token.isCriticallyDamagedWith(DamageCard.MAJOR_EXPLOSION_V2);
         },
         consequent: function(store, token, callback)
         {
            if (AttackDice.rollRandomValue() === AttackDiceValue.HIT)
            {
               var environment = store.getState().environment;
               token.receiveCriticalDamage(environment.drawDamage());
            }
            flipCardFacedown(store, token, DamageCard.MAJOR_EXPLOSION_V2);
            callback();
         },
      };

      DamageAbility0[Event.RECEIVE_CRITICAL_DAMAGE][DamageCard.MINOR_EXPLOSION] = {
         // Immediately roll 1 attack die. On a Hit result, suffer 1 damage. Then flip this card facedown.
         condition: function(store, token)
         {
            return isEventToken(store, token) && token.isCriticallyDamagedWith(DamageCard.MINOR_EXPLOSION);
         },
         consequent: function(store, token, callback)
         {
            if (AttackDice.rollRandomValue() === AttackDiceValue.HIT)
            {
               var environment = store.getState().environment;
               if (environment)
               {
                  token.receiveDamage(environment.drawDamage());
               }
            }
            flipCardFacedown(store, token, DamageCard.MINOR_EXPLOSION);
            callback();
         },
      };

      DamageAbility0[Event.RECEIVE_CRITICAL_DAMAGE][DamageCard.THRUST_CONTROL_FIRE] = {
         // Immediately receive 1 stress token. Then flip this card facedown.
         condition: function(store, token)
         {
            return isEventToken(store, token) && token.isCriticallyDamagedWith(DamageCard.THRUST_CONTROL_FIRE);
         },
         consequent: function(store, token, callback)
         {
            flipCardFacedown(store, token, DamageCard.THRUST_CONTROL_FIRE);
            token.receiveStress(callback);
         },
      };

      DamageAbility0[Event.RECEIVE_CRITICAL_DAMAGE][DamageCard.THRUST_CONTROL_FIRE_V2] = {
         // Receive 1 stress token. Then flip this card facedown.
         condition: function(store, token)
         {
            return isEventToken(store, token) && token.isCriticallyDamagedWith(DamageCard.THRUST_CONTROL_FIRE_V2);
         },
         consequent: function(store, token, callback)
         {
            flipCardFacedown(store, token, DamageCard.THRUST_CONTROL_FIRE_V2);
            token.receiveStress(callback);
         },
      };

      ////////////////////////////////////////////////////////////////////////
      function flipCardFacedown(store, token, damageKey)
      {
         InputValidator.validateNotNull("store", store);
         InputValidator.validateNotNull("token", token);
         InputValidator.validateNotNull("damageKey", damageKey);

         var damageInstance = token.criticalDamage(damageKey);
         token.flipDamageCardFacedown(damageInstance);
      }

      function getActivationAction(token)
      {
         InputValidator.validateNotNull("token", token);

         var store = token.store();

         return ActivationAction.get(store, token.id());
      }

      function getEventData(store)
      {
         InputValidator.validateNotNull("store", store);

         return store.getState().eventData;
      }

      function getEventToken(store)
      {
         InputValidator.validateNotNull("store", store);

         var eventData = getEventData(store);

         return (eventData !== undefined ? eventData.get("eventToken") : undefined);
      }

      function getManeuver(token)
      {
         InputValidator.validateNotNull("token", token);

         var maneuverKey = getManeuverKey(token);
         return Maneuver.properties[maneuverKey];
      }

      function getManeuverKey(token)
      {
         InputValidator.validateNotNull("token", token);

         var answer;
         var activationAction = getActivationAction(token);

         if (activationAction)
         {
            answer = activationAction.maneuverKey();
         }

         return answer;
      }

      function isEventToken(store, token)
      {
         var eventToken = getEventToken(store);

         return token.equals(eventToken);
      }

      DamageAbility0.toString = function()
      {
         return "model/js/DamageAbility0";
      };

      if (Object.freeze)
      {
         Object.freeze(DamageAbility0);
      }

      return DamageAbility0;
   });
