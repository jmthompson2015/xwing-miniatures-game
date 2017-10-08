"use strict";

define(["create-react-class", "prop-types", "react-dom-factories"],
   function(createReactClass, PropTypes, DOM)
   {
      var StatusBarUI = createReactClass(
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
               href: "view/html/help.html",
               target: "_blank",
            }, "Help");

            var cells = [];

            cells.push(DOM.td(
            {
               key: cells.length,
               className: "statusBarUICell ba",
            }, roundUI));
            cells.push(DOM.td(
            {
               key: cells.length,
               className: "statusBarUICell ba",
            }, phaseUI));
            cells.push(DOM.td(
            {
               key: cells.length,
               className: "statusBarUICell ba",
            }, activePilotUI));
            cells.push(DOM.td(
            {
               key: cells.length,
               className: "statusBarUICell ba",
            }, messageAreaUI));
            cells.push(DOM.td(
            {
               key: cells.length,
               className: "statusBarUICell ba",
            }, helpLinkUI));

            var row = DOM.tr(
            {}, cells);

            return DOM.table(
            {
               className: "statusBarUI bg-xw-light w-100",
            }, DOM.tbody(
            {}, row));
         },
      });

      return StatusBarUI;
   });
