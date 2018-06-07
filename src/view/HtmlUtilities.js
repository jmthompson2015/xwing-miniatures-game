/*
 * Provides utility methods for HTML.
 *
 * @see http://stackoverflow.com/questions/195951/change-an-elements-css-class-with-javascript/196038#196038
 */
const HtmlUtilities = {
   addClass: function(element, cls)
   {
      if (!HtmlUtilities.hasClass(element, cls))
      {
         element.className += " " + cls;
      }
   },

   hasClass: function(element, cls)
   {
      const regex = new RegExp('(\\s|^)' + cls + '(\\s|$)');
      return element.className.match(regex);
   },

   removeClass: function(element, cls)
   {
      if (HtmlUtilities.hasClass(element, cls))
      {
         const regex = new RegExp('(\\s|^)' + cls + '(\\s|$)');
         element.className = element.className.replace(regex, ' ');
      }
   },
};

export default HtmlUtilities;