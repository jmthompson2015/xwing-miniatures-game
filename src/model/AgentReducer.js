import AgentAction from "./AgentAction.js";

const AgentReducer = {};

AgentReducer.reduce = function(state, action)
{
   LOGGER.debug("AgentReducer.reduce() type = " + action.type);

   let agentId, cardId, index;
   let oldPilots;

   switch (action.type)
   {
      case AgentAction.ADD_PILOT:
         agentId = action.agent.id();
         cardId = action.cardInstance.id();
         oldPilots = (state.agentPilots.get(agentId) !== undefined ? state.agentPilots.get(agentId) : Immutable.List());
         return Object.assign(
         {}, state,
         {
            agentPilots: state.agentPilots.set(agentId, oldPilots.push(cardId)),
         });
      case AgentAction.INCREMENT_NEXT_AGENT_ID:
         return Object.assign(
         {}, state,
         {
            nextAgentId: state.nextAgentId + 1,
         });
      case AgentAction.REMOVE_PILOT:
         agentId = action.agent.id();
         cardId = action.cardInstance.id();
         oldPilots = (state.agentPilots.get(agentId) !== undefined ? state.agentPilots.get(agentId) : Immutable.List());
         index = oldPilots.indexOf(cardId);
         const newPilots = (index >= 0 ? oldPilots.delete(index) : oldPilots);
         return Object.assign(
         {}, state,
         {
            agentPilots: state.agentPilots.set(agentId, newPilots),
         });
      default:
         LOGGER.warn("AgentReducer.root: Unhandled action type: " + action.type);
         return state;
   }
};

if (Object.freeze)
{
   Object.freeze(AgentReducer);
}

export default AgentReducer;