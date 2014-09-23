angular.module("leaflet-directive").directive('prunemarkers', function ($log, $rootScope, $q, leafletData, leafletHelpers) {
    return {
        restrict: "A",
        scope: false,
        replace: false,
        require: ['leaflet', 'layers'],

        link: function (scope, element, attrs, controller) {
            if (!leafletHelpers.PruneClusterPlugin.isLoaded()) {
                $log.error("[AngularJS - Leaflet] The PruneCluster plugin is not loaded.");
                return;
            }


            var mapController = controller[0],
                isDefined = leafletHelpers.isDefined;

            mapController.getMap().then(function () {
                var getLayers;

                // If the layers attribute is used, we must wait until the layers are created
                if (isDefined(controller[1])) {
                    getLayers = controller[1].getLayers;
                }
                else {
                    getLayers = function () {
                        var deferred = $q.defer();
                        deferred.resolve();
                        return deferred.promise;
                    };
                }

                var getPruneLayer = function (markerData, layers) {
                    if (isDefined(layers) && isDefined(layers.overlays) &&
                        isDefined(markerData.layer) && isDefined(layers.overlays[markerData.layer])) {
                        return layers.overlays[markerData.layer];
                    }
                    else {
                        $log.error('[AngularJS - Leaflet] Unable to retrieve prune cluster layer');
                    }
                };

                getLayers().then(function (layers) {
                    var pruneMarkers = scope.prunemarkers;

                    for (var name in pruneMarkers) {
                        var pruneMarker = pruneMarkers[name];
                        var pruneLayer = getPruneLayer(pruneMarker, layers);

                        pruneLayer.RegisterMarker(
                            new PruneCluster.Marker(pruneMarker.lat,
                            pruneMarker.lng, pruneMarker.data, pruneMarker.category,
                            pruneMarker.weidht, pruneMarker.filtered));
                    }
                });
            });
        }
    };
});
