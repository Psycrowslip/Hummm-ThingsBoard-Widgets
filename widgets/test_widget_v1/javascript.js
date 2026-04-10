self.onInit = function() {
    self.ctx.$scope.timeSeriesChartWidget.onInit();
    Hello;
};

self.onDataUpdated = function() {
    self.ctx.$scope.timeSeriesChartWidget.onDataUpdated();
}

self.onLatestDataUpdated = function() {
    self.ctx.$scope.timeSeriesChartWidget.onLatestDataUpdated();
}

self.typeParameters = function() {
    return {
        previewWidth: '80%',
        embedTitlePanel: true,
        embedActionsPanel: true,
        hasAdditionalLatestDataKeys: true,
        supportsUnitConversion: true,
        dataKeySettingsFunction: TbTimeSeriesChart.dataKeySettings(),
        defaultDataKeysFunction: function() {
            return [{ name: 'temperature', label: 'Temperature', type: 'timeseries', units: '°C', decimals: 0 }];
        }
    };
}
