"use strict";

define(["create-react-class", "prop-types", "react", "react-dom-factories", "react-redux",
  "view/js/Button", "view/js/OptionPane"],
   function(createReactClass, PropTypes, React, DOM, ReactRedux, Button, OptionPane)
   {
      var NewGamePanel = createReactClass(
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
            var agentSquad1 = React.createElement(ReactRedux.Provider,
            {
               store: this.props.store1,
            }, React.createElement(this.props.agentSquadClass,
            {
               agentNumber: 1,
               resourceBase: this.props.resourceBase,
            }));
            var agentSquad2 = React.createElement(ReactRedux.Provider,
            {
               store: this.props.store2,
            }, React.createElement(this.props.agentSquadClass,
            {
               agentNumber: 2,
               resourceBase: this.props.resourceBase,
            }));
            var cell1 = DOM.td(
            {
               className: "newGamePanel ba bg-xw-light center v-top",
            }, agentSquad1);
            var cell2 = DOM.td(
            {
               className: "newGamePanel ba bg-xw-light center v-top",
            }, agentSquad2);

            var message = DOM.table(
            {}, DOM.tbody(
            {}, DOM.tr(
            {}, cell1, cell2)));
            var initialInput;
            var okButton = React.createElement(Button,
            {
               key: 0,
               name: "OK",
               onClick: this.ok,
            });
            var buttons = DOM.span(
            {}, [okButton]);

            return React.createElement(OptionPane,
            {
               title: "New Game",
               message: message,
               initialInput: initialInput,
               buttons: buttons,
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
