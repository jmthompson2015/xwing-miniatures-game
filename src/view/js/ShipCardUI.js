"use strict";

define(["create-react-class", "prop-types", "react", "react-dom-factories",
  "artifact/js/Maneuver", "artifact/js/ShipFaction",
  "view/js/ManeuverChooser", "view/js/ShipActionPanel", "view/js/ShipSilhouetteUI", "view/js/ShipUI"],
   function(createReactClass, PropTypes, React, DOM, Maneuver, ShipFaction,
      ManeuverChooser, ShipActionPanel, ShipSilhouetteUI, ShipUI)
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
               imagePanel = DOM.table(
               {
                  className: "center",
               }, DOM.tbody(
               {}, DOM.tr(
               {}, images.map(function(image)
               {
                  return DOM.td(
                  {
                     className: "ph1",
                  }, image);
               }))));
            }

            var silhouette = React.createElement(ShipSilhouetteUI,
            {
               ship: shipFaction.ship,
               resourceBase: resourceBase,
               showName: true,
            });

            var shipActionPanel0, shipActionPanel1;

            if (shipFactionKey === ShipFaction.IMPERIAL_RAIDER_CLASS_CORVETTE ||
               shipFactionKey === ShipFaction.REBEL_CR90_CORVETTE)
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

            cell0 = DOM.td(
            {
               key: "image" + shipFactionKey,
               className: "galleryCell center tc",
            }, imagePanel);
            cell1 = DOM.td(
            {
               key: "name" + shipFactionKey,
               className: "galleryCell center pa1"
            }, silhouette);

            if (shipActionPanel1 !== undefined)
            {
               cell2 = DOM.td(
               {
                  key: "actions" + shipFactionKey,
                  className: "galleryCell colorWhite center pa1 tc white"
               }, DOM.table(
                  {
                     className: "alignCenter center",
                  },
                  DOM.tbody(
                  {}, DOM.tr(
                     {}, DOM.td(
                     {}, "Aft"),
                     DOM.td(
                     {
                        className: "pa1",
                     }, shipActionPanel1), DOM
                     .td(
                     {
                        className: "pa1",
                     }, shipActionPanel0),
                     DOM.td(
                     {}, "Fore")))));
            }
            else
            {
               cell2 = DOM.td(
               {
                  key: "actions" + shipFactionKey,
                  className: "galleryCell center pa1"
               }, shipActionPanel0);
            }

            cell3 = DOM.td(
            {
               key: "maneuvers" + shipFactionKey,
               className: "galleryCell alignBottom center pa1"
            }, chooser);

            var rows = [];
            rows.push(DOM.tr(
            {
               key: rows.length,
            }, cell0));
            rows.push(DOM.tr(
            {
               key: rows.length,
               className: "galleryShipName white"
            }, cell1));
            rows.push(DOM.tr(
            {
               key: rows.length,
            }, cell2));
            rows.push(DOM.tr(
            {
               key: rows.length,
            }, cell3));

            return DOM.table(
            {
               key: this.props.myKey,
               className: "galleryTable b--xw-medium ba bg-black dib v-top",
            }, DOM.tbody(
            {}, rows));
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
