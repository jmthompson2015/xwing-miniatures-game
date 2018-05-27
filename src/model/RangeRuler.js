"use strict";

define(["utility/InputValidator", "artifact/Range", "model/ManeuverComputer", "model/Position"],
   function(InputValidator, Range, ManeuverComputer, Position)
   {
      var RangeRuler = {};

      RangeRuler.findRange = function(distance)
      {
         var answer;

         var values = Range.keys();

         for (var i = 0; i < values.length; i++)
         {
            var r = values[i];
            var min = Range.properties[r].minDistance;
            var max = Range.properties[r].maxDistance;

            if ((min <= distance) && (distance <= max))
            {
               answer = r;
               break;
            }
         }

         return answer;
      };

      RangeRuler.getRange = function(attacker, attackerPosition, defender, defenderPosition)
      {
         InputValidator.validateNotNull("attacker", attacker);
         InputValidator.validateNotNull("attackerPosition", attackerPosition);
         InputValidator.validateNotNull("defender", defender);
         InputValidator.validateNotNull("defenderPosition", defenderPosition);

         var distance = attackerPosition.computeDistance(defenderPosition);

         var attackerPolygon = ManeuverComputer.computePolygon(attacker.card().shipFaction.ship.shipBase, attackerPosition
            .x(), attackerPosition.y(), attackerPosition.heading());
         var defenderPolygon = ManeuverComputer.computePolygon(defender.card().shipFaction.ship.shipBase, defenderPosition
            .x(), defenderPosition.y(), defenderPosition.heading());

         var points0 = attackerPolygon.points();
         var points1 = defenderPolygon.points();

         for (var i = 0; i < points0.length; i += 2)
         {
            var position0 = new Position(points0[i], points0[i + 1], 0);

            for (var j = 0; j < points1.length; j += 2)
            {
               var position1 = new Position(points1[j], points1[j + 1], 0);
               var myDistance = position0.computeDistance(position1);
               distance = Math.min(myDistance, distance);
            }
         }

         LOGGER.trace("distance = " + distance);

         return RangeRuler.findRange(Math.round(distance));
      };

      if (Object.freeze)
      {
         Object.freeze(RangeRuler);
      }

      return RangeRuler;
   });
