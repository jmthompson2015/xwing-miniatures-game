import AttackDiceValue from "../../artifact/AttackDiceValue.js";
import Bearing from "../../artifact/Bearing.js";
import ConditionCard from "../../artifact/ConditionCard.js";
import Count from "../../artifact/Count.js";
import DamageCard from "../../artifact/DamageCard.js";
import DamageCardTrait from "../../artifact/DamageCardTrait.js";
import DefenseDiceValue from "../../artifact/DefenseDiceValue.js";
import DiceModification from "../../artifact/DiceModification.js";
import Difficulty from "../../artifact/Difficulty.js";
import Event from "../../artifact/Event.js";
import Faction from "../../artifact/Faction.js";
import FiringArc from "../../artifact/FiringArc.js";
import Maneuver from "../../artifact/Maneuver.js";
import Phase from "../../artifact/Phase.js";
import PilotCard from "../../artifact/PilotCard.js";
import PlayFormat from "../../artifact/PlayFormat.js";
import Range from "../../artifact/Range.js";
import Ship from "../../artifact/Ship.js";
import ShipAction from "../../artifact/ShipAction.js";
import ShipBase from "../../artifact/ShipBase.js";
import ShipFaction from "../../artifact/ShipFaction.js";
import ShipState from "../../artifact/ShipState.js";
import UpgradeCard from "../../artifact/UpgradeCard.js";
import UpgradeHeader from "../../artifact/UpgradeHeader.js";
import UpgradeRestriction from "../../artifact/UpgradeRestriction.js";
import UpgradeType from "../../artifact/UpgradeType.js";
import Value from "../../artifact/Value.js";

var GameColumns = [
   {
      key: "item",
      label: "Item",
      className: "textCell tl",
         },
   {
      key: "count",
      label: "Count",
      className: "numberCell tr",
         },
      ];

// Factories.
let Table = React.createFactory(Reactable.Table);
let Tr = React.createFactory(Reactable.Tr);
let Td = React.createFactory(Reactable.Td);

class GameDataTable extends React.Component
{
   render()
   {
      var rows = [];

      rows.push(this.createRow("AttackDiceValue", AttackDiceValue.keys().length, rows.length));
      rows.push(this.createRow("Bearing", Bearing.keys().length, rows.length));
      rows.push(this.createRow("ConditionCard", ConditionCard.keys().length, rows.length));
      rows.push(this.createRow("Count", Count.keys().length, rows.length));
      rows.push(this.createRow("DamageCard", DamageCard.keys().length, rows.length));
      rows.push(this.createRow("DamageCardTrait", DamageCardTrait.keys().length, rows.length));
      rows.push(this.createRow("DefenseDiceValue", DefenseDiceValue.keys().length, rows.length));
      rows.push(this.createRow("DiceModification", DiceModification.keys().length, rows.length));
      rows.push(this.createRow("Difficulty", Difficulty.keys().length, rows.length));
      rows.push(this.createRow("Event", Event.keys().length, rows.length));
      rows.push(this.createRow("Faction", Faction.keys().length, rows.length));
      rows.push(this.createRow("FiringArc", FiringArc.keys().length, rows.length));
      rows.push(this.createRow("Maneuver", Maneuver.keys().length, rows.length));
      rows.push(this.createRow("Phase", Phase.keys().length, rows.length));
      rows.push(this.createRow("PilotCard", PilotCard.keys().length, rows.length));
      rows.push(this.createRow("PlayFormat", PlayFormat.keys().length, rows.length));
      rows.push(this.createRow("Range", Range.keys().length, rows.length));
      rows.push(this.createRow("Ship", Ship.keys().length, rows.length));
      rows.push(this.createRow("ShipAction", ShipAction.keys().length, rows.length));
      rows.push(this.createRow("ShipBase", ShipBase.keys().length, rows.length));
      rows.push(this.createRow("ShipFaction", ShipFaction.keys().length, rows.length));
      rows.push(this.createRow("ShipState", ShipState.keys().length, rows.length));
      rows.push(this.createRow("UpgradeCard", UpgradeCard.keys().length, rows.length));
      rows.push(this.createRow("UpgradeHeader", UpgradeHeader.keys().length, rows.length));
      rows.push(this.createRow("UpgradeRestriction", UpgradeRestriction.keys().length, rows.length));
      rows.push(this.createRow("UpgradeType", UpgradeType.keys().length, rows.length));
      rows.push(this.createRow("Value", Value.keys().length, rows.length));

      return Table(
      {
         id: "gameTable",
         className: "bg-white f6",
         columns: GameColumns,
         sortable: true,
      }, rows);
   }
}

GameDataTable.prototype.createCell = function(key, column, value)
{
   return Td(
   {
      key: key,
      className: column.className,
      column: column.key,
   }, (value !== undefined ? value : ""));
};

GameDataTable.prototype.createRow = function(item, count, key)
{
   var cells = [];
   var j = 0;

   cells.push(this.createCell(cells.length, GameColumns[j++], item));
   cells.push(this.createCell(cells.length, GameColumns[j++], count));

   return Tr(
   {
      key: key,
      className: "striped--light-gray",
   }, cells);
};

export default GameDataTable;