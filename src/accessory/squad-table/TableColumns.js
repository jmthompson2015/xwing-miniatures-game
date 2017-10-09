"use strict";

define(function()
{
   var TableColumns = [
      {
         key: "factionKey",
         label: "Faction",
      },
      {
         key: "year",
         label: "Year",
         className: "numberCell tr",
      },
      {
         key: "name",
         label: "Squad",
         className: "textCell tl",
      },
      {
         key: "description",
         label: "Description",
         className: "textCell tl",
      },
      {
         key: "shipCount",
         label: "Ship Count",
         className: "numberCell tr",
      },
      {
         key: "upgradeCount",
         label: "Upgrade Count",
         className: "numberCell tr",
      },
      {
         key: "pilotSkill",
         label: "Pilot Skill",
         className: "numberCell tr",
      },
      {
         key: "primaryWeapon",
         label: "Primary Weapon",
         className: "numberCell tr",
      },
      {
         key: "energy",
         label: "Energy",
         className: "numberCell tr",
      },
      {
         key: "agility",
         label: "Agility",
         className: "numberCell tr",
      },
      {
         key: "hull",
         label: "Hull",
         className: "numberCell tr",
      },
      {
         key: "shield",
         label: "Shield",
         className: "numberCell tr",
      },
      {
         key: "squadPointCost",
         label: "Squad Point Cost",
         className: "numberCell tr",
      },
      {
         key: "sumStats",
         label: "Sum Stats",
         className: "numberCell tr",
      },
      {
         key: "ratioPrimaryWeaponAgility",
         label: "Primary Weapon / Agility",
         className: "numberCell tr",
      },
      {
         key: "hullPlusShield",
         label: "Hull + Shield",
         className: "numberCell tr",
      },
      {
         key: "ratioSumStatsSquadPointCost",
         label: "Sum Stats / Squad Point Cost",
         className: "numberCell tr",
      },
    ];

   return TableColumns;
});
