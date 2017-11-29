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
      this.nextTargetLockId = 0;
      this.phaseData = undefined;
      this.phaseKey = Phase.SETUP;
      this.phaseQueue = Immutable.List();
      this.userMessage = "";
      this.winner = undefined;

      this.tokenIdToActivationAction = {};
      this.tokenIdToAttackDice = {};
      this.tokenIdToCombatAction = {};
      this.tokenIdToDamageDealer = {};
      this.tokenIdToDefenseDice = {};
      this.tokenIdToIsDefenderHit = {};
      this.tokenIdToIsInFiringArc = {};
      this.tokenIdToManeuver = {};
      this.tokenIdToManeuverAction = {};
      this.tokenIdToRange = {};

      // Environment.
      this.activeTokenId = undefined;
      this.damageDeck = [];
      this.damageDiscardPile = [];
      this.firstAgent = undefined;
      this.firstSquad = undefined;
      this.playAreaScale = 1.0;
      this.playFormatKey = undefined;
      this.positionToTokenId = {};
      this.round = 0;
      this.secondAgent = undefined;
      this.secondSquad = undefined;
      this.tokenIdToIsTouching = {};
      this.tokenIdToPosition = {};
      this.tokens = Immutable.Map();

      // Target lock.
      this.targetLocks = Immutable.List();

      // id: agent
      this.agents = Immutable.Map();

      // agent IDs.
      this.agentPilots = Immutable.Map();
      this.nextAgentId = 1;

      // CardInstance.
      this.nextCardId = 1;
      this.cardCounts = Immutable.Map();
      this.cardCriticalDamages = Immutable.Map();
      this.cardDamages = Immutable.Map();
      this.cardPrimaryWeapon = Immutable.Map();
      this.cardSecondaryWeapons = Immutable.Map();
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
