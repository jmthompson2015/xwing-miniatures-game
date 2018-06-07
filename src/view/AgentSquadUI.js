import Faction from "../artifact/Faction.js";

import Select from "./Select.js";
import SquadChooser from "./SquadChooser.js";

class AgentSquadUI extends React.Component
{
   constructor(props)
   {
      super(props);

      this.handleAgentNameChange = this.handleAgentNameChangeFunction.bind(this);
      this.handleAgentTypeChange = this.handleAgentTypeChangeFunction.bind(this);
      this.handleFactionChange = this.handleFactionChangeFunction.bind(this);
      this.handleSquadBuilderChange = this.handleSquadBuilderChangeFunction.bind(this);
      this.handleSquadBuilderTypeChange = this.handleSquadBuilderTypeChangeFunction.bind(this);
   }

   render()
   {
      const factionUI = this.createFactionSelect();
      const agentNameUI = this.createAgentNameUI();
      const agentTypeUI = this.createAgentTypeSelect();
      const squadBuilderTypeUI = this.createSquadBuilderTypeSelect();
      const squadChooserPanel = this.createSquadChooserPanel();

      const rows = [];

      rows.push(ReactDOMFactories.tr(
      {
         key: "agentRow",
      }, ReactDOMFactories.td(
      {
         className: "agentTitle b tc",
         colSpan: 2,
      }, "Agent " + this.props.agentNumber)));

      rows.push(ReactDOMFactories.tr(
      {
         key: "factionRow",
      }, ReactDOMFactories.td(
      {
         key: "factionLabel",
      }, "Faction:"), ReactDOMFactories.td(
      {
         key: "factionValue",
      }, factionUI)));

      rows.push(ReactDOMFactories.tr(
      {
         key: "agentNameRow",
      }, ReactDOMFactories.td(
      {
         key: "agentNameLabel",
      }, "Agent Name:"), ReactDOMFactories.td(
      {
         key: "agentNameValue",
      }, agentNameUI)));

      rows.push(ReactDOMFactories.tr(
      {
         key: "agentTypeRow",
      }, ReactDOMFactories.td(
      {
         key: "agentTypeLabel",
      }, "Agent Type:"), ReactDOMFactories.td(
      {
         key: "agentTypeValue",
      }, agentTypeUI)));

      rows.push(ReactDOMFactories.tr(
      {
         key: "squadTypeRow",
      }, ReactDOMFactories.td(
      {
         key: "squadTypeLabel",
      }, "Squad Type:"), ReactDOMFactories.td(
      {
         key: "squadTypeValue",
      }, squadBuilderTypeUI)));

      rows.push(ReactDOMFactories.tr(
      {
         key: "squadChooserRow",
      }, ReactDOMFactories.td(
      {
         colSpan: 2,
      }, squadChooserPanel)));

      return ReactDOMFactories.table(
      {
         className: "agentPanel f5 tl",
      }, ReactDOMFactories.tbody(
      {}, rows));
   }
}

AgentSquadUI.prototype.createAgentNameUI = function()
{
   const agentName = this.props.agentName;

   return ReactDOMFactories.input(
   {
      type: "text",
      className: "f6",
      defaultValue: agentName,
      onChange: this.handleAgentNameChange,
   });
};

AgentSquadUI.prototype.createAgentTypeSelect = function()
{
   const typeNames = this.props.agentTypes.map(function(agentType)
   {
      return agentType.name;
   });
   const typeName = this.props.agentType.name;

   return React.createElement(Select,
   {
      values: typeNames,
      initialSelectedValue: typeName,
      onChange: this.handleAgentTypeChange,
   });
};

AgentSquadUI.prototype.createFactionSelect = function()
{
   const faction = this.props.faction;
   const factionLabelFunction = function(value)
   {
      let answer = Faction.properties[value].name;
      const friendKey = Faction.friend(value);
      if (friendKey)
      {
         answer += " + " + Faction.properties[friendKey].name;
      }
      return answer;
   };

   return React.createElement(Select,
   {
      values: AgentSquadUI.factionKeys,
      labelFunction: factionLabelFunction,
      initialSelectedValue: faction.key,
      onChange: this.handleFactionChange,
   });
};

