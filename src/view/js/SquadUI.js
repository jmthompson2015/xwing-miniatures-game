"use strict";

define(["create-react-class", "prop-types", "react", "react-dom-factories", "common/js/InputValidator",
  "artifact/js/ShipState", "artifact/js/Faction", "artifact/js/UpgradeCard",
  "view/js/EntityUI", "view/js/ImplementedImage", "view/js/ShipStateUI", "view/js/SquadColumns"],
   function(createReactClass, PropTypes, React, DOM, InputValidator,
      ShipState, Faction, UpgradeCard,
      EntityUI, ImplementedImage, ShipStateUI, SquadColumns)
   {
      var SquadUI = createReactClass(
      {
         propTypes:
         {
            resourceBase: PropTypes.string.isRequired,
            squad: PropTypes.object.isRequired,
         },

         render: function()
         {
            LOGGER.trace("SquadUI.render()");

            var squad = this.props.squad;
            var tokens = squad.tokens();
            var rows = [];
            rows.push(this.createHeaderRow("row" + rows.length));

            tokens.forEach(function(token, i)
            {
               var pilot = token.card();
               var ship = pilot.shipFaction.ship;
               rows.push(this.createShipRow(ship, i, "row" + rows.length));

               var upgradeKeys;

               if (pilot.fore)
               {
                  rows.push(this.createPilotRow(ship, pilot.fore, i, "row" + rows.length));
                  upgradeKeys = token.tokenFore().upgradeKeys();

                  upgradeKeys.forEach(function(upgradeKey, j)
                  {
                     var upgradeCard = UpgradeCard.properties[upgradeKey];
                     rows.push(this.createUpgradeTypeRow(upgradeCard, j, "row" + rows.length));
                  }, this);

                  rows.push(this.createPilotRow(ship, pilot.aft, i, "row" + rows.length));
                  upgradeKeys = token.tokenAft().upgradeKeys();

                  upgradeKeys.forEach(function(upgradeKey, j)
                  {
                     var upgradeCard = UpgradeCard.properties[upgradeKey];
                     rows.push(this.createUpgradeTypeRow(upgradeCard, j, "row" + rows.length));
                  }, this);
               }
               else
               {
                  rows.push(this.createPilotRow(ship, pilot, i, "row" + rows.length));
                  upgradeKeys = token.upgradeKeys();

                  upgradeKeys.forEach(function(upgradeKey, j)
                  {
                     var upgradeCard = UpgradeCard.properties[upgradeKey];
                     rows.push(this.createUpgradeTypeRow(upgradeCard, j, "row" + rows.length));
                  }, this);
               }
            }, this);

            rows.push(this.createFooterRow("row" + rows.length));

            var squadUI = DOM.table(
            {
               className: "squadUI ba b--black bg-xw-light fl f6",
            }, DOM.tbody(
            {}, rows));

            LOGGER.trace("SquadUI.render() end");

            return squadUI;
         },

         createCell: function(key, className, value)
         {
            return DOM.td(
            {
               key: key,
               className: className,
            }, (value !== undefined ? value : ""));
         },

         createFooterRow: function(key)
         {
            var cells = [];
            var squad = this.props.squad;

            SquadColumns.forEach(function(column)
            {
               var value = 0;
               var className = "squadUISum ba bg-xw-medium";

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
                        var valueFunction = squad[column.key];
                        value = valueFunction.apply(squad);
                     }
                     className += " alignRight tr";
               }

               cells.push(this.createCell("footerCell" + cells.length, className, value));
            }, this);

            return DOM.tr(
            {
               key: key,
            }, cells);
         },

         createHeaderCell: function(key, className, value)
         {
            return DOM.th(
            {
               key: key,
               className: className,
            }, (value !== undefined ? value : ""));
         },

         createHeaderRow: function(key)
         {
            var cells = [];
            var squad = this.props.squad;
            var faction = Faction.properties[squad.factionKey()];

            SquadColumns.forEach(function(column)
            {
               var value, className;

               switch (column.key)
               {
                  case "pilot":
                  case "isImplemented":
                  case "pilotSkillValue":
                  case "squadPointCost":
                     value = column.label;
                     break;
                  default:
                     var shipStateKey = column.key.substring(0, column.key.length - "Value".length);
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

            return DOM.tr(
            {
               key: key,
            }, cells);
         },

         createPilotRow: function(ship, pilot, index, rowKey)
         {
            InputValidator.validateNotNull("ship", ship);
            InputValidator.validateNotNull("pilot", pilot);
            InputValidator.validateIsNumber("index", index);
            InputValidator.validateNotNull("rowKey", rowKey);

            var pilotUI = React.createElement(EntityUI,
            {
               entity: pilot,
               resourceBase: this.props.resourceBase,
               showImplemented: false,
            });

            var cells = [];
            var isImplemented = (pilot ? (pilot.isImplemented === true) : undefined);

            SquadColumns.forEach(function(column)
            {
               var value;

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
                        var myShip;
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

            return DOM.tr(
            {
               key: rowKey,
            }, cells);
         },

         createShipRow: function(ship, index, rowKey)
         {
            InputValidator.validateNotNull("ship", ship);
            InputValidator.validateIsNumber("index", index);
            InputValidator.validateNotNull("rowKey", rowKey);

            var shipUI = React.createElement(EntityUI,
            {
               entity: ship,
               resourceBase: this.props.resourceBase,
               showImplemented: false,
            });

            var cells = [];

            SquadColumns.forEach(function(column)
            {
               var value;

               switch (column.key)
               {
                  case "pilot":
                     value = shipUI;
                     break;
               }

               cells.push(this.createCell("shipCell" + cells.length + (ship ? ship.key : ""), "backgroundMedium bg-xw-medium " + column.className + " pa1", value));
            }, this);

            return DOM.tr(
            {
               key: rowKey,
            }, cells);
         },

         createUpgradeTypeRow: function(upgradeCard, upgradeIndex, rowKey)
         {
            InputValidator.validateNotNull("upgradeCard", upgradeCard);
            InputValidator.validateIsNumber("upgradeIndex", upgradeIndex);
            InputValidator.validateNotNull("rowKey", rowKey);

            var upgradeUI = React.createElement(EntityUI,
            {
               entity: upgradeCard,
               resourceBase: this.props.resourceBase,
               showImplemented: false,
            });

            var cells = [];
            var isImplemented = (upgradeCard ? (upgradeCard.isImplemented === true) : undefined);

            SquadColumns.forEach(function(column)
            {
               var value;

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

            return DOM.tr(
            {
               key: rowKey,
            }, cells);
         },
      });

      return SquadUI;
   });
