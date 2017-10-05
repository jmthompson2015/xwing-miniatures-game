"use strict";

define(["create-react-class", "prop-types", "react", "react-dom-factories", "artifact/js/Faction", "view/js/Select", "view/js/SquadChooser"],
   function(createReactClass, PropTypes, React, DOM, Faction, Select, SquadChooser)
   {
      var AgentSquadUI = createReactClass(
      {
         render: function()
         {
            var factionUI = this.createFactionSelect();
            var agentNameUI = this.createAgentNameUI();
            var agentTypeUI = this.createAgentTypeSelect();
            var squadBuilderTypeUI = this.createSquadBuilderTypeSelect();
            var squadChooserPanel = this.createSquadChooserPanel();

            var rows = [];

            rows.push(DOM.tr(
            {
               key: "agentRow",
            }, DOM.td(
            {
               className: "agentTitle",
               colSpan: 2,
            }, "Agent " + this.props.agentNumber)));

            rows.push(DOM.tr(
            {
               key: "factionRow",
            }, DOM.td(
            {
               key: "factionLabel",
            }, "Faction:"), DOM.td(
            {
               key: "factionValue",
            }, factionUI)));

            rows.push(DOM.tr(
            {
               key: "agentNameRow",
            }, DOM.td(
            {
               key: "agentNameLabel",
            }, "Agent Name:"), DOM.td(
            {
               key: "agentNameValue",
            }, agentNameUI)));

            rows.push(DOM.tr(
            {
               key: "agentTypeRow",
            }, DOM.td(
            {
               key: "agentTypeLabel",
            }, "Agent Type:"), DOM.td(
            {
               key: "agentTypeValue",
            }, agentTypeUI)));

            rows.push(DOM.tr(
            {
               key: "squadTypeRow",
            }, DOM.td(
            {
               key: "squadTypeLabel",
            }, "Squad Type:"), DOM.td(
            {
               key: "squadTypeValue",
            }, squadBuilderTypeUI)));

            rows.push(DOM.tr(
            {
               key: "squadChooserRow",
            }, DOM.td(
            {
               colSpan: 2,
            }, squadChooserPanel)));

            return DOM.table(
            {
               className: "agentPanel",
            }, DOM.tbody(
            {}, rows));
         },

         createAgentNameUI: function()
         {
            var agentName = this.props.agentName;

            return DOM.input(
            {
               type: "text",
               defaultValue: agentName,
               onChange: this.handleAgentNameChange,
            });
         },

         createAgentTypeSelect: function()
         {
            var typeNames = this.props.agentTypes.map(function(agentType)
            {
               return agentType.name;
            });
            var typeName = this.props.agentType.name;

            return React.createElement(Select,
            {
               values: typeNames,
               initialSelectedValue: typeName,
               onChange: this.handleAgentTypeChange,
            });
         },

         createFactionSelect: function()
         {
            var faction = this.props.faction;
            var factionLabelFunction = function(value)
            {
               var answer = Faction.properties[value].name;
               var friendKey = Faction.friend(value);
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
         },

         createSquadChooserPanel: function()
         {
            var squadChooserPanel;
            var squadType = this.props.squadBuilderType;
            var factionKey = this.props.faction.key;

            if (squadType === AgentSquadUI.PREFABRICATED)
            {
               var agent = this.props.agent;
               var squadBuilders = this.props.squadBuilders;
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
               // squadChooserPanel = React.createElement(SquadBuilderContainer,
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
         },

         createSquadBuilderTypeSelect: function()
         {
            return React.createElement(Select,
            {
               values: AgentSquadUI.squadBuilderTypes,
               initialSelectedValue: this.props.squadBuilderType,
               onChange: this.handleSquadBuilderTypeChange,
            });
         },

         handleAgentNameChange: function(event)
         {
            var name = event.target.value;
            LOGGER.debug("AgentSquadUI.handleAgentNameChange() name = " + name);
            this.props.agentNameChanged(name);
         },

         handleAgentTypeChange: function(event)
         {
            var selected = event.target.value;
            LOGGER.debug("AgentSquadUI.handleAgentTypeChange() selected = " + selected);
            var agentType = this.props.agentTypes.reduce(function(accumulator, agentType)
            {
               if (selected === agentType.name)
               {
                  accumulator = agentType;
               }
               return accumulator;
            });
            this.props.agentTypeChanged(agentType);
         },

         handleFactionChange: function(event)
         {
            var selected = event.target.value;
            LOGGER.debug("AgentSquadUI.handleFactionChange() selected = " + selected);
            var faction = Faction.properties[selected];
            this.props.factionChanged(faction);
         },

         handleSquadChange: function(squad)
         {
            LOGGER.debug("AgentSquadUI.handleSquadChange() squad = " + squad);
            this.props.squadChanged(squad);
         },

         handleSquadBuilderChange: function(squadBuilder)
         {
            LOGGER.debug("AgentSquadUI.handleBuilderSquadChange() squadBuilder = " + squadBuilder);
            var agent = this.props.agent;
            var squad = squadBuilder.buildSquad(agent);
            this.props.squadChanged(squad);
         },

         handleSquadBuilderTypeChange: function(event)
         {
            var selected = event.target.value;
            LOGGER.debug("AgentSquadUI.handleSquadBuilderTypeChange() selected = " + selected);
            this.props.squadBuilderTypeChanged(selected);
         },
      });

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
         agentType: PropTypes.func.isRequired,
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

      return AgentSquadUI;
   });
