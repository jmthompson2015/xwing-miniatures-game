"use strict";

define(["create-react-class", "prop-types", "react", "react-dom-factories"],
   function(createClassReact, PropTypes, React, DOM)
   {
      var ImplementedImage = createClassReact(
      {
         propTypes:
         {
            resourceBase: PropTypes.string.isRequired,

            isImplemented: PropTypes.bool,
         },

         render: function()
         {
            var isImplemented = this.props.isImplemented;
            var answer;

            if (isImplemented !== undefined)
            {
               var resourceBase = this.props.resourceBase;
               var src = resourceBase + "icon/" + (isImplemented ? "accept.png" : "delete.png");
               var title = (isImplemented ? "Implemented" : "Not Implemented");

               answer = DOM.img(
               {
                  src: src,
                  title: title,
               });
            }
            else
            {
               answer = DOM.span(
               {});
            }

            return answer;
         },
      });

      return ImplementedImage;
   });
