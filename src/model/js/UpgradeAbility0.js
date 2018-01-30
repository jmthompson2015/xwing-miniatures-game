/*
 * Provides upgrade abilities for Events.
 */
"use strict";

define(["common/js/InputValidator",
  "artifact/js/AttackDiceValue", "artifact/js/Difficulty", "artifact/js/Event", "artifact/js/Faction", "artifact/js/Maneuver", "artifact/js/ShipAction", "artifact/js/UpgradeCard",
  "model/js/Ability", "model/js/ActivationAction", "model/js/AttackDice", "model/js/CardAction", "model/js/EnvironmentAction", "model/js/ShipActionAbility"],
   function(InputValidator,
      AttackDiceValue, Difficulty, Event, Faction, Maneuver, ShipAction, UpgradeCard,
      Ability, ActivationAction, AttackDice, CardAction, EnvironmentAction, ShipActionAbility)
   {
      var UpgradeAbility0 = {};

      ////////////////////////////////////////////////////////////////////////
      UpgradeAbility0[Event.AFTER_EXECUTE_MANEUVER] = {};

      UpgradeAbility0[Event.AFTER_EXECUTE_MANEUVER][UpgradeCard.ION_PROJECTOR] = {
         // After an enemy ship executes a maneuver that causes it to overlap your ship, roll 1 attack die. On a HIT or CRITICAL HIT result, the enemy ship receives 1 ion token.
         condition: function(store, pilotInstance)
         {
            var toucher = getActiveCardInstance(store);
            var isEnemy = (toucher !== undefined ? !Faction.isFriendly(toucher.card().shipFaction.factionKey, pilotInstance.card().shipFaction.factionKey) : false);
            var isTouching = (toucher !== undefined ? toucher.isTouching(pilotInstance) : false);
            return isEnemy && isTouching;
         },
         consequent: function(store, pilotInstance, callback)
         {
            if ([AttackDiceValue.HIT, AttackDiceValue.CRITICAL_HIT].includes(AttackDice.rollRandomValue()))
            {
               var enemy = getActiveCardInstance(store);
               store.dispatch(CardAction.addIonCount(enemy));
            }
            callback();
         },
      };

      UpgradeAbility0[Event.AFTER_EXECUTE_MANEUVER][UpgradeCard.K4_SECURITY_DROID] = {
         // After executing a green maneuver, you may acquire a Target Lock.
         condition: function(store, token)
         {
            var maneuver = getManeuver(token);
            var environment = store.getState().environment;
            var defenders = environment.getDefendersInRange(token);
            return isEventToken(store, token) && maneuver !== undefined && maneuver.difficultyKey === Difficulty.EASY && defenders !== undefined && defenders.length > 0;
         },
         consequent: function(store, token, callback)
         {
            var agent = token.agent();
            var shipActionKeys0 = [ShipAction.TARGET_LOCK];
            var that = this;
            var finishCallback = function(shipActionAbility)
            {
               that.finishConsequent(store, token, shipActionAbility, callback);
            };
            agent.getShipAction(token, finishCallback, shipActionKeys0);

            // Wait for agent to respond.
         },
         finishConsequent: function(store, token, shipActionAbility, callback)
         {
            if (shipActionAbility)
            {
               var consequent = shipActionAbility.consequent();
               consequent(store, token, callback, shipActionAbility.context());
            }
            else
            {
               callback();
            }
         },
      };

      UpgradeAbility0[Event.AFTER_EXECUTE_MANEUVER][UpgradeCard.OUTLAW_TECH] = {
         // After you execute a red maneuver, you may assign 1 Focus token to your ship.
         condition: function(store, token)
         {
            var maneuver = getManeuver(token);
            return isEventToken(store, token) && maneuver !== undefined && maneuver.difficultyKey === Difficulty.HARD;
         },
         consequent: function(store, token, callback)
         {
            token.receiveFocus(1, callback);
         },
      };

      UpgradeAbility0[Event.AFTER_EXECUTE_MANEUVER][UpgradeCard.R2_D2_ASTROMECH] = {
         // After executing a green maneuver, you may recover 1 shield (up to your shield value).
         condition: function(store, token)
         {
            var maneuver = getManeuver(token);
            return isEventToken(store, token) && maneuver !== undefined && maneuver.difficultyKey === Difficulty.EASY;
         },
         consequent: function(store, token, callback)
         {
            token.recoverShield();
            callback();
         },
      };

      ////////////////////////////////////////////////////////////////////////
      UpgradeAbility0[Event.RECEIVE_CRITICAL_DAMAGE] = {};

      UpgradeAbility0[Event.RECEIVE_CRITICAL_DAMAGE][UpgradeCard.CHEWBACCA] = {
         // When you are dealt a Damage card, you may immediately discard that card and recover 1 shield. Then, discard this Upgrade card.
         condition: function(store, token)
         {
            return isEventToken(store, token);
         },
         consequent: function(store, token, callback)
         {
            var criticalDamages = token.criticalDamages();
            var damageInstance = criticalDamages[criticalDamages.length - 1];
            store.dispatch(EnvironmentAction.discardDamage(damageInstance));
            token.recoverShield();
            var upgradeInstance = token.upgrade(UpgradeCard.CHEWBACCA);
            token.discardUpgrade(upgradeInstance);
            callback();
         },
      };

      ////////////////////////////////////////////////////////////////////////
      UpgradeAbility0[Event.RECEIVE_DAMAGE] = {};

      UpgradeAbility0[Event.RECEIVE_DAMAGE][UpgradeCard.CHEWBACCA] = {
         // When you are dealt a Damage card, you may immediately discard that card and recover 1 shield. Then, discard this Upgrade card.
         condition: function(store, token)
         {
            return isEventToken(store, token);
         },
         consequent: function(store, token, callback)
         {
            var criticalDamages = token.criticalDamages();
            var damageInstance = criticalDamages[criticalDamages.length - 1];
            store.dispatch(EnvironmentAction.discardDamage(damageInstance));
            token.recoverShield();
            var upgradeInstance = token.upgrade(UpgradeCard.CHEWBACCA);
            token.discardUpgrade(upgradeInstance);
            callback();
         },
      };

      ////////////////////////////////////////////////////////////////////////
      UpgradeAbility0[Event.RECEIVE_FOCUS] = {};

      UpgradeAbility0[Event.RECEIVE_FOCUS][UpgradeCard.ATTANNI_MINDLINK] = {
         // Each time you are assigned a focus or stress token, each other friendly ship with Attanni Mindlink must also be assigned the same type of token if it does not already have one.
         condition: function(store, token)
         {
            return isEventToken(store, token);
         },
         consequent: function(store, token, callback)
         {
            var agent = token.agent();
            agent.pilotInstances().forEach(function(pilotInstance)
            {
               if (pilotInstance.id() !== token.id() && pilotInstance.focusCount() === 0)
               {
                  // Don't send another event.
                  store.dispatch(CardAction.addFocusCount(pilotInstance));
               }
            });
            callback();
         },
      };

      ////////////////////////////////////////////////////////////////////////
      UpgradeAbility0[Event.RECEIVE_STRESS] = {};

      UpgradeAbility0[Event.RECEIVE_STRESS][UpgradeCard.ATTANNI_MINDLINK] = {
         // Each time you are assigned a focus or stress token, each other friendly ship with Attanni Mindlink must also be assigned the same type of token if it does not already have one.
         condition: function(store, token)
         {
            return isEventToken(store, token);
         },
         consequent: function(store, token, callback)
         {
            var agent = token.agent();
            agent.pilotInstances().forEach(function(pilotInstance)
            {
               if (pilotInstance.id() !== token.id() && pilotInstance.stressCount() === 0)
               {
                  // Don't send another event.
                  store.dispatch(CardAction.addStressCount(pilotInstance));
               }
            });
            callback();
         },
      };

      ////////////////////////////////////////////////////////////////////////
      UpgradeAbility0[Event.REMOVE_STRESS] = {};

      UpgradeAbility0[Event.REMOVE_STRESS][UpgradeCard.KYLE_KATARN] = {
         // After you remove a stress token from your ship, you may assign a Focus token to your ship.
         condition: function(store, token)
         {
            return isEventToken(store, token);
         },
         consequent: function(store, token, callback)
         {
            token.receiveFocus(1, callback);
         },
      };

      ////////////////////////////////////////////////////////////////////////
      UpgradeAbility0[Event.SHIP_ACTION_PERFORMED] = {};

      UpgradeAbility0[Event.SHIP_ACTION_PERFORMED][UpgradeCard.PUSH_THE_LIMIT] = {
         // Once per round, after you perform an action, you may perform 1 free action shown in your action bar. Then receive 1 stress token.
         condition: function(store, token)
         {
            var isUsed = token.isAbilityUsed(UpgradeCard, UpgradeCard.PUSH_THE_LIMIT);
            var adjudicator = store.getState().adjudicator;
            var canSelectShipAction = adjudicator.canSelectShipAction(token);
            return isEventToken(store, token) && !isUsed && canSelectShipAction;
         },
         consequent: function(store, token, callback)
         {
            var agent = token.agent();
            var shipActionKeys0 = token.ship().shipActionKeys;
            var that = this;
            var finishCallback = function(shipActionAbility)
            {
               that.finishConsequent(store, token, shipActionAbility, callback);
            };
            agent.getShipAction(token, finishCallback, shipActionKeys0);

            // Wait for agent to respond.
         },
         finishConsequent: function(store, token, shipActionAbility, callback)
         {
            if (shipActionAbility)
            {
               token.receiveStress();
               var consequent = shipActionAbility.consequent();
               consequent(store, token, callback, shipActionAbility.context());
            }
            else
            {
               callback();
            }
         },
      };

      UpgradeAbility0[Event.SHIP_ACTION_PERFORMED][UpgradeCard.RECON_SPECIALIST] = {
         // When you perform a Focus action, assign 1 additional Focus token to your ship.
         condition: function(store, token)
         {
            var eventShipActionKey = getEventShipActionKey(store);
            return isEventToken(store, token) && eventShipActionKey === ShipAction.FOCUS;
         },
         consequent: function(store, token, callback)
         {
            token.receiveFocus(1, callback);
         },
      };

      ////////////////////////////////////////////////////////////////////////
      UpgradeAbility0[Event.TARGET_LOCK_ACQUIRED] = {};

      UpgradeAbility0[Event.TARGET_LOCK_ACQUIRED][UpgradeCard.TIE_V1] = {
         // After you acquire a target lock, you may perform a free evade action.
         condition: function(store, token)
         {
            return isEventToken(store, token);
         },
         consequent: function(store, token, callback)
         {
            var ability = new Ability(ShipAction, ShipAction.EVADE, ShipActionAbility, ShipActionAbility.ABILITY_KEY);
            ability.consequent(store, token, callback);
         },
      };

      ////////////////////////////////////////////////////////////////////////
      function getActivationAction(token)
      {
         InputValidator.validateNotNull("token", token);

         return ActivationAction.get(token.store(), token.id());
      }

      function getActiveCardInstance(store)
      {
         InputValidator.validateNotNull("store", store);

         var environment = store.getState().environment;

         return environment.activeCardInstance();
      }

      function getEventContext(store)
      {
         InputValidator.validateNotNull("store", store);

         var eventData = getEventData(store);

         return (eventData !== undefined ? eventData.get("eventContext") : undefined);
      }

      function getEventData(store)
      {
         InputValidator.validateNotNull("store", store);

         return store.getState().eventData;
      }

      function getEventShipActionKey(store)
      {
         InputValidator.validateNotNull("store", store);

         var answer;
         var eventContext = getEventContext(store);

         if (eventContext)
         {
            answer = eventContext.shipActionKey;
         }

         return answer;
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

      UpgradeAbility0.toString = function()
      {
         return "model/js/UpgradeAbility0";
      };

      if (Object.freeze)
      {
         Object.freeze(UpgradeAbility0);
      }

      return UpgradeAbility0;
   });
