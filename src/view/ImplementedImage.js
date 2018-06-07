class ImplementedImage extends React.Component
{
   render()
   {
      const isImplemented = this.props.isImplemented;
      let answer;

      if (isImplemented !== undefined)
      {
         const resourceBase = this.props.resourceBase;
         const src = resourceBase + "icon/" + (isImplemented ? "accept.png" : "delete.png");
         const title = (isImplemented ? "Implemented" : "Not Implemented");

         answer = ReactDOMFactories.img(
         {
            src: src,
            title: title,
         });
      }
      else
      {
         answer = ReactDOMFactories.span(
         {});
      }

      return answer;
   }
}

ImplementedImage.propTypes = {
   resourceBase: PropTypes.string.isRequired,

   isImplemented: PropTypes.bool,
};

export default ImplementedImage;