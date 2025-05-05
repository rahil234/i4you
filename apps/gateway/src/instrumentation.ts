import { NodeSDK } from '@opentelemetry/sdk-node';
import { ConsoleSpanExporter } from '@opentelemetry/sdk-trace-node';
import { getNodeAutoInstrumentations } from '@opentelemetry/auto-instrumentations-node';
import { PrometheusExporter } from '@opentelemetry/exporter-prometheus';

const prometheusExporter = new PrometheusExporter(
  {
    port: 9464,
    endpoint: '/metrics',
  },
  () => {
    console.log('Prometheus scrape endpoint: http://localhost:9464/metrics');
  },
);

const sdk = new NodeSDK({
  traceExporter: new ConsoleSpanExporter(),
  metricReader: prometheusExporter,
  instrumentations: [getNodeAutoInstrumentations()],
});

sdk.start();
