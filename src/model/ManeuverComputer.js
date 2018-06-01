/*
 * Small ship base is 40mm x 40mm.
 * <p>Bearing straight, speed one maneuver is 40mm long. Other straight maneuvers are multiples of this.</p>
 */
import InputValidator from "../utility/InputValidator.js";
import MathUtilities from "../utility/MathUtilities.js";

import Bearing from "../artifact/Bearing.js";
import Maneuver from "../artifact/Maneuver.js";
import PlayFormat from "../artifact/PlayFormat.js";
import ShipBase from "../artifact/ShipBase.js";

import Path from "./Path.js";
import Position from "./Position.js";
import RectanglePath from "./RectanglePath.js";

var ManeuverComputer = {};

ManeuverComputer.backOffFrom = function(environment, token, maneuver, fromPosition, shipData1, startIndex, shipDataMap)
{
   InputValidator.validateNotNull("environment", environment);
   InputValidator.validateNotNull("token", token);
   InputValidator.validateNotNull("maneuver", maneuver);
   InputValidator.validateNotNull("fromPosition", fromPosition);
   InputValidator.validateNotNull("shipData1", shipData1);
   InputValidator.validateNotNull("startIndex", startIndex);
   InputValidator.validateNotNull("shipDataMap", shipDataMap);

   var answer = -2;
   var shipBase = token.card().shipFaction.ship.shipBase;
   var shipData0 = shipDataMap[token];
   var position0 = shipData0.position;
   var polygon1 = shipData1.polygon;

   // Find the shortest path until collision.
   var path = ManeuverComputer.computePath(maneuver, fromPosition, shipBase);
   var pathPoints = [];
   var points = path.points();
   var i;

   for (i = 0; i < points.length; i += 2)
   {
      pathPoints.push(
      {
         x: points[i],
         y: points[i + 1],
      });
   }

   var x0;
   var y0;
   var x1 = position0.x();
   var y1 = position0.y();
   var index = (startIndex < 0 ? pathPoints.length - 2 : startIndex);

   for (i = index; i >= 0; i--)
   {
      var point1 = pathPoints[i];
      x0 = point1.x;
      y0 = point1.y;
      var heading = Position.computeHeading(x0, y0, x1, y1);
      var polygon0 = ManeuverComputer.computePolygon(shipBase, MathUtilities.round(x0, 0), MathUtilities.round(y0, 0), heading);

      if (!RectanglePath.doPolygonsCollide(polygon0, polygon1))
      {
         var toPosition = ManeuverComputer._interpolate(x0, y0, x1, y1, polygon1, shipBase);
         shipData0 = {
            position: toPosition,
            polygon: polygon0,
         };
         shipDataMap[token] = shipData0;
         answer = i;
         break;
      }

      x1 = x0;
      y1 = y0;
   }

   return answer;
};

ManeuverComputer.computeFromPolygon = function(fromPosition, shipBase)
{
   InputValidator.validateNotNull("fromPosition", fromPosition);
   InputValidator.validateNotNull("shipBase", shipBase);

   return ManeuverComputer.computePolygon(shipBase, fromPosition.x(), fromPosition.y(), fromPosition.heading());
};

ManeuverComputer.computePolygon = function(shipBase, x, y, heading)
{
   InputValidator.validateNotNull("shipBase", shipBase);
   InputValidator.validateIsNumber("x", x);
   InputValidator.validateIsNumber("y", y);
   InputValidator.validateIsNumber("heading", heading);

   var answer = new RectanglePath(shipBase.width, shipBase.height);

   answer.rotate(heading * Math.PI / 180);
   answer.translate(x, y);

   return answer;
};

ManeuverComputer.computeToPolygon = function(playFormatKey, maneuver, fromPosition, shipBase)
{
   InputValidator.validateNotNull("playFormatKey", playFormatKey);
   InputValidator.validateNotNull("maneuverKey", maneuver);
   InputValidator.validateNotNull("fromPosition", fromPosition);
   InputValidator.validateNotNull("shipBaseKey", shipBase);

   var toPosition = ManeuverComputer.computeToPosition(playFormatKey, maneuver, fromPosition, shipBase);

   var answer;

   if (toPosition)
   {
      answer = ManeuverComputer.computePolygon(shipBase, toPosition.x(), toPosition.y(), toPosition.heading());
   }

   return answer;
};

