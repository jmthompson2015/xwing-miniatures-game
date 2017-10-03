"use strict";

define(["common/js/InputValidator"], function(InputValidator)
{
   var AgentSquadAction = {};

   // AgentSquadUI
   AgentSquadAction.SET_AGENT = "setAgent";
   AgentSquadAction.SET_AGENT_NAME = "setAgentName";
   AgentSquadAction.SET_AGENT_TYPE = "setAgentType";
   AgentSquadAction.SET_FACTION = "setFaction";
   AgentSquadAction.SET_INPUT_AREA_ID = "setInputAreaId";
   AgentSquadAction.SET_RESOURCE_BASE = "setResourceBase";
   AgentSquadAction.SET_SQUAD_BUILDER_TYPE = "setSquadBuilderType";

   // SquadBuilderUI
   AgentSquadAction.RESET = "reset";
   AgentSquadAction.SET_DELEGATE_STORE = "setDelegateStore";
   AgentSquadAction.SET_DISPLAY_ITEM = "setDisplayItem";
   AgentSquadAction.SET_PILOT = "setPilot";
   AgentSquadAction.SET_PILOT_UPGRADE = "setPilotUpgrade";
   AgentSquadAction.SET_SHIP = "setShip";
   AgentSquadAction.SET_SQUAD = "setSquad";

   /////////////////////////////////////////////////////////////////////////////
   // AgentSquadUI

   AgentSquadAction.setAgent = function(agent)
   {
      InputValidator.validateNotNull("agent", agent);

      return (
      {
         type: this.SET_AGENT,
         agent: agent,
      });
   };

   AgentSquadAction.setAgentName = function(agentName)
   {
      InputValidator.validateNotNull("agentName", agentName);

      return (
      {
         type: this.SET_AGENT_NAME,
         agentName: agentName,
      });
   };

   AgentSquadAction.setAgentType = function(agentType)
   {
      InputValidator.validateNotNull("agentType", agentType);

      return (
      {
         type: this.SET_AGENT_TYPE,
         agentType: agentType,
      });
   };

   AgentSquadAction.setFaction = function(faction)
   {
      InputValidator.validateNotNull("faction", faction);

      return (
      {
         type: this.SET_FACTION,
         faction: faction,
      });
   };

   AgentSquadAction.setInputAreaId = function(inputAreaId)
   {
      InputValidator.validateNotNull("inputAreaId", inputAreaId);

      return (
      {
         type: this.SET_INPUT_AREA_ID,
         inputAreaId: inputAreaId,
      });
   };

   AgentSquadAction.setResourceBase = function(resourceBase)
   {
      InputValidator.validateNotNull("resourceBase", resourceBase);

      return (
      {
         type: this.SET_RESOURCE_BASE,
         resourceBase: resourceBase,
      });
   };

   AgentSquadAction.setSquadBuilderType = function(squadBuilderType)
   {
      InputValidator.validateNotNull("squadBuilderType", squadBuilderType);

      return (
      {
         type: this.SET_SQUAD_BUILDER_TYPE,
         squadBuilderType: squadBuilderType,
      });
   };

   /////////////////////////////////////////////////////////////////////////////
   // SquadBuilderUI

   AgentSquadAction.reset = function()
   {
      return (
      {
         type: this.RESET,
      });
   };

   AgentSquadAction.setDelegateStore = function(delegateStore)
   {
      InputValidator.validateNotNull("delegateStore", delegateStore);

      return (
      {
         type: this.SET_DELEGATE_STORE,
         delegateStore: delegateStore,
      });
   };

   AgentSquadAction.setDisplayItem = function(displayItem)
   {
      // displayItem optional.

      return (
      {
         type: this.SET_DISPLAY_ITEM,
         displayItem: displayItem,
      });
   };

   AgentSquadAction.setPilot = function(pilot, index)
   {
      // pilot optional.
      InputValidator.validateIsNumber("index", index);

      return (
      {
         type: this.SET_PILOT,
         pilot: pilot,
         index: index,
      });
   };

   AgentSquadAction.setPilotUpgrade = function(pilotIndex, upgrade, upgradeIndex)
   {
      InputValidator.validateIsNumber("pilotIndex", pilotIndex);
      // upgrade optional.
      InputValidator.validateIsNumber("upgradeIndex", upgradeIndex);

      return (
      {
         type: this.SET_PILOT_UPGRADE,
         pilotIndex: pilotIndex,
         upgrade: upgrade,
         upgradeIndex: upgradeIndex,
      });
   };

   AgentSquadAction.setShip = function(ship, index)
   {
      // ship optional.
      InputValidator.validateIsNumber("index", index);

      return (
      {
         type: this.SET_SHIP,
         ship: ship,
         index: index,
      });
   };

   AgentSquadAction.setSquad = function(squad)
   {
      InputValidator.validateNotNull("squad", squad);

      return (
      {
         type: this.SET_SQUAD,
         squad: squad,
      });
   };

   if (Object.freeze)
   {
      Object.freeze(AgentSquadAction);
   }

   return AgentSquadAction;
});
