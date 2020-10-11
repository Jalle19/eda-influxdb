# eda-influxdb

Ingests data from eda-modbus-bridge into InfluxDB

## Usage

The script reads JSON from stdin, so we'll use curl to fetch the summary:

```
curl -sS http://10.110.1.1:9090/summary | INFLUX_HOST=10.110.1.6 INFLUX_DATABASE=eda INFLUX_USERNAME=eda INFLUX_PASSWORD=eda node eda-influxdb.js
```

## License

GNU GENERAL PUBLIC LICENSE 3.0