ManeuverComputer.computePath = function(maneuver, fromPosition, shipBase)
{
   InputValidator.validateNotNull("maneuver", maneuver);
   InputValidator.validateNotNull("fromPosition", fromPosition);
   InputValidator.validateNotNull("shipBase", shipBase);

   var bearingKey = maneuver.bearingKey;
   var speed = maneuver.speed;

   var answer = new Path();

   // Initial point.
   answer.add(0.0, 0.0);

   // First segment: move base center.
   var baseSize = shipBase.height / 2.0;
   var lastX;
   var lastY;
   var x, y, factor;

   if ([Bearing.BARREL_ROLL_LEFT, Bearing.BARREL_ROLL_RIGHT].includes(bearingKey))
   {
      factor = (bearingKey === Bearing.BARREL_ROLL_RIGHT ? 1.0 : -1.0);
      y = factor * baseSize;
      answer.add(0.0, y);
      lastX = 0.0;
      lastY = y;
   }
   else if (maneuver.key !== Maneuver.STATIONARY_0_HARD)
   {
      x = baseSize;
      answer.add(x, 0.0);
      lastX = x;
      lastY = 0.0;
   }

   if (speed !== 0)
   {
      // Middle segments: follow the arc.
      switch (bearingKey)
      {
         case Bearing.STRAIGHT:
         case Bearing.KOIOGRAN_TURN:
            x = lastX;
            for (var i = 0; i < speed; i++)
            {
               x += 40;
               answer.add(x, 0.0);
            }
            lastX = x;
            break;
         case Bearing.BANK_LEFT:
         case Bearing.BANK_RIGHT:
         case Bearing.SEGNORS_LOOP_LEFT:
         case Bearing.SEGNORS_LOOP_RIGHT:
            var last = ManeuverComputer._addSegments(maneuver, answer, lastX, 45, 3 + speed);
            lastX = last.x;
            lastY = last.y;
            break;
         case Bearing.TURN_LEFT:
         case Bearing.TURN_RIGHT:
         case Bearing.TALLON_ROLL_LEFT:
         case Bearing.TALLON_ROLL_RIGHT:
            last = ManeuverComputer._addSegments(maneuver, answer, lastX, 90, 5 + speed);
            lastX = last.x;
            lastY = last.y;
            break;
         case Bearing.BARREL_ROLL_LEFT:
         case Bearing.BARREL_ROLL_RIGHT:
            factor = (bearingKey === Bearing.BARREL_ROLL_RIGHT ? 1.0 : -1.0);
            y = lastY;
            for (var j = 0; j < speed; j++)
            {
               y += factor * 40;
               answer.add(0.0, y);
            }
            lastY = y;
            break;
      }

      // Last segment: move base center.
      switch (bearingKey)
      {
         case Bearing.STRAIGHT:
         case Bearing.KOIOGRAN_TURN:
            x = baseSize + lastX;
            answer.add(x, 0.0);
            break;
         case Bearing.BANK_LEFT:
         case Bearing.BANK_RIGHT:
         case Bearing.SEGNORS_LOOP_LEFT:
         case Bearing.SEGNORS_LOOP_RIGHT:
            factor = ([Bearing.BANK_RIGHT, Bearing.SEGNORS_LOOP_RIGHT].includes(bearingKey) ? 1.0 : -1.0);
            x = (baseSize * Math.cos(Math.PI / 4.0)) + lastX;
            y = (factor * baseSize * Math.cos(Math.PI / 4.0)) + lastY;
            answer.add(x, y);
            break;
         case Bearing.TURN_LEFT:
         case Bearing.TURN_RIGHT:
         case Bearing.TALLON_ROLL_LEFT:
         case Bearing.TALLON_ROLL_RIGHT:
            factor = ([Bearing.TURN_RIGHT, Bearing.TALLON_ROLL_RIGHT].includes(bearingKey) ? 1.0 : -1.0);
            y = (factor * baseSize) + lastY;
            answer.add(lastX, y);
            break;
         case Bearing.BARREL_ROLL_LEFT:
         case Bearing.BARREL_ROLL_RIGHT:
            factor = (bearingKey === Bearing.BARREL_ROLL_RIGHT ? 1.0 : -1.0);
            y = factor * baseSize + lastY;
            answer.add(0.0, y);
            break;
      }
   }

   // Rotate and translate to fromPosition.
   var angle = fromPosition.heading() * Math.PI / 180;
   answer.rotate(angle);
   answer.translate(fromPosition.x(), fromPosition.y());

   return answer;
};

