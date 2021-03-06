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

         if (column.key === "squadPointCost")
         {
            minValue = 0;
            maxValue = 46;
         }
         else if (column.key === "sumStats")
         {
            minValue = 8;
            maxValue = 27;
         }
         else if (column.key === "ratioPrimaryWeaponAgility")
         {
            minValue = 0;
            maxValue = 3;
         }
         else if (column.key === "hullPlusShield")
         {
            minValue = 3;
            maxValue = 16;
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
      this.entityColumns.push(TableColumns[2]); // shipKey
      this.entityColumns.push(TableColumns[3]); // wave
      this.entityColumns.push(TableColumns[5]); // isImplemented

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