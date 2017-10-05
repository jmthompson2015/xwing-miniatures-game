"use strict";

define(["create-react-class", "prop-types", "react", "react-dom-factories", "view/js/PilotCardCompactUI"],
   function(createReactClass, PropTypes, React, DOM, PilotCardCompactUI)
   {
      var PilotsUI = createReactClass(
      {
         propTypes:
         {
            tokens: PropTypes.array.isRequired,
            resourceBase: PropTypes.string.isRequired,
         },

         render: function()
         {
            var tokens = this.props.tokens;

            var tokenElements = tokens.map(function(token, i)
            {
               var element = React.createElement(PilotCardCompactUI,
               {
                  resourceBase: this.props.resourceBase,
                  token: token,
               });
               return DOM.td(
               {
                  key: i,
                  className: "alignTop",
               }, element);
            }, this);

            var row = DOM.tr(
            {}, tokenElements);

            var myTable = DOM.table(
            {
               style:
               {
                  "marginLeft": "auto",
                  "marginRight": "auto",
                  "textAlign": "center",
               },
            }, DOM.tbody(
            {}, row));

            return DOM.div(
            {}, myTable);
         },
      });

      return PilotsUI;
   });
