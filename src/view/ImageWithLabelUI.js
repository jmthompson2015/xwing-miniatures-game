class ImageWithLabelUI extends React.Component
{
   render()
   {
      const image = ReactDOMFactories.img(
      {
         className: "v-mid",
         src: this.props.src,
         title: this.props.label,
      });

      let answer = image;

      if (this.props.showLabel)
      {
         answer = ReactDOMFactories.span(
         {}, image, " ", this.props.label);
      }

      return answer;
   }
}

ImageWithLabelUI.propTypes = {
   src: PropTypes.string.isRequired,

   label: PropTypes.string,
   showLabel: PropTypes.bool,
};

ImageWithLabelUI.defaultProps = {
   label: "",
   showLabel: false,
};

export default ImageWithLabelUI;