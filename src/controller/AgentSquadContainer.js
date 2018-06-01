import AgentSquadAction from "../model/AgentSquadAction.js";
import MediumAgentStrategy from "../model/MediumAgentStrategy.js";
import SimpleAgentStrategy from "../model/SimpleAgentStrategy.js";
import SquadBuilder from "../model/SquadBuilder.js";

import AgentSquadUI from "../view/AgentSquadUI.js";

import HumanAgentStrategy from "./HumanAgentStrategy.js";
import SquadBuilderContainer from "./SquadBuilderContainer.js";

// AgentSquadContainer

function mapStateToProps(state, ownProps)
{
   var squadBuilders = SquadBuilder.findByFaction(state.faction.key);

   return (
   {
      agent: state.agent,
      agentName: state.agentName,
      agentNumber: ownProps.agentNumber,
      agentType: state.agentType,
      agentTypes: [SimpleAgentStrategy, MediumAgentStrategy, HumanAgentStrategy],
      faction: state.faction,
      resourceBase: ownProps.resourceBase,
      squad: state.squad,
      squadBuilderClass: SquadBuilderContainer,
      squadBuilderType: state.squadBuilderType,
      squadBuilders: squadBuilders,
   });
}

function mapDispatchToProps(dispatch)
{
   return (
   {
      agentNameChanged: function(agentName)
      {
         dispatch(AgentSquadAction.setAgentName(agentName));
      },
      agentTypeChanged: function(agentType)
      {
         dispatch(AgentSquadAction.setAgentType(agentType));
      },
      factionChanged: function(faction)
      {
         dispatch(AgentSquadAction.setFaction(faction));
      },
      squadBuilderTypeChanged: function(squadBuilderType)
      {
         dispatch(AgentSquadAction.setSquadBuilderType(squadBuilderType));
      },
      squadChanged: function(squad)
      {
         dispatch(AgentSquadAction.setSquad(squad));
      },
   });
}

export default ReactRedux.connect(mapStateToProps, mapDispatchToProps)(AgentSquadUI);