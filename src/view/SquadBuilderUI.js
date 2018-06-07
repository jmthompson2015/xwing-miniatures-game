import ArrayUtilities from "../utility/ArrayUtilities.js";
import InputValidator from "../utility/InputValidator.js";

import PilotCard from "../artifact/PilotCard.js";
import Ship from "../artifact/Ship.js";
import ShipState from "../artifact/ShipState.js";
import ShipFaction from "../artifact/ShipFaction.js";
import UpgradeCard from "../artifact/UpgradeCard.js";
import UpgradeType from "../artifact/UpgradeType.js";

import CardImage from "./CardImage.js";
import FactionUI from "./FactionUI.js";
import ImplementedImage from "./ImplementedImage.js";
import PilotChooser from "./PilotChooser.js";
import ShipCardUI from "./ShipCardUI.js";
import ShipChooser from "./ShipChooser.js";
import SquadColumns from "./SquadColumns.js";
import ShipStateUI from "./ShipStateUI.js";
import UpgradeChooser from "./UpgradeChooser.js";
import UpgradeTypeComparator from "./UpgradeTypeComparator.js";

class SquadBuilderUI extends React.Component
{
   constructor(props)
   {
      super(props);

      this.pilotChanged = this.pilotChangedFunction.bind(this);
      this.shipChanged = this.shipChangedFunction.bind(this);
      this.upgradeChanged = this.upgradeChangedFunction.bind(this);
   }

   render()
   {
      LOGGER.trace("SquadBuilderUI.render()");

      const ships = this.props.ships;
      const pilots = this.props.pilots;
      const rows = [];
      rows.push(this.createHeaderRow("row" + rows.length));

      ships.forEach(function(ship, i)
      {
         rows.push(this.createShipRow(ship, i, "row" + rows.length));

         const pilot = pilots.get(i);
         let upgradeTypeKeys;

         if (pilot && pilot.fore)
         {
            rows.push(this.createPilotRow(ship, pilot.fore, i, "row" + rows.length));
            const pilotIndexFore = SquadBuilderUI.computePilotIndexFore(i);
            upgradeTypeKeys = this.upgradeTypeKeys(pilot.fore, pilotIndexFore);

            upgradeTypeKeys.forEach(function(upgradeTypeKey, j)
            {
               const upgradeType = UpgradeType.properties[upgradeTypeKey];
               rows.push(this.createUpgradeTypeRow(pilot.fore, pilotIndexFore, upgradeType, j, "row" + rows.length));
            }, this);

            rows.push(this.createPilotRow(ship, pilot.aft, i, "row" + rows.length));
            const pilotIndexAft = SquadBuilderUI.computePilotIndexAft(i);
            upgradeTypeKeys = this.upgradeTypeKeys(pilot.aft, pilotIndexAft);

            upgradeTypeKeys.forEach(function(upgradeTypeKey, j)
            {
               const upgradeType = UpgradeType.properties[upgradeTypeKey];
               rows.push(this.createUpgradeTypeRow(pilot.aft, pilotIndexAft, upgradeType, j, "row" + rows.length));
            }, this);
         }
         else
         {
            rows.push(this.createPilotRow(ship, pilot, i, "row" + rows.length));

            if (pilot)
            {
               upgradeTypeKeys = this.upgradeTypeKeys(pilot, i);

               upgradeTypeKeys.forEach(function(upgradeTypeKey, j)
               {
                  const upgradeType = UpgradeType.properties[upgradeTypeKey];
                  rows.push(this.createUpgradeTypeRow(pilot, i, upgradeType, j, "row" + rows.length));
               }, this);
            }
         }
      }, this);

      // Put in an empty ship row.
      rows.push(this.createShipRow(undefined, ships.size, "row" + rows.length));
      rows.push(this.createFooterRow("row" + rows.length));

      const squadUI = ReactDOMFactories.table(
      {
         className: "squadUI bg-xw-light f6 fl",
      }, ReactDOMFactories.tbody(
      {}, rows));

      if (this.props.displayItem !== undefined)
      {
         return ReactDOMFactories.div(
         {}, squadUI, this.createDisplayItemUI());
      }
      else
      {
         return squadUI;
      }

      LOGGER.trace("SquadBuilderUI.render() end");
   }
}

