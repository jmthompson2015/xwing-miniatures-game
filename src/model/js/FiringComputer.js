"use strict";

define(["common/js/InputValidator", "artifact/js/FiringArc", "model/js/ManeuverComputer", "model/js/RangeRuler", "model/js/RectanglePath"],
   function(InputValidator, FiringArc, ManeuverComputer, RangeRuler, RectanglePath)
   {
      var FiringComputer = {};

      FiringComputer.isInFiringArc = function(attackerPosition, attackerFiringArc, defenderPosition, defenderShipBase)
      {
         InputValidator.validateNotNull("attackerPosition", attackerPosition);
         InputValidator.validateNotNull("attackerFiringArc", attackerFiringArc);
         InputValidator.validateNotNull("defenderPosition", defenderPosition);
         InputValidator.validateNotNull("defenderShipBase", defenderShipBase);

         var answer = FiringComputer._isInFiringArc(attackerPosition, attackerFiringArc, defenderPosition.x(), defenderPosition.y());

         if (!answer)
         {
            var polygon = ManeuverComputer.computePolygon(defenderShipBase, defenderPosition.x(), defenderPosition.y(), defenderPosition.heading());
            var points = polygon.points();

            for (var i = 0; i < points.length; i += 2)
            {
               if (FiringComputer._isInFiringArc(attackerPosition, attackerFiringArc, points[i], points[i + 1]))
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
            case FiringArc.FORWARD_180:
               answer = (270 <= bearing) || (bearing <= 90);
               break;
            case FiringArc.PORT:
               answer = (225 <= bearing) && (bearing <= 315);
               break;
            case FiringArc.STARBOARD:
               answer = (45 <= bearing) && (bearing <= 135);
               break;
            default:
               throw "Unknown firing arc: " + firingArc.key;
         }

         return answer;
      };

      return FiringComputer;
   });