ManeuverComputer.computeToPosition = function(playFormatKey, maneuver, fromPosition, shipBase)
{
   InputValidator.validateNotNull("playFormatKey", playFormatKey);
   InputValidator.validateNotNull("maneuver", maneuver);
   InputValidator.validateNotNull("fromPosition", fromPosition);
   InputValidator.validateNotNull("shipBase", shipBase);

   var answer;

   if ([Maneuver.STATIONARY_0_HARD, Maneuver.STATIONARY_0_STANDARD].includes(maneuver.key))
   {
      answer = fromPosition;
   }
   else
   {
      var bearingKey = maneuver.bearingKey;

      if ([Bearing.STRAIGHT, Bearing.KOIOGRAN_TURN].includes(bearingKey))
      {
         answer = ManeuverComputer._computeToPositionStraight(playFormatKey, maneuver, fromPosition, shipBase);
      }
      else if (bearingKey && maneuver.bearing.isBank)
      {
         answer = ManeuverComputer._computeToPositionBank(playFormatKey, maneuver, fromPosition, shipBase);
      }
      else if (bearingKey && maneuver.bearing.isTurn)
      {
         answer = ManeuverComputer._computeToPositionTurn(playFormatKey, maneuver, fromPosition, shipBase);
      }
      else if ([Bearing.BARREL_ROLL_LEFT, Bearing.BARREL_ROLL_RIGHT].includes(bearingKey))
      {
         answer = ManeuverComputer._computeToPositionBarrelRoll(playFormatKey, maneuver, fromPosition, shipBase);
      }
      else
      {
         throw "Unknown maneuver: " + maneuver.key;
      }
   }

   return answer;
};

ManeuverComputer.createShipDataMap = function(environment, token, maneuver, fromPosition)
{
   InputValidator.validateNotNull("environment", environment);
   InputValidator.validateNotNull("token", token);
   InputValidator.validateNotNull("maneuver", maneuver);
   InputValidator.validateNotNull("fromPosition", fromPosition);

   var answer = {};
   var shipBase = token.card().shipFaction.ship.shipBase;
   var tokens = environment.getTokensForActivation(false);

   tokens.forEach(function(token1)
   {
      var position1;
      var polygon1;

      if (token1.equals(token))
      {
         position1 = ManeuverComputer.computeToPosition(environment.playFormatKey(), maneuver, fromPosition, shipBase);

         if (position1)
         {
            polygon1 = ManeuverComputer.computePolygon(shipBase, position1.x(), position1.y(), position1.heading());
         }
      }
      else
      {
         position1 = environment.getPositionFor(token1);
         var shipBase1 = token1.card().shipFaction.ship.shipBase;
         polygon1 = ManeuverComputer.computePolygon(shipBase1, position1.x(), position1.y(), position1.heading());
      }

      answer[token1] = {
         pilotInstance: token1,
         position: position1,
         polygon: polygon1,
      };
   });

   return answer;
};

ManeuverComputer.findCollision = function(shipDataMap, token)
{
   InputValidator.validateNotNull("shipDataMap", shipDataMap);
   InputValidator.validateNotNull("token", token);

   var shipData0 = shipDataMap[token];
   var polygon0 = shipData0.polygon;
   var answer;

   if (polygon0 !== undefined)
   {
      var keys = Object.keys(shipDataMap);

      for (var i = 0; i < keys.length; i++)
      {
         var shipData1 = shipDataMap[keys[i]];

         if (shipData0 !== shipData1)
         {
            var polygon1 = shipData1.polygon;

            if (polygon1 !== undefined && RectanglePath.doPolygonsCollide(polygon0, polygon1))
            {
               answer = shipData1;
               break;
            }
         }
      }
   }

   return answer;
};

ManeuverComputer._addSegments = function(maneuver, path, lastX, heading, segmentCount)
{
   InputValidator.validateNotNull("maneuver", maneuver);
   InputValidator.validateNotNull("path", path);
   InputValidator.validateIsNumber("lastX", lastX);
   InputValidator.validateIsNumber("heading", heading);
   InputValidator.validateIsNumber("segmentCount", segmentCount);

   var bearingKey = maneuver.bearingKey;
   var radius = maneuver.radius;

   var factor = ([Bearing.BANK_RIGHT, Bearing.TURN_RIGHT, Bearing.SEGNORS_LOOP_RIGHT, Bearing.TALLON_ROLL_RIGHT].includes(bearingKey) ? 1.0 : -1.0);
   var deltaAngle = (heading * Math.PI / 180) / segmentCount;

   var myLastX = lastX;
   var myLastY = 0.0;

   for (var i = 1; i <= segmentCount; i++)
   {
      var angle = deltaAngle * i;
      var x = lastX + (radius * Math.sin(angle));
      var y = factor * radius * (1.0 - Math.cos(angle));
      path.add(x, y);
      myLastX = x;
      myLastY = y;
   }

   var answer = {};
   answer.x = Math.round(myLastX);
   answer.y = Math.round(myLastY);
   return answer;
};

