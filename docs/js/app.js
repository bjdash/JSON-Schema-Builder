'use strict'

angular.module('schema-builder', ['ui.bootstrap', 'json-schema']);

angular.module('schema-builder')
.controller('schemaCtrler', schemaCtrler);

schemaCtrler.$inject = ['$scope'];
function schemaCtrler($scope) {
    $scope.refModels = {
        "1496757761729": {
            "name": "User",
            "nameSpace": "user",
            "data": {
                "type": ["object"],
                "properties": {
                    "name": {
                        "type": ["string"]
                    }
                }
            }
        },
        "1497245758395": {
            "name": "Address",
            "nameSpace": "address",
            "data": {
                "type": ["object"]
            }
        }
    };

    //close model selector custom dropdown dropdown
    
}
