(function () {
    angular.module('json-schema', [])
            .factory('JsonSchema', JsonSchemaService)
            .directive('jsonSchema', jsonSchemaDirective)
            .directive('modelTypeSelector', modelTypeSelectorDirective)
            .run(run);

    run.$inject = ['$templateCache', '$rootScope'];
    function run($templateCache, $rootScope) {
        var indexSchema = '<div class="json-schema" style="">\
            <uib-tabset active="active">\
                <uib-tab index="0" heading="Designer" select="convertSchema2Obj()">\
                    <div>\
                        <fieldset ng-disabled="readonly">\
                            <div class="main" style="">\
                                <div ng-include="\'main-schema.html\'"></div>\
                            </div>\
                            <div class="model-type-selector" id="model-type-selector" style="display: none">\
                                <div ng-include="\'model-selector-schema.html\'"></div>\
                            </div>\
                        </fieldset>\
                    </div>\
                </uib-tab>\
                <uib-tab index="1" heading="JSON Schema" select="convertObj2Schema()">\
                    <pre ui-ace="{mode: \'json\'}" ng-model="$schema.original" class="highlight">{{$schema.original}}</pre>\
                </uib-tab>\
            </uib-tabset>\
        </div>';
        $templateCache.put('index-json-schema.html', indexSchema);
        
        
        
        
        var mainSchema = '<div class="objCont">\
        <fieldset ng-disabled="entity.disabled">\
    <div class="js-row" ng-class="showDetailsPan?\'t_bg\':\'\'" ng-init="showDetailsPan=false;ctrl={expanded:true}">\
        <button type="button" class="btn btn-link btn-href glyphicon glyphicon-plus obj-add" ng-click="addNewProp(entity,$data,$event,entity._type.indexOf(\'Object\')<0 && entity._items[0]._type[0]==\'Object\' ? true: false)" ng-disabled="$mode == \'static\'" ng-if="(entity._type.indexOf(\'Object\')>=0) || (entity._items[0]._type[0]==\'Object\')"></button>\
        <span ng-hide="($mode == \'list\' || $mode == \'static\')&& entity.root$$">\
            <span class="glyphicon t_color obj-exp" ng-class="ctrl.expanded?\'glyphicon-triangle-bottom\':\'glyphicon-triangle-right\'" ng-click="ctrl.expanded=!ctrl.expanded"  ng-if="entity._type.indexOf(\'Object\')>=0"></span>\
            <span ng-hide="entity.root$$"><input ng-readonly="$mode == \'static\'" class="model-key" type="text" ng-model="entity._key" />:</span> <span uib-dropdown class="dropdown">\
                <button type="button" uib-dropdown-toggle class="btn btn-link btn-href model-selector dropdown-toggle"  ng-click="openMenu(entity,$event)">\
                    <span ng-repeat="t in entity._type">\
                        <span ng-class="t">{{t}}</span>\
                        <span ng-if="t===\'Array\'" ng-class="entity._items[0]._type[0]" class="unspecified">[ {{entity._items[0]._type[0]?entity._items[0]._type[0]:\'Unspecified\'}}<span ng-if="entity._items[0]._type[0]==\'$ref\'">  (#/definitions/{{$models[entity._items[0]._value].nameSpace}})</span> ]</span>\
                        <span ng-if="t===\'$ref\'" class="faint">(#/definitions/{{$models[entity._value].nameSpace}})</span>\
                        <span ng-if="!$last" class="faint"> or </span> \
                    </span>\
                    <span class="caret"></span>\
                </button>\
            </span>\
            <span  ng-if="entity._type.indexOf(\'Object\')>=0" class="faint">{<span>{{entity._properties.length}}</span>}</span>\
            <div class="model-detail" ng-hide="showDetailsPan" ng-click="showDetailsPan=true"><span class="glyphicon glyphicon-pencil""></span></div>\
            <div class="model-done" ng-show="showDetailsPan" ng-click="showDetailsPan=false"><span class="glyphicon glyphicon-ok"></span></div>\
            <button class="model-remove" ng-if="!entity.root$$ && $mode != \'static\'" type="button" ng-click="removeEntity(entity)"><span class="glyphicon glyphicon-remove"></span></button>\
            <div class="model-summary">\
                <span ng-show="entity._description" class="icon bj-playlist_add_check ico" uib-tooltip="Description present"></span>\
                <span ng-if="!entity.root$$"><input type="checkbox" class="small" ng-model="entity._required"/>Required</span>\
            </div>\
        </span>\
        <span  ng-show="($mode == \'list\' || $mode == \'static\')&& entity.root$$">{{$msg}}</span>\
    </div>\
    <div class="model-det-cont" ng-show="showDetailsPan">\
        <div class="col-xs-6" style="border-right:1px solid #9E9E9E">\
            <div class="t_color bold" style="margin-left:-10px">Basic Info</div>\
            <div class="">\
            <form class="form-horizontal form-compact model-detail-form" name="detailForm" role="form">\
                <div class="form-group" ng-if="!entity.root$$">\
                    <label class="control-label col-xs-2">Name:</label>\
                    <div class="col-xs-9">\
                        <input type="text" class="form-control sm detail-ip" id="foldName" placeholder="Field Name" ng-model="entity._key">\
                    </div>\
                </div>\
                <div class="form-group">\
                    <label class="control-label col-xs-2">Desc: </label>\
                    <div class="col-xs-9">\
                        <textarea class="form-control" ng-model="entity._description"></textarea>\
                    </div>\
                </div>\
                <div class="form-group">\
                    <label class="control-label col-xs-2">Default:</label>\
                    <div class="col-xs-9">\
                        <input type="text" class="form-control sm detail-ip" ng-model="entity._default" />\
                    </div>\
                </div>\
            </form>\
            </div>\
        </div>\
        <div class="col-xs-6">\
            <form class="form-inline model-detail-form" name="detailForm" role="form">\
            <div ng-if="!entity.root$$">\
                <div class="t_color">Common Validations</div>\
                <div>\
                    <div class="checkbox" style="padding: 2px 0;">\
                        <label><input type="checkbox" class="small" ng-model="entity._required"> Required ?</label>\
                    </div>\
                </div>\
            </div>\
            <div ng-repeat="type in entity._type">\
                <div class="t_color">{{type}} Validations</div>\
                <div ng-if="type!== \'Integer\' && type!== \'Number\' " ng-include="type+\'-schema.html\'"></div>\
                <div ng-if="type== \'Integer\' || type== \'Number\' " ng-include="\'Integer-schema.html\'"></div>\
            </div>\
            </form>\
        </div>\
    </div>\
    <div ng-show="ctrl.expanded" class="objProps">\
        <div ng-repeat="prop in entity._properties track by $index" class="propCont">\
            <div ng-repeat="(key, entity) in prop track by $index">\
                <div ng-include="\'main-schema.html\'"></div>\
            </div>\
        </div>\
    </div>\
    <div ng-if="entity._type.indexOf(\'Object\')<0 && entity._items[0]._type[0]==\'Object\'" ng-repeat="prop in entity._items[0]._properties track by $index" class="propCont">\
        <div ng-repeat="(key, entity) in prop track by $index">\
            <div ng-include="\'main-schema.html\'"></div>\
        </div>\
    </div>\
    </fieldset>\
</div>';
        $templateCache.put('main-schema.html', mainSchema);
        
        var ObjectSchema = '<div>\
            <div class="checkbox" style="padding: 2px 0;">\
                <label><input type="checkbox" class="small" ng-model="entity._disallowAdditional"> Disallow Additipnal Properties</label>\
            </div>\
        </div>\
        <div class="form-group col-xs-12">\
            <label class="model-label-x">minProperties:</label>\
            <input type="number" class="form-control sm detail-ip" ng-model="entity._minProperties" min="0" placeholder=">=0" />\
        </div>\
        <div class="form-group col-xs-12">\
            <label class="model-label-x">maxProperties:</label>\
            <input type="number" class="form-control sm detail-ip" ng-model="entity._maxProperties" min="0" placeholder=">=0" />\
        </div>';
        $templateCache.put('Object-schema.html', ObjectSchema);


        var modelTypeSelector = '<span uib-dropdownz class="dropdown">\
                <button type="button" uib-dropdown-togglez class="btn btn-link btn-href model-selector dropdown-toggle"  ng-click="openMenu(entity,$event)">\
                    <span ng-repeat="t in entity._type">\
                        <span ng-class="t">{{t}}</span><span ng-if="!$last" class="faint"> or </span> \
                    </span>\
                    <span class="caret"></span>\
                </button>\
            </span>';
        $templateCache.put('modelTypeSelector.html', modelTypeSelector);


        var StringSchema = '<div class="form-group col-xs-12">\
            <label class="model-label-x">minLength:</label>\
            <input type="number" class="form-control sm detail-ip" ng-model="entity._minLength" min="0" placeholder=">=0" />\
        </div>\
        <div class="form-group col-xs-12">\
            <label class="model-label-x">maxLength:</label>\
            <input type="number" class="form-control sm detail-ip" ng-model="entity._maxLength" min="0" placeholder=">=0" />\
        </div>\
        <div class="form-group col-xs-12">\
            <label class="model-label-x">Pattern:</label>\
            <input type="text" class="form-control sm detail-ip" ng-model="entity._pattern" min="0" />\
        </div>\
        <div class="form-group col-xs-12">\
            <label class="model-label-x">Format:</label>\
            <select class="form-control sm detail-ip" ng-model="entity._format">\
                <option value="">--no-format--</option>\
                <option value="email">email</option>\
                <option value="hostname">hostname</option>\
                <option value="date-time">date-time</option>\
                <option value="ipv4">ipv4</option>\
                <option value="ipv6">ipv6</option>\
                <option value="uri">uri</option>\
            </select>\
        </div>\
        <div class="form-group col-xs-12">\
            <label class="model-label-x">Enum:</label>\
            <textarea class="form-control sm detail-ip" ng-model="entity._enum" placeholder="\"abcd\", 1, 1.5,\"etc\""></textarea>\
        </div>';
        $templateCache.put('String-schema.html', StringSchema);


        var ArraySchema = '<div>\
            <div class="checkbox" style="padding: 2px 0;">\
                <label><input type="checkbox" class="small" ng-model="entity._uniqueItems"> Allow only unique items?</label>\
            </div>\
        </div>\
        <div class="form-group col-xs-12">\
            <label class="model-label-x">minItems:</label>\
            <input type="number" class="form-control sm detail-ip" ng-model="entity._minItems" min="0" placeholder=">=0" />\
        </div>\
        <div class="form-group col-xs-12">\
            <label class="model-label-x">maxItems:</label>\
            <input type="number" class="form-control sm detail-ip" ng-model="entity._maxItems" min="0" placeholder=">=0" />\
        </div>';
        $templateCache.put('Array-schema.html', ArraySchema);


        var BooleanSchema = 'No validations for this type..';
        $templateCache.put('Boolean-schema.html', BooleanSchema);


        var IntNumSchema = '<div class="form-group col-xs-12">\
            <label class="model-label-x">minimum:</label>\
            <input type="number" class="form-control sm detail-ip" ng-model="entity._minimum" min="0" />\
            <label><input type="checkbox" class="small" ng-model="entity._exclusiveMinimum"> Exclude minimum ?</label>\
        </div>\
        <div class="form-group col-xs-12">\
            <label class="model-label-x">maximum:</label>\
            <input type="number" class="form-control sm detail-ip" ng-model="entity._maximum" min="0" />\
            <label><input type="checkbox" class="small" ng-model="entity._exclusiveMaximum"> Exclude maximum ?</label>\
        </div>\
        <div class="form-group col-xs-12">\
            <label class="model-label-x">multipleOf:</label>\
            <input type="number" class="form-control sm detail-ip" ng-model="entity._multipleOf" min="0" />\
        </div>\
        <div class="form-group col-xs-12">\
            <label class="model-label-x">Format:</label>\
            <select class="form-control sm detail-ip" ng-model="entity._format">\
                <option value="int32">int32</option>\
                <option value="int64">int64</option>\
            </select>\
        </div>\
        <div class="form-group col-xs-12">\
            <label class="model-label-x">Enum:</label>\
            <textarea class="form-control sm detail-ip" ng-model="entity._enum" placeholder="\"abcd\", 1, 1.5,\"etc\""></textarea>\
        </div>';
        $templateCache.put('Integer-schema.html', IntNumSchema);
        

        var NullSchema = 'No validations for this type..';
        $templateCache.put('Null-schema.html', NullSchema);


        var $refSchema = 'No validations for this type..';
        $templateCache.put('$ref-schema.html', $refSchema);


        var modelSelectorSchema = '<div class="model-type-selector-cont">\
            <div class="title t_color">Model Type</div>\
            <div style="float: right;font-size: 12px;margin-top: -20px;">Hold Ctrl key to select multiple</div>\
            <div class="model-types">\
                <button type="button" class="btn btn-link btn-sm" ng-class="configs.currModelType.indexOf(\'Array\')>=0?\'t_bg\':\'\'" ng-click="changeModelType(\'Array\', entity, $event)" ng-if="$mode != \'static\'">Array</button>\
                <button type="button" class="btn btn-link btn-sm" ng-class="configs.currModelType.indexOf(\'Boolean\')>=0?\'t_bg\':\'\'" ng-click="changeModelType(\'Boolean\', entity, $event)">Boolean</button>\
                <button type="button" class="btn btn-link btn-sm" ng-class="configs.currModelType.indexOf(\'Integer\')>=0?\'t_bg\':\'\'" ng-click="changeModelType(\'Integer\', entity, $event)">Integer</button>\
                <button type="button" class="btn btn-link btn-sm" ng-class="configs.currModelType.indexOf(\'Number\')>=0?\'t_bg\':\'\'" ng-click="changeModelType(\'Number\', entity, $event)">Number</button>\
                <button type="button" class="btn btn-link btn-sm" ng-class="configs.currModelType.indexOf(\'Null\')>=0?\'t_bg\':\'\'" ng-click="changeModelType(\'Null\', entity, $event)" ng-if="$mode != \'list\' && $mode != \'static\'">null</button>\
                <button type="button" class="btn btn-link btn-sm" ng-class="configs.currModelType.indexOf(\'Object\')>=0?\'t_bg\':\'\'" ng-click="changeModelType(\'Object\', entity, $event)" ng-if="$mode != \'list\' && $mode != \'static\'">Object</button>\
                <button type="button" class="btn btn-link btn-sm" ng-class="configs.currModelType.indexOf(\'String\')>=0?\'t_bg\':\'\'" ng-click="changeModelType(\'String\', entity, $event)">String</button>\
                <button type="button" class="btn btn-link btn-sm" ng-class="configs.currModelType.indexOf(\'$ref\')>=0?\'t_bg\':\'\'" ng-click="changeModelType(\'$ref\', entity, $event)" ng-if="$mode != \'list\' && $mode != \'static\'">$ref</button>\
            </div>\
            <div ng-if="configs.showMoreOptn == \'array\'">\
                <div class="title t_color">Array Items Type</div>\
                <div class="array-items">\
                    <button type="button" class="btn btn-link btn-sm" ng-class="selectedEntity._items[0]._type[0]?\'\':\'t_bg\'" ng-click="setArrayType(\'Unspecified\', entity, $event)">Unspecified</button>\
                    <button type="button" class="btn btn-link btn-sm" ng-class="selectedEntity._items[0]._type[0]==\'Integer\'?\'t_bg\':\'\'" ng-click="setArrayType(\'Integer\', entity, $event)">Integer</button>\
                    <button type="button" class="btn btn-link btn-sm" ng-class="selectedEntity._items[0]._type[0]==\'Boolean\'?\'t_bg\':\'\'" ng-click="setArrayType(\'Boolean\', entity, $event)">Boolean</button>\
                    <button type="button" class="btn btn-link btn-sm" ng-class="selectedEntity._items[0]._type[0]==\'Number\'?\'t_bg\':\'\'" ng-click="setArrayType(\'Number\', entity, $event)">Number</button>\
                    <button type="button" class="btn btn-link btn-sm" ng-class="selectedEntity._items[0]._type[0]==\'Object\'?\'t_bg\':\'\'" ng-click="setArrayType(\'Object\', entity, $event)" ng-if="$mode != \'list\'">Object</button>\
                    <button type="button" class="btn btn-link btn-sm" ng-class="selectedEntity._items[0]._type[0]==\'String\'?\'t_bg\':\'\'" ng-click="setArrayType(\'String\', entity, $event)">String</button>\
                    <button type="button" class="btn btn-link btn-sm" ng-class="selectedEntity._items[0]._type[0]==\'$ref\'?\'t_bg\':\'\'" ng-click="setArrayType(\'$ref\', entity, $event)">$ref</button>\
                </div>\
            </div>\
            <div ng-if="configs.showMoreOptn == \'$ref\' || configs.extraArrayOptn">\
                <div class="title t_color">Select model</div>\
                <div class="array-items">\
                    <select ng-click="$event.stopPropagation()" ng-change="setModelFor$Ref()" style="height:24px" ng-model="modelRef.model">\
                        <option ng-repeat="(id, m) in $models track by $index" value="{{id}}">#/definitions/{{m.nameSpace}} ({{m.name}})</option>\
                    </select>\
                </div>\
            </div>\
        </div>';

        $templateCache.put('model-selector-schema.html', modelSelectorSchema);
        
        
        //close model selector custom dropdown dropdown
        angular.element('body').bind('click', function (e) {
            var target = e.target;
            if (!angular.element(target).hasClass('model-selector')) {
                angular.element('.model-type-selector').hide();
            }
            console.log('body clicked');
        });
    }

    jsonSchemaDirective.$inject = ['JsonSchema', '$timeout'];
    function jsonSchemaDirective(JsonSchema, $timeout) {
        return{
            restrict: 'A',
            scope: {
                $data: '=data',
                $mode: '@mode',
                $msg: '@msg',
                $models: '=models',
                readonly: '@readonly'
            },
            templateUrl: 'index-json-schema.html',
            link: function ($scope, ele, attr, model) {
                initRootElement();
                //initialize the root element
                function initRootElement() {
                    $scope.$mode = $scope.$mode ? $scope.$mode : 'object';
                    if ($scope.$data) {
                        $scope.entity = $scope.$data;
                        JsonSchema._id_ = getLastModelId($scope.$data, 0);
                        return;
                    }
                    $scope.$data = JsonSchema.newObject('##ROOT##');
                    $scope.$data.root$$ = true;
                    
                    //initiate the entity used in all html templates;update whenever $data is changes (new opject is created)
                    $scope.entity = $scope.$data;
                }

                $scope.configs = {
                    showMoreOptn: '',
                    currModelType: [],
                    extraArrayOptn:'',
                    menuOpen: true
                };
                $scope.modelRef = {
                    model:0
                };
                
                $scope.str = function (data){
                    return JSON.stringify(data, function(k, v) { if (v === undefined) { return null; } return v; },'     ');
                };

                //generates a model based on the type and key
                function generateModel(type, key) {
                    var newModel;
                    switch (type) {
                        case 'Array':
                            newModel = JsonSchema.newArray(key);
                            break;
                        case 'Boolean':
                            newModel = JsonSchema.newBoolean(key);
                            break;
                        case 'Integer':
                            newModel = JsonSchema.newInteger(key);
                            break;
                        case 'Number':
                            newModel = JsonSchema.newNumber(key);
                            break;
                        case 'Null':
                            newModel = JsonSchema.newNull(key);
                            break;
                        case 'Object':
                            newModel = JsonSchema.newObject(key);
                            break;
                        case 'String':
                            newModel = JsonSchema.newString(key);
                            break;
                        case '$ref':
                            newModel = JsonSchema.new$ref(key);
                            break;
                    }
                    return newModel;
                }

                //change the model type
                $scope.changeModelType = function (type, entity, event) {
                    entity = $scope.selectedEntity;
                    if(event.ctrlKey){
                        if(entity._type.indexOf(type)>=0){
                        //unselect current type
                            if(entity._type.length>1){
                                var index = entity._type.indexOf(type);
                                entity._type.splice(index,1);
                                manageModelProps(type, entity, 'remove');
                            }
                        }else{
                            entity._type.push(type);
                            manageModelProps(type, entity, 'add');
                        }
                    }else{
                        for(var i=0; i< entity._type.length; i++){
                            manageModelProps(entity._type[i], entity, 'remove');
                        }
                        entity._type = [type];
                        manageModelProps(type, entity, 'add');
                    }
                    
                    $scope.modelChangesCallback(entity);
                    if (event) {
                        event.stopPropagation();
                    }
                };

                function manageModelProps(type, entity, action){
                    var fieldsObj = {};
                    switch (type){
                        case 'Object':
                            fieldsObj = angular.copy(JsonSchema.fields.forObject);
                            break;
                        case 'String':
                            fieldsObj = angular.copy(JsonSchema.fields.forString);
                            break;
                        case 'Array':
                            fieldsObj = angular.copy(JsonSchema.fields.forArray);
                            break;
                        case 'Integer':
                            fieldsObj = angular.copy(JsonSchema.fields.forInteger);
                            break;
                        case 'Number':
                            fieldsObj = angular.copy(JsonSchema.fields.forNumber);
                            break;
                        case '$ref':
                            fieldsObj = angular.copy(JsonSchema.fields.for$ref);
                            break;
                    }
                    angular.forEach(fieldsObj, function (val, key){
                        if(action === 'remove'){
                            if(entity.hasOwnProperty(key) && key !== '_type'){
                                delete entity[key];
                            }
                        }else if(action === 'add'){
                            if(!entity.hasOwnProperty(key)){
                                entity[key] = val;
                            }
                        }
                    });
                }

                $scope.openMenu = function (entity, e) {
                    var target = e.currentTarget;
                    //$scope.showSelector = true;
                    $scope.modelChangesCallback(entity);
                    var left= e.clientX, top = e.clientY+15;
                    var popHeight = 270; //max height of the popup
                    var winHeight = window.innerHeight;
                    if(winHeight-top < popHeight){
                        top = winHeight-popHeight;
                    }
                    angular.element(target).parents('.json-schema').find('#model-type-selector').css({'top':top+'px', 'left':left+'px'}).show();
                    e.preventDefault();
                    e.stopPropagation();
                };

                //recursively fine the parent and add the entity
                $scope.addNewProp = function (entity, data, e, forArray) {
                    if(forArray){
                        $scope.addNewPropArrObj(entity, data, e);
                        return;
                    }
                    var apic = JsonSchema.newString('');
                    
                    entity._properties.push({'': apic});
                    $timeout(function () {
                        angular.element(e.currentTarget).parents('.objCont').find('.propCont').last().find('.model-key').focus();
                    });
                    return;
                    
                   /*if (entity.__ID__ === data.__ID__) {
                        var apic = JsonSchema.newString('');
                        data._properties.push({"": apic});
                        $timeout(function () {
                            angular.element(e.currentTarget).parents('.objCont').find('.propCont').last().find('.model-key').focus();
                        });
                    } else if (data._properties && data._properties.length >= 0) {
                        for (var i = 0; i < data._properties.length; i++) {
                            var o = data._properties[i];
                            angular.forEach(o, function (val, key) {
                                $scope.addNewProp(entity, val, e);
                            });
                        }
                    }*/
                };

                //Add property when array type is Object
                $scope.addNewPropArrObj = function (entity, data, e) {
                    if (!entity._items) {
                        return;
                    }
                    var apic = JsonSchema.newString('');
                    entity._items[0]._properties.push({'': apic});
                    $timeout(function () {
                        angular.element(e.currentTarget).parents('.objCont').find('.propCont').last().find('.model-key').focus();
                    });
                };

                //callback after the model changed
                $scope.modelChangesCallback = function (entity) {
                    $scope.configs.currModelType = entity._type;
                    $scope.selectedEntity = entity;
                    if (entity._type.indexOf('Array')>=0) {
                        $scope.configs.showMoreOptn = 'array';
                        if (entity._type.indexOf('$ref')>=0) {
                            $scope.configs.showMoreOptn = 'Array$ref';
                            $scope.modelRef.model = '';
                        }
                    } else if (entity._type.indexOf('$ref')>=0) {
                        $scope.configs.showMoreOptn = '$ref';
                        $scope.modelRef.model = '';
                    } else {
                        $scope.configs.showMoreOptn = '';
                    }
                    $scope.configs.extraArrayOptn = false;
                };

                $scope.setArrayType = function (type, entity, e) {
                    var newM = generateModel(type, 'arrayEle');
                    entity = $scope.selectedEntity;
                    entity._items[0] = newM;
                    if(type === '$ref'){
                        $scope.configs.extraArrayOptn = true;
                        $scope.modelRef.model = '';
                    }else{
                        $scope.configs.extraArrayOptn = false;
                    }
                    e.stopPropagation();
                };

                $scope.setModelFor$Ref = function () {
                    if($scope.configs.extraArrayOptn){
                        $scope.selectedEntity._items[0]._value = $scope.modelRef.model;
                        console.log($scope.selectedEntity);
                    }else{
                        $scope.selectedEntity._value = $scope.modelRef.model;
                    }
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
                    for(var j=0; j<data._type.length; j++){
                        var type = data._type[j];
                        switch (type) {
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
                            case 'Array':
                                if(data._items[0] && data._items[0]._properties){
                                    for (var i = 0; i < data._items[0]._properties.length; i++) {
                                        var o = data._items[0]._properties[i];
                                        angular.forEach(o, function (val, key) {
                                            res = removeModel(val, id, i);
                                            if (res !== undefined) {
                                                data._items[0]._properties.splice(i, 1);
                                            }
                                        });
                                    }
                                }
                                break;
                        }
                    }
                    
                }

                $scope.convertObj2Schema = function () {
                    var schema = JsonSchema.obj2schema($scope.$data, $scope.$models);
                    console.log($scope.$data);
                    $scope.$schema = {
                        original: JSON.stringify(schema, null, '    '),
                        dup:JSON.stringify(schema, null, '    ')
                    };
                    
                };
                
                $scope.convertSchema2Obj = function () {
                    if($scope.$schema && $scope.$schema.original !== $scope.$schema.dup){
                        $scope.$data = JsonSchema.schema2obj($scope.$schema.original, undefined, undefined, true, $scope.$models);
                    }
                };

                $scope.$watch(function () {
                    return $scope.$data;
                }, function () {
                    initRootElement();
                });

                function getLastModelId(data, lastId) {
                    var id = data.__ID__;
                    var idNum = parseInt(id.substring(6, id.length));
                    if (idNum >= lastId)
                        lastId = idNum;
                    switch (data._type) {
                        case 'Object':
                            for (var i = 0; i < data._properties.length; i++) {
                                var o = data._properties[i];
                                angular.forEach(o, function (val, key) {
                                    if (typeof val === 'object' && val.__ID__) {
                                        lastId = getLastModelId(val, lastId);
                                    }
                                });
                            }
                            break;
                        case 'Array':
                            if(data._items[0] && data._items[0]._properties){
                                for (var i = 0; i < data._items[0]._properties.length; i++) {
                                    var o = data._items[0]._properties[i];
                                    angular.forEach(o, function (val, key) {
                                        if (typeof val === 'object' && val.__ID__) {
                                            lastId = getLastModelId(val, lastId);
                                        }
                                    });
                                }
                            }else if(data._items[0]){
                                lastId = getLastModelId(data._items[0], lastId);
                            }
                            break;
                    }

                    return lastId;
                }
            }
        };
    }

    modelTypeSelectorDirective.$inject = ['$rootScope'];
    function modelTypeSelectorDirective($rootScope) {
        return{
            restrict: 'A',
            templateUrl: 'modelTypeSelector.html',
            link: function (scope, ele, attr, model) {

            }
        };
    }

    JsonSchemaService.$inject = [];
    function JsonSchemaService() {
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
                _type: ['Object']
            },
            forString: {
                _format: '',
                _pattern: undefined,
                _maxLength: undefined,
                _minLength: undefined,
                _type: ['String']
            },
            forArray: {
                _items: [],
                _maxItems: undefined,
                _minItems: undefined,
                _uniqueItems: undefined,
                _type: ['Array']
            },
            forInteger: {
                _format: '',
                _maximum: undefined,
                _minimum: undefined,
                _exclusiveMaximum: undefined,
                _exclusiveMinimum: undefined,
                _multipleOf: undefined,
                _type: ['Integer']

            },
            forNumber: {
                _format: '',
                _maximum: undefined,
                _minimum: undefined,
                _exclusiveMaximum: undefined,
                _exclusiveMinimum: undefined,
                _multipleOf: undefined,
                _type: ['Number']

            },
            for$ref: {
                _type: ['$ref'],
                _value: ''
            }
        };
        MODELS.fields = additional;

        MODELS.newArray = function (key) {
            var newArr = {};
            angular.merge(newArr, MODELS.Default, additional.forArray);
            MODELS._id_+=1;
            newArr.__ID__ = '$model' + MODELS._id_;
            newArr._key = key;
            return newArr;
        };

        MODELS.newBoolean = function (key) {
            var newBool = {};
            angular.merge(newBool, MODELS.Default, {_type: ['Boolean']});
            MODELS._id_+=1;
            newBool.__ID__ = '$model' + MODELS._id_;
            newBool._key = key;
            return newBool;
        };

        MODELS.newInteger = function (key) {
            var newInt = {};
            angular.merge(newInt, MODELS.Default, additional.forInteger);
            MODELS._id_+=1;
            newInt.__ID__ = '$model' + MODELS._id_;
            newInt._key = key;
            return newInt;
        };

        MODELS.newNumber = function (key) {
            var newNum = {};
            angular.merge(newNum, MODELS.Default, additional.forNumber);
            MODELS._id_+=1;
            newNum.__ID__ = '$model' + MODELS._id_;
            newNum._key = key;
            return newNum;
        };

        MODELS.newNull = function (key) {
            var newNull = {};
            angular.merge(newNull, MODELS.Default, {_type: ['Null']});
            MODELS._id_+=1;
            newNull.__ID__ = '$model' + MODELS._id_;
            newNull._key = key;
            return newNull;
        };

        MODELS.newObject = function (key, props) {
            var newObj = {};
            angular.merge(newObj, MODELS.Default, additional.forObject);
            MODELS._id_+=1;
            newObj.__ID__ = '$model' + MODELS._id_;
            newObj._key = key;
            
            if(props){
                newObj._properties = props;
            }
            
            return newObj;
        };

        MODELS.newString = function (key) {
            var newStr = {};
            angular.merge(newStr, MODELS.Default, additional.forString);
            MODELS._id_+=1;
            newStr.__ID__ = '$model' + MODELS._id_;
            newStr._key = key;
            //newStr.disabled = true;
            return newStr;
        };

        MODELS.new$ref = function (key, value) {
            var newRef = {};
            angular.merge(newRef, {}, additional.for$ref);
            MODELS._id_+=1;
            newRef.__ID__ = '$model' + MODELS._id_;
            newRef._key = key;
            newRef._value = value;
            return newRef;
        };

        MODELS.getObjPropertyByKey = function (obj, key) {
            if (obj && obj._properties && obj._properties.length > 0) {
                var found = false;
                for (var i = 0; i < obj._properties.length; i++) {
                    var prop = obj._properties[i];
                    angular.forEach(prop, function (val) {
                        if (val._key === key)
                            found = val;
                    });
                    if (found)
                        return found;
                }
            }
            return false;
        };

        /*MODELS.copyCommonProperties = function (newModel, oldModel) {
            if (newModel === undefined || oldModel === undefined)
                return newModel;

            newModel._description = oldModel._description;
            newModel._required = oldModel._required;
            return newModel;
        };*/

        MODELS.obj2schema = obj2schema;
        MODELS.schema2obj = schema2obj;
        MODELS.getModeldefinitions = getModeldefinitions;
        
        function obj2schema(entity, models) {
            var schema = {};
            schema.type = [];
            for(var x = 0; x< entity._type.length; x++){
                var type = entity._type[x];
                switch (type) {
                    case 'Object':
                        schema.type.push('object');
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
                                        var res = obj2schema(val, models);
                                        schema.properties[val._key] = res;
                                        if (val._required) {
                                            schema.required.push(val._key);
                                        }
                                    }
                                });
                            }
                            if (schema.required.length === 0) {
                                delete schema.required;
                            }
                        }
                        break;
                    case 'String':
                        schema.type.push('string');
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
                        if(entity._enum){
                            var _enum = '['+entity._enum+']';
                            try{
                                schema.enum = JSON.parse(_enum);
                            }catch(e){
                                delete schema.enum;
                            }
                        }
                        break;
                    case 'Array':
                        schema.type.push('array');
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
                            schema.items = obj2schema(entity._items[0], models);
                        }
                        break;
                    case 'Integer':
                    case 'Number':
                        schema.type.push(type === 'Integer' ? 'integer' : 'number');
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
                        if(entity._enum){
                            var _enum = '['+entity._enum+']';
                            try{
                                schema.enum = JSON.parse(_enum);
                            }catch(e){
                                delete schema.enum;
                            }
                        }
                        break;
                    case 'Boolean':
                        schema.type.push('boolean');
                        if (entity._description) {
                            schema.description = entity._description;
                        }
                        if (entity._default) {
                            try{
                                var bool = JSON.parse(entity._default);
                                if(typeof bool === 'boolean'){
                                    schema.default = bool;
                                }
                            }catch (e){

                            }

                        }
                        break;
                    case 'Null':
                        schema.type.push('null');
                        if (entity._description) {
                            schema.description = entity._description;
                        }
                        if (entity._default) {
                            schema.default = entity._default;
                        }
                        break;
                    case '$ref':
                        var path = '';
                        if (models && models[entity._value] && models[entity._value].nameSpace) {
                            path = models[entity._value].nameSpace;
                        }
                        schema.$ref = '#/definitions/' + path;
                        delete schema.type;
                }
            }
            if(schema.type && schema.type.length === 1){
                var t = schema.type[0];
                schema.type = t;
            }
            return schema;
        }


        function copyProps(obj, newModel){
            angular.forEach(newModel, function (val, key){
                if(!obj.hasOwnProperty(key)){
                    obj[key] = val;
                }
            });
        }

        function schema2obj(schema, key, required, isRoot, modelObjs) {
            if(!schema) {
                var schema = MODELS.newObject('##ROOT##');
                schema.root$$ = true;
                return schema;
            }
            if (typeof schema === 'string') {
                try {
                    schema = JSON.parse(schema);
                } catch (e) {
                    return null;
                }
            }
            if (key === undefined)
                key = '##ROOT##';
            if (!required)
                required = false;

            var obj;
            if(!(schema.type instanceof Array)){
                schema.type = [schema.type];
            }
            //var types = schema.type;
            for(var x=0; x< schema.type.length; x++){
                var type = schema.type[x];
                switch (type) {
                    case 'object':
                        var newModel = angular.copy(MODELS.newObject(key));
                        if(obj && obj._type && obj._type.length>0){
                            obj._type.push(newModel._type[0]);
                            copyProps(obj, newModel);
                        }else{
                            obj = newModel;
                        }

                        if (schema.description) {
                            obj._description = schema.description;
                        }
                        if (schema.minProperties >= 0) {
                            obj._minProperties = schema.minProperties;
                        }
                        if (schema.maxProperties >= 0) {
                            obj._maxProperties = schema.maxProperties;
                        }
                        if (schema.hasOwnProperty('additionalProperties')) {
                            obj._disallowAdditional = !schema.additionalProperties;
                        }
                        angular.forEach(schema.properties, function (entity, key) {
                            var req = false;
                            if (schema.required) {
                                req = schema.required.indexOf(key) >= 0 ? true : false;
                            }
                            var childObj = {};
                            childObj[key]=schema2obj(entity, key, req,false, modelObjs);
                            obj._properties.push(childObj);
                        });
                        break;
                    case 'array':
                        var newModel = angular.copy(MODELS.newArray(key));
                        if(obj && obj._type && obj._type.length>0){
                            obj._type.push(newModel._type[0]);
                            copyProps(obj, newModel);
                        }else{
                            obj = newModel;
                        }

                        if (schema.description) {
                            obj._description = schema.description;
                        }
                        if (schema.default) {
                            obj._default=schema.default;
                        }
                        if (schema.hasOwnProperty('uniqueItems')) {
                            obj._uniqueItems = obj.uniqueItems;
                        }
                        if (schema.hasOwnProperty('minItems')) {
                            obj._minItems = schema.minItems;
                        }
                        if (schema.hasOwnProperty('maxItems')) {
                            obj._maxItems = schema.maxItems;
                        }

                        if (schema.items) {
                            obj._items = [];
                            var req = false;
                            if (schema.required) {
                                req = schema.required.indexOf(key) >= 0 ? true : false;
                            }
                            obj._items.push(schema2obj(schema.items, '', req,false, modelObjs));
                        }
                        break;
                    case 'string':
                        var newModel = angular.copy(MODELS.newString(key));
                        if(obj && obj._type && obj._type.length>0){
                            obj._type.push(newModel._type[0]);
                            copyProps(obj, newModel);
                        }else{
                            obj = newModel;
                        }
                        if (schema.description) {
                            obj._description = schema.description;
                        }
                        if (schema.minLength >= 0) {
                            obj._minLength = schema.minLength;
                        }
                        if (schema.maxLength >= 0) {
                            obj._maxLength = schema.maxLength;
                        }
                        if (schema.pattern) {
                            obj._pattern = schema.pattern;
                        }
                        if (schema.format) {
                            obj._format = schema.format;
                        }
                        if (schema.default) {
                            obj._default = schema.default;
                        }
                        if (schema.hasOwnProperty('enum') && schema.enum.length>0 ) {
                            var _enum = JSON.stringify(schema.enum);
                            _enum = _enum.substr(1,_enum.length-2);
                            _enum = _enum.replace(/,/g,',\n');
                            obj._enum = _enum;
                        }
                        break;
                    case 'integer':
                    case 'number':
                        var newModel;
                        if (type === 'integer') {
                            newModel = angular.copy(MODELS.newInteger(key));
                        } else {
                            newModel = angular.copy(MODELS.newNumber(key));
                        }
                        if(obj && obj._type && obj._type.length>0){
                            obj._type.push(newModel._type[0]);
                            copyProps(obj, newModel);
                        }else{
                            obj = newModel;
                        }
                        
                        if (schema.description) {
                            obj._description = schema.description;
                        }
                        if (schema.default) {
                            obj._default = schema.default;
                        }
                        if (schema.minimum >= 0) {
                            obj._minimum = schema.minimum;
                        }
                        if (schema.maximum >= 0) {
                            obj._maximum = schema.maximum;
                        }
                        if (schema.exclusiveMinimum) {
                            obj._exclusiveMinimum = schema.exclusiveMinimum;
                        }
                        if (schema.exclusiveMaximum) {
                            obj._exclusiveMaximum = schema.exclusiveMaximum;
                        }
                        if (schema.multipleOf >= 0) {
                            obj._multipleOf = schema.multipleOf;
                        }
                        if (schema.format) {
                            obj._format = schema.format;
                        }
                        if (schema.hasOwnProperty('enum') && schema.enum.length>0 ) {
                            var _enum = JSON.stringify(schema.enum);
                            _enum = _enum.substr(1,_enum.length-2);
                            _enum = _enum.replace(/,/g,',\n');
                            obj._enum = _enum;
                        }
                        break;
                    case 'boolean':
                        var newModel = angular.copy(MODELS.newBoolean(key));
                        if(obj && obj._type && obj._type.length>0){
                            obj._type.push(newModel._type[0]);
                            copyProps(obj, newModel);
                        }else{
                            obj = newModel;
                        }
                        if (schema.description) {
                            obj._description = schema.description;
                        }
                        if (schema.default) {
                            obj._default = schema.default;
                        }
                        break;
                    case 'null':
                        var newModel = angular.copy(MODELS.newNull(key));
                        if(obj && obj._type && obj._type.length>0){
                            obj._type.push(newModel._type[0]);
                            copyProps(obj, newModel);
                        }else{
                            obj = newModel;
                        }
                        //schema.type = 'null';
                        if (schema.description) {
                            obj._description = schema.description;
                        }
                        if (schema.default) {
                            obj._default = schema.default;
                        }
                        break;
                }
                if(!type && schema.$ref){
                    var value = schema.$ref.substring(14,schema.$ref.length);
                    var modelKey = '';
                    if(modelObjs){
                        angular.forEach(modelObjs, function (model, key){
                            if(model.nameSpace === value){
                                modelKey = key;
                            }
                        });
                    }

                    obj = MODELS.new$ref(key, modelKey);
                }
            }
            
            obj._required = required;
            if(isRoot){
                obj.root$$ = true;
            }
            
            return obj;
        }
        
        function getModeldefinitions(models) {
            var modelRefs = {};
            angular.forEach(models, function (model) {
                modelRefs[model.nameSpace] = model.data;
            });
            return modelRefs;
        }
        
        return MODELS;
    }
})();