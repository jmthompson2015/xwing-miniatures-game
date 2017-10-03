"use strict";

define(["create-react-class", "prop-types", "react", "react-dom-factories", "react-redux", "artifact/js/Faction",
  "view/js/AgentSquadUI", "view/js/OptionPane"],
   function(createClassReact, PropTypes, React, DOM, ReactRedux, Faction, AgentSquadUI, OptionPane)
   {
      var NewGamePanel = createClassReact(
      {
         propTypes:
         {
            agentSquadClass: PropTypes.func.isRequired,
            resourceBase: PropTypes.string.isRequired,
            store1: PropTypes.object.isRequired,
            store2: PropTypes.object.isRequired,

            callback: PropTypes.func,
         },

         render: function()
         {
            var agentPanel1 = React.createElement(ReactRedux.Provider,
            {
               store: this.props.store1,
            }, React.createElement(this.props.agentSquadClass,
            {
               agentNumber: 1,
               resourceBase: this.props.resourceBase,
            }));
            var agentPanel2 = React.createElement(ReactRedux.Provider,
            {
               store: this.props.store2,
            }, React.createElement(this.props.agentSquadClass,
            {
               agentNumber: 2,
               resourceBase: this.props.resourceBase,
            }));
            var cell1 = DOM.td(
            {
               className: "newGamePanel",
            }, agentPanel1);
            var cell2 = DOM.td(
            {
               className: "newGamePanel",
            }, agentPanel2);

            var message = DOM.table(
            {}, DOM.tbody(
            {}, DOM.tr(
            {}, cell1, cell2)));
            var initialInput;
            var okButton = DOM.button(
            {
               key: 0,
               onClick: this.ok,
            }, "OK");
            var buttons = DOM.span(
            {}, [okButton]);

            return React.createElement(OptionPane,
            {
               panelClass: "optionPane",
               title: "New Game",
               titleClass: "optionPaneTitle",
               message: message,
               messageClass: "optionPaneMessage",
               initialInput: initialInput,
               buttons: buttons,
               buttonsClass: "optionPaneButtons",
            });
         },

         ok: function()
         {
            var store1 = this.props.store1;
            var agent1 = store1.getState().agent;
            var squad1 = store1.getState().squad;

            var store2 = this.props.store2;
            var agent2 = store2.getState().agent;
            var squad2 = store2.getState().squad;

            this.props.callback(agent1, squad1, agent2, squad2);
         },
      });

      return NewGamePanel;
   });
