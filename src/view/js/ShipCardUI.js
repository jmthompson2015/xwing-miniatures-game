"use strict";

define(["create-react-class", "prop-types", "react",
  "artifact/js/Maneuver", "artifact/js/ShipFaction",
  "view/js/ManeuverChooser", "view/js/ReactUtilities", "view/js/ShipActionPanel", "view/js/ShipSilhouetteUI", "view/js/ShipUI"],
   function(createReactClass, PropTypes, React, Maneuver, ShipFaction,
      ManeuverChooser, ReactUtilities, ShipActionPanel, ShipSilhouetteUI, ShipUI)
   {
      var ShipCardUI = createReactClass(
      {
         propTypes:
         {
            resourceBase: PropTypes.string.isRequired,
            shipFaction: PropTypes.object.isRequired,
         },

         render: function()
         {
            var shipFaction = this.props.shipFaction;
            var resourceBase = this.props.resourceBase;

            var cell0, cell1, cell2, cell3;
            var shipFactionKey = shipFaction.key;

            var images = [];
            images.push(this.createShipImage(shipFactionKey));

            if (shipFactionKey === ShipFaction.IMPERIAL_TIE_BOMBER)
            {
               images.push(this.createShipImage(ShipFaction.IMPERIAL_TIE_BOMBER_V2));
            }
            else if (shipFactionKey === ShipFaction.IMPERIAL_TIE_DEFENDER)
            {
               images.push(this.createShipImage(ShipFaction.IMPERIAL_TIE_DEFENDER_V2));
            }
            else if (shipFactionKey === ShipFaction.IMPERIAL_TIE_INTERCEPTOR)
            {
               images.push(this.createShipImage(ShipFaction.IMPERIAL_TIE_INTERCEPTOR_V2));
               images.push(this.createShipImage(ShipFaction.IMPERIAL_TIE_INTERCEPTOR_V3));
            }
            else if (shipFactionKey === ShipFaction.REBEL_A_WING)
            {
               images.push(this.createShipImage(ShipFaction.REBEL_A_WING_V2));
            }
            else if (shipFactionKey === ShipFaction.REBEL_B_WING)
            {
               images.push(this.createShipImage(ShipFaction.REBEL_B_WING_V2));
            }
            else if (shipFactionKey === ShipFaction.RESISTANCE_T_70_X_WING)
            {
               images.push(this.createShipImage(ShipFaction.RESISTANCE_T_70_X_WING_V2));
            }
            else if (shipFactionKey === ShipFaction.SCUM_KIHRAXZ_FIGHTER)
            {
               images.push(this.createShipImage(ShipFaction.SCUM_KIHRAXZ_FIGHTER_V2));
            }
            else if (shipFactionKey === ShipFaction.SCUM_M3_A_INTERCEPTOR)
            {
               images.push(this.createShipImage(ShipFaction.SCUM_M3_A_INTERCEPTOR_V2));
            }
            else if (shipFactionKey === ShipFaction.SCUM_STAR_VIPER)
            {
               images.push(this.createShipImage(ShipFaction.SCUM_STAR_VIPER_V2));
            }

            var imagePanel;

            if (images.length === 1)
            {
               imagePanel = images;
            }
            else
            {
               var imagePanelCells = images.map(function(image, i)
               {
                  return ReactUtilities.createCell(image, "image" + i, "pa1");
               });

               var imagePanelRow = ReactUtilities.createRow(imagePanelCells);
               imagePanel = ReactUtilities.createTable(imagePanelRow, "imagePanel", "center tc");
            }

            var silhouette = React.createElement(ShipSilhouetteUI,
            {
               ship: shipFaction.ship,
               resourceBase: resourceBase,
               showName: true,
            });

            var shipActionPanel0, shipActionPanel1;

            if ([ShipFaction.IMPERIAL_RAIDER_CLASS_CORVETTE, ShipFaction.REBEL_CR90_CORVETTE].includes(shipFactionKey))
            {
               shipActionPanel0 = React.createElement(ShipActionPanel,
               {
                  resourceBase: resourceBase,
                  shipActionKeys: shipFaction.ship.fore.shipActionKeys,
               });
               shipActionPanel1 = React.createElement(ShipActionPanel,
               {
                  resourceBase: resourceBase,
                  shipActionKeys: shipFaction.ship.aft.shipActionKeys,
               });
            }
            else
            {
               shipActionPanel0 = React.createElement(ShipActionPanel,
               {
                  resourceBase: resourceBase,
                  shipActionKeys: shipFaction.ship.shipActionKeys,
               });
            }

            var maneuverKeys = shipFaction.ship.maneuverKeys;
            var maneuvers = maneuverKeys.map(function(maneuverKey)
            {
               return Maneuver.properties[maneuverKey];
            });
            var chooser = React.createElement(ManeuverChooser,
            {
               resourceBase: resourceBase,
               isEditable: false,
               shipName: shipFaction.ship.name,
               maneuvers: maneuvers,
            });

            cell0 = ReactUtilities.createCell(imagePanel, "image" + shipFactionKey, "center tc");
            cell1 = ReactUtilities.createCell(silhouette, "name" + shipFactionKey, "center pa1 tc");

            if (shipActionPanel1 !== undefined)
            {
               var cell2Cells = [];
               cell2Cells.push(ReactUtilities.createCell("Aft"));
               cell2Cells.push(ReactUtilities.createCell(shipActionPanel1, "aftPanel", "pa1"));
               cell2Cells.push(ReactUtilities.createCell(shipActionPanel0, "forePanel", "pa1"));
               cell2Cells.push(ReactUtilities.createCell("Fore"));

               var cell2Row = ReactUtilities.createRow(cell2Cells);
               var cell2Table = ReactUtilities.createTable(cell2Row, "cell2Table", "center tc");
               cell2 = ReactUtilities.createCell(cell2Table, "actions" + shipFactionKey, "colorWhite center pa1 tc white");
            }
            else
            {
               cell2 = ReactUtilities.createCell(shipActionPanel0, "actions" + shipFactionKey, "center pa1");
            }

            cell3 = ReactUtilities.createCell(chooser, "maneuvers" + shipFactionKey, "alignBottom center pa1");

            var rows = [];
            rows.push(ReactUtilities.createRow(cell0, rows.length));
            rows.push(ReactUtilities.createRow(cell1, rows.length, "white"));
            rows.push(ReactUtilities.createRow(cell2, rows.length));
            rows.push(ReactUtilities.createRow(cell3, rows.length));

            return ReactUtilities.createTable(rows, this.props.myKey, "b--xw-medium ba bg-black v-top");
         },

         createShipImage: function(shipFactionKey)
         {
            var shipFaction = ShipFaction.properties[shipFactionKey];
            var shipBase = shipFaction.ship.shipBase;

            // Mock the model/js/Position class to avoid a dependency.
            var position = {
               x: function()
               {
                  return shipBase.width / 2;
               },
               y: function()
               {
                  return shipBase.height / 2;
               },
               heading: function()
               {
                  return 0;
               },
            };

            return React.createElement(ShipUI,
            {
               key: shipFactionKey + shipBase.key + position.toString(),
               canvasId: shipFaction.name,
               resourceBase: this.props.resourceBase,
               position: position,
               shipFaction: shipFaction,
            });
         },
      });

      return ShipCardUI;
   });
