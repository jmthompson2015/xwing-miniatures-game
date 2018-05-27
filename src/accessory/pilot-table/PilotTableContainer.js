"use strict";

define(["react-redux", "utility/InputValidator", "accessory/pilot-table/PilotTable"],
   function(ReactRedux, InputValidator, PilotTable)
   {
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

      return ReactRedux.connect(mapStateToProps)(PilotTable);
   });
