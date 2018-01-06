"use strict";

define(["create-react-class", "prop-types", "react", "react-dom-factories", "redux", "common/js/ArrayUtilities", "common/js/InputValidator",
  "artifact/js/PilotCard", "artifact/js/Ship", "artifact/js/ShipState", "artifact/js/ShipFaction", "artifact/js/UpgradeCard", "artifact/js/UpgradeType",
  "view/js/CardImage", "view/js/FactionUI", "view/js/ImplementedImage", "view/js/PilotChooser", "view/js/ShipCardUI", "view/js/ShipChooser", "view/js/SquadColumns", "view/js/ShipStateUI", "view/js/UpgradeChooser", "view/js/UpgradeTypeComparator"],
   function(createReactClass, PropTypes, React, DOM, Redux, ArrayUtilities, InputValidator,
      PilotCard, Ship, ShipState, ShipFaction, UpgradeCard, UpgradeType,
      CardImage, FactionUI, ImplementedImage, PilotChooser, ShipCardUI, ShipChooser, SquadColumns, ShipStateUI, UpgradeChooser, UpgradeTypeComparator)
   {
      var SquadBuilderUI = createReactClass(
      {
         propTypes:
         {
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
         },

         render: function()
         {
            LOGGER.trace("SquadBuilderUI.render()");

            var ships = this.props.ships;
            var pilots = this.props.pilots;
            var rows = [];
            rows.push(this.createHeaderRow("row" + rows.length));

            ships.forEach(function(ship, i)
            {
               rows.push(this.createShipRow(ship, i, "row" + rows.length));

               var pilot = pilots.get(i);
               var upgradeTypeKeys;

               if (pilot && pilot.fore)
               {
                  rows.push(this.createPilotRow(ship, pilot.fore, i, "row" + rows.length));
                  var pilotIndexFore = SquadBuilderUI.computePilotIndexFore(i);
                  upgradeTypeKeys = this.upgradeTypeKeys(pilot.fore, pilotIndexFore);

                  upgradeTypeKeys.forEach(function(upgradeTypeKey, j)
                  {
                     var upgradeType = UpgradeType.properties[upgradeTypeKey];
                     rows.push(this.createUpgradeTypeRow(pilot.fore, pilotIndexFore, upgradeType, j, "row" + rows.length));
                  }, this);

                  rows.push(this.createPilotRow(ship, pilot.aft, i, "row" + rows.length));
                  var pilotIndexAft = SquadBuilderUI.computePilotIndexAft(i);
                  upgradeTypeKeys = this.upgradeTypeKeys(pilot.aft, pilotIndexAft);

                  upgradeTypeKeys.forEach(function(upgradeTypeKey, j)
                  {
                     var upgradeType = UpgradeType.properties[upgradeTypeKey];
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
                        var upgradeType = UpgradeType.properties[upgradeTypeKey];
                        rows.push(this.createUpgradeTypeRow(pilot, i, upgradeType, j, "row" + rows.length));
                     }, this);
                  }
               }
            }, this);

            // Put in an empty ship row.
            rows.push(this.createShipRow(undefined, ships.size, "row" + rows.length));
            rows.push(this.createFooterRow("row" + rows.length));

            var squadUI = DOM.table(
            {
               className: "squadUI bg-xw-light f6 fl",
            }, DOM.tbody(
            {}, rows));

            if (this.props.displayItem !== undefined)
            {
               return DOM.div(
               {}, squadUI, this.createDisplayItemUI());
            }
            else
            {
               return squadUI;
            }

            LOGGER.trace("SquadBuilderUI.render() end");
         },

         createCell: function(key, className, value, onMouseEnter, onMouseLeave)
         {
            return DOM.td(
            {
               key: key,
               className: className,
               onMouseEnter: onMouseEnter,
               onMouseLeave: onMouseLeave,
            }, (value !== undefined ? value : ""));
         },

         createDisplayItemUI: function()
         {
            var answer;
            var displayItem = this.props.displayItem;

            if (displayItem)
            {
               var xwingType = displayItem.xwingType;

               switch (xwingType)
               {
                  case Ship:
                     var faction = this.props.faction;
                     var shipFactionKeys = ShipFaction.keysByShipAndFaction(displayItem.key, faction.key);
                     var shipFactionKey = (shipFactionKeys.length > 0 ? shipFactionKeys[0] : undefined);

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

            SquadColumns.forEach(function(column)
            {
               var value;
               var className = "";

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
                        faction: this.props.faction,
                        resourceBase: this.props.resourceBase,
                        shipState: ShipState.properties[shipStateKey],
                     });
                     className = "alignCenter center";
               }
               cells.push(this.createHeaderCell("headerCell" + cells.length, className + " b--black ba bg-xw-dark white", value));
            }, this);

            return DOM.tr(
            {
               key: key,
            }, cells);
         },

         createPilotRow: function(ship, pilot, index, rowKey)
         {
            InputValidator.validateIsNumber("index", index);
            InputValidator.validateNotNull("rowKey", rowKey);

            var faction = (pilot ? pilot.shipFaction.faction : this.props.faction);
            var pilotChooser, onMouseEnter;
            var that = this;
            var displayItemChanged = this.props.displayItemChanged;

            if (pilot && pilot.parent)
            {
               var image = React.createElement(FactionUI,
               {
                  faction: faction,
                  isSmall: true,
                  resourceBase: this.props.resourceBase,
               });

               pilotChooser = DOM.span(
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

            var cells = [];
            var isImplemented = (pilot ? (pilot.isImplemented === true) : undefined);

            SquadColumns.forEach(function(column)
            {
               var value, mouseFunction;

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
                           var myShip;
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

            return DOM.tr(
            {
               key: rowKey,
            }, cells);
         },

         createShipRow: function(ship, index, rowKey)
         {
            InputValidator.validateIsNumber("index", index);
            InputValidator.validateNotNull("rowKey", rowKey);

            var shipChooser = React.createElement(ShipChooser,
            {
               faction: this.props.faction,
               initialShip: ship,
               onChange: this.shipChanged,
               index: index,
               resourceBase: this.props.resourceBase,
            });

            var that = this;
            var displayItemChanged = this.props.displayItemChanged;
            var onMouseEnter = function()
            {
               LOGGER.debug("onMouseEnter() ship = " + ship);

               if (ship)
               {
                  displayItemChanged(ship);

                  // FIXME
                  that.forceUpdate();
               }
            };

            var cells = [];

            SquadColumns.forEach(function(column)
            {
               var value, mouseFunction;

               switch (column.key)
               {
                  case "pilot":
                     value = shipChooser;
                     mouseFunction = onMouseEnter;
                     break;
               }

               cells.push(this.createCell("shipCell" + cells.length + (ship ? ship.key : ""), "backgroundMedium " + column.className + " ba", value, mouseFunction));
            }, this);

            return DOM.tr(
            {
               key: rowKey,
            }, cells);
         },

         createUpgradeTypeRow: function(pilot, pilotIndex, upgradeType, upgradeIndex, rowKey)
         {
            InputValidator.validateNotNull("pilot", pilot);
            InputValidator.validateIsNumber("pilotIndex", pilotIndex);
            InputValidator.validateNotNull("upgradeType", upgradeType);
            InputValidator.validateIsNumber("upgradeIndex", upgradeIndex);
            InputValidator.validateNotNull("rowKey", rowKey);

            var upgradeCards = this.props.pilotIndexToUpgrades.get(pilotIndex);
            var isVaksai = upgradeCards.reduce(function(accumulator, upgradeCard)
            {
               if (upgradeCard && upgradeCard.key === UpgradeCard.VAKSAI)
               {
                  accumulator = true;
               }
               return accumulator;
            }, false);
            var upgradeCard = upgradeCards.get(upgradeIndex);

            var upgradeChooser = React.createElement(UpgradeChooser,
            {
               initialUpgrade: upgradeCard,
               onChange: this.upgradeChanged,
               pilot: pilot,
               pilotIndex: pilotIndex,
               resourceBase: this.props.resourceBase,
               upgradeIndex: upgradeIndex,
               upgradeType: upgradeType,
            });

            var that = this;
            var displayItemChanged = this.props.displayItemChanged;
            var onMouseEnter = function()
            {
               LOGGER.debug("onMouseEnter() upgradeCard = " + upgradeCard);

               if (upgradeCard)
               {
                  displayItemChanged(upgradeCard);

                  // FIXME
                  that.forceUpdate();
               }
            };

            var cells = [];
            var isImplemented = (upgradeCard ? (upgradeCard.isImplemented === true) : undefined);

            SquadColumns.forEach(function(column)
            {
               var value, mouseFunction;

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

            return DOM.tr(
            {
               key: rowKey,
            }, cells);
         },

         pilotChanged: function(event, pilot, index)
         {
            LOGGER.debug("SquadBuilderUI.pilotChanged() pilot = " + pilot + " index = " + index);

            this.props.pilotChanged(pilot, index);
         },

         shipChanged: function(event, ship, index)
         {
            LOGGER.debug("SquadBuilderUI.shipChanged() ship = " + ship + " index = " + index);

            this.props.shipChanged(ship, index);

            if (ship)
            {
               var faction = this.props.faction;
               var values = PilotCard.keysByShipAndFaction(ship.key, faction.key);
               var pilotKey = values[0];
               var pilot = PilotCard.properties[pilotKey];
               this.props.pilotChanged(pilot, index);
            }
         },

         upgradeChanged: function(event, pilotIndex, upgrade, upgradeIndex)
         {
            LOGGER.debug("SquadBuilderUI.upgradeChanged() pilotIndex = " + pilotIndex + " upgrade = " + upgrade + " upgradeIndex = " + upgradeIndex);

            this.props.pilotUpgradeChanged(pilotIndex, upgrade, upgradeIndex);
         },

         upgradeTypeKeys: function(pilot, pilotIndex)
         {
            InputValidator.validateNotNull("pilot", pilot);
            InputValidator.validateIsNumber("pilotIndex", pilotIndex);

            var answer = pilot.upgradeTypeKeys.slice();

            answer.unshift(UpgradeType.TITLE);
            answer.push(UpgradeType.MODIFICATION);

            var upgrades = this.props.pilotIndexToUpgrades.get(pilotIndex);
            var upgradeKeys = upgrades.map(function(upgrade)
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

            if (upgradeKeys.includes(UpgradeCard.HAVOC))
            {
               answer.push(UpgradeType.SYSTEM);
               answer.push(UpgradeType.SALVAGED_ASTROMECH);
               ArrayUtilities.xwingRemove(answer, UpgradeType.CREW);
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
               ArrayUtilities.xwingRemove(answer, UpgradeType.CARGO);
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
               answer = this.xwingRemoveAll(answer, UpgradeType.TORPEDO);
               answer = this.xwingRemoveAll(answer, UpgradeType.MISSILE);
               answer = this.xwingRemoveAll(answer, UpgradeType.BOMB);
               answer.push(UpgradeType.CREW);
               answer.push(UpgradeType.CREW);
            }

            if (upgradeKeys.includes(UpgradeCard.TIE_X1))
            {
               answer.push(UpgradeType.SYSTEM);
            }

            if (upgradeKeys.includes(UpgradeCard.TIE_X7))
            {
               ArrayUtilities.xwingRemove(answer, UpgradeType.CANNON);
               ArrayUtilities.xwingRemove(answer, UpgradeType.MISSILE);
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

            answer.sort(UpgradeTypeComparator);

            return answer;
         },

         vizziniRemoveAll: function(array, removeElement)
         {
            InputValidator.validateNotNull("array", array);
            InputValidator.validateNotNull("removeElement", removeElement);

            return array.filter(function(element)
            {
               return element !== removeElement;
            });
         }
      });

      SquadBuilderUI.computePilotIndexAft = function(pilotIndex)
      {
         return 200 + pilotIndex;
      };

      SquadBuilderUI.computePilotIndexFore = function(pilotIndex)
      {
         return 100 + pilotIndex;
      };

      return SquadBuilderUI;
   });
