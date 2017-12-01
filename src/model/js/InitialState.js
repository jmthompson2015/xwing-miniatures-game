"use strict";

define(["immutable", "artifact/js/Phase"], function(Immutable, Phase)
{
   function InitialState()
   {
      this.adjudicator = undefined;
      this.environment = undefined;
      this.eventData = undefined;
      this.eventQueue = Immutable.List();
      this.isGameOver = false;
      this.phaseData = undefined;
      this.phaseKey = Phase.SETUP;
      this.phaseQueue = Immutable.List();
      this.userMessage = "";
      this.winner = undefined;

      // Environment.
      this.activeCardId = undefined;
      this.damageDeck = [];
      this.damageDiscardPile = [];
      this.firstAgent = undefined;
      this.firstSquad = undefined;
      this.playAreaScale = 1.0;
      this.playFormatKey = undefined;
      this.positionToCardId = {};
      this.round = 0;
      this.secondAgent = undefined;
      this.secondSquad = undefined;

      // Target lock.
      this.nextTargetLockId = 0;
      this.targetLocks = Immutable.List();

      // id: agent
      this.agents = Immutable.Map();

      // agent IDs.
      this.agentPilots = Immutable.Map();
      this.nextAgentId = 1;

      // id: cardInstance
      this.cardInstances = Immutable.Map();

      // CardInstance.
      this.nextCardId = 1;
      this.cardActivationAction = {};
      this.cardAttackDice = {};
      this.cardCombatAction = {};
      this.cardCounts = Immutable.Map();
      this.cardCriticalDamages = Immutable.Map();
      this.cardDamageDealer = {};
      this.cardDamages = Immutable.Map();
      this.cardDefenseDice = {};
      this.cardIsDefenderHit = {};
      this.cardIsInFiringArc = {};
      this.cardIsTouching = {};
      this.cardManeuver = {};
      this.cardManeuverAction = {};
      this.cardPosition = {};
      this.cardRange = {};
      this.cardUpgradeEnergy = Immutable.Map();
      this.cardUpgrades = Immutable.Map();
      this.cardUsedAbilities = Immutable.Map();
      this.cardUsedPerRoundAbilities = Immutable.Map();
   }

   if (Object.freeze)
   {
      Object.freeze(InitialState);
   }

   return InitialState;
});
