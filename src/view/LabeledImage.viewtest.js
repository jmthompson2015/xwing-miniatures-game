import Logger from "../utility/Logger.js";

import LabeledImage from "./LabeledImage.js";

window.LOGGER = new Logger();
LOGGER.setTraceEnabled(false);
LOGGER.setDebugEnabled(false);

const resourceBase = "../resource/";

let element = React.createElement(LabeledImage,
{
   image: "pilotCard/Imperial_Skill32.png",
   resourceBase: resourceBase,
   label: "7",
   labelClass: "pilotSkillValue b orange",
   title: "Pilot Skill",
});
ReactDOM.render(element, document.getElementById("imperialSkillPanel"));

element = React.createElement(LabeledImage,
{
   image: "pilotCard/Rebel_Skill32.png",
   resourceBase: resourceBase,
   label: "8",
   labelClass: "pilotSkillValue b orange",
   title: "Pilot Skill",
});
ReactDOM.render(element, document.getElementById("rebelSkillPanel"));

element = React.createElement(LabeledImage,
{
   image: "pilotCard/Scum_Skill32.png",
   resourceBase: resourceBase,
   label: "9",
   labelClass: "pilotSkillValue b orange",
   title: "Pilot Skill",
});
ReactDOM.render(element, document.getElementById("scumSkillPanel"));

let count = 1;
element = React.createElement(LabeledImage,
{
   image: "token/CloakToken32.png",
   resourceBase: resourceBase,
   label: String(count++),
   labelClass: "lightImageText b f5 white",
   showOne: false,
   title: "Cloak",
});
ReactDOM.render(element, document.getElementById("cloakPanel1"));

element = React.createElement(LabeledImage,
{
   image: "token/CloakToken32.png",
   resourceBase: resourceBase,
   label: String(count++),
   labelClass: "lightImageText b f5 white",
   showOne: false,
   title: "Cloak",
});
ReactDOM.render(element, document.getElementById("cloakPanel2"));

element = React.createElement(LabeledImage,
{
   image: "token/EvadeToken32.png",
   resourceBase: resourceBase,
   label: String(count++),
   labelClass: "lightImageText b f5 white",
   title: "Evade",
});
ReactDOM.render(element, document.getElementById("evadePanel"));

element = React.createElement(LabeledImage,
{
   image: "token/FocusToken32.png",
   resourceBase: resourceBase,
   label: String(count++),
   labelClass: "lightImageText b f5 white",
   title: "Focus",
});
ReactDOM.render(element, document.getElementById("focusPanel"));

element = React.createElement(LabeledImage,
{
   image: "token/ShieldToken32.png",
   resourceBase: resourceBase,
   label: String(count++),
   labelClass: "lightImageText b f5 white",
   title: "Shield",
});
ReactDOM.render(element, document.getElementById("shieldPanel"));

element = React.createElement(LabeledImage,
{
   image: "token/StressToken32.png",
   resourceBase: resourceBase,
   label: String(count++),
   labelClass: "lightImageText b f5 white",
   title: "Stress",
});
ReactDOM.render(element, document.getElementById("stressPanel"));

element = React.createElement(LabeledImage,
{
   image: "token/AttackerTargetLock32.png",
   resourceBase: resourceBase,
   label: "A",
   labelClass: "lightImageText b f5 white",
   title: "Attacker Target Lock",
   width: 38,
});
ReactDOM.render(element, document.getElementById("atlPanel"));

element = React.createElement(LabeledImage,
{
   image: "token/DefenderTargetLock32.png",
   resourceBase: resourceBase,
   label: "B",
   labelClass: "lightImageText b f5 white",
   title: "Defender Target Lock",
   width: 38,
});
ReactDOM.render(element, document.getElementById("dtlPanel"));

element = React.createElement(LabeledImage,
{
   image: "pilotCard/Damage32.jpg",
   resourceBase: resourceBase,
   label: String(count++),
   labelClass: "darkImageText b black f5",
   title: "Damage",
});
ReactDOM.render(element, document.getElementById("damagePanel"));

element = React.createElement(LabeledImage,
{
   image: "pilotCard/CriticalDamage32.jpg",
   resourceBase: resourceBase,
   label: String(count++),
   labelClass: "darkImageText b black f5",
   title: "Critical Damage",
});
ReactDOM.render(element, document.getElementById("criticalDamagePanel"));