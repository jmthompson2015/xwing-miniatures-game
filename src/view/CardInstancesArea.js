import ReactUtilities from "./ReactUtilities.js";

class CardInstancesArea extends React.Component
{
   constructor(props)
   {
      super(props);

      this.state = {
         isExpanded: this.props.isExpanded,
      };

      this.toggleExpand = this.toggleExpandFunction.bind(this);
   }

   render()
   {
      const rows = [];

      rows.push(this.createLabelUI());
      rows.push(this.createCardInstanceCells());

      return ReactUtilities.createTable(rows, undefined, "bg-lotr-light");
   }
}

CardInstancesArea.prototype.createCardInstanceCells = function()
{
   const cardInstanceUIs = this.props.cardInstanceUIs;
   const isExpanded = this.state.isExpanded;

   const cells = cardInstanceUIs.map(function(cardInstanceUI, i)
   {
      let myClassName;

      if (isExpanded || i === cardInstanceUIs.length - 1)
      {
         myClassName = "dtc pa1 v-mid";
      }
      else if (i < cardInstanceUIs.length - 1)
      {
         myClassName = "dn";
      }

      return ReactDOMFactories.div(
      {
         key: "cardCell" + i,
         className: myClassName,
      }, cardInstanceUI);
   });

   const cell = ReactUtilities.createCell(cells);

   return ReactUtilities.createRow(cell, "mainRow", "bg-lotr-medium");
};

CardInstancesArea.prototype.createLabelUI = function()
{
   const label = ReactUtilities.createCell(this.props.label, "labelCell", "b lotr-light tc");

   const cardCount = this.props.cardInstanceUIs.length;
   const isExpanded = this.state.isExpanded;
   const expandLabel = (cardCount > 1 ? (isExpanded ? "\u25B6" : "\u25BC") : "");
   const expandControl = ReactDOMFactories.div(
   {
      key: "expandCell",
      onClick: this.toggleExpand,
   }, expandLabel);

   const row = ReactUtilities.createRow([label, expandControl], "labelExpandRow");
   const table = ReactUtilities.createTable(row, "labelExpandTable", "w-100");

   const tableCell = ReactUtilities.createCell(table, "tableCell");
   return ReactUtilities.createRow(tableCell, "labelRow", "bg-lotr-dark");
};

CardInstancesArea.prototype.toggleExpandFunction = function()
{
   this.setState(
   {
      isExpanded: !this.state.isExpanded,
   });
};

CardInstancesArea.propTypes = {
   cardInstanceUIs: PropTypes.array.isRequired,

   isExpanded: PropTypes.bool,
   label: PropTypes.string, // default: undefined
};

CardInstancesArea.defaultProps = {
   isExpanded: true,
};

export default CardInstancesArea;