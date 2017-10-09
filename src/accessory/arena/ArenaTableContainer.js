"use strict";

define(["react-redux", "common/js/InputValidator", "accessory/arena/ArenaTable", "accessory/arena/TableRow"],
   function(ReactRedux, InputValidator, ArenaTable, TableRow)
   {
      //  var Connector = {};
      //
      //  Connector.ArenaTable = {
      //     mapStateToProps: function(state, ownProps)
      //     {
      //        var arenaData = [];
      //
      //        state.squadBuilders.forEach(function(squadBuilder)
      //        {
      //           var key = squadBuilder.toString();
      //           var winCount = state.sbToWinCount[key];
      //           var loseCount = state.sbToLoseCount[key];
      //           var tieCount = state.sbToTieCount[key];
      //           arenaData.push(ArenaData.createArenaData(squadBuilder, winCount, loseCount, tieCount));
      //        });
      //
      //        return (
      //        {
      //           rowData: arenaData,
      //        });
      //     },
      //  };
      //
      //  return Connector;

      function mapStateToProps(state, ownProps)
      {
         InputValidator.validateNotNull("resourceBase", ownProps.resourceBase);

         var arenaData = [];

         state.squadBuilders.forEach(function(squadBuilder)
         {
            var key = squadBuilder.toString();
            var winCount = state.sbToWinCount[key];
            var loseCount = state.sbToLoseCount[key];
            var tieCount = state.sbToTieCount[key];
            arenaData.push(TableRow.createTableRow(squadBuilder, winCount, loseCount, tieCount));
         });

         return (
         {
            // isFilterShown: state.isFilterShown,
            // filters: state.filters,
            resourceBase: ownProps.resourceBase,
            rowData: arenaData,
         });
      }

      return ReactRedux.connect(mapStateToProps)(ArenaTable);
   });
