import InputValidator from "../utility/InputValidator.js";

import ShipState from "../artifact/ShipState.js";
import Faction from "../artifact/Faction.js";
import UpgradeCard from "../artifact/UpgradeCard.js";

import EntityUI from "./EntityUI.js";
import ImplementedImage from "./ImplementedImage.js";
import ShipStateUI from "./ShipStateUI.js";
import SquadColumns from "./SquadColumns.js";

class SquadUI extends React.Component
{
   render()
   {
      LOGGER.trace("SquadUI.render()");

      const squad = this.props.squad;
      const tokens = squad.tokens();
      const rows = [];
      rows.push(this.createHeaderRow("row" + rows.length));

      tokens.forEach(function(token, i)
      {
         const pilot = token.card();
         const ship = pilot.shipFaction.ship;
         rows.push(this.createShipRow(ship, i, "row" + rows.length));

         let upgradeKeys;

         if (pilot.fore)
         {
            rows.push(this.createPilotRow(ship, pilot.fore, i, "row" + rows.length));
            upgradeKeys = token.tokenFore().upgradeKeys();

            upgradeKeys.forEach(function(upgradeKey, j)
            {
               const upgradeCard = UpgradeCard.properties[upgradeKey];
               rows.push(this.createUpgradeTypeRow(upgradeCard, j, "row" + rows.length));
            }, this);

            rows.push(this.createPilotRow(ship, pilot.aft, i, "row" + rows.length));
            upgradeKeys = token.tokenAft().upgradeKeys();

            upgradeKeys.forEach(function(upgradeKey, j)
            {
               const upgradeCard = UpgradeCard.properties[upgradeKey];
               rows.push(this.createUpgradeTypeRow(upgradeCard, j, "row" + rows.length));
            }, this);
         }
         else
         {
            rows.push(this.createPilotRow(ship, pilot, i, "row" + rows.length));
            upgradeKeys = token.upgradeKeys();

            upgradeKeys.forEach(function(upgradeKey, j)
            {
               const upgradeCard = UpgradeCard.properties[upgradeKey];
               rows.push(this.createUpgradeTypeRow(upgradeCard, j, "row" + rows.length));
            }, this);
         }
      }, this);

      rows.push(this.createFooterRow("row" + rows.length));

      const squadUI = ReactDOMFactories.table(
      {
         className: "squadUI ba b--black bg-xw-light fl f6",
      }, ReactDOMFactories.tbody(
      {}, rows));

      LOGGER.trace("SquadUI.render() end");

      return squadUI;
   }
}

SquadUI.prototype.createCell = function(key, className, value)
{
   return ReactDOMFactories.td(
   {
      key: key,
      className: className,
   }, (value !== undefined ? value : ""));
};

SquadUI.prototype.createFooterRow = function(key)
{
   const cells = [];
   const squad = this.props.squad;

   SquadColumns.forEach(function(column)
   {
      let value = 0;
      let className = "squadUISum ba bg-xw-medium";

      switch (column.key)
      {
         case "pilot":
            value = "Totals";
            className += " alignRight tr";
            break;
         case "isImplemented":
            value = undefined;
            break;
         default:
            if (squad)
            {
               const valueFunction = squad[column.key];
               value = valueFunction.apply(squad);
            }
            className += " alignRight tr";
      }

      cells.push(this.createCell("footerCell" + cells.length, className, value));
   }, this);

   return ReactDOMFactories.tr(
   {
      key: key,
   }, cells);
};

SquadUI.prototype.createHeaderCell = function(key, className, value)
{
   return ReactDOMFactories.th(
   {
      key: key,
      className: className,
   }, (value !== undefined ? value : ""));
};

SquadUI.prototype.createHeaderRow = function(key)
{
   const cells = [];
   const squad = this.props.squad;
   const faction = Faction.properties[squad.factionKey()];

   SquadColumns.forEach(function(column)
   {
      let value, className;

      switch (column.key)
      {
         case "pilot":
         case "isImplemented":
         case "pilotSkillValue":
         case "squadPointCost":
            value = column.label;
            break;
         default:
            const shipStateKey = column.key.substring(0, column.key.length - "Value".length);
            value = React.createElement(ShipStateUI,
            {
               faction: faction,
               resourceBase: this.props.resourceBase,
               shipState: ShipState.properties[shipStateKey],
            });
            className = "alignCenter tc";
      }
      cells.push(this.createHeaderCell("headerCell" + cells.length, className + " ba b--black bg-xw-dark pa1 white", value));
   }, this);

   return ReactDOMFactories.tr(
   {
      key: key,
   }, cells);
};

