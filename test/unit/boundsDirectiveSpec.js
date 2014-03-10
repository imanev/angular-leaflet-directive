'use strict';

/*jshint -W117 */
/*jshint globalstrict: true*/
/* jasmine specs for directives go here */

describe('Directive: bounds', function() {
    var $compile, $rootScope, leafletData, bounds, scope;

    beforeEach(module('leaflet-directive'));
    beforeEach(inject(function(_$compile_, _$rootScope_, _leafletData_){
        $compile = _$compile_;
        $rootScope = _$rootScope_;
        leafletData = _leafletData_;
    }));

    beforeEach(function(){
        scope = $rootScope.$new();
        bounds = {
            southWest: {
                lat: 51.508742458803326,
                lng: -0.087890625,
            },
            northEast: {
                lat: 51.508742458803326,
                lng: -0.087890625,
            }
        };
    });

    it('updates the map bounds if bounds are provided', function() {
        angular.extend(scope, {
            bounds: bounds,
            center: {}
        });
        var element = angular.element('<leaflet bounds="bounds" center="center"></leaflet>');
        element = $compile(element)(scope);

        var map;
        leafletData.getMap().then(function(leafletMap) {
            map = leafletMap;
        });

        scope.$digest();
        var mapBounds = map.getBounds();
        expect(mapBounds.getSouthWest().lat).toBeCloseTo(51.508742458803326);
        expect(mapBounds.getSouthWest().lng).toBeCloseTo(-0.087890625);
        expect(mapBounds.getNorthEast().lat).toBeCloseTo(51.508742458803326);
        expect(mapBounds.getNorthEast().lng).toBeCloseTo(-0.087890625);
    });

    it('allows empty bounds initialization', function(){
        angular.extend(scope, {
            bound: {},
            center: {}
        });
        var element = angular.element('<leaflet bounds="bounds" center="center"></leaflet>');
        element = $compile(element)(scope);

        var map;
        leafletData.getMap().then(function(leafletMap) {
            map = leafletMap;
        });

        scope.$digest();
        var mapBounds = map.getBounds();
        expect(mapBounds.getSouthWest().lat).toBeCloseTo(0);
        expect(mapBounds.getSouthWest().lng).toBeCloseTo(0);
        expect(mapBounds.getNorthEast().lat).toBeCloseTo(0);
        expect(mapBounds.getNorthEast().lng).toBeCloseTo(0);
    });

    it('should update map bounds when map initializes', function() {
        angular.extend(scope, {
            bound: {},
            center: {}
        });
        var element = angular.element('<leaflet bounds="bounds" center="center"></leaflet>');
        element = $compile(element)(scope);
        scope.$digest();

        leafletData.getMap().then(function(map) {
            var bounds = scope.bounds;
            var mapBounds = map.getBounds();

            expect(bounds.northEast).toBeNull();
            expect(bounds.southWest).toBeDefined();

            expect(bounds.northEast.lat).toBe(mapBounds.getNorthEast().lat);
            expect(bounds.northEast.lng).toBe(mapBounds.getNorthEast().lng);
            expect(bounds.southWest.lat).toBe(mapBounds.getSouthWest().lat);
            expect(bounds.southWest.lng).toBe();
        });
    });
});
