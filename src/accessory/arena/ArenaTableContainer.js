import InputValidator from "../../utility/InputValidator.js";

import ArenaTable from "./ArenaTable.js";
import TableRow from "./TableRow.js";

// ArenaTableContainer

function mapStateToProps(state, ownProps)
{
   InputValidator.validateNotNull("resourceBase", ownProps.resourceBase);

   var arenaData = [];

   state.squadBuilders.forEach(function(squadBuilder)
   {
      var key = squadBuilder.toString();
      var winCount = state.sbToWinCount[key];
      var loseCount = state.sbToLoseCount[key];
      var tieCount = state.sbToTieCount[key];
      arenaData.push(TableRow.createTableRow(squadBuilder, winCount, loseCount, tieCount));
   });

   return (
   {
      resourceBase: ownProps.resourceBase,
      rowData: arenaData,
   });
}

export default ReactRedux.connect(mapStateToProps)(ArenaTable);