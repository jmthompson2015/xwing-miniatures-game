var ReactUtilities = {};

ReactUtilities.createCell = function(element, key, className, title)
{
   return ReactDOMFactories.div(
   {
      key: key,
      className: "dtc" + (className ? " " + className : ""),
      title: title,
   }, element);
};

ReactUtilities.createFlexbox = function(cells, key, className)
{
   return ReactDOMFactories.div(
   {
      key: key,
      className: "flex" + (className ? " " + className : ""),
   }, cells);
};

ReactUtilities.createFlexboxWrap = function(cells, key, className)
{
   return ReactDOMFactories.div(
   {
      key: key,
      className: "flex flex-wrap" + (className ? " " + className : ""),
   }, cells);
};

ReactUtilities.createRow = function(cells, key, className)
{
   return ReactDOMFactories.div(
   {
      key: key,
      className: "dt-row" + (className ? " " + className : ""),
   }, cells);
};

ReactUtilities.createTable = function(rows, key, className)
{
   return ReactDOMFactories.div(
   {
      key: key,
      className: "dt" + (className ? " " + className : ""),
   }, rows);
};

export default ReactUtilities;