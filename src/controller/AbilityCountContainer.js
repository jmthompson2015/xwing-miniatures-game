import InputValidator from "../utility/InputValidator.js";

import AbilityCountUI from "../view/AbilityCountUI.js";

function mapStateToProps(state)
{
   InputValidator.validateNotNull("state.filteredTableRows", state.filteredTableRows);

   const filteredTableRows = state.filteredTableRows;
   const implementedCount = filteredTableRows.reduce(function(accumulator, tableRow)
   {
      return accumulator + (tableRow.isImplemented ? 1 : 0);
   }, 0);

   return (
   {
      implementedCount: implementedCount,
      abilityCount: filteredTableRows.length,
   });
}

export default ReactRedux.connect(mapStateToProps)(AbilityCountUI);