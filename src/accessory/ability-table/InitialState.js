"use strict";

define(["redux", "utility/InputValidator",
  "artifact/ConditionCard", "artifact/DamageCard", "artifact/PilotCard", "artifact/UpgradeCard",
  "model/Agent", "model/EntityFilter", "model/RangeFilter", "model/Reducer", "model/SquadBuilder",
  "accessory/ability-table/DefaultFilters", "accessory/ability-table/TableRow"],
   function(Redux, InputValidator, ConditionCard, DamageCard, PilotCard, UpgradeCard, Agent, EntityFilter, RangeFilter, Reducer, SquadBuilder, DefaultFilters, TableRow)
   {
      function InitialState()
      {
         this.tableRows = [];
         this.filteredTableRows = [];

         var damageKeysV2 = DamageCard.keysV2();
         var pilots = {};
         var upgrades = {};
         var store = Redux.createStore(Reducer.root);
         var agent = new Agent(store, "dummy");
         var count;

         SquadBuilder.SquadBuilders.forEach(function(squadBuilder)
         {
            var squad = squadBuilder.buildSquad(agent);
            squad.tokens().forEach(function(pilotInstance)
            {
               var pilotKey = pilotInstance.card().key;
               count = (pilots[pilotKey] !== undefined ? pilots[pilotKey] : 0);
               pilots[pilotKey] = count + 1;

               pilotInstance.upgrades().forEach(function(upgradeInstance)
               {
                  var upgradeKey = upgradeInstance.card().key;
                  count = (upgrades[upgradeKey] !== undefined ? upgrades[upgradeKey] : 0);
                  upgrades[upgradeKey] = count + 1;
               });
            });
         });

         ConditionCard.keys().forEach(function(conditionKey)
         {
            var condition = ConditionCard.properties[conditionKey];
            var tableRows = TableRow.createTableRow(condition, "ConditionCard");
            this.tableRows.push(tableRows);
            this.filteredTableRows.push(tableRows);
         }, this);

         DamageCard.keys().forEach(function(damageKey)
         {
            var damage = DamageCard.properties[damageKey];
            var count = (damageKeysV2.includes(damageKey) ? 1 : undefined);
            var tableRows = TableRow.createTableRow(damage, "DamageCard", count);
            this.tableRows.push(tableRows);
            this.filteredTableRows.push(tableRows);
         }, this);

         PilotCard.keys().forEach(function(pilotKey)
         {
            var pilot = PilotCard.properties[pilotKey];
            var count = pilots[pilotKey];
            var tableRows = TableRow.createTableRow(pilot, "PilotCard", count);
            this.tableRows.push(tableRows);
            this.filteredTableRows.push(tableRows);
         }, this);

         UpgradeCard.keys().forEach(function(upgradeKey)
         {
            var upgrade = UpgradeCard.properties[upgradeKey];
            var count = upgrades[upgradeKey];
            var tableRows = TableRow.createTableRow(upgrade, "UpgradeCard", count);
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
