class LabeledImage extends React.Component
{
   render()
   {
      let answer;
      const label = this.props.label;
      const containerStyle = this.createContainerStyle();
      const title = this.props.title;

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
         const cell = ReactDOMFactories.div(
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
   }
}

LabeledImage.prototype.createContainerStyle = function()
{
   const height = this.props.height;
   const width = this.props.width;

   return (
   {
      backgroundImage: 'url(' + this.props.resourceBase + this.props.image + ')',
      backgroundPosition: "alignCenter",
      backgroundRepeat: "no-repeat",
      display: "table",
      minHeight: height,
      minWidth: width,
   });
};

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