const brainjs = require('brain.js');
const { cfgNetwork } = require('../config');
const model = require('./model');
const pattern = require('./pattern');
const brain = require('./brain');

module.exports = (config = cfgNetwork, log) => {
  try {
    // считывание моделей графиков из папки для дальнейшего обучения нейронной сети
    const missingModels = model.getMissingModels(config);
    // отправка информации в лог
    log.network.info(
      `Найдено ${missingModels.length} новых моделей для обучения: ${JSON.stringify(
        missingModels.map(currency => currency.currency),
      )}.`,
    );

    // стандартизирование шаблонов под единый формат
    const standardizedModels = model.standardizeModels(missingModels, config);
    // отправка информации в лог
    log.network.info(
      `Было стандартизировано ${
        standardizedModels.length
      } новых моделей для обучения: ${JSON.stringify(
        standardizedModels.map(
          stockModel => `${stockModel.currency} - ${stockModel.stockCharts.map(chart => chart.exchange)}`,
        ),
      )}.`,
    );

    // создание шаблонов для обучения из стандартизированных моделей
    const patterns = pattern.create(standardizedModels, config);
    // отправка информации в лог
    log.network.info(
      `Создано следующее количество шаблонов для обучения: ${patterns.map(
        chart => `${chart.currency} - ${chart.pattern.map(
          ptn => `[${ptn.exchange} - ${ptn.pattern.length}]`,
        )}`,
      )}.`,
    );

    // загрузка образов нейронной сети
    const loadedBrains = brain.loadSnapshots(brainjs, config);
    // отправка информации в лог
    log.network.info(
      `Загружены образы следующих нейронных сетей: ${Object.keys(loadedBrains).map(key => key)}.`,
    );

    // обучение нейронной сети по шаблонам
    const trainedBrains = brain.train(brainjs, patterns, config);
    // отправка информации в лог
    log.network.info(
      `Обучены следующие нейронные сети: ${Object.keys(trainedBrains).map(key => key)}.`,
    );

    // объединение загруженных и обученных нейронных сетей
    const brains = Object.assign(loadedBrains, trainedBrains);
    // отправка информации в лог
    log.network.info(
      `Следующие нейронные сети готовы к работе: ${Object.keys(brains).map(key => key)}.`,
    );

    // логгирование информации потребляемых ресурсов
    log.app.debug(
      `Потребляемая приложением память: ${(process.memoryUsage().rss / 1048576).toFixed(1)} MB.`,
    );

    // активация нейронной сети
    const result = brain.run(brains, 'eos', 'poloniex', [
      {
        date: 1541174400,
        high: 5.4153,
        low: 5.39804999,
        open: 5.40356982,
        close: 5.40626997,
        volume: 1721.40991987,
        quoteVolume: 318.4508082,
        weightedAverage: 5.4055756,
      },
      {
        date: 1541188800,
        high: 5.40626996,
        low: 5.38433073,
        open: 5.40356,
        close: 5.40626993,
        volume: 41.47978422,
        quoteVolume: 7.67396426,
        weightedAverage: 5.40526158,
      },
      {
        date: 1541203200,
        high: 5.40626695,
        low: 5.36630778,
        open: 5.40626695,
        close: 5.36630778,
        volume: 16.15115142,
        quoteVolume: 3.00401063,
        weightedAverage: 5.37652938,
      },
      {
        date: 1541217600,
        high: 5.37142104,
        low: 5.36630779,
        open: 5.36630779,
        close: 5.371,
        volume: 1494.97493355,
        quoteVolume: 278.32441745,
        weightedAverage: 5.37133948,
      },
      {
        date: 1541232000,
        high: 5.39552312,
        low: 5.34148553,
        open: 5.39552312,
        close: 5.34192341,
        volume: 1603.63503219,
        quoteVolume: 299.20501674,
        weightedAverage: 5.35965288,
      },
    ]);

    console.log(result);
  } catch (error) {
    throw new Error(`Невозможно произвести инициализацию нейронной сети. ${error.message}`);
  }
};