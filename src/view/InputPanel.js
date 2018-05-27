"use strict";

define(["create-react-class", "prop-types", "react", "react-dom-factories", "utility/ArrayUtilities", "utility/InputValidator", "utility/ObjectUtilities"],
   function(createReactClass, PropTypes, React, DOM, ArrayUtilities, InputValidator, ObjectUtilities)
   {
      var InputPanel = createReactClass(
      {
         getInitialState: function()
         {
            var selected;

            switch (this.props.type)
            {
               case InputPanel.Type.CHECKBOX:
                  selected = [];
                  break;
               case InputPanel.Type.TEXT:
                  selected = {};
                  break;
            }

            if (this.props.initialValues)
            {
               switch (this.props.type)
               {
                  case InputPanel.Type.CHECKBOX:
                     ArrayUtilities.addAll(selected, this.props.initialValues);
                     break;
                  case InputPanel.Type.RADIO:
                     selected = this.props.initialValues;
                     break;
                  case InputPanel.Type.TEXT:
                     ObjectUtilities.merge(selected, this.props.initialValues);
                     break;
                  default:
                     throw "Unknown input type: " + this.props.type;
               }
            }

            return (
            {
               selected: selected,
            });
         },

         render: function()
         {
            this.validateProps();

            var inputProps = this.createInputProps();
            var values = this.props.values;

            var rows = values.map(function(value, i)
            {
               return this.createRow(i, value, inputProps);
            }, this);

            return DOM.table(
            {
               className: this.props.panelClass,
            }, DOM.tbody(
            {}, rows));
         },

         createInputProps: function()
         {
            var answer = {
               name: this.props.name, // needed for radio
               onChange: this.handleChange,
               type: this.props.type,
            };

            var clientProps = this.props.clientProps;

            if (clientProps)
            {
               ObjectUtilities.merge(answer, clientProps);
            }

            return answer;
         },

         createRow: function(i, value, inputProps)
         {
            var selected = this.state.selected;
            var labelFunction = this.props.labelFunction;
            var label = (labelFunction ? labelFunction(value) : value);
            var type = this.props.type;

            inputProps.id = i;

            switch (type)
            {
               case InputPanel.Type.CHECKBOX:
                  inputProps.defaultChecked = selected.includes(value);
                  break;
               case InputPanel.Type.RADIO:
                  inputProps.defaultChecked = (value === selected);
                  break;
               case InputPanel.Type.TEXT:
                  inputProps.defaultValue = selected[i];
                  break;
               default:
                  throw "Unknown input type: " + type;
            }

            var input = DOM.input(inputProps);
            var cells = [];

            if (type === InputPanel.Type.CHECKBOX || type === InputPanel.Type.RADIO)
            {
               cells.push(DOM.td(
               {
                  key: cells.length,
               }, input));
               cells.push(DOM.td(
               {
                  key: cells.length,
                  className: "labelCell ph1",
               }, label));
            }
            else if (type === InputPanel.Type.TEXT)
            {
               cells.push(DOM.td(
               {
                  key: cells.length,
                  className: "labelCell ph1",
               }, label));
               cells.push(DOM.td(
               {
                  key: cells.length,
               }, input));
            }

            return DOM.tr(
            {
               key: "row" + value + i,
               className: "striped--light-gray",
            }, cells);
         },

         handleChange: function(event)
         {
            var source = event.target;
            var id = event.target.id;
            var selected = this.state.selected;

            switch (this.props.type)
            {
               case InputPanel.Type.CHECKBOX:
                  var mySelected = this.props.values[id];
                  if (source.checked)
                  {
                     selected.push(mySelected);
                  }
                  else
                  {
                     ArrayUtilities.remove(selected, mySelected);
                  }
                  break;
               case InputPanel.Type.RADIO:
                  selected = this.props.values[id];
                  break;
               case InputPanel.Type.TEXT:
                  selected[id] = source.key;
                  break;
               default:
                  throw "Unknown input type: " + this.props.type;
            }

            this.setState(
               {
                  selected: selected,
               },
               this.props.onChange(event, selected));
         },

         validateProps: function()
         {
            if (this.props.type === InputPanel.Type.RADIO)
            {
               InputValidator.validateNotNull("name", this.props.name);
            }
         }
      });

      InputPanel.propTypes = {
         // Function called when the selection changes.
         onChange: PropTypes.func.isRequired,
         // Input type. (e.g. "checkbox", "radio", "text")
         type: PropTypes.string.isRequired,
         // Option values.
         values: PropTypes.array.isRequired,

         // Client properties.
         clientProps: PropTypes.object,
         // Initial values.
         initialValues: PropTypes.oneOfType([PropTypes.string, PropTypes.array, PropTypes.object]),
         // Function which returns the label for a value. Defaults to simply return the value.
         labelFunction: PropTypes.func,
         // Button name. (required for radio)
         name: PropTypes.string,
         // Panel CSS class.
         panelClass: PropTypes.string,
      };

      InputPanel.defaultProps = {
         panelClass: "inputPanel2",
      };

      InputPanel.Type = {
         CHECKBOX: "checkbox",
         RADIO: "radio",
         TEXT: "text",
      };

      return InputPanel;
   });
