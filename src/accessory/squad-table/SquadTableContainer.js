"use strict";

define(["react-redux", "common/js/InputValidator", "accessory/squad-table/SquadTable"],
   function(ReactRedux, InputValidator, SquadTable)
   {
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

      return ReactRedux.connect(mapStateToProps)(SquadTable);
   });
