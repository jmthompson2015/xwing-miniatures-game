"use strict";

define(["react-redux", "model/js/AgentSquadAction", "model/js/MediumAgent", "model/js/SimpleAgent", "model/js/SquadBuilder",
  "view/js/AgentSquadUI", "controller/js/HumanAgent", "controller/js/SquadBuilderContainer"],
   function(ReactRedux, AgentSquadAction, MediumAgent, SimpleAgent, SquadBuilder, AgentSquadUI, HumanAgent, SquadBuilderContainer)
   {
      function mapStateToProps(state, ownProps)
      {
         var squadBuilders = SquadBuilder.findByFaction(state.faction.key);

         return (
         {
            agent: state.agent,
            agentName: state.agentName,
            agentNumber: ownProps.agentNumber,
            agentType: state.agentType,
            agentTypes: [SimpleAgent, MediumAgent, HumanAgent],
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

      return ReactRedux.connect(mapStateToProps, mapDispatchToProps)(AgentSquadUI);
   });
