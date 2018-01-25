"use strict";

define(["react-redux", "common/js/InputValidator", "accessory/damage-table/DamageTable"],
   function(ReactRedux, InputValidator, DamageTable)
   {
      // DamageTableContainer

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

      return ReactRedux.connect(mapStateToProps)(DamageTable);
   });
