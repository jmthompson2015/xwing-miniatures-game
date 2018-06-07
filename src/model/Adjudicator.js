import InputValidator from "../utility/InputValidator.js";

import Faction from "../artifact/Faction.js";
import Maneuver from "../artifact/Maneuver.js";
import PilotCard from "../artifact/PilotCard.js";
import UpgradeCard from "../artifact/UpgradeCard.js";

import Action from "./Action.js";
import Agent from "./Agent.js";
import ManeuverComputer from "./ManeuverComputer.js";
import RectanglePath from "./RectanglePath.js";
import Reducer from "./Reducer.js";
import Selector from "./Selector.js";

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
   const adjudicator = new Adjudicator(store);

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
   let answer = false;
   const store = this.store();
   const environment = Selector.environment(store.getState());
   const fromPosition = environment.getPositionFor(attacker);

   if (fromPosition)
   {
      const maneuver = Maneuver.properties[maneuverKey];
      const shipBase = attacker.card().shipFaction.ship.shipBase;
      const toPolygon = ManeuverComputer.computeToPolygon(environment.playFormatKey(), maneuver, fromPosition,
         shipBase);

      if (toPolygon)
      {
         const tokens = environment.pilotInstances();
         answer = true;

         for (let i = 0; i < tokens.length; i++)
         {
            const token = tokens[i];

            if (token !== attacker)
            {
               const myShipBase = token.card().shipFaction.ship.shipBase;
               const position = environment.getPositionFor(token);
               const polygon = ManeuverComputer.computePolygon(myShipBase, position.x(), position.y(),
                  position.heading());
               const collide = RectanglePath.doPolygonsCollide(polygon, toPolygon);

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
   return (attacker.card().key === PilotCard.TYCHO_CELCHU || !attacker.isStressed()) && !attacker.isTouching();
};

Adjudicator.prototype.canSlam = function(token, maneuverKey)
{
   InputValidator.validateNotNull("token", token);
   InputValidator.validateNotNull("maneuverKey", maneuverKey);

   // To SLAM, choose and execute a maneuver on the ship's dial.
   // The chosen maneuver must be the same speed as the maneuver that ship executed this round.
   // Performing a SLAM counts as executing a maneuver.
   // A ship cannot perform SLAM as a free action.
   const previousManeuver = Selector.maneuver(token.store().getState(), token);
   let speed;

   if (previousManeuver)
   {
      speed = previousManeuver.speed;
   }

   const ship = token.card().shipFaction.ship;
   const maneuverKeys = ship.maneuverKeys;
   const slamManeuver = Maneuver.properties[maneuverKey];
   const store = this.store();
   const environment = Selector.environment(store.getState());
   const fromPosition = environment.getPositionFor(token);
   let toPolygon;

   if (fromPosition)
   {
      const playFormatKey = environment.playFormatKey();
      const shipBase = token.card().shipFaction.ship.shipBase;
      toPolygon = ManeuverComputer.computeToPolygon(playFormatKey, slamManeuver, fromPosition, shipBase);
   }

   return (previousManeuver !== undefined) && (toPolygon !== undefined) && maneuverKeys.includes(maneuverKey) && (slamManeuver.speed === speed);
};

Adjudicator.prototype.compareInitiative = function(squadBuilder1, squadBuilder2)
{
   InputValidator.validateNotNull("squadBuilder1", squadBuilder1);
   InputValidator.validateNotNull("squadBuilder2", squadBuilder2);

   let answer = 1;

   // Compare squad point costs.
   const store = Redux.createStore(Reducer.root);
   const factionKey1 = squadBuilder1.factionKey();
   const agent1 = new Agent(store, "Agent1");
   const squad1 = squadBuilder1.buildSquad(agent1);
   const squadPointCost1 = squad1.squadPointCost();

   const factionKey2 = squadBuilder2.factionKey();
   const agent2 = new Agent(store, "Agent2");
   const squad2 = squadBuilder2.buildSquad(agent2);
   const squadPointCost2 = squad2.squadPointCost();

   answer = (squadPointCost2 - squadPointCost1);

   if (answer === 0)
   {
      // Compare faction keys.
      const values = Faction.keys();
      const index1 = values.indexOf(factionKey1);
      const index2 = values.indexOf(factionKey2);

      answer = index2 - index1;
   }

   return answer;
};

Adjudicator.prototype.determineWinner = function()
{
   let answer;

   const store = this.store();
   const environment = Selector.environment(store.getState());
   const firstCount = environment.firstAgent().pilotInstances().length;
   const secondCount = environment.secondAgent().pilotInstances().length;

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
   let answer = false;

   const store = this.store();
   const environment = Selector.environment(store.getState());
   const firstCount = environment.firstAgent().pilotInstances().length;

   answer = (firstCount === 0);

   if (!answer)
   {
      const secondCount = environment.secondAgent().pilotInstances().length;
      answer = (secondCount === 0);
   }

   return answer;
};

export default Adjudicator;