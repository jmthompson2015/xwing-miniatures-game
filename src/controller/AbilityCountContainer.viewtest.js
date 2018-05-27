"use strict";

require(["react", "react-dom", "react-redux", "redux", "utility/Logger", "controller/AbilityCountContainer", "accessory/ability-table/Reducer"],
   function(React, ReactDOM, ReactRedux, Redux, Logger, AbilityCountContainer, Reducer)
   {
      window.LOGGER = new Logger();
      LOGGER.setTraceEnabled(false);
      LOGGER.setDebugEnabled(false);

      var store = Redux.createStore(Reducer.root);

      var element = React.createElement(ReactRedux.Provider,
      {
         store: store,
      }, React.createElement(AbilityCountContainer));
      ReactDOM.render(element, document.getElementById("inputArea"));
   });