import MathUtilities from "../../utility/MathUtilities.js";

import Faction from "../../artifact/Faction.js";

import Button from "../../view/Button.js";
import DataTable from "../../view/DataTable.js";
import FactionUI from "../../view/FactionUI.js";

import Action from "./Action.js";
import FilterContainer from "./FilterContainer.js";
import TableColumns from "./TableColumns.js";

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
      rows.push(ReactDOMFactories.tr(
      {
         key: rows.length,
         className: "alignLeft tl",
      }, ReactDOMFactories.td(
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

         rows.push(ReactDOMFactories.tr(
         {
            key: rows.length,
         }, ReactDOMFactories.td(
         {}, filterUI)));
      }

      rows.push(ReactDOMFactories.tr(
      {
         key: rows.length,
      }, ReactDOMFactories.td(
      {}, table)));

      return ReactDOMFactories.table(
      {}, ReactDOMFactories.tbody(
      {}, rows));
   },

   toggleFilterShownActionPerformed: function()
   {
      LOGGER.trace("SquadTable.toggleFilterShownActionPerformed() start");
      this.context.store.dispatch(Action.toggleFilterShown());
      LOGGER.trace("SquadTable.toggleFilterShownActionPerformed() end");
   },
});

export default SquadTable;