"use strict";

define(["artifact/Faction"], function(Faction)
{
   var CardComparator = {};

   CardComparator.Activation = function(a, b)
   {
      var isHuge0 = a.isHuge();
      var isHuge1 = b.isHuge();
      var answer = (isHuge0 === isHuge1 ? 0 : (isHuge0 && !isHuge1 ? 1 : -1));

      if (answer === 0)
      {
         var skill0 = a.pilotSkillValue();
         var skill1 = b.pilotSkillValue();
         answer = skill0 - skill1;
      }

      if (answer === 0)
      {
         var teamKey0 = a.card().shipFaction.factionKey;
         var teamKey1 = b.card().shipFaction.factionKey;

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
      var skill0 = a.pilotSkillValue();
      var skill1 = b.pilotSkillValue();
      var answer = skill1 - skill0;

      if (answer === 0)
      {
         var teamKey0 = a.card().shipFaction.factionKey;
         var teamKey1 = b.card().shipFaction.factionKey;

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

   return CardComparator;
});
