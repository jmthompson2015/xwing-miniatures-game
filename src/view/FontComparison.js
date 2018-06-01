import Logger from "../utility/Logger.js";

window.LOGGER = new Logger();
LOGGER.setTraceEnabled(false);
LOGGER.setDebugEnabled(false);

var cellClass = "ba pa1";
var rows = [];
var cells = [];
cells.push(ReactDOMFactories.th(
{
   className: "ba",
}, "CSS"));
cells.push(ReactDOMFactories.th(
{
   className: "ba",
}, "Example"));
cells.push(ReactDOMFactories.th(
{
   className: "ba",
}, "Example"));
cells.push(ReactDOMFactories.th(
{
   className: "ba",
}, "Tachyons"));
rows.push(ReactDOMFactories.tr(
{
   className: "bg-light-silver",
}, cells));
rows.push(createRow("xx-large", "f1"));
rows.push(createRow("x-large", "f2"));
rows.push(createRow("large", "f3"));
rows.push(createRow("large", "f4"));
rows.push(createRow("medium", "f5"));
rows.push(createRow("small", "f6"));
rows.push(createRow("x-small", "f7"));

ReactDOM.render(ReactDOMFactories.table(
{
   className: "ba bg-xw-light center mt4",
}, ReactDOMFactories.tbody(
{}, rows)), document.getElementById("panel"));

function createRow(fontSize, fontClass)
{
   var cells = [];
   cells.push(ReactDOMFactories.td(
   {
      key: "title0" + cells.length,
      className: cellClass,
      style:
      {
         fontSize: fontSize,
      }
   }, "font-size: " + fontSize));
   cells.push(ReactDOMFactories.td(
   {
      key: "sampleText0" + cells.length,
      className: cellClass,
      style:
      {
         fontSize: fontSize,
      }
   }, "Sample Text"));
   cells.push(ReactDOMFactories.td(
   {
      key: "sampleText0" + cells.length,
      className: cellClass + " " + fontClass,
   }, "Sample Text"));
   cells.push(ReactDOMFactories.td(
   {
      key: "title0" + cells.length,
      className: cellClass + " " + fontClass,
   }, fontClass));

   return ReactDOMFactories.tr(
   {
      key: rows.length,
   }, cells);
}