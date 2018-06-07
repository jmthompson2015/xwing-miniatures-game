import Phase from "../artifact/Phase.js";

import StatusBarUI from "../view/StatusBarUI.js";

// StatusBarContainer

function mapStateToProps(state)
{
   const environment = state.environment;
   const activeToken = environment.getTokenById(state.activeCardId);
   const activeShipName = (activeToken ? activeToken.name() : "");

   return (
   {
      round: state.round,
      phase: Phase.properties[state.phaseKey],
      activeShipName: activeShipName,
      userMessage: state.userMessage,
   });
}

export default ReactRedux.connect(mapStateToProps)(StatusBarUI);