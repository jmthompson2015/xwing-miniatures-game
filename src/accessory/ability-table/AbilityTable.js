"use strict";

define(["create-react-class", "prop-types", "react", "react-dom-factories", "react-redux",
  "artifact/js/DamageCardTrait", "artifact/js/Event", "artifact/js/Faction", "artifact/js/Phase", "artifact/js/UpgradeType",
  "view/js/DataTable", "view/js/FactionUI", "view/js/ImplementedImage", "view/js/UpgradeTypeUI",
  "accessory/ability-table/Action", "accessory/ability-table/FilterContainer", "accessory/ability-table/TableColumns"
],
   function(createReactClass, PropTypes, React, DOM, ReactRedux,
      DamageCardTrait, Event, Faction, Phase, UpgradeType,
      DataTable, FactionUI, ImplementedImage, UpgradeTypeUI,
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

      var valueFunctions = {
         "name": function(data)
         {
            var answer = data.name;
            answer = answer.replace(/\"/, "");
            return answer;
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
         "event": function(data)
         {
            if (data.event)
            {
               var key = data.event.substring(data.event.indexOf(".") + 1);

               if (data.event.startsWith("Event"))
               {
                  var event = Event.properties[key];
                  if (event === undefined)
                  {
                     LOGGER.warn("Missing event for key = " + key);
                  }
                  return "Event" + String.pad(Event.keys().indexOf(event.key), 2);
               }
               else if (data.event.startsWith("Phase"))
               {
                  var phase = Phase.properties[key];
                  if (phase === undefined)
                  {
                     LOGGER.warn("Missing phase for key = " + key);
                  }
                  return "Phase" + String.pad(Phase.keys().indexOf(phase.key), 2);
               }
            }
            else
            {
               return data.event;
            }
         },
      };

      var AbilityTable = createReactClass(
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
               "type": function(data)
               {
                  var answer = data.type;
                  if (DamageCardTrait.properties[data.type])
                  {
                     answer = DamageCardTrait.properties[data.type].name;
                  }
                  else if (Faction.properties[data.type])
                  {
                     answer = React.createElement(FactionUI,
                     {
                        faction: Faction.properties[data.type],
                        isSmall: true,
                        resourceBase: resourceBase,
                     });
                  }
                  else if (UpgradeType.properties[data.type])
                  {
                     answer = React.createElement(UpgradeTypeUI,
                     {
                        upgradeType: UpgradeType.properties[data.type],
                        resourceBase: resourceBase,
                     });
                  }
                  return answer;
               },
               "name": function(data)
               {
                  var src = resourceBase + "icon/Wikipedia16.png";
                  var searchString = data.name.replace(/ /g, "_");
                  var href = "http://xwing-miniatures.wikia.com/wiki/" + searchString;
                  var link = createImageLink(src, href);
                  return DOM.span(
                  {
                     className: "textImageLink",
                  }, data.name, link);
               },
               "event": function(data)
               {
                  return data.event;
               },
               "isImplemented": function(data)
               {
                  return React.createElement(ImplementedImage,
                  {
                     resourceBase: resourceBase,
                     isImplemented: data.isImplemented,
                  });
               },
            };

            var table = React.createElement(DataTable,
            {
               columns: TableColumns,
               rowData: myRowData,
               cellFunctions: cellFunctions,
               valueFunctions: valueFunctions,
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
            LOGGER.trace("AbilityTable.toggleFilterShownActionPerformed() start");
            this.context.store.dispatch(Action.toggleFilterShown());
            LOGGER.trace("AbilityTable.toggleFilterShownActionPerformed() end");
         },
      });

      return AbilityTable;
   });