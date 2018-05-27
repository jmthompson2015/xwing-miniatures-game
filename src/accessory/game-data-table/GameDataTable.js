"use strict";

define(["create-react-class", "react", "artifact/AttackDiceValue", "artifact/Bearing", "artifact/ConditionCard", "artifact/Count", "artifact/DamageCard",
  "artifact/DamageCardTrait", "artifact/DefenseDiceValue", "artifact/DiceModification", "artifact/Difficulty",
  "artifact/Event", "artifact/Faction", "artifact/FiringArc", "artifact/Maneuver", "artifact/Phase",
  "artifact/PilotCard", "artifact/PlayFormat", "artifact/Range", "artifact/Ship", "artifact/ShipAction",
  "artifact/ShipBase", "artifact/ShipFaction", "artifact/ShipState", "artifact/UpgradeCard", "artifact/UpgradeHeader",
  "artifact/UpgradeRestriction", "artifact/UpgradeType", "artifact/Value"],
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
            className: "textCell tl",
         },
         {
            key: "count",
            label: "Count",
            className: "numberCell tr",
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
               className: "bg-white f6",
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
               className: "striped--light-gray",
            }, cells);
         },
      });

      return GameDataTable;
   });
