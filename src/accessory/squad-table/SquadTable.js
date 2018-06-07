import MathUtilities from "../../utility/MathUtilities.js";

import Faction from "../../artifact/Faction.js";

import Button from "../../view/Button.js";
import DataTable from "../../view/DataTable.js";
import FactionUI from "../../view/FactionUI.js";

import Action from "./Action.js";
import FilterContainer from "./FilterContainer.js";
import TableColumns from "./TableColumns.js";

class SquadTable extends React.Component
{
   constructor(props)
   {
      super(props);

      this.toggleFilterShownActionPerformed = this.toggleFilterShownActionPerformedFunction.bind(this);
   }

   render()
   {
      const filterShownButton = React.createElement(Button,
      {
         name: (this.props.isFilterShown ? "Hide Filter" : "Show Filter"),
         onClick: this.toggleFilterShownActionPerformed,
      });

      const myRowData = this.props.rowData;
      const resourceBase = this.props.resourceBase;
      const cellFunctions = {
         "factionKey": function(data)
         {
            const faction = Faction.properties[data.factionKey];
            return React.createElement(FactionUI,
            {
               faction: faction,
               isSmall: true,
               resourceBase: resourceBase,
            });
         },
         "ratioPrimaryWeaponAgility": function(data)
         {
            const value = data.ratioPrimaryWeaponAgility;
            return MathUtilities.format(value, 2);
         },
         "ratioSumStatsSquadPointCost": function(data)
         {
            const value = data.ratioSumStatsSquadPointCost;
            return MathUtilities.format(value, 4);
         },
      };

      const table = React.createElement(DataTable,
      {
         columns: TableColumns,
         rowData: myRowData,
         cellFunctions: cellFunctions,
      });

      const rows = [];
      rows.push(ReactDOMFactories.tr(
      {
         key: rows.length,
         className: "alignLeft tl",
      }, ReactDOMFactories.td(
      {}, filterShownButton)));

      if (this.props.isFilterShown)
      {
         const filterUI = React.createElement(ReactRedux.Provider,
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
   }
}

SquadTable.prototype.toggleFilterShownActionPerformedFunction = function()
{
   LOGGER.trace("SquadTable.toggleFilterShownActionPerformed() start");
   this.context.store.dispatch(Action.toggleFilterShown());
   LOGGER.trace("SquadTable.toggleFilterShownActionPerformed() end");
};

SquadTable.contextTypes = {
   store: PropTypes.object.isRequired,
};

SquadTable.propTypes = {
   isFilterShown: PropTypes.bool.isRequired,
   filters: PropTypes.object.isRequired,
   rowData: PropTypes.array.isRequired,
};

export default SquadTable;