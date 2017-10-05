"use strict";

define(["common/js/InputValidator", "model/js/EntityFilter", "model/js/RangeFilter", "model/js/SquadBuilder",
  "accessory/squad-table/DefaultFilters", "accessory/squad-table/TableRow"],
   function(InputValidator, EntityFilter, RangeFilter, SquadBuilder, DefaultFilters, TableRow)
   {
      function InitialState()
      {
         this.tableRows = [];
         this.filteredTableRows = [];

         SquadBuilder.SquadBuilders.forEach(function(squadBuilder)
         {
            var tableRows = TableRow.createTableRow(squadBuilder);
            this.tableRows.push(tableRows);
            this.filteredTableRows.push(tableRows);
         }, this);

         this.isFilterShown = false;
         this.filters = DefaultFilters.create();
         var oldFilters = InitialState.loadFromLocalStorage();

         if (oldFilters)
         {
            this.merge(oldFilters);
         }
      }

      InitialState.prototype.merge = function(oldFilters)
      {
         InputValidator.validateNotNull("oldFilters", oldFilters);

         Object.getOwnPropertyNames(oldFilters).forEach(function(columnKey)
         {
            this.filters[columnKey] = oldFilters[columnKey];
         }, this);
      };

      InitialState.loadFromLocalStorage = function()
      {
         var answer;
         var filterObjects = JSON.parse(localStorage.filters || null);

         if (filterObjects)
         {
            answer = {};

            filterObjects.forEach(function(object)
            {
               var filter;

               switch (object.type)
               {
                  case "EntityFilter":
                     filter = EntityFilter.fromObject(object);
                     break;
                  case "RangeFilter":
                     filter = RangeFilter.fromObject(object);
                     break;
                  default:
                     throw "Unknown filter type: " + JSON.stringify(object);
               }

               answer[filter.columnKey()] = filter;
            });
         }

         return answer;
      };

      return InitialState;
   });
