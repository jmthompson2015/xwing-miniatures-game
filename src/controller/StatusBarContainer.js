import Phase from "../artifact/Phase.js";

import StatusBarUI from "../view/StatusBarUI.js";

// StatusBarContainer

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

export default ReactRedux.connect(mapStateToProps)(StatusBarUI);