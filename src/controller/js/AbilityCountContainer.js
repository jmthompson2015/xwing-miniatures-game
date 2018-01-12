"use strict";

define(["react-redux", "common/js/InputValidator", "view/js/AbilityCountUI"],
   function(ReactRedux, InputValidator, AbilityCountUI)
   {
      function mapStateToProps(state)
      {
         InputValidator.validateNotNull("state.filteredTableRows", state.filteredTableRows);

         var filteredTableRows = state.filteredTableRows;
         var implementedCount = filteredTableRows.reduce(function(accumulator, tableRow)
         {
            return accumulator + (tableRow.isImplemented ? 1 : 0);
         }, 0);

         return (
         {
            implementedCount: implementedCount,
            abilityCount: filteredTableRows.length,
         });
      }

      return ReactRedux.connect(mapStateToProps)(AbilityCountUI);
   });
