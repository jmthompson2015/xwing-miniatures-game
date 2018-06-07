import InputValidator from "../utility/InputValidator.js";

import Range from "../artifact/Range.js";

import ManeuverComputer from "./ManeuverComputer.js";
import Position from "./Position.js";

const RangeRuler = {};

RangeRuler.findRange = function(distance)
{
   let answer;

   const values = Range.keys();

   for (let i = 0; i < values.length; i++)
   {
      const r = values[i];
      const min = Range.properties[r].minDistance;
      const max = Range.properties[r].maxDistance;

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

   let distance = attackerPosition.computeDistance(defenderPosition);

   const attackerPolygon = ManeuverComputer.computePolygon(attacker.card().shipFaction.ship.shipBase, attackerPosition
      .x(), attackerPosition.y(), attackerPosition.heading());
   const defenderPolygon = ManeuverComputer.computePolygon(defender.card().shipFaction.ship.shipBase, defenderPosition
      .x(), defenderPosition.y(), defenderPosition.heading());

   const points0 = attackerPolygon.points();
   const points1 = defenderPolygon.points();

   for (let i = 0; i < points0.length; i += 2)
   {
      const position0 = new Position(points0[i], points0[i + 1], 0);

      for (let j = 0; j < points1.length; j += 2)
      {
         const position1 = new Position(points1[j], points1[j + 1], 0);
         const myDistance = position0.computeDistance(position1);
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

export default RangeRuler;