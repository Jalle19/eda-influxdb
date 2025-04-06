const fs = require('fs')
const Influx = require('influx')

getSchemaDefinition = function () {
  return [
    {
      measurement: 'eda',
      fields: {
        'flags.away': Influx.FieldType.BOOLEAN,
        'flags.longAway': Influx.FieldType.BOOLEAN,
        'flags.overPressure': Influx.FieldType.BOOLEAN,
        'flags.maxHeating': Influx.FieldType.BOOLEAN,
        'flags.maxCooling': Influx.FieldType.BOOLEAN,
        'flags.manualBoost': Influx.FieldType.BOOLEAN,
        'flags.summerNightCooling': Influx.FieldType.BOOLEAN,
        'readings.freshAirTemperature': Influx.FieldType.FLOAT,
        'readings.supplyAirTemperatureAfterHeatRecovery': Influx.FieldType.FLOAT,
        'readings.supplyAirTemperature': Influx.FieldType.FLOAT,
        'readings.wasteAirTemperature': Influx.FieldType.FLOAT,
        'readings.exhaustAirTemperature': Influx.FieldType.FLOAT,
        'readings.exhaustAirTemperatureBeforeHeatRecovery': Influx.FieldType.FLOAT,
        'readings.exhaustAirHumidity': Influx.FieldType.INTEGER,
        'readings.heatRecoverySupplySide': Influx.FieldType.INTEGER,
        'readings.heatRecoveryExhaustSide': Influx.FieldType.INTEGER,
        'readings.heatRecoveryTemperatureDifferenceSupplySide': Influx.FieldType.FLOAT,
        'readings.heatRecoveryTemperatureDifferenceExhaustSide': Influx.FieldType.FLOAT,
        'readings.mean48HourExhaustHumidity': Influx.FieldType.INTEGER,
        'readings.cascadeSp': Influx.FieldType.INTEGER,
        'readings.cascadeP': Influx.FieldType.INTEGER,
        'readings.cascadeI': Influx.FieldType.INTEGER,
        'readings.overPressureTimeLeft': Influx.FieldType.INTEGER,
        'readings.ventilationLevelActual': Influx.FieldType.INTEGER,
        'readings.ventilationLevelTarget': Influx.FieldType.INTEGER,
        'settings.overPressureDelay': Influx.FieldType.INTEGER,
        'settings.awayVentilationLevel': Influx.FieldType.INTEGER,
        'settings.awayTemperatureReduction': Influx.FieldType.INTEGER,
        'settings.longAwayVentilationLevel': Influx.FieldType.INTEGER,
        'settings.longAwayTemperatureReduction': Influx.FieldType.INTEGER,
        'settings.temperatureTarget': Influx.FieldType.FLOAT,
      },
      tags: []
    }
  ]
}

createPoint = function (summary) {
  return {
    measurement: 'eda',
    fields: {
      'flags.away': summary.modes.away,
      'flags.longAway': summary.modes.longAway,
      'flags.overPressure': summary.modes.overPressure,
      'flags.maxHeating': summary.modes.maxHeating,
      'flags.maxCooling': summary.modes.maxCooling,
      'flags.manualBoost': summary.modes.manualBoost,
      'flags.summerNightCooling': summary.modes.summerNightCooling,
      'readings.freshAirTemperature': summary.readings.freshAirTemperature,
      'readings.supplyAirTemperatureAfterHeatRecovery': summary.readings.supplyAirTemperatureAfterHeatRecovery,
      'readings.supplyAirTemperature': summary.readings.supplyAirTemperature,
      'readings.wasteAirTemperature': summary.readings.wasteAirTemperature,
      'readings.exhaustAirTemperature': summary.readings.exhaustAirTemperature,
      'readings.exhaustAirTemperatureBeforeHeatRecovery': summary.readings.exhaustAirTemperatureBeforeHeatRecovery,
      'readings.exhaustAirHumidity': summary.readings.exhaustAirHumidity,
      'readings.heatRecoverySupplySide': summary.readings.heatRecoverySupplySide,
      'readings.heatRecoveryExhaustSide': summary.readings.heatRecoveryExhaustSide,
      'readings.heatRecoveryTemperatureDifferenceSupplySide': summary.readings.heatRecoveryTemperatureDifferenceSupplySide,
      'readings.heatRecoveryTemperatureDifferenceExhaustSide': summary.readings.heatRecoveryTemperatureDifferenceExhaustSide,
      'readings.mean48HourExhaustHumidity': summary.readings.mean48HourExhaustHumidity,
      'readings.cascadeSp': summary.readings.cascadeSp,
      'readings.cascadeP': summary.readings.cascadeP,
      'readings.cascadeI': summary.readings.cascadeI,
      'readings.overPressureTimeLeft': summary.readings.overPressureTimeLeft,
      'readings.ventilationLevelActual': summary.readings.ventilationLevelActual,
      'readings.ventilationLevelTarget': summary.readings.ventilationLevelTarget,
      'settings.overPressureDelay': summary.settings.overPressureDelay,
      'settings.awayVentilationLevel': summary.settings.awayVentilationLevel,
      'settings.awayTemperatureReduction': summary.settings.awayTemperatureReduction,
      'settings.longAwayVentilationLevel': summary.settings.longAwayVentilationLevel,
      'settings.longAwayTemperatureReduction': summary.settings.longAwayTemperatureReduction,
      'settings.temperatureTarget': summary.settings.temperatureTarget,
    },
  }
}

const requiredEnvVars = [
  'INFLUX_HOST',
  'INFLUX_DATABASE',
  'INFLUX_USERNAME',
  'INFLUX_PASSWORD',
]

for (const envVar of requiredEnvVars) {
  if (!process.env[envVar]) {
    throw new Error(`${requiredEnvVars.join(', ')} must be specified`)
  }
}

const influx = new Influx.InfluxDB({
  host: process.env.INFLUX_HOST,
  database: process.env.INFLUX_DATABASE,
  username: process.env.INFLUX_USERNAME,
  password: process.env.INFLUX_PASSWORD,
  schema: getSchemaDefinition(),
})

influx.getDatabaseNames().then((names) => {
  if (!names.includes(process.env.INFLUX_DATABASE)) {
    throw new Error(`The specified database "${process.env.INFLUX_DATABASE}" does not exist`)
  }

  const jsonData = fs.readFileSync(0, 'utf-8')
  const summary = JSON.parse(jsonData)

  influx.writePoints([createPoint(summary)])
})
