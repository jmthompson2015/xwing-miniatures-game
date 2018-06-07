import Faction from "../artifact/Faction.js";

const CardComparator = {};

CardComparator.Activation = function(a, b)
{
   const isHuge0 = a.isHuge();
   const isHuge1 = b.isHuge();
   let answer = (isHuge0 === isHuge1 ? 0 : (isHuge0 && !isHuge1 ? 1 : -1));

   if (answer === 0)
   {
      const skill0 = a.pilotSkillValue();
      const skill1 = b.pilotSkillValue();
      answer = skill0 - skill1;
   }

   if (answer === 0)
   {
      const teamKey0 = a.card().shipFaction.factionKey;
      const teamKey1 = b.card().shipFaction.factionKey;

      if (Faction.isFriendly(teamKey0, teamKey1))
      {
         answer = 0;
      }
      else if (Faction.isFriendly(teamKey0, Faction.IMPERIAL))
      {
         answer = -1;
      }
      else
      {
         answer = 1;
      }
   }

   if (answer === 0)
   {
      answer = a.id() - b.id();
   }

   return answer;
};

CardComparator.Combat = function(a, b)
{
   const skill0 = a.pilotSkillValue();
   const skill1 = b.pilotSkillValue();
   let answer = skill1 - skill0;

   if (answer === 0)
   {
      const teamKey0 = a.card().shipFaction.factionKey;
      const teamKey1 = b.card().shipFaction.factionKey;

      if (Faction.isFriendly(teamKey0, teamKey1))
      {
         answer = 0;
      }
      else if (Faction.isFriendly(teamKey0, Faction.IMPERIAL))
      {
         answer = -1;
      }
      else
      {
         answer = 1;
      }
   }

   if (answer === 0)
   {
      answer = a.id() - b.id();
   }

   return answer;
};

//  function compare(a, b)
//  {
//     return (a === b ? 0 : (a > b ? 1 : -1));
//  }

export default CardComparator;