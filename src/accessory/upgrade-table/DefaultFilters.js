import EntityFilter from "../../model/EntityFilter.js";
import RangeFilter from "../../model/RangeFilter.js";

import TableColumns from "./TableColumns.js";

var DefaultFilters = {
   entityColumns: [],
   rangeColumns: [],

   create: function()
   {
      var filters = {};

      this.entityColumns.forEach(function(column)
      {
         var values = [];
         var filter = new EntityFilter(column.key, values);
         filters[column.key] = filter;
      });

      this.rangeColumns.forEach(function(column)
      {
         var isMinEnabled = false;
         var minValue = 1;
         var isMaxEnabled = false;
         var maxValue = 10;

         var filter = new RangeFilter(column.key, isMinEnabled, minValue, isMaxEnabled, maxValue);
         filters[column.key] = filter;
      });

      return filters;
   },

   initialize: function()
   {
      this.entityColumns.push(TableColumns[0]); // typeKey
      this.entityColumns.push(TableColumns[2]); // wave
      this.entityColumns.push(TableColumns[3]); // restrictionKeys
      this.entityColumns.push(TableColumns[4]); // headerKey
      this.entityColumns.push(TableColumns[6]); // isImplemented
      this.entityColumns.push(TableColumns[8]); // rangeKeys
      this.entityColumns.push(TableColumns[9]); // firingArc

      this.rangeColumns.push(TableColumns[7]); // weaponValue
      this.rangeColumns.push(TableColumns[10]); // squadPointCost
   },
};

DefaultFilters.initialize();

export default DefaultFilters;