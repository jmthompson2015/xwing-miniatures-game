"use strict";

define(["create-react-class", "prop-types", "react", "react-dom-factories",
  "artifact/js/Count", "artifact/js/DamageCard", "artifact/js/ShipState", "artifact/js/UpgradeCard",
  "view/js/EntityUI", "view/js/FactionUI", "view/js/LabeledImage", "view/js/ShipStateUI"],
   function(createReactClass, PropTypes, React, DOM,
      Count, DamageCard, ShipState, UpgradeCard,
      EntityUI, FactionUI, LabeledImage, ShipStateUI)
   {
      var PilotCardCompactUI = createReactClass(
      {
         propTypes:
         {
            resourceBase: PropTypes.string.isRequired,
            token: PropTypes.object.isRequired,
         },

         render: function()
         {
            var token = this.props.token;
            var myToken, myTokenAft;
            var attackerTargetLocks, defenderTargetLocks;
            var attackerAftTargetLocks, defenderAftTargetLocks;

            if (token.tokenFore && token.tokenAft)
            {
               myToken = token.tokenFore();
               myTokenAft = token.tokenAft();
               attackerTargetLocks = myToken.attackerTargetLocks();
               defenderTargetLocks = myToken.defenderTargetLocks();
               attackerAftTargetLocks = myTokenAft.attackerTargetLocks();
               defenderAftTargetLocks = myTokenAft.defenderTargetLocks();
            }
            else
            {
               myToken = token;
               attackerTargetLocks = token.attackerTargetLocks();
               defenderTargetLocks = token.defenderTargetLocks();
            }

            var rows = [];

            var colSpan0 = (myTokenAft ? 2 : 1);
            var cell1 = createCell(DOM.div(
            {
               className: "pilotCardStatsTable bg-xw-jet center",
            }, this.createStatsPanel(myToken)), "statsPanel0");
            var cell2 = createCell(this.createUpgradesPanel(myToken), "upgradesPanel0", "v-top");
            var cell3 = createCell(DOM.div(
            {
               className: "pilotCardTokensTable bg-xw-medium center",
            }, this.createTokensPanel(myToken, attackerTargetLocks, defenderTargetLocks)), "tokensPanel0");
            var cell4 = createCell(this.createCriticalDamagesPanel(myToken), "damagesPanel0", "v-top");

            rows.push(DOM.tr(
            {
               key: "nameRow",
            }, DOM.td(
            {
               colSpan: colSpan0,
            }, this.createNamePanel(token, myToken, myTokenAft))));

            if (myTokenAft)
            {
               var cell11 = createCell(DOM.div(
               {
                  className: "pilotCardStatsTable bg-xw-jet center",
               }, this.createStatsPanel(myTokenAft)), "statsPanel1");
               var cell22 = createCell(this.createUpgradesPanel(myTokenAft), "upgradesPanel1", "v-top");
               var cell44 = createCell(this.createCriticalDamagesPanel(myTokenAft), "damagesPanel1", "v-top");
               var cell33 = createCell(DOM.div(
               {
                  className: "pilotCardTokensTable bg-xw-medium center",
               }, this.createTokensPanel(myTokenAft, attackerAftTargetLocks, defenderAftTargetLocks)), "tokensPanel1");

               rows.push(createRow([cell1, cell11], "statsRow"));
               rows.push(createRow([cell2, cell22], "upgradeRow"));
               rows.push(createRow([cell3, cell33], "tokenRow"));
               rows.push(createRow([cell4, cell44], "damageRow"));
            }
            else
            {
               rows.push(createRow(cell1, "statsRow"));
               rows.push(createRow(cell2, "upgradeRow"));
               rows.push(createRow(cell3, "tokenRow"));
               rows.push(createRow(cell4, "damageRow"));
            }

            var key = "mainTable" + token.id();

            return createTable(rows, key, "pilotCard bg-xw-dark f6");
         },

         createCriticalDamagesPanel: function(token, key, className)
         {
            return React.createElement(CriticalDamagesPanel,
            {
               key: key,
               className: className,
               resourceBase: this.props.resourceBase,
               token: token,
            });
         },

         createNamePanel: function(token, myToken, myTokenAft)
         {
            return React.createElement(NamePanel,
            {
               pilotSkillValue: myToken.pilotSkillValue(),
               pilotName: token.pilotName(),
               pilotDescription: (token.card().isFlavorText ? undefined : token.card().description),
               shipName: (myTokenAft ? myToken.ship().name : token.shipName()),
               faction: token.card().shipFaction.faction,
               pilotAftSkillValue: (myTokenAft ? myTokenAft.pilotSkillValue() : undefined),
               shipAftName: (myTokenAft ? myTokenAft.ship().name : undefined),
               resourceBase: this.props.resourceBase,
            });
         },

         createStatsPanel: function(token)
         {
            return React.createElement(StatsPanel,
            {
               resourceBase: this.props.resourceBase,
               token: token,
            });
         },

         createTokensPanel: function(token, attackerTargetLocks, defenderTargetLocks)
         {
            return React.createElement(TokensPanel,
            {
               attackerTargetLocks: attackerTargetLocks,
               defenderTargetLocks: defenderTargetLocks,
               resourceBase: this.props.resourceBase,
               token: token,
            });
         },

         createUpgradesPanel: function(token)
         {
            return React.createElement(UpgradesPanel,
            {
               resourceBase: this.props.resourceBase,
               token: token,
            });
         },
      });

      var CriticalDamagesPanel = createReactClass(
      {
         propTypes:
         {
            resourceBase: PropTypes.string.isRequired,
            token: PropTypes.object.isRequired,
         },

         render: function()
         {
            var token = this.props.token;

            var rows = [];

            token.criticalDamageKeys().forEach(function(damageKey, i)
            {
               var damage = DamageCard.properties[damageKey];
               var element = React.createElement(EntityUI,
               {
                  entity: damage,
                  resourceBase: this.props.resourceBase,
               });
               var cellKey = damage.key + i;
               var className = "pilotCardCriticalDamageCell";
               var cell = createCell(element, cellKey, className);
               var rowKey = cellKey;
               rows.push(createRow(cell, rowKey));
            }, this);

            return createTable(rows, "damagesTable", "pilotCardCriticalDamagesTable bg-moon-gray center w-100");
         }
      });

      var NamePanel = createReactClass(
      {
         propTypes:
         {
            resourceBase: PropTypes.string.isRequired,
            pilotSkillValue: PropTypes.number.isRequired,
            pilotName: PropTypes.string.isRequired,
            shipName: PropTypes.string.isRequired,
            faction: PropTypes.object.isRequired,

            pilotAftSkillValue: PropTypes.number,
            pilotDescription: PropTypes.string,
            shipAftName: PropTypes.string,
         },

         render: function()
         {
            var rows = [];
            var cells = [];

            var image = React.createElement(ShipStateUI,
            {
               shipState: ShipState.properties[ShipState.PILOT_SKILL],
               faction: this.props.faction,
               resourceBase: this.props.resourceBase,
               label: String(this.props.pilotSkillValue),
               labelClass: "pilotSkillValue orange f5",
               showOne: true,
            });
            var description = (this.props.pilotDescription ? this.props.pilotDescription : "Name");

            cells.push(DOM.td(
            {
               key: cells.length,
               rowSpan: 2,
            }, image));
            cells.push(DOM.td(
            {
               key: cells.length,
               title: description,
               className: "pilotCardNameCell ba bg-xw-light",
               colSpan: (this.props.shipAftName ? 2 : 1),
            }, this.props.pilotName));

            if (this.props.pilotAftSkillValue)
            {
               image = React.createElement(ShipStateUI,
               {
                  shipState: ShipState.properties[ShipState.PILOT_SKILL],
                  faction: this.props.faction,
                  resourceBase: this.props.resourceBase,
                  label: String(this.props.pilotAftSkillValue),
                  labelClass: "pilotSkillValue orange f5",
               });
               cells.push(DOM.td(
               {
                  key: cells.length,
                  rowSpan: 2,
               }, image));
            }

            var factionImage = React.createElement(FactionUI,
            {
               faction: this.props.faction,
               resourceBase: this.props.resourceBase,
            });
            cells.push(DOM.td(
            {
               key: cells.length,
               className: "tr",
               rowSpan: 2,
            }, factionImage));
            rows.push(createRow(cells, rows.length));

            cells = [];
            if (this.props.shipAftName)
            {
               cells.push(createCell(this.props.shipName, cells.length, "pilotCardNameCell ba bg-xw-light", "Ship"));
               cells.push(createCell(this.props.shipAftName, cells.length, "pilotCardNameCell ba bg-xw-light", "Ship"));
            }
            else
            {
               cells.push(createCell(this.props.shipName, cells.length, "pilotCardNameCell ba bg-xw-light", "Ship"));
            }
            rows.push(createRow(cells, rows.length));

            return createTable(rows, "nameTable", "pilotCardNameTable w-100");
         },
      });

      var StatsPanel = createReactClass(
      {
         propTypes:
         {
            resourceBase: PropTypes.string.isRequired,
            token: PropTypes.object.isRequired,
         },

         render: function()
         {
            var myToken = this.props.token;
            var faction = myToken.card().shipFaction.faction;
            var cells = [];
            var shipStateKeys = [ShipState.PRIMARY_WEAPON, ShipState.ENERGY, ShipState.AGILITY, ShipState.HULL, ShipState.SHIELD];

            shipStateKeys.forEach(function(shipStateKey)
            {
               var shipStateValue = myToken.key(shipStateKey);
               if (shipStateKey === ShipState.PRIMARY_WEAPON && myToken.ship().isPrimaryWeaponTurret)
               {
                  shipStateKey = ShipState.TURRET_WEAPON;
               }
               if (![undefined, null].includes(shipStateValue))
               {
                  var shipState = ShipState.properties[shipStateKey];
                  var image = React.createElement(ShipStateUI,
                  {
                     shipState: shipState,
                     faction: faction,
                     resourceBase: this.props.resourceBase,
                  });

                  var className = shipState.numberClass;
                  cells.push(createCell(image, shipState.key + "0", className, shipState.name));
                  cells.push(createCell(shipStateValue, shipState.key + "1", className, shipState.name));
               }
            }, this);

            var row = createRow(cells);

            return createTable(row, "statsTable", "pilotCardStatsTable bg-dark-gray center");
         },
      });

      var TokensPanel = createReactClass(
      {
         propTypes:
         {
            attackerTargetLocks: PropTypes.array.isRequired,
            defenderTargetLocks: PropTypes.array.isRequired,
            resourceBase: PropTypes.string.isRequired,
            token: PropTypes.object.isRequired,
         },

         render: function()
         {
            var myToken = this.props.token;
            var attackerTargetLocks = this.props.attackerTargetLocks;
            var defenderTargetLocks = this.props.defenderTargetLocks;

            var cells = [];
            var countKeys = Count.keys();

            countKeys.forEach(function(countKey)
            {
               var countValue = myToken.count(countKey);
               if (countValue !== undefined && countValue > 0)
               {
                  var count = Count.properties[countKey];
                  var element = React.createElement(LabeledImage,
                  {
                     image: count.image,
                     resourceBase: this.props.resourceBase,
                     label: String(countValue),
                     labelClass: "lightImageText b f5 white",
                     title: count.name,
                  });
                  cells.push(createCell(element, count.key + countValue));
               }
            }, this);

            attackerTargetLocks.forEach(function(targetLock)
            {
               var title = "Target Lock to " + targetLock.defender().name();
               var element = React.createElement(LabeledImage,
               {
                  image: "token/AttackerTargetLock32.png",
                  resourceBase: this.props.resourceBase,
                  label: targetLock.id(),
                  labelClass: "lightImageText b f5 white",
                  title: title,
                  width: 38,
               });
               var key = "attackerTargetLock" + targetLock.attacker() + targetLock.defender();
               cells.push(createCell(element, key));
            }, this);

            defenderTargetLocks.forEach(function(targetLock)
            {
               var title = "Target Lock from " + targetLock.attacker().name();
               var element = React.createElement(LabeledImage,
               {
                  image: "token/DefenderTargetLock32.png",
                  resourceBase: this.props.resourceBase,
                  label: targetLock.id(),
                  labelClass: "lightImageText b f5 white",
                  title: title,
                  width: 38,
               });
               var key = "defenderTargetLock" + targetLock.attacker() + targetLock.defender();
               cells.push(createCell(element, key));
            }, this);

            if (myToken.damageCount() > 0)
            {
               var element = React.createElement(LabeledImage,
               {
                  image: "pilotCard/Damage32.jpg",
                  resourceBase: this.props.resourceBase,
                  label: String(myToken.damageCount()),
                  labelClass: "darkImageText b black f5",
                  title: "Damage",
               });
               cells.push(createCell(element, "damageCell" + myToken.damageCount()));
            }

            var row = createRow(cells);

            return createTable(row, "tokensTable", "pilotCardTokensTable bg-xw-medium center");
         },
      });

      var UpgradesPanel = createReactClass(
      {
         propTypes:
         {
            resourceBase: PropTypes.string.isRequired,
            token: PropTypes.object.isRequired,
         },

         render: function()
         {
            var token = this.props.token;

            var rows = [];
            var upgradeKeys = token.upgradeKeys();

            upgradeKeys.forEach(function(upgradeKey, i)
            {
               var upgrade = UpgradeCard.properties[upgradeKey];
               var element = React.createElement(EntityUI,
               {
                  entity: upgrade,
                  resourceBase: this.props.resourceBase,
               });
               var cellKey = upgrade.key + i;
               var cell = DOM.div(
               {
                  key: cellKey,
                  className: "pilotCardUpgradeCell pr1 tl",
               }, element);
               rows.push(cell);
            }, this);

            var scrollClass = (upgradeKeys.size > 2 ? " xw-height48 overflowYScroll overflow-y-scroll" : "");

            return DOM.div(
            {
               key: "upgradesTable",
               className: "pilotCardUpgradesTable bg-xw-medium center w-100" + scrollClass,
            }, rows);
         }
      });

      function createCell(value, key, className, title)
      {
         return DOM.td(
         {
            key: key,
            className: className,
            title: title,
         }, (value !== undefined ? value : ""));
      }

      function createRow(cells, key)
      {
         return DOM.tr(
         {
            key: key,
         }, cells);
      }

      function createTable(rows, key, className)
      {
         return DOM.table(
         {
            className: className,
         }, DOM.tbody(
         {}, rows));
      }

      return PilotCardCompactUI;
   });
