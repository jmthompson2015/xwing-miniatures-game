import InputValidator from "../../utility/InputValidator.js";
import MathUtilities from "../../utility/MathUtilities.js";

import Agent from "../../model/Agent.js";
import Reducer from "../../model/Reducer.js";

const TableRow = {};

TableRow.computeRatioPrimaryWeaponAgility = function(squad)
{
   InputValidator.validateNotNull("squad", squad);

   const primaryWeapon = squad.primaryWeaponValue();
   const agility = squad.agilityValue();

   return (agility !== 0 ? MathUtilities.round(primaryWeapon / agility, 2) : "");
};

TableRow.computeRatioSumStatsSquadPointCost = function(squad)
{
   InputValidator.validateNotNull("squad", squad);

   const sumStats = TableRow.computeSumStats(squad);
   const squadPointCost = squad.squadPointCost();

   return (squadPointCost !== 0 ? MathUtilities.round(sumStats / squadPointCost, 4) : "");
};

TableRow.computeSumStats = function(squad)
{
   InputValidator.validateNotNull("squad", squad);

   let answer = squad.pilotSkillValue();
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

   const store = Redux.createStore(Reducer.root);
   const agent = new Agent(store, "Agent1");
   const squad = squadBuilder.buildSquad(agent);
   const sumStats = TableRow.computeSumStats(squad);
   const ratioPrimaryWeaponAgility = TableRow.computeRatioPrimaryWeaponAgility(squad);
   const hullPlusShield = squad.hullValue() + squad.shieldValue();
   const ratioSumStatsSquadPointCost = TableRow.computeRatioSumStatsSquadPointCost(squad);

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

export default TableRow;