SquadBuilderUI.prototype.createCell = function(key, className, value, onMouseEnter, onMouseLeave)
{
   return ReactDOMFactories.td(
   {
      key: key,
      className: className,
      onMouseEnter: onMouseEnter,
      onMouseLeave: onMouseLeave,
   }, (value !== undefined ? value : ""));
};

SquadBuilderUI.prototype.createDisplayItemUI = function()
{
   let answer;
   const displayItem = this.props.displayItem;

   if (displayItem)
   {
      const xwingType = displayItem.xwingType;

      switch (xwingType)
      {
         case Ship:
            const faction = this.props.faction;
            const shipFactionKeys = ShipFaction.keysByShipAndFaction(displayItem.key, faction.key);
            const shipFactionKey = (shipFactionKeys.length > 0 ? shipFactionKeys[0] : undefined);

            answer = React.createElement(ShipCardUI,
            {
               key: "shipCard" + displayItem.key,
               className: "shipCardUI fl",
               resourceBase: this.props.resourceBase,
               shipFaction: ShipFaction.properties[shipFactionKey],
            });
            break;
         case PilotCard:
            answer = React.createElement(CardImage,
            {
               key: "pilotCard" + displayItem.key,
               card: displayItem,
               className: "pilotCardImage fl",
               resourceBase: this.props.resourceBase,
               width: 250,
            });
            break;
         case UpgradeCard:
            answer = React.createElement(CardImage,
            {
               key: "upgradeCard" + displayItem.key,
               card: displayItem,
               className: "upgradeCardImage fl",
               resourceBase: this.props.resourceBase,
               width: 178,
            });
            break;
      }
   }

   return answer;
};

SquadBuilderUI.prototype.createFooterRow = function(key)
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

SquadBuilderUI.prototype.createHeaderCell = function(key, className, value)
{
   return ReactDOMFactories.th(
   {
      key: key,
      className: className,
   }, (value !== undefined ? value : ""));
};

SquadBuilderUI.prototype.createHeaderRow = function(key)
{
   const cells = [];

   SquadColumns.forEach(function(column)
   {
      let value;
      let className = "";

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
               faction: this.props.faction,
               resourceBase: this.props.resourceBase,
               shipState: ShipState.properties[shipStateKey],
            });
            className = "alignCenter center";
      }
      cells.push(this.createHeaderCell("headerCell" + cells.length, className + " b--black ba bg-xw-dark white", value));
   }, this);

   return ReactDOMFactories.tr(
   {
      key: key,
   }, cells);
};

SquadBuilderUI.prototype.createPilotRow = function(ship, pilot, index, rowKey)
{
   InputValidator.validateIsNumber("index", index);
   InputValidator.validateNotNull("rowKey", rowKey);

   const faction = (pilot ? pilot.shipFaction.faction : this.props.faction);
   let pilotChooser, onMouseEnter;
   const that = this;
   const displayItemChanged = this.props.displayItemChanged;

   if (pilot && pilot.parent)
   {
      const image = React.createElement(FactionUI,
      {
         faction: faction,
         isSmall: true,
         resourceBase: this.props.resourceBase,
      });

      pilotChooser = ReactDOMFactories.span(
      {}, image, " ", pilot.name);

      onMouseEnter = function()
      {
         LOGGER.debug("onMouseEnter() pilot = " + pilot);

         if (pilot)
         {
            displayItemChanged(pilot);

            // FIXME
            that.forceUpdate();
         }
      };
   }
   else
   {
      if (ship)
      {
         pilotChooser = React.createElement(PilotChooser,
         {
            onChange: this.pilotChanged,
            faction: faction,
            index: index,
            initialPilot: pilot,
            resourceBase: this.props.resourceBase,
            ship: ship,
         });

         onMouseEnter = function()
         {
            LOGGER.debug("onMouseEnter() pilot = " + pilot);

            if (pilot)
            {
               displayItemChanged(pilot);

               // FIXME
               that.forceUpdate();
            }
         };
      }
   }

   const cells = [];
   const isImplemented = (pilot ? (pilot.isImplemented === true) : undefined);

   SquadColumns.forEach(function(column)
   {
      let value, mouseFunction;

      switch (column.key)
      {
         case "pilot":
            value = pilotChooser;
            mouseFunction = onMouseEnter;
            break;
         case "isImplemented":
            value = React.createElement(ImplementedImage,
            {
               resourceBase: this.props.resourceBase,
               isImplemented: isImplemented,
            });
            break;
         default:
            if (ship && pilot)
            {
               if (!ship.fore)
               {
                  value = (pilot && pilot[column.key] !== undefined ? pilot[column.key] : ship[column.key]);
               }
               else if (ship.fore && !pilot.parent)
               {
                  value = (pilot && pilot[column.key] !== undefined ? pilot[column.key] : ship.fore[column.key]);
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
                  value = (pilot && pilot[column.key] !== undefined ? pilot[column.key] : myShip[column.key]);
               }
            }
      }

      cells.push(this.createCell("pilotCell" + cells.length + (pilot ? pilot.key : ""), column.className + " ba", value, mouseFunction));
   }, this);

   return ReactDOMFactories.tr(
   {
      key: rowKey,
   }, cells);
};

