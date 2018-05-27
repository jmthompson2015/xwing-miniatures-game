"use strict";

define(["react-redux", "utility/InputValidator", "accessory/upgrade-table/FilterUI"],
   function(ReactRedux, InputValidator, FilterUI)
   {
      function mapStateToProps(state, ownProps)
      {
         InputValidator.validateNotNull("resourceBase", ownProps.resourceBase);

         return (
         {
            filters: state.filters,
            resourceBase: ownProps.resourceBase,
         });
      }

      return ReactRedux.connect(mapStateToProps)(FilterUI);
   });
