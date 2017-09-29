"use strict";

define(["create-react-class", "prop-types", "react-dom-factories"],
   function(createClassReact, PropTypes, DOM)
   {
      var StatusBarUI = createClassReact(
      {
         propTypes:
         {
            activeShipName: PropTypes.string.isRequired,
            phase: PropTypes.object.isRequired,
            round: PropTypes.number.isRequired,
            userMessage: PropTypes.string.isRequired,
         },

         render: function()
         {
            var round = this.props.round;
            var phase = this.props.phase;
            var phaseName = (phase ? phase.name : " ");
            var activeShipName = (this.props.activeShipName ? this.props.activeShipName : " ");
            var userMessage = this.props.userMessage;

            var roundUI = DOM.span(
            {}, "Round: ", round);
            var phaseUI = DOM.span(
            {}, "Phase: ", phaseName);
            var activePilotUI = DOM.span(
            {}, "Active Ship: ", activeShipName);
            var messageAreaUI = DOM.span(
            {}, userMessage);
            var helpLinkUI = DOM.a(
            {
               href: "help.html",
               target: "_blank",
            }, "Help");

            var cells = [];

            cells.push(DOM.td(
            {
               key: cells.length,
               className: "statusBarUICell",
            }, roundUI));
            cells.push(DOM.td(
            {
               key: cells.length,
               className: "statusBarUICell",
            }, phaseUI));
            cells.push(DOM.td(
            {
               key: cells.length,
               className: "statusBarUICell",
            }, activePilotUI));
            cells.push(DOM.td(
            {
               key: cells.length,
               className: "statusBarUICell",
            }, messageAreaUI));
            cells.push(DOM.td(
            {
               key: cells.length,
               className: "statusBarUICell",
            }, helpLinkUI));

            var row = DOM.tr(
            {}, cells);

            return DOM.table(
            {
               className: "statusBarUI",
            }, DOM.tbody(
            {}, row));
         },
      });

      return StatusBarUI;
   });