SquadBuilderUI.prototype.createShipRow = function(ship, index, rowKey)
{
   InputValidator.validateIsNumber("index", index);
   InputValidator.validateNotNull("rowKey", rowKey);

   const shipChooser = React.createElement(ShipChooser,
   {
      faction: this.props.faction,
      initialShip: ship,
      onChange: this.shipChanged,
      index: index,
      resourceBase: this.props.resourceBase,
   });

   const that = this;
   const displayItemChanged = this.props.displayItemChanged;
   const onMouseEnter = function()
   {
      LOGGER.debug("onMouseEnter() ship = " + ship);

      if (ship)
      {
         displayItemChanged(ship);

         // FIXME
         that.forceUpdate();
      }
   };

   const cells = [];

   SquadColumns.forEach(function(column)
   {
      let value, mouseFunction;

      switch (column.key)
      {
         case "pilot":
            value = shipChooser;
            mouseFunction = onMouseEnter;
            break;
      }

      cells.push(this.createCell("shipCell" + cells.length + (ship ? ship.key : ""), "backgroundMedium " + column.className + " ba", value, mouseFunction));
   }, this);

   return ReactDOMFactories.tr(
   {
      key: rowKey,
   }, cells);
};

SquadBuilderUI.prototype.createUpgradeTypeRow = function(pilot, pilotIndex, upgradeType, upgradeIndex, rowKey)
{
   InputValidator.validateNotNull("pilot", pilot);
   InputValidator.validateIsNumber("pilotIndex", pilotIndex);
   InputValidator.validateNotNull("upgradeType", upgradeType);
   InputValidator.validateIsNumber("upgradeIndex", upgradeIndex);
   InputValidator.validateNotNull("rowKey", rowKey);

   const upgradeCards = this.props.pilotIndexToUpgrades.get(pilotIndex);
   const isVaksai = upgradeCards.reduce(function(accumulator, upgradeCard)
   {
      if (upgradeCard && upgradeCard.key === UpgradeCard.VAKSAI)
      {
         accumulator = true;
      }
      return accumulator;
   }, false);
   const upgradeCard = upgradeCards.get(upgradeIndex);

   const upgradeChooser = React.createElement(UpgradeChooser,
   {
      initialUpgrade: upgradeCard,
      onChange: this.upgradeChanged,
      pilot: pilot,
      pilotIndex: pilotIndex,
      resourceBase: this.props.resourceBase,
      upgradeIndex: upgradeIndex,
      upgradeType: upgradeType,
   });

   const that = this;
   const displayItemChanged = this.props.displayItemChanged;
   const onMouseEnter = function()
   {
      LOGGER.debug("onMouseEnter() upgradeCard = " + upgradeCard);

      if (upgradeCard)
      {
         displayItemChanged(upgradeCard);

         // FIXME
         that.forceUpdate();
      }
   };

   const cells = [];
   const isImplemented = (upgradeCard ? (upgradeCard.isImplemented === true) : undefined);

   SquadColumns.forEach(function(column)
   {
      let value, mouseFunction;

      switch (column.key)
      {
         case "pilot":
            value = upgradeChooser;
            mouseFunction = onMouseEnter;
            break;
         case "isImplemented":
            value = React.createElement(ImplementedImage,
            {
               resourceBase: this.props.resourceBase,
               isImplemented: isImplemented,
            });
            break;
         case "squadPointCost":
            if (upgradeCard && upgradeCard[column.key] !== undefined)
            {
               value = upgradeCard[column.key];
               value = (isVaksai ? Math.max(0, value - 1) : value);
            }
            break;
         default:
            value = (upgradeCard && upgradeCard[column.key] !== undefined ? upgradeCard[column.key] : undefined);
      }
      cells.push(this.createCell("upgradeCell" + cells.length + upgradeType.key, column.className + " ba", value, mouseFunction));
   }, this);

   return ReactDOMFactories.tr(
   {
      key: rowKey,
   }, cells);
};