ManeuverComputer._computeToPositionBank = function(playFormatKey, maneuver, fromPosition, shipBase)
{
   var bearingKey = maneuver.bearingKey;
   var speed = maneuver.speed;
   var headingChange = (maneuver.bearing !== undefined ? maneuver.bearing.headingChange : undefined);

   var dx, dy, factor, angle;

   if (shipBase.key === ShipBase.HUGE1)
   {
      factor = (bearingKey === Bearing.HUGE_BANK_RIGHT ? 1.0 : -1.0);
      angle = headingChange * Math.PI / 180.0;
      switch (speed)
      {
         case 1:
            dx = 66;
            dy = factor * 18;
            break;
         case 2:
            dx = 107;
            dy = factor * 23;
            break;
         default:
            throw "Unknown huge bank speed: " + bearingKey + " " + speed;
      }
   }
   else if (shipBase.key === ShipBase.HUGE2)
   {
      factor = (bearingKey === Bearing.HUGE_BANK_RIGHT ? 1.0 : -1.0);
      angle = headingChange * Math.PI / 180.0;
      switch (speed)
      {
         case 1:
            dx = 69;
            dy = factor * 11;
            break;
         case 2:
            dx = 112;
            dy = factor * 18;
            break;
         default:
            throw "Unknown huge bank speed: " + bearingKey + " " + speed;
      }
   }
   else
   {
      var baseSize = shipBase.height / 2;
      var radius = maneuver.radius;

      // Half base.
      var speedFactor = (speed > 0 ? 1 : -1);
      var x1 = speedFactor * baseSize;
      var y1 = 0.0;

      // Curve.
      factor = ([Bearing.BANK_RIGHT, Bearing.SEGNORS_LOOP_RIGHT].includes(bearingKey) ? 1.0 : -1.0);
      angle = factor * 45.0 * Math.PI / 180.0;
      var x2 = speedFactor * radius * Math.cos(angle);
      var y2 = speedFactor * factor * radius * (1.0 - (Math.sin(angle) * factor));

      // Half base.
      var x3 = speedFactor * baseSize * Math.cos(angle);
      var y3 = speedFactor * baseSize * Math.sin(angle);

      dx = x1 + x2 + x3;
      dy = y1 + y2 + y3;
   }

   return ManeuverComputer._createPosition(playFormatKey, fromPosition, dx, dy, headingChange);
};

ManeuverComputer._computeToPositionBarrelRoll = function(playFormatKey, maneuver, fromPosition, shipBase)
{
   var baseSize = shipBase.height / 2;
   var bearingKey = maneuver.bearingKey;
   var speed = maneuver.speed;

   var factor = (bearingKey === Bearing.BARREL_ROLL_RIGHT ? 1.0 : -1.0);
   var dx = 0;
   var dy = factor * ((2 * baseSize) + (40 * speed));
   var headingChange = 0;

   return ManeuverComputer._createPosition(playFormatKey, fromPosition, dx, dy, headingChange);
};

ManeuverComputer._computeToPositionStraight = function(playFormatKey, maneuver, fromPosition, shipBase)
{
   var baseSize = shipBase.height / 2;

   if (ShipBase.isHuge(shipBase.key))
   {
      baseSize = 0;
   }

   var speed = maneuver.speed;
   var speedFactor = (speed > 0 ? 1 : -1);
   var dx = (2 * speedFactor * baseSize) + (40 * speed);
   var dy = 0;
   var headingChange = (maneuver.bearing !== undefined ? maneuver.bearing.headingChange : undefined);

   return ManeuverComputer._createPosition(playFormatKey, fromPosition, dx, dy, headingChange);
};