AgentSquadUI.prototype.createSquadChooserPanel = function()
{
   let squadChooserPanel;
   const squadType = this.props.squadBuilderType;
   const factionKey = this.props.faction.key;

   if (squadType === AgentSquadUI.PREFABRICATED)
   {
      const agent = this.props.agent;
      const squadBuilders = this.props.squadBuilders;
      squadChooserPanel = React.createElement(SquadChooser,
      {
         key: squadType + factionKey,
         agent: agent,
         resourceBase: this.props.resourceBase,
         name: "agent" + this.props.agentNumber,
         onChange: this.handleSquadBuilderChange,
         squadBuilders: squadBuilders,
      });
   }
   else if (squadType === AgentSquadUI.CUSTOM)
   {
      squadChooserPanel = React.createElement(this.props.squadBuilderClass,
      {
         key: squadType + factionKey,
         faction: this.props.faction,
         resourceBase: this.props.resourceBase,
         store: this.context.store,
      });
   }
   else
   {
      throw "Unknown squadType: " + squadType;
   }

   return squadChooserPanel;
};

AgentSquadUI.prototype.createSquadBuilderTypeSelect = function()
{
   return React.createElement(Select,
   {
      values: AgentSquadUI.squadBuilderTypes,
      initialSelectedValue: this.props.squadBuilderType,
      onChange: this.handleSquadBuilderTypeChange,
   });
};

AgentSquadUI.prototype.handleAgentNameChangeFunction = function(event)
{
   const name = event.target.value;
   LOGGER.debug("AgentSquadUI.handleAgentNameChange() name = " + name);
   this.props.agentNameChanged(name);
};

AgentSquadUI.prototype.handleAgentTypeChangeFunction = function(event)
{
   const selected = event.target.value;
   LOGGER.debug("AgentSquadUI.handleAgentTypeChange() selected = " + selected);
   const agentType = this.props.agentTypes.reduce(function(accumulator, agentType)
   {
      if (selected === agentType.name)
      {
         accumulator = agentType;
      }
      return accumulator;
   });
   this.props.agentTypeChanged(agentType);
};

AgentSquadUI.prototype.handleFactionChangeFunction = function(event)
{
   const selected = event.target.value;
   LOGGER.debug("AgentSquadUI.handleFactionChange() selected = " + selected);
   const faction = Faction.properties[selected];
   this.props.factionChanged(faction);
};

AgentSquadUI.prototype.handleSquadChange = function(squad)
{
   LOGGER.debug("AgentSquadUI.handleSquadChange() squad = " + squad);
   this.props.squadChanged(squad);
};

AgentSquadUI.prototype.handleSquadBuilderChangeFunction = function(squadBuilder)
{
   LOGGER.debug("AgentSquadUI.handleBuilderSquadChange() squadBuilder = " + squadBuilder);
   const agent = this.props.agent;
   const squad = squadBuilder.buildSquad(agent);
   this.props.squadChanged(squad);
};

AgentSquadUI.prototype.handleSquadBuilderTypeChangeFunction = function(event)
{
   const selected = event.target.value;
   LOGGER.debug("AgentSquadUI.handleSquadBuilderTypeChange() selected = " + selected);
   this.props.squadBuilderTypeChanged(selected);
};

AgentSquadUI.factionKeys = [Faction.IMPERIAL, Faction.REBEL, Faction.SCUM];
AgentSquadUI.CUSTOM = "Custom";
AgentSquadUI.PREFABRICATED = "Prefabricated";
AgentSquadUI.squadBuilderTypes = [AgentSquadUI.PREFABRICATED, AgentSquadUI.CUSTOM];

AgentSquadUI.contextTypes = {
   store: PropTypes.object.isRequired,
};

AgentSquadUI.propTypes = {
   agent: PropTypes.object.isRequired,
   agentName: PropTypes.string.isRequired,
   agentNumber: PropTypes.number.isRequired,
   agentType: PropTypes.object.isRequired,
   agentTypes: PropTypes.array.isRequired,
   faction: PropTypes.object.isRequired,
   resourceBase: PropTypes.string.isRequired,
   squad: PropTypes.object.isRequired,
   squadBuilderClass: PropTypes.func.isRequired,
   squadBuilderType: PropTypes.string.isRequired,
   squadBuilders: PropTypes.array.isRequired,

   // callbacks
   agentNameChanged: PropTypes.func.isRequired,
   agentTypeChanged: PropTypes.func.isRequired,
   factionChanged: PropTypes.func.isRequired,
   squadBuilderTypeChanged: PropTypes.func.isRequired,
   squadChanged: PropTypes.func.isRequired,

   inputAreaId: PropTypes.string,
};

AgentSquadUI.defaultProps = {
   inputAreaId: "inputArea",
};

export default AgentSquadUI;