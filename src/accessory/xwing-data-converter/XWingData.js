"use strict";

define(["utility/InputValidator", "utility/JSONFileLoader", "accessory/xwing-data-converter/XWingType"],
   function(InputValidator, JSONFileLoader, XWingType)
   {
      function XWingData()
      {
         var dataMap = {};

         this.dataByType = function(type, data)
         {
            InputValidator.validateIsString("type", type);
            // data optional.

            if (data !== undefined)
            {
               dataMap[type] = data;
            }

            return dataMap[type];
         };
      }

      XWingData.prototype.findById = function(type, id)
      {
         InputValidator.validateIsString("type", type);
         InputValidator.validateIsNumber("id", id);

         var answer;
         var data = this.dataByType(type);
         var length = data.length;

         for (var i = 0; i < length; i++)
         {
            var element = data[i];

            if (element.id === id)
            {
               answer = element;
               break;
            }
         }

         return answer;
      };

      XWingData.prototype.findByName = function(type, name)
      {
         InputValidator.validateIsString("type", type);
         InputValidator.validateIsString("name", name);

         var answer;
         var data = this.dataByType(type);
         var length = data.length;

         for (var i = 0; i < length; i++)
         {
            var element = data[i];

            if (element.name === name)
            {
               answer = element;
               break;
            }
         }

         return answer;
      };

      XWingData.prototype.findShip = function(pilotId)
      {
         InputValidator.validateIsNumber("pilotId", pilotId);

         var pilot = this.findById(XWingType.PILOTS, pilotId);

         return this.findByName(XWingType.SHIPS, pilot.ship);
      };

      XWingData.prototype.findSources = function(type, id)
      {
         InputValidator.validateIsString("type", type);
         InputValidator.validateIsNumber("id", id);

         var idString = "" + id;
         var sources = this.dataByType(XWingType.SOURCES);

         return sources.reduce(function(accumulator, source)
         {
            var map = source.contents[type];
            if (map && Object.keys(map).includes(idString))
            {
               accumulator.push(source);
            }
            return accumulator;
         }, []);
      };

      XWingData.prototype.firstSource = function(type, id)
      {
         InputValidator.validateIsString("type", type);
         InputValidator.validateIsNumber("id", id);

         var answer;
         var sources = this.findSources(type, id);

         if (sources && sources.length > 0)
         {
            if (sources[0].wave === 0 && sources.length > 1)
            {
               answer = sources[1];
            }
            else
            {
               answer = sources[0];
            }
         }

         return answer;
      };

      XWingData.prototype.load = function(callback)
      {
         InputValidator.validateIsFunction("callback", callback);

         var receiveData = this.receiveData.bind(this);

         XWingType.keys().forEach(function(type)
         {
            JSONFileLoader.loadFile(XWingType.properties[type].filepath, function(data)
            {
               receiveData(type, data, callback);
            });
         });
      };

      XWingData.prototype.receiveData = function(type, data, callback)
      {
         InputValidator.validateIsString("type", type);
         InputValidator.validateIsArray("data", data);

         LOGGER.trace("receiveData() type = " + type);

         this.dataByType(type, data);

         var that = this;
         var isDataLoaded = XWingType.keys().reduce(function(accumulator, type)
         {
            var data = that.dataByType(type);
            if (data === undefined)
            {
               accumulator = false;
            }
            return accumulator;
         }, true);

         if (isDataLoaded)
         {
            LOGGER.debug("Data loaded. Using callback()");
            callback(this);
         }
      };

      return XWingData;
   });
