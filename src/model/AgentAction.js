import InputValidator from "../utility/InputValidator.js";

var AgentAction = {};

AgentAction.ADD_PILOT = "addPilot";
AgentAction.INCREMENT_NEXT_AGENT_ID = "incrementNextAgentId";
AgentAction.REMOVE_PILOT = "removePilot";

AgentAction.addPilot = function(agent, cardInstance)
{
   InputValidator.validateNotNull("agent", agent);
   InputValidator.validateNotNull("cardInstance", cardInstance);

   return (
   {
      type: AgentAction.ADD_PILOT,
      agent: agent,
      cardInstance: cardInstance,
   });
};

AgentAction.incrementNextAgentId = function()
{
   return (
   {
      type: AgentAction.INCREMENT_NEXT_AGENT_ID,
   });
};

AgentAction.removePilot = function(agent, cardInstance)
{
   InputValidator.validateNotNull("agent", agent);
   InputValidator.validateNotNull("cardInstance", cardInstance);

   return (
   {
      type: AgentAction.REMOVE_PILOT,
      agent: agent,
      cardInstance: cardInstance,
   });
};

export default AgentAction;