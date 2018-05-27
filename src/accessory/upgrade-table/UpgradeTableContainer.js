"use strict";

define(["react-redux", "utility/InputValidator", "accessory/upgrade-table/UpgradeTable"],
   function(ReactRedux, InputValidator, UpgradeTable)
   {
      // UpgradeTableContainer

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

      return ReactRedux.connect(mapStateToProps)(UpgradeTable);
   });
