/* global angular */

angular.module('json-schema', [])
        .directive('jsonSchema', jsonSchemaDirective)
        .directive('modelTypeSelector', modelTypeSelectorDirective);

jsonSchemaDirective.$inject = [];
function jsonSchemaDirective() {
    return{
        restrict: 'A',
        scope: {
            $data: '=data'},
        templateUrl: 'modules/JsonSchemeEditor/jsonSchema.html',
        link: function ($scope, ele, attr, model) {

            var MODELS = {};

            MODELS.Default = {
                _key: '',
                _title: '',
                _description: '',
                _$ref: '',
                _default: '',
                _enum: '',
                _type: '',
                _required: false,
                __ID__: ''
            };
            MODELS._id_ = 0;

            var additional = {
                forObject: {
                    _properties: [],
                    _additionalProperties: [],
                    _disallowAdditional: false,
                    _maxProperties: undefined,
                    _minProperties: undefined,
                    _type: 'Object'
                },
                forString: {
                    _format: '',
                    _pattern: undefined,
                    _maxLength: undefined,
                    _minLength: undefined,
                    _type: 'String'
                },
                forArray: {
                    _items: [],
                    _maxItems: undefined,
                    _minItems: undefined,
                    _uniqueItems: undefined,
                    _type: 'Array'
                },
                forInteger: {
                    _format: '',
                    _maximum: undefined,
                    _minimum: undefined,
                    _exclusiveMaximum: undefined,
                    _exclusiveMinimum: undefined,
                    _multipleOf: undefined,
                    _type: 'Integer'

                },
                forNumber: {
                    _format: '',
                    _maximum: undefined,
                    _minimum: undefined,
                    _exclusiveMaximum: undefined,
                    _exclusiveMinimum: undefined,
                    _multipleOf: undefined,
                    _type: 'Number'

                }
            };


            MODELS.newArray = function (key) {
                var newArr = {};
                angular.merge(newArr, MODELS.Default, additional.forArray);
                MODELS._id_++;
                newArr.__ID__ = '$model' + MODELS._id_;
                newArr._key = key;
                return newArr;
            };

            MODELS.newBoolean = function (key) {
                var newBool = {};
                angular.merge(newBool, MODELS.Default, {_type: 'Boolean'});
                MODELS._id_++;
                newBool.__ID__ = '$model' + MODELS._id_;
                newBool._key = key;
                return newBool;
            };

            MODELS.newInteger = function (key) {
                var newInt = {};
                angular.merge(newInt, MODELS.Default, additional.forInteger);
                MODELS._id_++;
                newInt.__ID__ = '$model' + MODELS._id_;
                newInt._key = key;
                return newInt;
            };

            MODELS.newNumber = function (key) {
                var newNum = {};
                angular.merge(newNum, MODELS.Default, additional.forNumber);
                MODELS._id_++;
                newNum.__ID__ = '$model' + MODELS._id_;
                newNum._key = key;
                return newNum;
            };

            MODELS.newNull = function (key) {
                var newNull = {};
                angular.merge(newNull, MODELS.Default, {_type: 'Null'});
                MODELS._id_++;
                newNull.__ID__ = '$model' + MODELS._id_;
                newNull._key = key;
                return newNull;
            };

            MODELS.newObject = function (key) {
                var newObj = {};
                angular.merge(newObj, MODELS.Default, additional.forObject);
                MODELS._id_++;
                newObj.__ID__ = '$model' + MODELS._id_;
                newObj._key = key;
                return newObj;
            };

            MODELS.newString = function (key) {
                var newStr = {};
                angular.merge(newStr, MODELS.Default, additional.forString);
                MODELS._id_++;
                newStr.__ID__ = '$model' + MODELS._id_;
                newStr._key = key;
                return newStr;
            };



            initRootElement();
            function initRootElement() {
                if ($scope.$data){
                    $scope.entity = $scope.$data;
                    //TODO: update model{id} for existing data 
                    return;
                }
                $scope.$data = MODELS.newObject('$$ROOT##');
                $scope.$data.$root$ = true;
                var name = MODELS.newBoolean('name');
                var address = MODELS.newArray('address');

                var info = MODELS.newObject('info');
                var age = MODELS.newString('age');
                var test = MODELS.newArray('test');
                info._properties.push({age: age});
                info._properties.push({test: test});

                $scope.$data._properties.push({name: name});
                $scope.$data._properties.push({address: address});
                $scope.$data._properties.push({info: info});

                //initiate the entity used in all html templates;update whenever $data is changes (new opject is created)
                $scope.entity = $scope.$data;
            }

            $scope.configs = {
                showArrItems: false,
                currModelType: ''
            };

            function generateModel(type, key) {
                var newModel;
                switch (type) {
                    case 'Array':
                        newModel = MODELS.newArray(key);
                        break;
                    case 'Boolean':
                        newModel = MODELS.newBoolean(key);
                        break;
                    case 'Integer':
                        newModel = MODELS.newInteger(key);
                        break;
                    case 'Number':
                        newModel = MODELS.newNumber(key);
                        break;
                    case 'Null':
                        newModel = MODELS.newNull(key);
                        break;
                    case 'Object':
                        newModel = MODELS.newObject(key);
                        break;
                    case 'String':
                        newModel = MODELS.newString(key);
                        break;
                }
                return newModel;
            }

            $scope.changeModelType = function (type, entity) {
                var newModel = {};
                newModel = generateModel(type, entity._key);
                var res = updateModel($scope.$data, entity.__ID__, newModel);
                if (res === 1) {
                    $scope.$data = newModel;
                    $scope.$data.$root$ = true;
                    $scope.entity = $scope.$data;
                }
            };

            function  updateModel(data, id, newModel) {
                if (data.__ID__ === id)
                    return 1;
                var res;
                switch (data._type) {
                    case 'String':
                        // nothingt to do here
                        break;
                    case 'Integer':
                        // nothing to do here
                        break;
                    case 'Object':
                        for (var i = 0; i < data._properties.length; i++) {
                            var o = data._properties[i];
                            angular.forEach(o, function (val, key) {
                                res = updateModel(val, id, newModel);
                                if (res === 1) {
                                    data._properties[i][key] = newModel;
                                }
                            });
                        }
                        break;
                }
            }

            $scope.addNewProp = function (entity, data) {
                if (entity.__ID__ === data.__ID__) {
                    var apic = MODELS.newString('');
                    data._properties.push({"": apic});
                } else if (data._properties && data._properties.length >= 0) {
                    for (var i = 0; i < data._properties.length; i++) {
                        var o = data._properties[i];
                        angular.forEach(o, function (val, key) {
                            $scope.addNewProp(entity, val);
                        });
                    }
                }
            };

            $scope.modelSelectorOpened = function (status, entity) {
                $scope.configs.currModelType = entity._type;
                if (entity._type === 'Array') {
                    $scope.configs.showArrItems = true;
                } else {
                    $scope.configs.showArrItems = false;
                }
            };

            $scope.setArrayType = function (type, entity) {
                var newM = generateModel(type, 'arrayEle');
                entity._items[0] = newM;
            };

            $scope.removeEntity = function (entity) {
                var res = removeModel($scope.$data, entity.__ID__);
                if (res !== undefined) {
                    $scope.$data._properties.splice(res, 1);
                }
            };

            function removeModel(data, id, i) {
                if (data.__ID__ === id)
                    return i;
                var res;
                switch (data._type) {
                    case 'Object':
                        for (var i = 0; i < data._properties.length; i++) {
                            var o = data._properties[i];
                            angular.forEach(o, function (val, key) {
                                res = removeModel(val, id, i);
                                if (res !== undefined) {
                                    data._properties.splice(i, 1);
                                }
                            });
                        }
                        break;
                }
            }

            $scope.convertObj2Schema = function () {
                var schema = obj2JsonString($scope.$data);
                $scope.$schema = JSON.stringify(schema, null, '\t');
            };

            function obj2JsonString(entity) {
                var schema = {};
                switch (entity._type) {
                    case 'Object':
                        schema.type = 'object';
                        if (entity._description) {
                            schema.description = entity._description;
                        }
                        if (entity._minProperties >= 0) {
                            schema.minProperties = entity._minProperties;
                        }
                        if (entity._maxProperties >= 0) {
                            schema.maxProperties = entity._maxProperties;
                        }
                        if (entity._disallowAdditional) {
                            schema.additionalProperties = !entity._disallowAdditional;
                        }
                        if (entity._properties.length > 0) {
                            schema.properties = {};
                            schema.required = [];
                            for (var i = 0; i < entity._properties.length; i++) {
                                var o = entity._properties[i];
                                angular.forEach(o, function (val, key) {
                                    if (val && val._type) {
                                        var res = obj2JsonString(val);
                                        schema.properties[val._key] = res;
                                        if (val._required) {
                                            schema.required.push(val._key);
                                        }
                                    }
                                });
                            }
                            if (schema.required.length == 0) {
                                delete schema.required;
                            }
                        }
                        console.log(entity);
                        break;
                    case 'String':
                        schema.type = 'string';
                        if (entity._description) {
                            schema.description = entity._description;
                        }
                        if (entity._minLength >= 0) {
                            schema.minLength = entity._minLength;
                        }
                        if (entity._maxLength >= 0) {
                            schema.maxLength = entity._maxLength;
                        }
                        if (entity._pattern) {
                            schema.pattern = entity._pattern;
                        }
                        if (entity._format) {
                            schema.format = entity._format;
                        }
                        if (entity._default) {
                            schema.default = entity._default;
                        }
                        break;
                    case 'Array':
                        schema.type = 'array';
                        if (entity._description) {
                            schema.description = entity._description;
                        }
                        if (entity._default) {
                            schema.default = entity._default;
                        }
                        if (entity._uniqueItems) {
                            schema.uniqueItems = entity._uniqueItems;
                        }
                        if (entity._minItems >= 0) {
                            schema.minItems = entity._minItems;
                        }
                        if (entity._maxItems >= 0) {
                            schema.maxItems = entity._maxItems;
                        }
                        if (entity._items && entity._items[0]) {
                            schema.items = obj2JsonString(entity._items[0]);
                        }
                        break;
                    case 'Integer':
                    case 'Number':
                        schema.type = entity._type == 'Integer' ? 'integer' : 'number';
                        if (entity._description) {
                            schema.description = entity._description;
                        }
                        if (entity._default) {
                            schema.default = entity._default;
                        }
                        if (entity._minimum >= 0) {
                            schema.minimum = entity._minimum;
                        }
                        if (entity._maximum >= 0) {
                            schema.maximum = entity._maximum;
                        }
                        if (entity._exclusiveMinimum) {
                            schema.exclusiveMinimum = entity._exclusiveMinimum;
                        }
                        if (entity._exclusiveMaximum) {
                            schema.exclusiveMaximum = entity._exclusiveMaximum;
                        }
                        if (entity._multipleOf >= 0) {
                            schema.multipleOf = entity._multipleOf;
                        }
                        if (entity._format) {
                            schema.format = entity._format;
                        }
                        break;
                    case 'Boolean':
                        schema.type = 'boolean';
                        if (entity._description) {
                            schema.description = entity._description;
                        }
                        if (entity._default) {
                            schema.default = entity._default;
                        }
                        break;
                    case 'Null':
                        schema.type = 'null';
                        if (entity._description) {
                            schema.description = entity._description;
                        }
                        if (entity._default) {
                            schema.default = entity._default;
                        }
                        break;
                }
                return schema;
            }
        }
    };
}

modelTypeSelectorDirective.$inject = ['$rootScope'];
function modelTypeSelectorDirective($rootScope) {
    return{
        restrict: 'A',
        templateUrl: 'modules/JsonSchemeEditor/modelTypeSelector.html',
        link: function (scope, ele, attr, model) {

        }
    };
}