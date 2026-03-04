import { NodeSDK } from '@opentelemetry/sdk-node';
import { getNodeAutoInstrumentations } from '@opentelemetry/auto-instrumentations-node';
import { OTLPMetricExporter } from '@opentelemetry/exporter-metrics-otlp-http';
import { PeriodicExportingMetricReader } from '@opentelemetry/sdk-metrics';
import { resourceFromAttributes } from '@opentelemetry/resources';
import { ATTR_SERVICE_NAME, ATTR_SERVICE_VERSION } from '@opentelemetry/semantic-conventions';

const sdk = new NodeSDK({
    resource: resourceFromAttributes({
        [ATTR_SERVICE_NAME]: 'receiptsnap-backend',
        [ATTR_SERVICE_VERSION]: '1.0.0',
    }),

    metricReader: new PeriodicExportingMetricReader({
        exporter: new OTLPMetricExporter({
            url:
                process.env.OTEL_EXPORTER_OTLP_ENDPOINT ??
                'http://otel-collector:4318/v1/metrics',
        }),
        exportIntervalMillis: 10000,
    }),

    instrumentations: [
        getNodeAutoInstrumentations({
            '@opentelemetry/instrumentation-fs': { enabled: false },
        }),
    ],
});

sdk.start();

process.on('SIGTERM', () => {
    sdk.shutdown().finally(() => process.exit(0));
});