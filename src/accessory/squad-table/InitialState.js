import InputValidator from "../../utility/InputValidator.js";

import EntityFilter from "../../model/EntityFilter.js";
import RangeFilter from "../../model/RangeFilter.js";
import SquadBuilder from "../../model/SquadBuilder.js";

import DefaultFilters from "./DefaultFilters.js";
import TableRow from "./TableRow.js";

function InitialState()
{
   this.tableRows = [];
   this.filteredTableRows = [];

   SquadBuilder.SquadBuilders.forEach(function(squadBuilder)
   {
      const tableRows = TableRow.createTableRow(squadBuilder);
      this.tableRows.push(tableRows);
      this.filteredTableRows.push(tableRows);
   }, this);

   this.isFilterShown = false;
   this.filters = DefaultFilters.create();
   const oldFilters = InitialState.loadFromLocalStorage();

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
   let answer;
   const filterObjects = JSON.parse(localStorage.filters || null);

   if (filterObjects)
   {
      answer = {};

      filterObjects.forEach(function(object)
      {
         let filter;

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

export default InitialState;