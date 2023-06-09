"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const FilteredFeatureProvider_1 = require("./FilteredFeatureProvider");
/**
 * Feature provider implementation that calls the TAS web service to get the most recent active features.
 */
class TasApiFeatureProvider extends FilteredFeatureProvider_1.FilteredFeatureProvider {
    constructor(httpClient, telemetry, filterProviders) {
        super(telemetry, filterProviders);
        this.httpClient = httpClient;
        this.telemetry = telemetry;
        this.filterProviders = filterProviders;
    }
    /**
     * Method that handles fetching of latest data (in this case, flights) from the provider.
     */
    async fetch() {
        // We get the filters that will be sent as headers.
        let filters = this.getFilters();
        let headers = {};
        // Filters are handled using Map<string,any> therefore we need to
        // convert these filters into something axios can take as headers.
        for (let key of filters.keys()) {
            const filterValue = filters.get(key);
            headers[key] = filterValue;
        }
        //axios webserver call.
        let response = await this.httpClient.get({ headers: headers });
        // If we have at least one filter, we post it to telemetry event.
        if (filters.keys.length > 0) {
            this.PostEventToTelemetry(headers);
        }
        // Read the response data from the server.
        let responseData = response.data;
        let configs = responseData.Configs;
        let features = [];
        for (let c of configs) {
            if (!c.Parameters) {
                continue;
            }
            for (let key of Object.keys(c.Parameters)) {
                const featureName = key + (c.Parameters[key] ? '' : 'cf');
                if (!features.includes(featureName)) {
                    features.push(featureName);
                }
            }
        }
        return {
            features,
            assignmentContext: responseData.AssignmentContext,
            configs
        };
    }
}
exports.TasApiFeatureProvider = TasApiFeatureProvider;
//# sourceMappingURL=TasApiFeatureProvider.js.map