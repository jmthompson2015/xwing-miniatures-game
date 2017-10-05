"use strict";

define(["model/js/EntityFilter", "model/js/RangeFilter", "accessory/upgrade-table/TableColumns"],
   function(EntityFilter, RangeFilter, TableColumns)
   {
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
            this.entityColumns.push(TableColumns[2]); // restrictionKeys
            this.entityColumns.push(TableColumns[3]); // headerKey
            this.entityColumns.push(TableColumns[5]); // isImplemented
            this.entityColumns.push(TableColumns[7]); // rangeKeys
            this.entityColumns.push(TableColumns[8]); // firingArc

            this.rangeColumns.push(TableColumns[6]); // weaponValue
            this.rangeColumns.push(TableColumns[9]); // squadPointCost
         },
      };

      DefaultFilters.initialize();

      return DefaultFilters;
   });
