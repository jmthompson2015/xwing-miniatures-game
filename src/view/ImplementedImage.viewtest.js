import Logger from "../utility/Logger.js";

import ImplementedImage from "./ImplementedImage.js";

window.LOGGER = new Logger();
LOGGER.setTraceEnabled(false);
LOGGER.setDebugEnabled(false);

const resourceBase = "../resource/";

const element1 = React.createElement(ImplementedImage,
{
   resourceBase: resourceBase,
   isImplemented: true,
});
ReactDOM.render(element1, document.getElementById("panel1"));

const element2 = React.createElement(ImplementedImage,
{
   resourceBase: resourceBase,
   isImplemented: false,
});
ReactDOM.render(element2, document.getElementById("panel2"));

const element3 = React.createElement(ImplementedImage,
{
   resourceBase: resourceBase,
});
ReactDOM.render(element3, document.getElementById("panel3"));