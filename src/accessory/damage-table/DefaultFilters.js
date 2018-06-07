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
         const minValue = 1;
         const isMaxEnabled = false;
         const maxValue = 10;

         const filter = new RangeFilter(column.key, isMinEnabled, minValue, isMaxEnabled, maxValue);
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