import InputValidator from "../../utility/InputValidator.js";

import FilterUI from "./FilterUI.js";

// FilterContainer

function mapStateToProps(state, ownProps)
{
   InputValidator.validateNotNull("resourceBase", ownProps.resourceBase);

   return (
   {
      filters: state.filters,
      resourceBase: ownProps.resourceBase,
   });
}

export default ReactRedux.connect(mapStateToProps)(FilterUI);