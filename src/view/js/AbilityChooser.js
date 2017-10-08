"use strict";

define(["create-react-class", "prop-types", "react", "react-dom-factories", "common/js/ArrayAugments",
  "view/js/Button", "view/js/EntityUI", "view/js/InputPanel", "view/js/OptionPane"],
   function(createReactClass, PropTypes, React, DOM, ArrayAugments,
      Button, EntityUI, InputPanel, OptionPane)
   {
      var AbilityChooser = createReactClass(
      {
         propTypes:
         {
            damages: PropTypes.array.isRequired,
            resourceBase: PropTypes.string.isRequired,
            onChange: PropTypes.func.isRequired,
            pilots: PropTypes.array.isRequired,
            shipActions: PropTypes.array.isRequired,
            token: PropTypes.object.isRequired,
            upgrades: PropTypes.array.isRequired,
         },

         render: function()
         {
            var token = this.props.token;
            var damages = this.props.damages;
            var pilots = this.props.pilots;
            var shipActions = this.props.shipActions;
            var upgrades = this.props.upgrades;
            var resourceBase = this.props.resourceBase;

            var message = "Active Ship: " + token.name();
            var okButton = React.createElement(Button,
            {
               key: 0,
               name: "Pass",
               onClick: this.ok,
            });
            var buttons = DOM.span(
            {}, [okButton]);

            var labelFunction = function(value)
            {
               var answer = React.createElement(EntityUI,
               {
                  context: value.context(),
                  entity: value.sourceObject(),
                  resourceBase: resourceBase,
               });

               return answer;
            };

            var values = shipActions.slice();
            values.xwingAddAll(pilots);
            values.xwingAddAll(upgrades);
            values.xwingAddAll(damages);

            var initialInput = React.createElement(InputPanel,
            {
               type: InputPanel.Type.RADIO,
               values: values,
               name: "selectUpgrade",
               labelFunction: labelFunction,
               onChange: this.myOnChange,
               panelClass: "combatChoicePanel f6 tl",
            });

            var title = "Select Ability";

            return React.createElement(OptionPane,
            {
               panelClass: "optionPane bg-xw-light",
               title: title,
               titleClass: "optionPaneTitle bg-moon-gray",
               message: message,
               messageClass: "combatMessage",
               initialInput: initialInput,
               buttons: buttons,
               buttonsClass: "optionPaneButtons pa2 tr",
            });
         },

         myOnChange: function(event, selected)
         {
            LOGGER.trace("AbilityChooser.myOnChange()");
            LOGGER.debug("AbilityChooser.myOnChange() selected = " + selected + " " + (typeof selected));

            var isAccepted = (selected !== undefined);
            this.props.onChange(selected, isAccepted);
         },

         ok: function()
         {
            var isAccepted = false;
            this.props.onChange(undefined, undefined, undefined, isAccepted);
         },
      });

      return AbilityChooser;
   });
