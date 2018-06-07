import EntityFilter from "../../model/EntityFilter.js";
import RangeFilter from "../../model/RangeFilter.js";

import TableColumns from "./TableColumns.js";

const DefaultFilters = {
   entityColumns: [],
   rangeColumns: [],

   create: function()
   {
      const filters = {};

      this.entityColumns.forEach(function(column)
      {
         const values = [];
         const filter = new EntityFilter(column.key, values);
         filters[column.key] = filter;
      });

      this.rangeColumns.forEach(function(column)
      {
         const isMinEnabled = false;
         let minValue = 1;
         const isMaxEnabled = false;
         let maxValue = 10;

         if (column.key === "year")
         {
            minValue = 2012;
            maxValue = 2017;
         }
         else if (column.key === "shipCount")
         {
            minValue = 1;
            maxValue = 7;
         }
         else if (column.key === "upgradeCount")
         {
            minValue = 0;
            maxValue = 17;
         }
         else if (column.key === "pilotSkill")
         {
            minValue = 8;
            maxValue = 26;
         }
         else if (column.key === "primaryWeapon")
         {
            minValue = 3;
            maxValue = 14;
         }
         else if (column.key === "energy")
         {
            minValue = 0;
            maxValue = 10;
         }
         else if (column.key === "agility")
         {
            minValue = 2;
            maxValue = 22;
         }
         else if (column.key === "hull")
         {
            minValue = 3;
            maxValue = 28;
         }
         else if (column.key === "shield")
         {
            minValue = 0;
            maxValue = 17;
         }
         else if (column.key === "squadPointCost")
         {
            minValue = 36;
            maxValue = 100;
         }
         else if (column.key === "sumStats")
         {
            minValue = 18;
            maxValue = 82;
         }
         else if (column.key === "ratioPrimaryWeaponAgility")
         {
            minValue = 0;
            maxValue = 4;
         }
         else if (column.key === "hullPlusShield")
         {
            minValue = 5;
            maxValue = 45;
         }
         else if (column.key === "ratioSumStatsSquadPointCost")
         {
            minValue = 0;
            maxValue = 1;
         }

         const filter = new RangeFilter(column.key, isMinEnabled, minValue, isMaxEnabled, maxValue);
         filters[column.key] = filter;
      });

      return filters;
   },

   initialize: function()
   {
      this.entityColumns.push(TableColumns[0]); // factionKey

      this.rangeColumns.push(TableColumns[1]); // year
      this.rangeColumns.push(TableColumns[4]); // ship count
      this.rangeColumns.push(TableColumns[5]); // upgrade count
      this.rangeColumns.push(TableColumns[6]); // pilotSkill
      this.rangeColumns.push(TableColumns[7]); // primaryWeapon
      this.rangeColumns.push(TableColumns[8]); // energy
      this.rangeColumns.push(TableColumns[9]); // agility
      this.rangeColumns.push(TableColumns[10]); // hull
      this.rangeColumns.push(TableColumns[11]); // shield
      this.rangeColumns.push(TableColumns[12]); // squadPointCost
      this.rangeColumns.push(TableColumns[13]); // sumStats
      this.rangeColumns.push(TableColumns[14]); // ratioPrimaryWeaponAgility
      this.rangeColumns.push(TableColumns[15]); // hullPlusShield
      this.rangeColumns.push(TableColumns[16]); // ratioSumStatsSquadPointCost
   },
};

DefaultFilters.initialize();

export default DefaultFilters;