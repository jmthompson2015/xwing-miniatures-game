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
      this.entityColumns.push(TableColumns[0]); // version
      this.entityColumns.push(TableColumns[2]); // trait
      this.entityColumns.push(TableColumns[5]); // isImplemented
   },
};

DefaultFilters.initialize();

export default DefaultFilters;