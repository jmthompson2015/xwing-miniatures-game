"use strict";

define(["create-react-class", "react", "artifact/js/AttackDiceValue", "artifact/js/Bearing", "artifact/js/ConditionCard", "artifact/js/Count", "artifact/js/DamageCard",
  "artifact/js/DamageCardTrait", "artifact/js/DefenseDiceValue", "artifact/js/DiceModification", "artifact/js/Difficulty",
  "artifact/js/Event", "artifact/js/Faction", "artifact/js/FiringArc", "artifact/js/Maneuver", "artifact/js/Phase",
  "artifact/js/PilotCard", "artifact/js/PlayFormat", "artifact/js/Range", "artifact/js/Ship", "artifact/js/ShipAction",
  "artifact/js/ShipBase", "artifact/js/ShipFaction", "artifact/js/ShipState", "artifact/js/UpgradeCard", "artifact/js/UpgradeHeader",
  "artifact/js/UpgradeRestriction", "artifact/js/UpgradeType", "artifact/js/Value"],
   function(createReactClass, React, AttackDiceValue, Bearing, ConditionCard, Count, DamageCard,
      DamageCardTrait, DefenseDiceValue, DiceModification, Difficulty,
      Event, Faction, FiringArc, Maneuver, Phase,
      PilotCard, PlayFormat, Range, Ship, ShipAction,
      ShipBase, ShipFaction, ShipState, UpgradeCard, UpgradeHeader,
      UpgradeRestriction, UpgradeType, Value)
   {
      var GameColumns = [
         {
            key: "item",
            label: "Item",
            className: "textCell",
         },
         {
            key: "count",
            label: "Count",
            className: "numberCell",
         },
      ];

      var GameDataTable = createReactClass(
      {
         // Factories.
         Table: React.createFactory(Reactable.Table),
         Tr: React.createFactory(Reactable.Tr),
         Td: React.createFactory(Reactable.Td),

         render: function()
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

            return this.Table(
            {
               id: "gameTable",
               columns: GameColumns,
               sortable: true,
            }, rows);
         },

         createCell: function(key, column, value)
         {
            return this.Td(
            {
               key: key,
               className: column.className,
               column: column.key,
            }, (value !== undefined ? value : ""));
         },

         createRow: function(item, count, key)
         {
            var cells = [];
            var j = 0;

            cells.push(this.createCell(cells.length, GameColumns[j++], item));
            cells.push(this.createCell(cells.length, GameColumns[j++], count));

            return this.Tr(
            {
               key: key,
            }, cells);
         },
      });

      return GameDataTable;
   });
