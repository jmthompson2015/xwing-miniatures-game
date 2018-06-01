var LabeledImage = createReactClass(
{
   render: function()
   {
      var answer;
      var label = this.props.label;
      var containerStyle = this.createContainerStyle();
      var title = this.props.title;

      if (!this.props.showOne && label === "1")
      {
         answer = ReactDOMFactories.div(
         {
            title: title,
            style: containerStyle,
         });
      }
      else
      {
         var cell = ReactDOMFactories.div(
         {
            className: this.props.labelClass,
            style:
            {
               display: "table-cell",
               verticalAlign: "middle",
            },
         }, label);

         answer = ReactDOMFactories.div(
         {
            title: title,
            style: containerStyle,
         }, cell);
      }

      return answer;
   },

   createContainerStyle: function()
   {
      var height = this.props.height;
      var width = this.props.width;

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

LabeledImage.propTypes = {
   image: PropTypes.string.isRequired,
   resourceBase: PropTypes.string.isRequired,
   label: PropTypes.string.isRequired,

   height: PropTypes.number,
   // default: undefined
   labelClass: PropTypes.string,
   showOne: PropTypes.bool,
   // default: undefined
   title: PropTypes.string,
   width: PropTypes.number,
};

LabeledImage.defaultProps = {
   height: 32,
   showOne: false,
   width: 32,
};

export default LabeledImage;