"use strict";

define(["utility/InputValidator", "artifact/FiringArc", "artifact/ShipBase", "model/ManeuverComputer", "model/Position", "model/RangeRuler", "model/RectanglePath"],
   function(InputValidator, FiringArc, ShipBase, ManeuverComputer, Position, RangeRuler, RectanglePath)
   {
      var FiringComputer = {};

      FiringComputer.isInFiringArc = function(attackerPosition, attackerFiringArc, defenderPosition, defenderShipBase)
      {
         InputValidator.validateNotNull("attackerPosition", attackerPosition);
         InputValidator.validateNotNull("attackerFiringArc", attackerFiringArc);
         InputValidator.validateNotNull("defenderPosition", defenderPosition);
         InputValidator.validateNotNull("defenderShipBase", defenderShipBase);

         var offsetKeys = FiringArc.offsetKeys();
         var myAttackerPosition = (offsetKeys.includes(attackerFiringArc.key) ? FiringComputer._computeOffsetAttackerPosition(attackerPosition, attackerFiringArc) : attackerPosition);

         var answer = FiringComputer._isInFiringArc(myAttackerPosition, attackerFiringArc, defenderPosition.x(), defenderPosition.y());

         if (!answer)
         {
            var polygon = ManeuverComputer.computePolygon(defenderShipBase, defenderPosition.x(), defenderPosition.y(), defenderPosition.heading());
            var points = polygon.points();

            for (var i = 0; i < points.length; i += 2)
            {
               if (FiringComputer._isInFiringArc(myAttackerPosition, attackerFiringArc, points[i], points[i + 1]))
               {
                  answer = true;
                  break;
               }
            }
         }

         return answer;
      };

      FiringComputer.isInRange = function(rangeKeys, attacker, attackerPosition, defender, defenderPosition)
      {
         InputValidator.validateIsArray("rangeKeys", rangeKeys);
         InputValidator.validateNotNull("attacker", attacker);
         InputValidator.validateNotNull("attackerPosition", attackerPosition);
         InputValidator.validateNotNull("defender", defender);
         InputValidator.validateNotNull("defenderPosition", defenderPosition);

         var range = RangeRuler.getRange(attacker, attackerPosition, defender, defenderPosition);

         return rangeKeys.includes(range);
      };

      FiringComputer._computeOffsetAttackerPosition = function(attackerPosition, attackerFiringArc)
      {
         var answer = attackerPosition;
         var heading = attackerPosition.heading();
         var angle = heading * Math.PI / 180.0;
         var x, y;

         // Assume HUGE2
         var shipBase = ShipBase.properties[ShipBase.HUGE2];
         var width = shipBase.width;

         switch (attackerFiringArc.key)
         {
            case FiringArc.PORT_AND_STARBOARD_AFT:
            case FiringArc.PORT_AND_STARBOARD_AFT_SKEWED:
               x = attackerPosition.x() - (width / 2 - 40) * Math.cos(angle);
               y = attackerPosition.y() - (width / 2 - 40) * Math.sin(angle);
               answer = new Position(x, y, heading);
               break;
            case FiringArc.PORT_AND_STARBOARD_FORE:
               x = attackerPosition.x() + (width / 2 - 40) * Math.cos(angle);
               y = attackerPosition.y() + (width / 2 - 40) * Math.sin(angle);
               answer = new Position(x, y, heading);
               break;
            default:
               LOGGER.error("Unknown firing arc: " + attackerFiringArc.key);
         }

         return answer;
      };

      FiringComputer._createBullseyePolygon = function(attackerPosition)
      {
         var size = 915;
         var heading = attackerPosition.heading();
         var answer = new RectanglePath(size, 15);
         answer.rotate(heading);
         answer.translate(size / 2 * Math.cos(heading), size / 2 * Math.sin(heading));

         return answer;
      };

      FiringComputer._isInFiringArc = function(attackerPosition, firingArc, x, y)
      {
         var bearing = attackerPosition.computeBearing(x, y);
         var answer;

         switch (firingArc.key)
         {
            case FiringArc.AFT:
               answer = (135 <= bearing) && (bearing <= 225);
               break;
            case FiringArc.AFT_180:
               answer = (90 <= bearing) && (bearing <= 270);
               break;
            case FiringArc.BULLSEYE:
               var dx = x - attackerPosition.x();
               var dy = y - attackerPosition.y();
               var polygon = FiringComputer._createBullseyePolygon(attackerPosition);
               answer = RectanglePath.isPointInPolygon(dx, dy, polygon);
               break;
            case FiringArc.FORWARD:
               answer = (315 <= bearing) || (bearing <= 45);
               break;
            case FiringArc.FORWARD_106:
               answer = (307 <= bearing) || (bearing <= 53);
               break;
            case FiringArc.FORWARD_136:
               answer = (292 <= bearing) || (bearing <= 68);
               break;
            case FiringArc.FORWARD_180:
               answer = (270 <= bearing) || (bearing <= 90);
               break;
            case FiringArc.PORT:
               answer = (225 <= bearing) && (bearing <= 315);
               break;
            case FiringArc.PORT_AND_STARBOARD_AFT:
            case FiringArc.PORT_AND_STARBOARD_FORE:
               answer = (225 <= bearing) && (bearing <= 315) || (45 <= bearing) && (bearing <= 135);
               break;
            case FiringArc.PORT_AND_STARBOARD_AFT_SKEWED:
               answer = (225 <= bearing) && (bearing <= 331) || (29 <= bearing) && (bearing <= 135);
               break;
            case FiringArc.STARBOARD:
               answer = (45 <= bearing) && (bearing <= 135);
               break;
            default:
               LOGGER.error("Unknown firing arc: " + firingArc.key);
         }

         return answer;
      };

      return FiringComputer;
   });
