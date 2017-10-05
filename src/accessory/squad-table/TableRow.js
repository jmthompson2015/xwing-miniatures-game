"use strict";

define(["common/js/InputValidator", "model/js/SimpleAgent"],
   function(InputValidator, SimpleAgent)
   {
      var TableRow = {};

      TableRow.computeRatioPrimaryWeaponAgility = function(squad)
      {
         InputValidator.validateNotNull("squad", squad);

         var primaryWeapon = squad.primaryWeaponValue();
         var agility = squad.agilityValue();

         return (agility !== 0 ? Math.xwingRound(primaryWeapon / agility, 2) : "");
      };

      TableRow.computeRatioSumStatsSquadPointCost = function(squad)
      {
         InputValidator.validateNotNull("squad", squad);

         var sumStats = TableRow.computeSumStats(squad);
         var squadPointCost = squad.squadPointCost();

         return (squadPointCost !== 0 ? Math.xwingRound(sumStats / squadPointCost, 4) : "");
      };

      TableRow.computeSumStats = function(squad)
      {
         InputValidator.validateNotNull("squad", squad);

         var answer = squad.pilotSkillValue();
         answer += squad.primaryWeaponValue();
         answer += squad.energyValue();
         answer += squad.agilityValue();
         answer += squad.hullValue();
         answer += squad.shieldValue();

         return answer;
      };

      TableRow.createTableRow = function(squadBuilder)
      {
         InputValidator.validateNotNull("squadBuilder", squadBuilder);

         var factionKey = squadBuilder.factionKey();
         var agent = new SimpleAgent("Agent1", factionKey);
         var squad = squadBuilder.buildSquad(agent);
         var sumStats = TableRow.computeSumStats(squad);
         var ratioPrimaryWeaponAgility = TableRow.computeRatioPrimaryWeaponAgility(squad);
         var hullPlusShield = squad.hullValue() + squad.shieldValue();
         var ratioSumStatsSquadPointCost = TableRow.computeRatioSumStatsSquadPointCost(squad);

         return (
         {
            factionKey: squad.factionKey(),
            year: squad.year(),
            name: squad.name(),
            description: squad.description(),
            shipCount: squad.tokens().length,
            upgradeCount: squad.upgradeCount(),
            pilotSkill: squad.pilotSkillValue(),
            primaryWeapon: squad.primaryWeaponValue(),
            energy: squad.energyValue(),
            agility: squad.agilityValue(),
            hull: squad.hullValue(),
            shield: squad.shieldValue(),
            squadPointCost: squad.squadPointCost(),
            sumStats: sumStats,
            ratioPrimaryWeaponAgility: ratioPrimaryWeaponAgility,
            hullPlusShield: hullPlusShield,
            ratioSumStatsSquadPointCost: ratioSumStatsSquadPointCost,
         });
      };

      return TableRow;
   });