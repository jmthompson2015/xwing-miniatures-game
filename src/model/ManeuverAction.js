import InputValidator from "../utility/InputValidator.js";

import Bearing from "../artifact/Bearing.js";
import Maneuver from "../artifact/Maneuver.js";
import PilotCard from "../artifact/PilotCard.js";
import PlayFormat from "../artifact/PlayFormat.js";

import Action from "./Action.js";
import CardAction from "./CardAction.js";
import ManeuverComputer from "./ManeuverComputer.js";
import Position from "./Position.js";
import ShipFledAction from "./ShipFledAction.js";

function ManeuverAction(store, tokenId, maneuverKey, isBoostIn, fromPositionIn)
{
   InputValidator.validateNotNull("store", store);
   InputValidator.validateIsNumber("tokenId", tokenId);
   InputValidator.validateNotNull("maneuverKey", maneuverKey);
   // isBoost is optional. default: false
   // fromPosition is optional. default: lookup from environment

   const isBoost = (isBoostIn !== undefined ? isBoostIn : false);

   this.store = function()
   {
      return store;
   };

   this.tokenId = function()
   {
      return tokenId;
   };

   this.maneuverKey = function()
   {
      return maneuverKey;
   };

   this.isBoost = function()
   {
      return isBoost;
   };

   const environment = store.getState().environment;
   const token = environment.getTokenById(tokenId);
   const fromPosition = (fromPositionIn !== undefined ? fromPositionIn : environment.getPositionFor(token));

   this.environment = function()
   {
      return environment;
   };

   this.fromPosition = function()
   {
      return fromPosition;
   };

   this.token = function()
   {
      return token;
   };
}

//////////////////////////////////////////////////////////////////////////
// Accessor methods.

ManeuverAction.prototype.maneuver = function()
{
   const maneuverKey = this.maneuverKey();

   return Maneuver.properties[maneuverKey];
};

ManeuverAction.prototype.shipBase = function()
{
   const token = this.token();
   const pilot = token.card();
   const shipBase = pilot.shipFaction.ship.shipBase;

   return shipBase;
};

ManeuverAction.prototype.toString = function()
{
   return "ManeuverAction tokenId=" + this.tokenId() + ", maneuverKey=" + this.maneuverKey() + ", isBoost?" + this.isBoost() + ", fromPosition=" + this.fromPosition();
};

//////////////////////////////////////////////////////////////////////////
// Behavior methods.

ManeuverAction.prototype.doIt = function()
{
   LOGGER.trace("ManeuverAction.doIt() start");

   const token = this.token();

   if (token)
   {
      const store = this.store();
      const environment = this.environment();
      const maneuver = this.maneuver();
      const shipBase = this.shipBase();
      this._save();
      environment.removeTouching(token);
      const bearingKey = maneuver.bearingKey;
      const isBarrelRoll = [Bearing.BARREL_ROLL_LEFT, Bearing.BARREL_ROLL_RIGHT].includes(bearingKey);
      const isBoost = this.isBoost();
      const fromPosition = this.fromPosition();
      const toPosition = this.determineToPosition(isBarrelRoll, isBoost);
      let toPolygon;

      if (toPosition)
      {
         toPolygon = ManeuverComputer.computePolygon(shipBase, toPosition.x(), toPosition.y(), toPosition.heading());
      }

      if (!toPosition && (isBarrelRoll || isBoost))
      {
         // Maneuver failed.
         const message = isBarrelRoll ? "Barrel Roll failed." : "Boost failed.";
         LOGGER.info(message);
      }
      else if (!toPosition || !PlayFormat.isPathInPlayArea(environment.playFormatKey(), toPolygon))
      {
         LOGGER.info("Ship fled the battlefield: " + token.name());
         const shipFledAction = new ShipFledAction(environment, token, fromPosition);
         shipFledAction.doIt();
      }
      else
      {
         environment.moveToken(fromPosition, toPosition);

         if (token.isIonized && token.isIonized())
         {
            store.dispatch(CardAction.setIonCount(token));
         }

         if (token.card().key === PilotCard.IG_88C && isBoost)
         {
            store.dispatch(CardAction.addEvadeCount(token));
         }
      }
   }

   LOGGER.trace("ManeuverAction.doIt() end");
};

