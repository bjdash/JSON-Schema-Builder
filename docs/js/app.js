'use strict'

angular.module('schema-builder', ['ui.bootstrap', 'json-schema']);

angular.module('schema-builder')
    .controller('schemaCtrler', schemaCtrler);

schemaCtrler.$inject = ['$scope', 'JsonSchema'];
function schemaCtrler($scope, JsonSchema) {
    $scope.definitions = {
        address:{
            "type": "object",
            "properties": {
                "addressLine1": {
                    "type": "string"
                },
                "addressLine2": {
                    "type": "string"
                },
                "postCode": {
                    "type": "string"
                },
                "country": {
                    "type": "string"
                }
            },
            "required": [
                "addressLine1",
                "addressLine2",
                "postCode",
                "country"
            ]
        },
        service1:{
            "type": "object",
            "properties": {
                "service1Fields": {
                    "type": "string"
                }
            }
        },
        service2:{
            "type": "object",
            "properties": {
                "service2Fields": {
                    "type": "string"
                }
            }
        }
    };

    var schema = {
        "type": "object",
        "properties": {
            "name": {
                "type": "string",
                "description": "user name"
            },
            "age": {
                "type": "integer"
            },
            "addresses": {
                "type": "array",
                "items": {
                    "$ref": "#/definitions/address"
                }
            },
            "services": {
                "anyOf": [
                    {
                        "$ref": "#/definitions/service1"
                    },
                    {
                        "$ref": "#/definitions/service2"
                    }
                ]
            }
        },
        "required": [
            "name"
        ]
    }

    $scope.data = JsonSchema.schema2obj(schema);
    $scope.data.root$$ = true;
}
