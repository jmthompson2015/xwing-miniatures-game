import InputValidator from "../../utility/InputValidator.js";

import ConditionCard from "../../artifact/ConditionCard.js";
import DamageCard from "../../artifact/DamageCard.js";
import PilotCard from "../../artifact/PilotCard.js";
import UpgradeCard from "../../artifact/UpgradeCard.js";

import Agent from "../../model/Agent.js";
import EntityFilter from "../../model/EntityFilter.js";
import RangeFilter from "../../model/RangeFilter.js";
import Reducer from "../../model/Reducer.js";
import SquadBuilder from "../../model/SquadBuilder.js";

import DefaultFilters from "./DefaultFilters.js";
import TableRow from "./TableRow.js";

function InitialState()
{
   this.tableRows = [];
   this.filteredTableRows = [];

   const damageKeysV2 = DamageCard.keysV2();
   const pilots = {};
   const upgrades = {};
   const store = Redux.createStore(Reducer.root);
   const agent = new Agent(store, "dummy");
   let count;

   SquadBuilder.SquadBuilders.forEach(function(squadBuilder)
   {
      const squad = squadBuilder.buildSquad(agent);
      squad.tokens().forEach(function(pilotInstance)
      {
         const pilotKey = pilotInstance.card().key;
         count = (pilots[pilotKey] !== undefined ? pilots[pilotKey] : 0);
         pilots[pilotKey] = count + 1;

         pilotInstance.upgrades().forEach(function(upgradeInstance)
         {
            const upgradeKey = upgradeInstance.card().key;
            count = (upgrades[upgradeKey] !== undefined ? upgrades[upgradeKey] : 0);
            upgrades[upgradeKey] = count + 1;
         });
      });
   });

   ConditionCard.keys().forEach(function(conditionKey)
   {
      const condition = ConditionCard.properties[conditionKey];
      const tableRows = TableRow.createTableRow(condition, "ConditionCard");
      this.tableRows.push(tableRows);
      this.filteredTableRows.push(tableRows);
   }, this);

   DamageCard.keys().forEach(function(damageKey)
   {
      const damage = DamageCard.properties[damageKey];
      const count = (damageKeysV2.includes(damageKey) ? 1 : undefined);
      const tableRows = TableRow.createTableRow(damage, "DamageCard", count);
      this.tableRows.push(tableRows);
      this.filteredTableRows.push(tableRows);
   }, this);

   PilotCard.keys().forEach(function(pilotKey)
   {
      const pilot = PilotCard.properties[pilotKey];
      const count = pilots[pilotKey];
      const tableRows = TableRow.createTableRow(pilot, "PilotCard", count);
      this.tableRows.push(tableRows);
      this.filteredTableRows.push(tableRows);
   }, this);

   UpgradeCard.keys().forEach(function(upgradeKey)
   {
      const upgrade = UpgradeCard.properties[upgradeKey];
      const count = upgrades[upgradeKey];
      const tableRows = TableRow.createTableRow(upgrade, "UpgradeCard", count);
      this.tableRows.push(tableRows);
      this.filteredTableRows.push(tableRows);
   }, this);

   this.filteredTableRows.sort(function(a, b)
   {
      let answer = -1;

      const nameA = a.name.replace(/\"/g, "");
      const nameB = b.name.replace(/\"/g, "");

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