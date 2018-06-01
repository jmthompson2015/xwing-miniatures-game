import InputValidator from "../../utility/InputValidator.js";

import DamageCard from "../../artifact/DamageCard.js";

import EntityFilter from "../../model/EntityFilter.js";
import RangeFilter from "../../model/RangeFilter.js";

import TableRow from "./TableRow.js";
import DefaultFilters from "./DefaultFilters.js";

function InitialState()
{
   this.tableRows = [];
   this.filteredTableRows = [];

   DamageCard.keys().forEach(function(damageKey)
   {
      var damage = DamageCard.properties[damageKey];
      var version = (damageKey.substring(damageKey.length - 2) === "V2" ? "v2" : "v1");
      var tableRows = TableRow.createTableRow(damage, version);
      this.tableRows.push(tableRows);
      this.filteredTableRows.push(tableRows);
   }, this);

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

export default InitialState;