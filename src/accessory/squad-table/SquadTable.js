"use strict";

define(["create-react-class", "prop-types", "react", "react-dom-factories", "react-redux", "artifact/js/Faction", "view/js/DataTable", "view/js/FactionUI",
  "accessory/squad-table/Action", "accessory/squad-table/FilterContainer", "accessory/squad-table/TableColumns"],
   function(createReactClass, PropTypes, React, DOM, ReactRedux, Faction, DataTable, FactionUI,
      Action, FilterContainer, TableColumns)
   {
      var SquadTable = createReactClass(
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
            LOGGER.trace("SquadTable.toggleFilterShownActionPerformed() start");
            this.context.store.dispatch(Action.toggleFilterShown());
            LOGGER.trace("SquadTable.toggleFilterShownActionPerformed() end");
         },
      });

      return SquadTable;
   });
