import InputValidator from "../../utility/InputValidator.js";

import ArenaTable from "./ArenaTable.js";
import TableRow from "./TableRow.js";

// ArenaTableContainer

function mapStateToProps(state, ownProps)
{
   InputValidator.validateNotNull("resourceBase", ownProps.resourceBase);

   const arenaData = [];

   state.squadBuilders.forEach(function(squadBuilder)
   {
      const key = squadBuilder.toString();
      const winCount = state.sbToWinCount[key];
      const loseCount = state.sbToLoseCount[key];
      const tieCount = state.sbToTieCount[key];
      arenaData.push(TableRow.createTableRow(squadBuilder, winCount, loseCount, tieCount));
   });

   return (
   {
      resourceBase: ownProps.resourceBase,
      rowData: arenaData,
   });
}

export default ReactRedux.connect(mapStateToProps)(ArenaTable);