import Faction from "../../artifact/Faction.js";

import FactionUI from "../../view/FactionUI.js";
import DataTable from "../../view/DataTable.js";

import TableColumns from "./TableColumns.js";

class ArenaTable extends React.Component
{
   render()
   {
      const rowData = this.props.rowData;
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
         "squadBuilder": function(data)
         {
            return data.squadBuilder.toString();
         },
      };

      const table = React.createElement(DataTable,
      {
         cellFunctions: cellFunctions,
         columns: TableColumns,
         resourceBase: resourceBase,
         rowData: rowData,
      });

      const rows = [];
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

ArenaTable.propTypes = {
   resourceBase: PropTypes.string.isRequired,
   rowData: PropTypes.array.isRequired,
};

export default ArenaTable;