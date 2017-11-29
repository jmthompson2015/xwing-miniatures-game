"use strict";

define(["react-redux", "artifact/js/Phase", "view/js/StatusBarUI"],
   function(ReactRedux, Phase, StatusBarUI)
   {
      function mapStateToProps(state)
      {
         var environment = state.environment;
         var activeToken = environment.getTokenById(state.activeCardId);
         var activeShipName = (activeToken ? activeToken.name() : "");

         return (
         {
            round: state.round,
            phase: Phase.properties[state.phaseKey],
            activeShipName: activeShipName,
            userMessage: state.userMessage,
         });
      }

      return ReactRedux.connect(mapStateToProps)(StatusBarUI);
   });
