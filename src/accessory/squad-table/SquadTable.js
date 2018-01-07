"use strict";

define(["create-react-class", "prop-types", "react", "react-dom-factories", "react-redux", "common/js/MathUtilities", "artifact/js/Faction",
  "view/js/Button", "view/js/DataTable", "view/js/FactionUI",
  "accessory/squad-table/Action", "accessory/squad-table/FilterContainer", "accessory/squad-table/TableColumns"],
   function(createReactClass, PropTypes, React, DOM, ReactRedux, MathUtilities, Faction, Button, DataTable, FactionUI,
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
            LOGGER.trace("SquadTable.toggleFilterShownActionPerformed() start");
            this.context.store.dispatch(Action.toggleFilterShown());
            LOGGER.trace("SquadTable.toggleFilterShownActionPerformed() end");
         },
      });

      return SquadTable;
   });
