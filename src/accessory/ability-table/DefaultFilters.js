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
      this.entityColumns.push(TableColumns[0]); // deck
      this.entityColumns.push(TableColumns[1]); // type
      this.entityColumns.push(TableColumns[3]); // wave
      this.entityColumns.push(TableColumns[7]); // isImplemented
      this.entityColumns.push(TableColumns[8]); // event

      this.rangeColumns.push(TableColumns[4]); // count
   },
};

DefaultFilters.initialize();

export default DefaultFilters;