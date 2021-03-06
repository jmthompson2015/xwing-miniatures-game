import Phase from "../artifact/Phase.js";

function InitialState()
{
   this.adjudicator = undefined;
   this.environment = undefined;
   this.delay = 1000;
   this.eventData = undefined;
   this.eventQueue = Immutable.List();
   this.isGameOver = false;
   this.phaseData = undefined;
   this.phaseKey = Phase.SETUP;
   this.phaseQueue = Immutable.List();
   this.pilotToManeuver = Immutable.Map();
   this.resourceBase = "resource/";
   this.userMessage = "";
   this.winner = undefined;

   // Environment.
   this.activeCardId = undefined;
   this.damageDeck = Immutable.List();
   this.damageDiscardPile = Immutable.List();
   this.firstAgent = undefined;
   this.firstSquad = undefined;
   this.playAreaScale = 1.0;
   this.playFormatKey = undefined;
   this.positionToCardId = Immutable.Map();
   this.round = 0;
   this.secondAgent = undefined;
   this.secondSquad = undefined;

   // Target lock.
   this.nextTargetLockId = 0;
   this.targetLocks = Immutable.List();

   // Touching.
   this.touching = Immutable.List();

   // id: agent
   this.agents = Immutable.Map();

   // agent IDs.
   this.agentPilots = Immutable.Map();
   this.nextAgentId = 1;

   // id: cardInstance
   this.cardInstances = Immutable.Map();

   // CardInstance.
   this.nextCardId = 1;
   this.cardActivationAction = Immutable.Map();
   this.cardAttackDice = Immutable.Map();
   this.cardCombatAction = Immutable.Map();
   this.cardCounts = Immutable.Map();
   this.cardDamageDealer = Immutable.Map();
   this.cardDamages = Immutable.Map();
   this.cardDefenseDice = Immutable.Map();
   this.cardIsDefenderHit = Immutable.Map();
   this.cardIsFaceUp = Immutable.Map();
   this.cardIsInFiringArc = Immutable.Map();
   this.cardManeuver = Immutable.Map();
   this.cardManeuverAction = Immutable.Map();
   this.cardPosition = Immutable.Map();
   this.cardRange = Immutable.Map();
   this.cardUpgrades = Immutable.Map();
   this.cardUsedAbilities = Immutable.Map();
   this.cardUsedPerRoundAbilities = Immutable.Map();
}

if (Object.freeze)
{
   Object.freeze(InitialState);
}

export default InitialState;