SquadUI.prototype.createPilotRow = function(ship, pilot, index, rowKey)
{
   InputValidator.validateNotNull("ship", ship);
   InputValidator.validateNotNull("pilot", pilot);
   InputValidator.validateIsNumber("index", index);
   InputValidator.validateNotNull("rowKey", rowKey);

   const pilotUI = React.createElement(EntityUI,
   {
      entity: pilot,
      resourceBase: this.props.resourceBase,
      showImplemented: false,
   });

   const cells = [];
   const isImplemented = (pilot ? (pilot.isImplemented === true) : undefined);

   SquadColumns.forEach(function(column)
   {
      let value;

      switch (column.key)
      {
         case "pilot":
            value = pilotUI;
            break;
         case "isImplemented":
            value = React.createElement(ImplementedImage,
            {
               resourceBase: this.props.resourceBase,
               isImplemented: isImplemented,
            });
            break;
         default:
            if (!ship.fore)
            {
               value = (pilot[column.key] !== undefined ? pilot[column.key] : ship[column.key]);
            }
            else if (ship.fore && !pilot.parent)
            {
               value = (pilot[column.key] !== undefined ? pilot[column.key] : ship.fore[column.key]);
            }
            else
            {
               let myShip;
               if (pilot.key.endsWith(".fore"))
               {
                  myShip = ship.fore;
               }
               else if (pilot.key.endsWith(".aft"))
               {
                  myShip = ship.aft;
               }
               value = (pilot[column.key] !== undefined ? pilot[column.key] : myShip[column.key]);
            }
      }

      cells.push(this.createCell("pilotCell" + cells.length + (pilot ? pilot.key : ""), column.className + " ba pa1", value));
   }, this);

   return ReactDOMFactories.tr(
   {
      key: rowKey,
   }, cells);
};

SquadUI.prototype.createShipRow = function(ship, index, rowKey)
{
   InputValidator.validateNotNull("ship", ship);
   InputValidator.validateIsNumber("index", index);
   InputValidator.validateNotNull("rowKey", rowKey);

   const shipUI = React.createElement(EntityUI,
   {
      entity: ship,
      resourceBase: this.props.resourceBase,
      showImplemented: false,
   });

   const cells = [];

   SquadColumns.forEach(function(column)
   {
      let value;

      switch (column.key)
      {
         case "pilot":
            value = shipUI;
            break;
      }

      cells.push(this.createCell("shipCell" + cells.length + (ship ? ship.key : ""), "backgroundMedium bg-xw-medium " + column.className + " pa1", value));
   }, this);

   return ReactDOMFactories.tr(
   {
      key: rowKey,
   }, cells);
};

SquadUI.prototype.createUpgradeTypeRow = function(upgradeCard, upgradeIndex, rowKey)
{
   InputValidator.validateNotNull("upgradeCard", upgradeCard);
   InputValidator.validateIsNumber("upgradeIndex", upgradeIndex);
   InputValidator.validateNotNull("rowKey", rowKey);

   const upgradeUI = React.createElement(EntityUI,
   {
      entity: upgradeCard,
      resourceBase: this.props.resourceBase,
      showImplemented: false,
   });

   const cells = [];
   const isImplemented = (upgradeCard ? (upgradeCard.isImplemented === true) : undefined);

   SquadColumns.forEach(function(column)
   {
      let value;

      switch (column.key)
      {
         case "pilot":
            value = upgradeUI;
            break;
         case "isImplemented":
            value = React.createElement(ImplementedImage,
            {
               resourceBase: this.props.resourceBase,
               isImplemented: isImplemented,
            });
            break;
         default:
            value = (upgradeCard && upgradeCard[column.key] !== undefined ? upgradeCard[column.key] : undefined);
      }
      cells.push(this.createCell("upgradeCell" + cells.length + upgradeCard.key, column.className + " ba pa1", value));
   }, this);

   return ReactDOMFactories.tr(
   {
      key: rowKey,
   }, cells);
};

SquadUI.propTypes = {
   resourceBase: PropTypes.string.isRequired,
   squad: PropTypes.object.isRequired,
};

export default SquadUI;