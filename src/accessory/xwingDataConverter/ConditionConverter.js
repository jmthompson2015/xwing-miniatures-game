"use strict";

define(["artifact/js/ConditionCard", "accessory/xwingDataConverter/EnumGenerator", "accessory/xwingDataConverter/XWingData", "accessory/xwingDataConverter/XWingType"],
   function(ConditionCard, EnumGenerator, XWingData, XWingType)
   {
      var ConditionConverter = {};

      ConditionConverter.convert = function(callback)
      {
         var finishConvert = this.finishConvert.bind(this);
         var finishCallback = function(response)
         {
            finishConvert(response, callback);
         };

         var xwingData = new XWingData();
         xwingData.load(finishCallback);
      };

      ConditionConverter.finishConvert = function(xwingData, callback)
      {
         var enums = generateEnums(xwingData);
         var properties = generateProperties(xwingData);

         callback(xwingData, enums, properties);
      };

      function determineDescription(condition, conditionCard)
      {
         var answer = condition.text;

         if (answer === undefined && conditionCard)
         {
            answer = conditionCard.description;
         }

         answer = answer.replace(/"/g, "\\\"");
         answer = answer.replace(/<strong>/g, "&lt;strong>");
         answer = answer.replace(/<\/strong>/g, "&lt;\/strong>");
         answer = answer.replace(/<br \/>/g, "&lt;br />");

         if (answer !== undefined)
         {
            answer = EnumGenerator.quoteValue(answer);
         }

         return answer;
      }

      function determineImage(condition)
      {
         var answer;

         if (condition.image !== undefined)
         {
            answer = EnumGenerator.quoteValue(condition.image);
         }

         return answer;
      }

      function determineIsUnique(condition)
      {
         var answer;

         if (condition.unique !== undefined && condition.unique)
         {
            answer = condition.unique;
         }

         return answer;
      }

      function findConditionCard(condition)
      {
         var enumValue = EnumGenerator.createConditionEnumValue(condition);
         enumValue = enumValue.replace(/"/g, "");
         var conditionCard = ConditionCard.properties[enumValue];

         if (conditionCard === undefined)
         {
            LOGGER.warn("Can't find conditionCard for " + enumValue);
         }

         return conditionCard;
      }

      function generateEnums(xwingData)
      {
         var conditionArray = xwingData.dataByType(XWingType.CONDITIONS);
         var enumNames = [];
         var enumValues = [];

         var enums = conditionArray.reduce(function(accumulator, condition)
         {
            var enumName = EnumGenerator.createConditionEnumName(condition);
            if (enumNames.includes(enumName))
            {
               LOGGER.warn("Duplicate enum name " + enumName);
            }
            enumNames.push(enumName);

            var enumValue = EnumGenerator.createConditionEnumValue(condition);
            if (enumValues.includes(enumValue))
            {
               LOGGER.warn("Duplicate enum value " + enumValue);
            }
            enumValues.push(enumValue);

            accumulator.push(enumName + ": " + enumValue + ",<br/>");
            return accumulator;
         }, []);

         enums.sort();

         return enums.join("");
      }

      function generateProperties(xwingData)
      {
         var conditionArray = xwingData.dataByType(XWingType.CONDITIONS);
         var properties = conditionArray.reduce(function(accumulator, condition)
         {
            var source = xwingData.firstSource(XWingType.CONDITIONS, condition.id);
            condition.wave = "" + source.wave;
            if (condition.wave === "Iconic Starships")
            {
               condition.wave = "Aces";
            }
            var enumValue = EnumGenerator.createConditionEnumValue(condition);
            accumulator.push(enumValue + ":<br/>{<br/>" + generatePropertiesSingle(condition) + "},<br/>");
            return accumulator;
         }, []);

         properties.sort();

         return "properties:<br/>{<br/>" + properties.join("") + "},<br/>";
      }

      function generatePropertiesSingle(condition)
      {
         var name = condition.name;
         name = name.replace("(-1)", "Decrease");
         name = name.replace("(+1)", "Increase");
         name = name.replace("-wing", "-Wing");
         name = name.replace(/'/g, "\\\'");
         name = name.replace(/"/g, "\\\"");
         name = EnumGenerator.quoteValue(name);

         var conditionCard = findConditionCard(condition);
         var description = determineDescription(condition, conditionCard);
         var image = determineImage(condition, conditionCard);
         var isUnique = determineIsUnique(condition, conditionCard);
         var wave = EnumGenerator.quoteValue(condition.wave);
         var key = EnumGenerator.createConditionEnumValue(condition);

         var answer = "";

         answer += EnumGenerator.createProperty("name", name);
         answer += EnumGenerator.createProperty("isUnique", isUnique);
         answer += EnumGenerator.createProperty("description", description);
         answer += EnumGenerator.createProperty("image", image);
         answer += EnumGenerator.createProperty("wave", wave);
         answer += EnumGenerator.createProperty("key", key);

         return answer;
      }

      return ConditionConverter;
   });