ManeuverComputer._computeToPositionTurn = function(playFormatKey, maneuver, fromPosition, shipBase)
{
   var baseSize = shipBase.height / 2;
   var radius = maneuver.radius;
   var bearingKey = maneuver.bearingKey;
   var headingChange = (maneuver.bearing !== undefined ? maneuver.bearing.headingChange : undefined);

   // Half base.
   var x1 = baseSize;
   var y1 = 0.0;

   // Curve.
   var factor = ([Bearing.TURN_RIGHT, Bearing.TALLON_ROLL_RIGHT].includes(bearingKey) ? 1.0 : -1.0);
   var angle = factor * 90.0 * Math.PI / 180.0;
   var x2 = radius;
   var y2 = factor * radius;

   // Half base.
   var x3 = baseSize * Math.cos(angle);
   var y3 = baseSize * Math.sin(angle);

   var dx = x1 + x2 + x3;
   var dy = y1 + y2 + y3;

   return ManeuverComputer._createPosition(playFormatKey, fromPosition, dx, dy, headingChange);
};

ManeuverComputer._createPosition = function(playFormatKey, fromPosition, dx, dy, headingChange)
{
   InputValidator.validateNotNull("playFormatKey", playFormatKey);
   InputValidator.validateNotNull("fromPosition", fromPosition);
   InputValidator.validateIsNumber("dx", dx);
   InputValidator.validateIsNumber("dy", dy);
   InputValidator.validateIsNumber("headingChange", headingChange);

   var x0 = fromPosition.x();
   var y0 = fromPosition.y();
   var angle = fromPosition.heading() * Math.PI / 180;

   var x = Math.round((x0 + (dx * Math.cos(angle))) - (dy * Math.sin(angle)));
   var y = Math.round((y0 + (dx * Math.sin(angle))) + (dy * Math.cos(angle)));
   var heading = fromPosition.heading() + headingChange;

   var answer;

   if (PlayFormat.isPointInPlayArea(playFormatKey, x, y))
   {
      answer = new Position(x, y, heading);
   }

   return answer;
};

/*
 * @param x0 Non-collision X coordinate.
 *
 * @param y0 Non-collision Y coordinate.
 *
 * @param x1 Collision X coordinate.
 *
 * @param y1 Collision Y coordinate.
 *
 * @param polygon1 Colliding area.
 *
 * @return the closest non-collision point.
 */
ManeuverComputer._interpolate = function(x0, y0, x1, y1, polygon1, shipBase)
{
   InputValidator.validateNotNull("x0", x0);
   InputValidator.validateNotNull("y0", y0);
   InputValidator.validateNotNull("x1", x1);
   InputValidator.validateNotNull("y1", y1);
   InputValidator.validateNotNull("polygon1", polygon1);
   InputValidator.validateNotNull("shipBase", shipBase);

   var answer;

   // Calculate the midpoint.
   var t = 0.5;
   var x01 = x0 + (t * (x1 - x0));
   var y01 = y0 + (t * (y1 - y0));
   var heading;

   if (((MathUtilities.round(x0 - x01, 0) === 0) && (MathUtilities.round(y0 - y01, 0) === 0)) ||
      ((MathUtilities.round(x01 - x1, 0) === 0) && (MathUtilities.round(y01 - y1, 0) === 0)))
   {
      heading = Position.computeHeading(x0, y0, x1, y1);
      answer = new Position(MathUtilities.round(x0, 0), MathUtilities.round(y0, 0), heading);
   }
   else
   {
      var heading01 = Position.computeHeading(x0, y0, x01, y01);
      var polygon01 = ManeuverComputer.computePolygon(shipBase, MathUtilities.round(x01, 0), MathUtilities.round(y01, 0), heading01);

      if (RectanglePath.doPolygonsCollide(polygon01, polygon1))
      {
         x01 = x0 + (t * (x01 - x0));
         y01 = y0 + (t * (y01 - y0));
         answer = ManeuverComputer._interpolate(x0, y0, x01, y01, polygon1, shipBase);
      }
      else
      {
         x01 = x01 + (t * (x1 - x01));
         y01 = y01 + (t * (y1 - y01));
         answer = ManeuverComputer._interpolate(x01, y01, x1, y1, polygon1, shipBase);
      }
   }

   if (answer === undefined)
   {
      heading = Position.computeHeading(x0, y0, x1, y1);
      answer = new Position(parseInt(x1), parseInt(y1), heading);
   }

   return answer;
};

if (Object.freeze)
{
   Object.freeze(ManeuverComputer);
}

export default ManeuverComputer;