import Logger from "../utility/Logger.js";

import LabeledImage from "./LabeledImage.js";

window.LOGGER = new Logger();
LOGGER.setTraceEnabled(false);
LOGGER.setDebugEnabled(false);

var resourceBase = "../resource/";

var element = React.createElement(LabeledImage,
{
   image: "pilotCard/Imperial_Skill32.png",
   resourceBase: resourceBase,
   label: "7",
   labelClass: "pilotSkillValue b orange",
   title: "Pilot Skill",
});
ReactDOM.render(element, document.getElementById("imperialSkillPanel"));

var element = React.createElement(LabeledImage,
{
   image: "pilotCard/Rebel_Skill32.png",
   resourceBase: resourceBase,
   label: "8",
   labelClass: "pilotSkillValue b orange",
   title: "Pilot Skill",
});
ReactDOM.render(element, document.getElementById("rebelSkillPanel"));

var element = React.createElement(LabeledImage,
{
   image: "pilotCard/Scum_Skill32.png",
   resourceBase: resourceBase,
   label: "9",
   labelClass: "pilotSkillValue b orange",
   title: "Pilot Skill",
});
ReactDOM.render(element, document.getElementById("scumSkillPanel"));

var count = 1;
var element = React.createElement(LabeledImage,
{
   image: "token/CloakToken32.png",
   resourceBase: resourceBase,
   label: String(count++),
   labelClass: "lightImageText b f5 white",
   showOne: false,
   title: "Cloak",
});
ReactDOM.render(element, document.getElementById("cloakPanel1"));

var element = React.createElement(LabeledImage,
{
   image: "token/CloakToken32.png",
   resourceBase: resourceBase,
   label: String(count++),
   labelClass: "lightImageText b f5 white",
   showOne: false,
   title: "Cloak",
});
ReactDOM.render(element, document.getElementById("cloakPanel2"));

var element = React.createElement(LabeledImage,
{
   image: "token/EvadeToken32.png",
   resourceBase: resourceBase,
   label: String(count++),
   labelClass: "lightImageText b f5 white",
   title: "Evade",
});
ReactDOM.render(element, document.getElementById("evadePanel"));

var element = React.createElement(LabeledImage,
{
   image: "token/FocusToken32.png",
   resourceBase: resourceBase,
   label: String(count++),
   labelClass: "lightImageText b f5 white",
   title: "Focus",
});
ReactDOM.render(element, document.getElementById("focusPanel"));

var element = React.createElement(LabeledImage,
{
   image: "token/ShieldToken32.png",
   resourceBase: resourceBase,
   label: String(count++),
   labelClass: "lightImageText b f5 white",
   title: "Shield",
});
ReactDOM.render(element, document.getElementById("shieldPanel"));

var element = React.createElement(LabeledImage,
{
   image: "token/StressToken32.png",
   resourceBase: resourceBase,
   label: String(count++),
   labelClass: "lightImageText b f5 white",
   title: "Stress",
});
ReactDOM.render(element, document.getElementById("stressPanel"));

var element = React.createElement(LabeledImage,
{
   image: "token/AttackerTargetLock32.png",
   resourceBase: resourceBase,
   label: "A",
   labelClass: "lightImageText b f5 white",
   title: "Attacker Target Lock",
   width: 38,
});
ReactDOM.render(element, document.getElementById("atlPanel"));

var element = React.createElement(LabeledImage,
{
   image: "token/DefenderTargetLock32.png",
   resourceBase: resourceBase,
   label: "B",
   labelClass: "lightImageText b f5 white",
   title: "Defender Target Lock",
   width: 38,
});
ReactDOM.render(element, document.getElementById("dtlPanel"));

var element = React.createElement(LabeledImage,
{
   image: "pilotCard/Damage32.jpg",
   resourceBase: resourceBase,
   label: String(count++),
   labelClass: "darkImageText b black f5",
   title: "Damage",
});
ReactDOM.render(element, document.getElementById("damagePanel"));

var element = React.createElement(LabeledImage,
{
   image: "pilotCard/CriticalDamage32.jpg",
   resourceBase: resourceBase,
   label: String(count++),
   labelClass: "darkImageText b black f5",
   title: "Critical Damage",
});
ReactDOM.render(element, document.getElementById("criticalDamagePanel"));