SquadBuilderUI.prototype.pilotChangedFunction = function(event, pilot, index)
{
   LOGGER.debug("SquadBuilderUI.pilotChanged() pilot = " + pilot + " index = " + index);

   this.props.pilotChanged(pilot, index);
};

SquadBuilderUI.prototype.shipChangedFunction = function(event, ship, index)
{
   LOGGER.debug("SquadBuilderUI.shipChanged() ship = " + ship + " index = " + index);

   this.props.shipChanged(ship, index);

   if (ship)
   {
      const faction = this.props.faction;
      const values = PilotCard.keysByShipAndFaction(ship.key, faction.key);
      const pilotKey = values[0];
      const pilot = PilotCard.properties[pilotKey];
      this.props.pilotChanged(pilot, index);
   }
};

SquadBuilderUI.prototype.upgradeChangedFunction = function(event, pilotIndex, upgrade, upgradeIndex)
{
   LOGGER.debug("SquadBuilderUI.upgradeChanged() pilotIndex = " + pilotIndex + " upgrade = " + upgrade + " upgradeIndex = " + upgradeIndex);

   this.props.pilotUpgradeChanged(pilotIndex, upgrade, upgradeIndex);
};

SquadBuilderUI.prototype.upgradeTypeKeys = function(pilot, pilotIndex)
{
   InputValidator.validateNotNull("pilot", pilot);
   InputValidator.validateIsNumber("pilotIndex", pilotIndex);

   let answer = pilot.upgradeTypeKeys.slice();

   answer.unshift(UpgradeType.TITLE);
   answer.push(UpgradeType.MODIFICATION);

   const upgrades = this.props.pilotIndexToUpgrades.get(pilotIndex);
   const upgradeKeys = upgrades.map(function(upgrade)
   {
      return (upgrade ? upgrade.key : undefined);
   });

   if (upgradeKeys.includes(UpgradeCard.A_WING_TEST_PILOT))
   {
      answer.push(UpgradeType.ELITE);
   }

   if (upgradeKeys.includes(UpgradeCard.ANDRASTA))
   {
      answer.push(UpgradeType.BOMB);
      answer.push(UpgradeType.BOMB);
   }

   if (upgradeKeys.includes(UpgradeCard.BOMB_LOADOUT))
   {
      answer.push(UpgradeType.BOMB);
   }

   if (upgradeKeys.includes(UpgradeCard.B_WING_E2))
   {
      answer.push(UpgradeType.CREW);
   }

   if (upgradeKeys.includes(UpgradeCard.CAD_BANE))
   {
      answer.push(UpgradeType.BOMB);
   }

   if (upgradeKeys.includes(UpgradeCard.HAVOC))
   {
      answer.push(UpgradeType.SYSTEM);
      // FIXME: You cannot equip non-unique [Salvaged Astromech] Upgrade cards.
      answer.push(UpgradeType.SALVAGED_ASTROMECH);
      ArrayUtilities.remove(answer, UpgradeType.CREW);
   }

   if (upgradeKeys.includes(UpgradeCard.HEAVY_SCYK_INTERCEPTOR))
   {
      // FIXME: this is an OR not an AND.
      answer.push(UpgradeType.CANNON);
      answer.push(UpgradeType.TORPEDO);
      answer.push(UpgradeType.MISSILE);
   }

   if (upgradeKeys.includes(UpgradeCard.MERCHANT_ONE))
   {
      answer.push(UpgradeType.CREW);
      answer.push(UpgradeType.TEAM);
      ArrayUtilities.remove(answer, UpgradeType.CARGO);
   }

   if (upgradeKeys.includes(UpgradeCard.R2_D6))
   {
      answer.push(UpgradeType.ELITE);
   }

   if (upgradeKeys.includes(UpgradeCard.SABINES_MASTERPIECE))
   {
      answer.push(UpgradeType.CREW);
      answer.push(UpgradeType.ILLICIT);
   }

   if (upgradeKeys.includes(UpgradeCard.SABINE_WREN))
   {
      answer.push(UpgradeType.BOMB);
   }

   if (upgradeKeys.includes(UpgradeCard.SLAVE_I))
   {
      answer.push(UpgradeType.TORPEDO);
   }

   if (upgradeKeys.includes(UpgradeCard.SMUGGLING_COMPARTMENT))
   {
      answer.push(UpgradeType.ILLICIT);
      // FIXME: You may equip 1 additional Modification upgrade that costs 3 or fewer squad points.
      answer.push(UpgradeType.MODIFICATION);
   }

   if (upgradeKeys.includes(UpgradeCard.STAR_VIPER_MKII))
   {
      answer.push(UpgradeType.TITLE);
   }

   if (upgradeKeys.includes(UpgradeCard.TANTIVE_IV))
   {
      answer.push(UpgradeType.CREW);
      answer.push(UpgradeType.TEAM);
   }

   if (upgradeKeys.includes(UpgradeCard.TIE_SHUTTLE))
   {
      answer = this.removeAll(answer, UpgradeType.TORPEDO);
      answer = this.removeAll(answer, UpgradeType.MISSILE);
      answer = this.removeAll(answer, UpgradeType.BOMB);
      // FIXME: You cannot equip a [Crew] Upgrade card that costs more than 4 squad points.
      answer.push(UpgradeType.CREW);
      answer.push(UpgradeType.CREW);
   }

   if (upgradeKeys.includes(UpgradeCard.TIE_X1))
   {
      // FIXME: If you equip a [System] upgrade, its squad point cost is reduced by 4 (to a minimum of 0).
      answer.push(UpgradeType.SYSTEM);
   }

   if (upgradeKeys.includes(UpgradeCard.TIE_X7))
   {
      ArrayUtilities.remove(answer, UpgradeType.CANNON);
      ArrayUtilities.remove(answer, UpgradeType.MISSILE);
   }

   if (upgradeKeys.includes(UpgradeCard.VAKSAI))
   {
      answer.push(UpgradeType.MODIFICATION);
      answer.push(UpgradeType.MODIFICATION);
   }

   if (upgradeKeys.includes(UpgradeCard.VIRAGO))
   {
      answer.push(UpgradeType.SYSTEM);
      answer.push(UpgradeType.ILLICIT);
   }

   if (upgradeKeys.includes(UpgradeCard.XG_1_ASSAULT_CONFIGURATION))
   {
      answer.push(UpgradeType.CANNON);
      answer.push(UpgradeType.CANNON);
   }

   answer.sort(UpgradeTypeComparator);

   return answer;
};

SquadBuilderUI.prototype.vizziniRemoveAll = function(array, removeElement)
{
   InputValidator.validateNotNull("array", array);
   InputValidator.validateNotNull("removeElement", removeElement);

   return array.filter(function(element)
   {
      return element !== removeElement;
   });
};

SquadBuilderUI.computePilotIndexAft = function(pilotIndex)
{
   return 200 + pilotIndex;
};

SquadBuilderUI.computePilotIndexFore = function(pilotIndex)
{
   return 100 + pilotIndex;
};

SquadBuilderUI.propTypes = {
   faction: PropTypes.object.isRequired,
   pilotIndexToUpgrades: PropTypes.object.isRequired,
   pilots: PropTypes.object.isRequired,
   resourceBase: PropTypes.string.isRequired,
   ships: PropTypes.object.isRequired,

   // callbacks
   displayItemChanged: PropTypes.func.isRequired,
   pilotChanged: PropTypes.func.isRequired,
   pilotUpgradeChanged: PropTypes.func.isRequired,
   shipChanged: PropTypes.func.isRequired,

   displayItem: PropTypes.object,
   squad: PropTypes.object,
};

export default SquadBuilderUI;