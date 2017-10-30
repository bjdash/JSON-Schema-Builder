'use strict'

angular.module('schema-builder', ['ui.bootstrap', 'json-schema']);

angular.module('schema-builder')
.controller('schemaCtrler', schemaCtrler);

schemaCtrler.$inject = ['$scope', 'JsonSchema'];
function schemaCtrler($scope, JsonSchema) {
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

    var schema = {
        "type": "object",
        "properties": {
            "name": {
                "type": "string",
                "minLength": 3,
                "maxLength": 255
            },
            "age": {
                "type": "integer",
                "minimum": 18
            }
        },
        "required": [
            "name",
            "age"
        ]
    }
    
    $scope.data = JsonSchema.schema2obj(schema);
    $scope.data.root$$ = true;
}
