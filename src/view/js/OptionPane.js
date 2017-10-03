/*
 * Provides a React component which emulates a Java
 * <a href="http://docs.oracle.com/javase/6/docs/api/javax/swing/JOptionPane.html">JOptionPane</a>.
 */
"use strict";

define(["create-react-class", "prop-types", "react", "react-dom-factories"],
   function(createClassReact, PropTypes, React, DOM)
   {
      var OptionPane = createClassReact(
      {
         propTypes:
         {
            buttons: PropTypes.object.isRequired,
            message: PropTypes.oneOfType([PropTypes.string, PropTypes.object]).isRequired,
            title: PropTypes.string.isRequired,

            initialInput: PropTypes.object,
            buttonsClass: PropTypes.string,
            buttonsStyle: PropTypes.object,
            icon: PropTypes.object,
            iconClass: PropTypes.string,
            iconStyle: PropTypes.object,
            inputClass: PropTypes.string,
            inputStyle: PropTypes.object,
            messageClass: PropTypes.string,
            messageStyle: PropTypes.object,
            panelClass: PropTypes.string,
            panelStyle: PropTypes.object,
            titleClass: PropTypes.string,
            titleStyle: PropTypes.object,
         },

         getInitialState: function()
         {
            return (
            {
               input: this.props.initialInput
            });
         },

         render: function()
         {
            var rows = [];

            var cell0 = DOM.td(
            {
               colSpan: 2,
               className: this.props.titleClass,
               style: this.props.titleStyle
            }, this.props.title);
            rows.push(DOM.tr(
            {
               key: 0
            }, cell0));

            var cell10 = DOM.td(
            {
               key: 0,
               rowSpan: 2,
               className: this.props.iconClass,
               style: this.props.iconStyle
            }, this.props.icon);
            var cell11 = DOM.td(
            {
               key: 1,
               className: this.props.messageClass,
               style: this.props.messageStyle
            }, this.props.message);
            rows.push(DOM.tr(
            {
               key: 1
            }, [cell10, cell11]));

            var cell2 = DOM.td(
            {
               className: this.props.inputClass,
               style: this.props.inputStyle
            }, this.state.input);
            rows.push(DOM.tr(
            {
               key: 2
            }, cell2));

            var cell3 = DOM.td(
            {
               colSpan: 2,
               className: this.props.buttonsClass,
               style: this.props.buttonsStyle
            }, this.props.buttons);
            rows.push(DOM.tr(
            {
               key: 3
            }, cell3));

            return DOM.table(
            {
               className: this.props.panelClass,
               style: this.props.panelStyle
            }, DOM.tbody(
            {}, rows));
         }
      });

      return OptionPane;
   });