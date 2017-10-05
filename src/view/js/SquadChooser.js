"use strict";

define(["create-react-class", "prop-types", "react", "react-dom-factories", "common/js/InputValidator",
  "view/js/Select", "view/js/SquadUI"],
   function(createReactClass, PropTypes, React, DOM, InputValidator, Select, SquadUI)
   {
      var SquadChooser = createReactClass(
      {
         propTypes:
         {
            agent: PropTypes.object.isRequired,
            resourceBase: PropTypes.string.isRequired,
            squadBuilders: PropTypes.array.isRequired,

            onChange: PropTypes.func,
         },

         getInitialState: function()
         {
            var squadBuilders = this.props.squadBuilders;
            InputValidator.validateNotEmpty("squadBuilders", squadBuilders);

            return (
            {
               squadBuilder: squadBuilders[0],
            });
         },

         render: function()
         {
            var squadLabelFunction = function(value)
            {
               return value.toString();
            };
            var squadBuilders = this.props.squadBuilders;
            var selectedSquadBuilder = this.state.squadBuilder;
            var squadChooserSelect = React.createElement(Select,
            {
               values: squadBuilders,
               labelFunction: squadLabelFunction,
               initialSelectedValue: selectedSquadBuilder,
               onChange: this.handleSquadChange,
            });
            var agent = this.props.agent;
            var mySquad = selectedSquadBuilder.buildSquad(agent);
            var squadDisplayPanel = React.createElement(SquadUI,
            {
               resourceBase: this.props.resourceBase,
               squad: mySquad,
            });

            var rows = [];
            var cells = [];
            cells.push(DOM.td(
            {
               key: "squadLabel",
            }, "Squad:"));
            cells.push(DOM.td(
            {
               key: "squadChooserSelect",
               className: "squadChooserSelect",
            }, squadChooserSelect));
            rows.push(DOM.tr(
            {
               key: "selectRow",
            }, cells));

            rows.push(DOM.tr(
            {
               key: "displayRow",
            }, DOM.td(
            {
               colSpan: 2,
            }, squadDisplayPanel)));

            return DOM.table(
            {
               className: "squadChooser",
            }, DOM.tbody(
            {}, rows));
         },

         handleSquadChange: function(event)
         {
            LOGGER.debug("SquadChooser.handleSquadChange() event.target.selectedIndex = " + event.target.selectedIndex);
            var squadBuilder = this.props.squadBuilders[event.target.selectedIndex];
            this.setState(
            {
               squadBuilder: squadBuilder,
            });
            LOGGER.debug("SquadChooser.handleSquadChange() squadBuilder = " + squadBuilder);

            if (this.props.onChange)
            {
               this.props.onChange(squadBuilder);
            }
         },
      });

      return SquadChooser;
   });
