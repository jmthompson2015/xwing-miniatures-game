"use strict";

define(["common/js/InputValidator",
  "artifact/js/DamageCard", "artifact/js/PilotCard", "artifact/js/UpgradeCard", "model/js/EntityFilter", "model/js/RangeFilter",
  "accessory/ability-table/DefaultFilters", "accessory/ability-table/TableRow"],
   function(InputValidator, DamageCard, PilotCard, UpgradeCard, EntityFilter, RangeFilter, DefaultFilters, TableRow)
   {
      function InitialState()
      {
         this.tableRows = [];
         this.filteredTableRows = [];

         DamageCard.keys().forEach(function(damageKey)
         {
            var damage = DamageCard.properties[damageKey];
            var tableRows = TableRow.createTableRow(damage, "DamageCard");
            this.tableRows.push(tableRows);
            this.filteredTableRows.push(tableRows);
         }, this);

         PilotCard.keys().forEach(function(pilotKey)
         {
            var pilot = PilotCard.properties[pilotKey];
            var tableRows = TableRow.createTableRow(pilot, "PilotCard");
            this.tableRows.push(tableRows);
            this.filteredTableRows.push(tableRows);
         }, this);

         UpgradeCard.keys().forEach(function(upgradeKey)
         {
            var upgrade = UpgradeCard.properties[upgradeKey];
            var tableRows = TableRow.createTableRow(upgrade, "UpgradeCard");
            this.tableRows.push(tableRows);
            this.filteredTableRows.push(tableRows);
         }, this);

         this.filteredTableRows.sort(function(a, b)
         {
            var answer = -1;

            var nameA = a.name.replace(/\"/g, "");
            var nameB = b.name.replace(/\"/g, "");

            if (nameA === nameB)
            {
               answer = 0;
            }
            else if (nameA > nameB)
            {
               answer = 1;
            }

            return answer;
         });

         // FIXME
         // localStorage.removeItem("filters");
         // FIXME

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