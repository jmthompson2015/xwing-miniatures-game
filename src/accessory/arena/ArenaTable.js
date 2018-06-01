import Faction from "../../artifact/Faction.js";

import FactionUI from "../../view/FactionUI.js";
import DataTable from "../../view/DataTable.js";

import TableColumns from "./TableColumns.js";

var ArenaTable = createReactClass(
{
   propTypes:
   {
      resourceBase: PropTypes.string.isRequired,
      rowData: PropTypes.array.isRequired,
   },

   render: function()
   {
      var rowData = this.props.rowData;
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
         "squadBuilder": function(data)
         {
            return data.squadBuilder.toString();
         },
      };

      var table = React.createElement(DataTable,
      {
         cellFunctions: cellFunctions,
         columns: TableColumns,
         resourceBase: resourceBase,
         rowData: rowData,
      });

      var rows = [];
      rows.push(ReactDOMFactories.tr(
      {
         key: rows.length,
      }, ReactDOMFactories.td(
      {}, table)));

      return ReactDOMFactories.table(
      {}, ReactDOMFactories.tbody(
      {}, rows));
   },
});

export default ArenaTable;