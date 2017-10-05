"use strict";

define(["create-react-class", "prop-types", "react", "react-dom-factories", "react-redux", "common/js/MathAugments",
  "artifact/js/Faction", "artifact/js/Ship",
  "view/js/DataTable", "view/js/FactionUI", "view/js/ImplementedImage", "view/js/ShipSilhouetteUI",
  "accessory/pilot-table/Action", "accessory/pilot-table/FilterContainer", "accessory/pilot-table/TableColumns"],
   function(createReactClass, PropTypes, React, DOM, ReactRedux, MathAugments,
      Faction, Ship, DataTable, FactionUI, ImplementedImage, ShipSilhouetteUI,
      Action, FilterContainer, TableColumns)
   {
      function createImageLink(src, href)
      {
         var image = DOM.img(
         {
            className: "imageBlock",
            src: src,
         });

         return DOM.a(
         {
            href: href,
            target: "_blank",
         }, image);
      }

      var PilotTable = createReactClass(
      {
         contextTypes:
         {
            store: PropTypes.object.isRequired,
         },

         propTypes:
         {
            isFilterShown: PropTypes.bool.isRequired,
            filters: PropTypes.object.isRequired,
            rowData: PropTypes.array.isRequired,
         },

         render: function()
         {
            var filterShownButton = DOM.button(
            {
               onClick: this.toggleFilterShownActionPerformed,
            }, (this.props.isFilterShown ? "Hide Filter" : "Show Filter"));

            var myRowData = [];

            this.props.rowData.forEach(function(pilot)
            {
               if (pilot.fore || pilot.aft)
               {
                  myRowData.push(pilot.fore);
                  myRowData.push(pilot.aft);
               }
               else
               {
                  myRowData.push(pilot);
               }
            });

            var resourceBase = this.props.resourceBase;
            var cellFunctions = {
               "factionKey": function(data)
               {
                  var faction = Faction.properties[data.factionKey];
                  return React.createElement(FactionUI,
                  {
                     faction: faction,
                     isSmall: true,
                     resourceBase: resourceBase,
                  });
               },
               "pilotName": function(data)
               {
                  var src = resourceBase + "icon/Wikipedia16.png";
                  var searchString = data.pilotName.replace(/ /g, "_");
                  var href = "http://xwing-miniatures.wikia.com/wiki/" + searchString;
                  var link = createImageLink(src, href);
                  return DOM.span(
                  {
                     className: "textImageLink",
                  }, data.pilotName, link);
               },
               "shipKey": function(data)
               {
                  var src = resourceBase + "icon/Wikipedia16.png";
                  var href = data.shipWikiUrl;
                  if (!href)
                  {
                     var searchString = data.shipName + "_Expansion_Pack";
                     searchString = searchString.replace(/ /g, "_");
                     href = "http://xwing-miniatures.wikia.com/wiki/" + searchString;
                  }
                  var link = createImageLink(src, href);
                  var silhouette = React.createElement(ShipSilhouetteUI,
                  {
                     ship: Ship.properties[data.shipKey],
                     resourceBase: resourceBase,
                     showName: true,
                  });
                  return DOM.span(
                  {
                     className: "textImageLink",
                  }, silhouette, link);
               },
               "description": function(data)
               {
                  var answer = data.description;
                  if (data.isFlavorText)
                  {
                     answer = DOM.span(
                     {
                        className: "flavorText",
                     }, data.description);
                  }
                  return answer;
               },
               "isImplemented": function(data)
               {
                  return React.createElement(ImplementedImage,
                  {
                     resourceBase: resourceBase,
                     isImplemented: data.isImplemented,
                  });
               },
               "ratioPrimaryWeaponAgility": function(data)
               {
                  var value = data.ratioPrimaryWeaponAgility;
                  return Math.xwingFormat(value, 2);
               },
               "ratioSumStatsSquadPointCost": function(data)
               {
                  var value = data.ratioSumStatsSquadPointCost;
                  return Math.xwingFormat(value, 4);
               },
            };

            var table = React.createElement(DataTable,
            {
               columns: TableColumns,
               rowData: myRowData,
               cellFunctions: cellFunctions,
               resourceBase: resourceBase,
            });

            var rows = [];
            rows.push(DOM.tr(
            {
               key: rows.length,
               className: "alignLeft",
            }, DOM.td(
            {}, filterShownButton)));

            if (this.props.isFilterShown)
            {
               var filterUI = React.createElement(ReactRedux.Provider,
               {
                  store: this.context.store,
               }, React.createElement(FilterContainer,
               {
                  resourceBase: resourceBase,
               }));

               rows.push(DOM.tr(
               {
                  key: rows.length,
               }, DOM.td(
               {}, filterUI)));
            }

            rows.push(DOM.tr(
            {
               key: rows.length,
            }, DOM.td(
            {}, table)));

            return DOM.table(
            {}, DOM.tbody(
            {}, rows));
         },

         toggleFilterShownActionPerformed: function()
         {
            LOGGER.trace("PilotTable.toggleFilterShownActionPerformed() start");
            this.context.store.dispatch(Action.toggleFilterShown());
            LOGGER.trace("PilotTable.toggleFilterShownActionPerformed() end");
         },
      });

      return PilotTable;
   });
