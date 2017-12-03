"use strict";

define(["redux", "common/js/InputValidator",
  "artifact/js/Faction", "artifact/js/Maneuver", "artifact/js/PilotCard", "artifact/js/UpgradeCard",
  "model/js/Action", "model/js/Agent", "model/js/ManeuverComputer", "model/js/RectanglePath", "model/js/Reducer", "model/js/Selector"],
   function(Redux, InputValidator, Faction, Maneuver, PilotCard, UpgradeCard,
      Action, Agent, ManeuverComputer, RectanglePath, Reducer, Selector)
   {
      function Adjudicator(store)
      {
         InputValidator.validateNotNull("store", store);

         this.store = function()
         {
            return store;
         };
      }

      //////////////////////////////////////////////////////////////////////////
      // Creation methods.

      Adjudicator.create = function(store)
      {
         var adjudicator = new Adjudicator(store);

         store.dispatch(Action.setAdjudicator(adjudicator));

         return adjudicator;
      };

      //////////////////////////////////////////////////////////////////////////
      // Utility methods.

      Adjudicator.prototype.canAttack = function(attacker)
      {
         InputValidator.validateNotNull("attacker", attacker);

         // A cloaked ship cannot attack. Cannot attack if weapons are disabled. Cannot attack if Gunner upgrade was used this round.
         return !attacker.isCloaked() && attacker.weaponsDisabledCount() === 0 && !attacker.isPerRoundAbilityUsed(UpgradeCard, UpgradeCard.GUNNER);
      };

      Adjudicator.prototype.canBarrelRoll = function(attacker, maneuverKey)
      {
         InputValidator.validateNotNull("attacker", attacker);
         InputValidator.validateNotNull("maneuverKey", maneuverKey);

         // A ship cannot barrel roll if this would cause its base to overlap with another ship's base or an obstacle
         // token.
         var answer = false;
         var store = this.store();
         var environment = Selector.environment(store.getState());
         var fromPosition = environment.getPositionFor(attacker);

         if (fromPosition)
         {
            var maneuver = Maneuver.properties[maneuverKey];
            var shipBase = attacker.card().shipFaction.ship.shipBase;
            var toPolygon = ManeuverComputer.computeToPolygon(environment.playFormatKey(), maneuver, fromPosition,
               shipBase);

            if (toPolygon)
            {
               var tokens = environment.pilotInstances();
               answer = true;

               for (var i = 0; i < tokens.length; i++)
               {
                  var token = tokens[i];

                  if (token !== attacker)
                  {
                     var myShipBase = token.card().shipFaction.ship.shipBase;
                     var position = environment.getPositionFor(token);
                     var polygon = ManeuverComputer.computePolygon(myShipBase, position.x(), position.y(),
                        position.heading());
                     var collide = RectanglePath.doPolygonsCollide(polygon, toPolygon);

                     if (collide)
                     {
                        answer = false;
                        break;
                     }
                  }
               }
            }
         }

         return answer;
      };

      Adjudicator.prototype.canBoost = function(attacker, maneuverKey)
      {
         InputValidator.validateNotNull("attacker", attacker);
         InputValidator.validateNotNull("maneuverKey", maneuverKey);

         // A ship cannot boost if this would cause its base to overlap with another ship's base or an obstacle
         // token, or if the maneuver template overlaps an obstacle token.

         // FIXME: implement Adjudicator.canBoost()
         return this.canBarrelRoll(attacker, maneuverKey);
      };

      Adjudicator.prototype.canDecloak = function(attacker, maneuverKey)
      {
         InputValidator.validateNotNull("attacker", attacker);
         InputValidator.validateNotNull("maneuverKey", maneuverKey);

         // A ship cannot decloak if it would overlap another ship or an obstacle token, or if the maneuver template
         // would overlap an obstacle token.

         // FIXME: implement Adjudicator.canDecloak()
         return attacker.isCloaked() && this.canBarrelRoll(attacker, maneuverKey);
      };

      Adjudicator.prototype.canSelectShipAction = function(attacker)
      {
         InputValidator.validateNotNull("attacker", attacker);

         // Cannot select a ship action if the ship is stressed (exception: pilot Tycho Celchu), or
         // if the ship is touching another ship.
         var store = this.store();
         var environment = Selector.environment(store.getState());
         return (attacker.card().key === PilotCard.TYCHO_CELCHU || !attacker.isStressed()) && !environment.isTouching(attacker);
      };

      Adjudicator.prototype.canSlam = function(token, maneuverKey)
      {
         InputValidator.validateNotNull("token", token);
         InputValidator.validateNotNull("maneuverKey", maneuverKey);

         // To SLAM, choose and execute a maneuver on the ship's dial.
         // The chosen maneuver must be the same speed as the maneuver that ship executed this round.
         // Performing a SLAM counts as executing a maneuver.
         // A ship cannot perform SLAM as a free action.
         var previousManeuver = Selector.maneuver(token.store().getState(), token);
         var speed;

         if (previousManeuver)
         {
            speed = previousManeuver.speed;
         }

         var ship = token.card().shipFaction.ship;
         var maneuverKeys = ship.maneuverKeys;
         var slamManeuver = Maneuver.properties[maneuverKey];
         var store = this.store();
         var environment = Selector.environment(store.getState());
         var fromPosition = environment.getPositionFor(token);
         var toPolygon;

         if (fromPosition)
         {
            var playFormatKey = environment.playFormatKey();
            var shipBase = token.card().shipFaction.ship.shipBase;
            toPolygon = ManeuverComputer.computeToPolygon(playFormatKey, slamManeuver, fromPosition, shipBase);
         }

         return (previousManeuver !== undefined) && (toPolygon !== undefined) && maneuverKeys.includes(maneuverKey) && (slamManeuver.speed === speed);
      };

      Adjudicator.prototype.compareInitiative = function(squadBuilder1, squadBuilder2)
      {
         InputValidator.validateNotNull("squadBuilder1", squadBuilder1);
         InputValidator.validateNotNull("squadBuilder2", squadBuilder2);

         var answer = 1;

         // Compare squad point costs.
         var store = Redux.createStore(Reducer.root);
         var factionKey1 = squadBuilder1.factionKey();
         var agent1 = new Agent(store, "Agent1");
         var squad1 = squadBuilder1.buildSquad(agent1);
         var squadPointCost1 = squad1.squadPointCost();

         var factionKey2 = squadBuilder2.factionKey();
         var agent2 = new Agent(store, "Agent2");
         var squad2 = squadBuilder2.buildSquad(agent2);
         var squadPointCost2 = squad2.squadPointCost();

         answer = (squadPointCost2 - squadPointCost1);

         if (answer === 0)
         {
            // Compare faction keys.
            var values = Faction.keys();
            var index1 = values.indexOf(factionKey1);
            var index2 = values.indexOf(factionKey2);

            answer = index2 - index1;
         }

         return answer;
      };

      Adjudicator.prototype.determineWinner = function()
      {
         var answer;

         var store = this.store();
         var environment = Selector.environment(store.getState());
         var firstSquad = environment.firstSquad();
         var firstCount = environment.getTokensForFaction(firstSquad.factionKey()).length;
         var secondSquad = environment.secondSquad();
         var secondCount = environment.getTokensForFaction(secondSquad.factionKey()).length;

         if (firstCount === 0)
         {
            answer = environment.secondAgent();
         }
         else if (secondCount === 0)
         {
            answer = environment.firstAgent();
         }

         return answer;
      };

      Adjudicator.prototype.isGameOver = function()
      {
         var answer = false;

         var store = this.store();
         var environment = Selector.environment(store.getState());
         var firstSquad = environment.firstSquad();
         var firstCount = environment.getTokensForFaction(firstSquad.factionKey()).length;

         answer = (firstCount === 0);

         if (!answer)
         {
            var secondSquad = environment.secondSquad();
            var secondCount = environment.getTokensForFaction(secondSquad.factionKey()).length;
            answer = (secondCount === 0);
         }

         return answer;
      };

      return Adjudicator;
   });