ManeuverAction.prototype.determineToPosition = function(isBarrelRoll, isBoost)
{
   InputValidator.validateNotNull("isBarrelRoll", isBarrelRoll);
   InputValidator.validateNotNull("isBoost", isBoost);

   let answer;

   if (isBarrelRoll || isBoost)
   {
      answer = this.determineToPositionWithoutBackOff();
   }
   else
   {
      answer = this.determineToPositionWithBackOff();
   }

   return answer;
};

ManeuverAction.prototype.determineToPositionWithBackOff = function()
{
   LOGGER.trace("determineToPositionWithBackOff() start");

   let answer;
   const environment = this.environment();
   const token = this.token();
   const maneuver = this.maneuver();
   const fromPosition = this.fromPosition();
   const shipDataMap = ManeuverComputer.createShipDataMap(environment, token, maneuver, fromPosition);
   const shipData0 = shipDataMap[token];
   let toPosition;

   if (shipData0 !== undefined)
   {
      toPosition = shipData0.position;
   }

   if (toPosition === undefined)
   {
      // Ship fled the battlefield.
      return undefined;
   }

   let shipData;
   let index = -1;
   let count = 0;

   do {
      shipData = ManeuverComputer.findCollision(shipDataMap, token);

      if (shipData === undefined)
      {
         // No collision.
         answer = shipDataMap[token].position;
      }
      else
      {
         // Collision with shipData, at least.
         environment.addTouching(token, shipData.pilotInstance);
         index = ManeuverComputer.backOffFrom(environment, token, maneuver, fromPosition, shipData, index, shipDataMap);
      }

      count++;

      if (count > 100)
      {
         throw "Too long spent in do loop.";
      }

      if (index < -1)
      {
         // Backoff failed.
         answer = fromPosition;
      }
   }
   while (answer === undefined);

   LOGGER.trace("determineToPositionWithBackOff() end");

   return answer;
};

ManeuverAction.prototype.determineToPositionWithoutBackOff = function()
{
   let answer;
   const environment = this.environment();
   const token = this.token();
   const maneuver = this.maneuver();
   const fromPosition = this.fromPosition();
   const shipDataMap = ManeuverComputer.createShipDataMap(environment, token, maneuver, fromPosition);
   const toPosition = shipDataMap[token].position;

   if (toPosition === undefined)
   {
      // Ship fled the battlefield.
      return undefined;
   }

   const shipData = ManeuverComputer.findCollision(shipDataMap, token);

   if (shipData === undefined)
   {
      // No collision.
      answer = shipDataMap[token].position;
   }

   return answer;
};

//////////////////////////////////////////////////////////////////////////
// Mutator methods.

ManeuverAction.prototype._save = function()
{
   const store = this.store();
   const tokenId = this.tokenId();
   const maneuverKey = this.maneuverKey();
   const isBoost = this.isBoost();
   const fromPosition = this.fromPosition();
   const fromPosition0 = Immutable.Map(
   {
      x: fromPosition.x(),
      y: fromPosition.y(),
      heading: fromPosition.heading(),
   });

   const values = Immutable.Map(
   {
      tokenId: tokenId,
      maneuverKey: maneuverKey,
      isBoost: isBoost,
      fromPosition: fromPosition0,
   });

   store.dispatch(Action.setTokenManeuverAction(tokenId, values));
};

//////////////////////////////////////////////////////////////////////////
// Utility methods.

ManeuverAction.get = function(store, tokenId)
{
   InputValidator.validateNotNull("store", store);
   InputValidator.validateIsNumber("tokenId", tokenId);

   const values = store.getState().cardManeuverAction.get(tokenId);
   let answer;

   if (values !== undefined)
   {
      const maneuverKey = values.get("maneuverKey");
      const isBoost = values.get("isBoost");
      const fromPosition0 = values.get("fromPosition");
      const x = fromPosition0.get("x");
      const y = fromPosition0.get("y");
      const heading = fromPosition0.get("heading");
      const fromPosition = new Position(x, y, heading);

      answer = new ManeuverAction(store, tokenId, maneuverKey, isBoost, fromPosition);
   }

   return answer;
};

export default ManeuverAction;