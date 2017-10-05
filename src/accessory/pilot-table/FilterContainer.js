"use strict";

define(["react-redux", "common/js/InputValidator", "accessory/pilot-table/FilterUI"],
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
