"use strict";

define(["create-react-class", "prop-types", "react", "react-dom-factories", "react-redux", "common/js/MathUtilities",
  "artifact/js/Faction", "artifact/js/Ship",
  "view/js/Button", "view/js/DataTable", "view/js/FactionUI", "view/js/ImplementedImage", "view/js/ShipSilhouetteUI",
  "accessory/pilot-table/Action", "accessory/pilot-table/FilterContainer", "accessory/pilot-table/TableColumns"],
   function(createReactClass, PropTypes, React, DOM, ReactRedux, MathUtilities,
      Faction, Ship, Button, DataTable, FactionUI, ImplementedImage, ShipSilhouetteUI,
      Action, FilterContainer, TableColumns)
   {
      function createImageLink(src, href)
      {
         var image = DOM.img(
         {
            className: "imageBlock fr v-mid",
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
            var filterShownButton = React.createElement(Button,
            {
               name: (this.props.isFilterShown ? "Hide Filter" : "Show Filter"),
               onClick: this.toggleFilterShownActionPerformed,
            });

            var myRowData = this.props.rowData;
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
                     className: "textImageLink dib w-100",
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
                     className: "textImageLink dib w-100",
                  }, silhouette, link);
               },
               "description": function(data)
               {
                  var answer;
                  if (data.isFlavorText)
                  {
                     answer = DOM.span(
                     {
                        className: "flavorText i",
                     }, data.description);
                  }
                  else
                  {
                     answer = DOM.span(
                     {
                        dangerouslySetInnerHTML:
                        {
                           __html: data.description,
                        },
                     });
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
                  return MathUtilities.format(value, 2);
               },
               "ratioSumStatsSquadPointCost": function(data)
               {
                  var value = data.ratioSumStatsSquadPointCost;
                  return MathUtilities.format(value, 4);
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
               className: "alignLeft tl",
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
