import InputValidator from "../../utility/InputValidator.js";

import PilotTable from "./PilotTable.js";

// PilotTableContainer

function mapStateToProps(state, ownProps)
{
   InputValidator.validateNotNull("resourceBase", ownProps.resourceBase);

   return (
   {
      isFilterShown: state.isFilterShown,
      filters: state.filters,
      resourceBase: ownProps.resourceBase,
      rowData: state.filteredTableRows,
   });
}

export default ReactRedux.connect(mapStateToProps)(PilotTable);