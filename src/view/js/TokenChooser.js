"use strict";

define(["create-react-class", "prop-types", "react", "react-dom-factories", "common/js/InputValidator",
  "view/js/InputPanel", "view/js/OptionPane"],
   function(createReactClass, PropTypes, React, DOM, InputValidator, InputPanel, OptionPane)
   {
      var TokenChooser = createReactClass(
      {
         propTypes:
         {
            tokens: PropTypes.array.isRequired,
            callback: PropTypes.func.isRequired,

            attacker: PropTypes.object,
            inputPanelName: PropTypes.string,
            title: PropTypes.string,
         },

         getInitialState: function()
         {
            InputValidator.validateNotEmpty("tokens", this.props.tokens);

            var tokens = this.props.tokens;

            return (
            {
               defender: tokens[0],
            });
         },

         render: function()
         {
            var title = (this.props.title !== undefined ? this.props.title : "Select Starfighter");
            var attacker = this.props.attacker;
            var tokens = this.props.tokens;

            var message = (this.props.attacker !== undefined ? DOM.div(
            {
               className: "attackerLabel"
            }, "Attacker: " + attacker.name()) : "");
            var inputPanelName = (this.props.inputPanelName ? this.props.inputPanelName : "tokenChooserRadioButtons");
            var idFunction = function(token)
            {
               return token.id();
            };
            var labelFunction = function(token)
            {
               return token.name();
            };
            var initialValue = this.state.defender;
            var initialInput = React.createElement(InputPanel,
            {
               type: InputPanel.Type.RADIO,
               values: tokens,
               name: inputPanelName,
               idFunction: idFunction,
               labelFunction: labelFunction,
               initialValues: initialValue,
               onChange: this.selectionChanged,
               panelClass: "optionPaneInput",
            });

            var cancelButton = DOM.button(
            {
               key: 0,
               onClick: this.cancel,
            }, "Cancel");
            var okButton = DOM.button(
            {
               key: 1,
               onClick: this.ok,
            }, "OK");
            var buttons = DOM.span(
            {}, [cancelButton, okButton]);

            return React.createElement(OptionPane,
            {
               panelClass: "optionPane",
               title: title,
               titleClass: "optionPaneTitle",
               message: message,
               messageClass: "optionPaneMessage",
               initialInput: initialInput,
               buttons: buttons,
               buttonsClass: "optionPaneButtons",
            });
         },

         selectionChanged: function(event, defender)
         {
            LOGGER.debug("selectionChanged() defender = " + defender);
            this.setState(
            {
               defender: defender,
            });
         },

         cancel: function()
         {
            LOGGER.debug("cancel()");
            this.props.callback(undefined);
         },

         ok: function()
         {
            LOGGER.debug("ok()");
            this.props.callback(this.state.defender);
         },
      });

      return TokenChooser;
   });
