"use strict";

define(["create-react-class", "prop-types", "react", "react-dom-factories", "artifact/js/Maneuver",
  "view/js/ManeuverChooser", "view/js/OptionPane"],
   function(createClassReact, PropTypes, React, DOM, Maneuver, ManeuverChooser, OptionPane)
   {
      var PlanningPanel = createClassReact(
      {
         propTypes:
         {
            agent: PropTypes.object.isRequired,
            callback: PropTypes.func.isRequired,
            environment: PropTypes.object.isRequired,
            resourceBase: PropTypes.string.isRequired,
            tokens: PropTypes.array.isRequired,
         },

         getInitialState: function()
         {
            return (
            {
               tokenToManeuver:
               {},
            });
         },

         render: function()
         {
            var tokens = this.props.tokens;
            var self = this;
            var cells = [];

            for (var i = 0; i < tokens.length; i++)
            {
               var token = tokens[i];
               var maneuverKeys = token.maneuverKeys();
               var maneuvers = [];
               for (var m = 0; m < maneuverKeys.length; m++)
               {
                  maneuvers.push(Maneuver.properties[maneuverKeys[m]]);
               }
               var element = React.createElement(ManeuverChooser,
               {
                  callback: self.selectionChanged,
                  resourceBase: this.props.resourceBase,
                  maneuvers: maneuvers,
                  pilotName: token.pilotName(),
                  shipName: token.shipName(),
                  tokenId: token.id(),
               });
               cells.push(DOM.td(
               {
                  key: i,
                  className: "planningTableCell",
               }, element));
            }

            var initialInput = DOM.table(
            {}, DOM.tbody(
            {}, DOM.tr(
            {}, cells)));
            var disabled = Object.getOwnPropertyNames(this.state.tokenToManeuver).length < tokens.length;
            var buttons = DOM.button(
            {
               onClick: self.ok,
               disabled: disabled,
            }, "OK");
            return React.createElement(OptionPane,
            {
               message: "",
               panelClass: "optionPane",
               title: "Planning: Select Maneuvers",
               titleClass: "optionPaneTitle",
               initialInput: initialInput,
               buttons: buttons,
               buttonsClass: "optionPaneButtons",
            });
         },

         ok: function()
         {
            var tokenToManeuver = this.state.tokenToManeuver;
            var callback = this.props.callback;

            callback(tokenToManeuver);
         },

         selectionChanged: function(tokenId, maneuverKey)
         {
            LOGGER.debug("selectionChanged() tokenId = " + tokenId + " maneuverKey = " + maneuverKey);
            var tokens = this.props.tokens;
            var store = (tokens.length > 0 ? tokens[0].store() : undefined);
            var token = store.getState().environment.getTokenById(parseInt(tokenId));
            var tokenToManeuver = this.state.tokenToManeuver;
            tokenToManeuver[token] = maneuverKey;

            this.setState(
            {
               tokenToManeuver: tokenToManeuver,
            });
         },
      });

      return PlanningPanel;
   });
