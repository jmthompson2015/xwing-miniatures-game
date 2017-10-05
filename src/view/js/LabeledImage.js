"use strict";

define(["create-react-class", "prop-types", "react", "react-dom-factories"],
   function(createReactClass, PropTypes, React, DOM)
   {
      var LabeledImage = createReactClass(
      {
         propTypes:
         {
            image: PropTypes.string.isRequired,
            resourceBase: PropTypes.string.isRequired,
            label: PropTypes.string.isRequired,

            // default: 32
            height: PropTypes.number,
            // default: undefined
            labelClass: PropTypes.string,
            // default: false
            showOne: PropTypes.bool,
            // default: undefined
            title: PropTypes.string,
            // default: 32
            width: PropTypes.number,
         },

         render: function()
         {
            var answer;
            var label = this.props.label;
            var containerStyle = this.createContainerStyle();
            var title = this.props.title;

            if (!this.props.showOne && label === "1")
            {
               answer = DOM.div(
               {
                  title: title,
                  style: containerStyle,
               });
            }
            else
            {
               var cell = DOM.div(
               {
                  className: this.props.labelClass,
                  style:
                  {
                     display: "table-cell",
                     verticalAlign: "middle",
                  },
               }, label);

               answer = DOM.div(
               {
                  title: title,
                  style: containerStyle,
               }, cell);
            }

            return answer;
         },

         createContainerStyle: function()
         {
            var height = (this.props.height !== undefined ? this.props.height : 32);
            var width = (this.props.width !== undefined ? this.props.width : 32);

            return (
            {
               backgroundImage: 'url(' + this.props.resourceBase + this.props.image + ')',
               backgroundPosition: "alignCenter",
               backgroundRepeat: "no-repeat",
               display: "table",
               minHeight: height,
               minWidth: width,
            });
         },
      });

      return LabeledImage;
   });
