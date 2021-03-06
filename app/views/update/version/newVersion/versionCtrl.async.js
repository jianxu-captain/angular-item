var scope = ["$scope", "serviceAPI", "ModalAlert", "Upload", "$stateParams", 'urlAPI', '$state',
    function($scope, serviceAPI, ModalAlert, Upload, $stateParams, urlAPI, $state) {
        $scope.checkNum = false;
        $scope.showPic = true;
        $scope.isShow = true;
        $scope.fullState = false;
        $scope.incState = false;
        $scope.getDetail = function() {
            $scope.detail = {
                "appicon": "",
                "fullpackage": "",
                "appName": $stateParams.app,
                "app": $stateParams.package,
                "appid": 0,
                "packagename": "",
                "version_code": "",
                "version_name": "",
                "updatenote": "",
                "mandatory_update": 0,
                "silenceinstall": 0,
                "target": 100,
                "updatepriority": 0,
                "requiresandroid": "",
                "incrementalpack": [],
                "segment": {
                    "isAnd": true,
                    "isTrue": true,
                    "items": []
                }
            };
        };
        $scope.loadDetail = function(id) {
            serviceAPI.loadData(urlAPI.update_appdetail, { "id": id }).then(function(result) {
                if (result.status == 0 && result.code == 0) {
                    $scope.detail = result.data;
                    $scope.detail.appName = result.data.app;
                    if (!$scope.detail.segment || $scope.detail.segment == '') {
                        $scope.detail.segment = {
                            "isAnd": true,
                            "isTrue": true,
                            "items": []
                        }
                    } else {
                        $scope.detail.segment = $scope.getSegment(JSON.parse($scope.detail.segment));
                    };
                    if ($scope.detail.incrementalpack.length >= 3) {
                        $scope.isShow = false;
                    };
                }
            })
        };
        $scope.getImg = function(id) {
            serviceAPI.loadData(urlAPI.update_getImg, { "id": id }).then(function(result) {
                if (result.status == 0 && result.code == 0) {
                    $scope.detail.appicon = result.data;
                }
            });
        };
        $scope.getSegment = function(vo) {
            for (var i = 0; i < vo.items.length; i++) {
                var item = vo.items[i];
                if (item.items && item.items.length > 0) {
                    item = $scope.getSegment(item);
                } else {
                    switch (item.key) {
                        case "device": 
                            item.value1 = item.channel;
                            item.value2 = item.model === '*' ? 'All Devices' : item.model;
                            item.value3 = item.osVersion === '*' ? 'All OS Versions' : item.osVersion;
                        break;
                        case "androidVersion": 
                            if (item.condition == 'bigger') {
                                item.value1 = item.version1;
                            } else {
                                item.value1 = item.version1;
                                item.value2 = item.version2;
                            }
                        break;
                        case "location": 
                            item.value1 = item.country;
                            item.value2 = item.state === '*' ? 'All States' : item.state;
                        break;
                        case "Create Time": 
                            if (item.condition == 'bigger') {
                                 item.value1 = item.days1;
                            } else {
                                item.value1 = item.days1;
                                item.value2 = item.days2;
                            }
                        break;
                        case "clientId":
                            item.value1 = item.clientIds.join();
                        break;
                    }
                    delete item.channel;
                    delete item.model;
                    delete item.osVersion;
                    delete item.version1;
                    delete item.version2;
                    delete item.country;
                    delete item.state;
                    delete item.days1;
                    delete item.days2;
                    delete item.clientIds;
                }
            }
            return vo;
        };
        $scope.loadDevice = function() {
            serviceAPI.loadData(urlAPI.update_getDevice).then(function(result) {
                if (result.status == 0 && result.code == 0) {
                    var arr = [];
                    for (var i = 0; i < result.data.length; i++) {
                        if (result.data[i].channel && result.data[i].channel != "") {
                            arr.push(result.data[i]);
                        }
                    };
                    $scope.devices = arr;
                }
            });
        };
        $scope.loadAndroidVersion = function() {
            serviceAPI.loadData(urlAPI.update_androidVersion).then(function(result) {
                if (result.status == 0 && result.code == 0) {
                    $scope.versions = result.data;
                }
            })
        };
        $scope.loadCountry = function() {
            serviceAPI.loadData(urlAPI.update_getArea).then(function(result) {
                if (result.status == 0 && result.code == 0) {
                    $scope.areas = result.data;
                }
            })
        };
        $scope.delInc = function(index, id) {
            var arr = $scope.detail.incrementalpack;
            var length = arr.length;
            if (index == 0) {
                $scope.detail.incrementalpack = arr.slice(index + 1, length);
            } else {
                $scope.detail.incrementalpack = arr.slice(0, index).concat(arr.slice(index + 1, length));
            };
            if (id) {
                serviceAPI.delData(urlAPI.update_delincrepack, { id: id }).then(function(result) {
                    if (result.status == 0 && result.code == 0) {
                        $scope.versions = result.data;
                    }
                })
            }
            $scope.isShow = true;
        };
        $scope.addInc = function() {
            if ($scope.detail.fullpackage == "") {
                return;
            };
            $scope.detail.incrementalpack.push({
                "version": "",
                "pack": "",
                "id": 0
            });
            if ($scope.detail.incrementalpack.length == 3) {
                $scope.isShow = false;
            }
        };
        $scope.changeState = function(str) {
            if ($scope.detail[str] == 0) {
                $scope.detail[str] = 1;
            } else {
                $scope.detail[str] = 0;
            }
        };
        $scope.changeTarget = function() {
            if ($scope.detail.target == 100) {
                $scope.detail.target = 99;
            } else {
                $scope.detail.target = 100;
            }
        };
        $scope.checkTarget = function() {
            $scope.detail.target = Number($scope.detail.target);
            if (!$scope.detail.target || $scope.detail.target <= 0 || isNaN($scope.detail.target)) {
                $scope.checkNum = true;
            }
        };
        $scope.removeTarget = function() {
            $scope.checkNum = false;
        };
        $scope.changePriority = function(str, num) {
            $scope.detail[str] = num;
        };
        $scope.uploadFull = function(file, errFiles) {
            if (file) {
                $scope.fullState = true;
                Upload.upload({
                    url: urlAPI.update_uploadfile,
                    data: { file: file }
                    // , idType: 1
                }).then(function(result) {
                    var result = result.data;
                    $scope.fullState = false;
                    if (result.status == 0 && result.code == 0) {
                        $scope.detail.fullpackage = result.data.filePath;
                        $scope.detail.packagename = result.data.packageName;
                        $scope.detail.version_name = result.data.versionName;
                        $scope.detail.version_code = result.data.versionCode;
                    } else {
                        ModalAlert.popup({ msg: result.msg }, 2500);
                    }
                });
            }
        };
        $scope.uploadInc = function(file, errFiles, vo) {
            if (file) {
                $scope.incState = true;
                Upload.upload({
                    url: urlAPI.update_uploadfile,
                    data: { file: file, id: vo.id }
                    // , idType: 1
                }).then(function(result) {
                    var result = result.data;
                    $scope.incState = false;
                    if (result.status == 0 && result.code == 0) {
                        vo.pack = result.data.filePath;
                        if (result.data.versionCode) {
                            vo.version = result.data.versionCode;
                        } else {
                            ModalAlert.popup({ msg: 'incorrect fileName' }, 2500);
                        }
                    } else {
                        ModalAlert.popup({ msg: result.msg }, 2500);
                    }
                });
            }
        };
        $scope.uploadImg = function(file, errFiles) {
            if (file) {
                if (file.size >= 102400) {
                    ModalAlert.popup({
                        msg: "The picture is too big"
                    }, 2500);
                    return false;
                } else {
                    $scope.picFile = file;
                    Upload.upload({
                        url: urlAPI.update_uploadfile,
                        data: { file: file }
                        // , idType: 1
                    }).then(function(result) {
                        var result = result.data;
                        if (result.status == 0 && result.code == 0) {
                            $scope.showPic = false;
                            $scope.detail.appicon = result.data.filePath;
                        } else {
                            ModalAlert.popup({ msg: result.msg }, 2500);
                        }
                    });
                }
            }
        };
        $scope.setSegment = function(vo) {
            vo.isAnd = vo.isAnd === 'true' ? true : false;
            vo.isTrue = vo.isTrue === 'true' ? true : false;
            for (var i = 0; i < vo.items.length; i++) {
                var item = vo.items[i];
                if (item.items && item.items.length > 0) {
                    item = $scope.setSegment(item);
                    delete item.key;
                    delete item.condition;
                } else {
                    delete item.isAnd;
                    delete item.isTrue;
                    switch (item.key) {
                        case "device": 
                            item.channel = item.value1;
                            item.model = item.value2 === 'All Devices' ? '*' : item.value2;
                            item.osVersion = item.value3 === 'All OS Versions' ? '*' : item.value3;
                        break;
                        case "androidVersion": 
                            if (item.condition == 'bigger') {
                                item.version1 = item.value1;
                            } else {
                                item.version1 = item.value1;
                                item.version2 = item.value2;
                            }
                        break;
                        case "location": 
                            item.country = item.value1;
                            item.state = item.value2 === 'All States' ? '*' : item.value2;
                        break;
                        case "Create Time": 
                            if (item.condition == 'bigger') {
                                item.days1 = item.value1;
                            } else {
                                item.days1 = item.value1;
                                item.days2 = item.value2;
                            }
                        break;
                        case "clientId":
                            item.clientIds = item.value1.split(",");
                        break;
                    }
                }
                delete item.value1;
                delete item.value2;
                delete item.value3;
                delete item.$$hashKey;
            }
            return vo;
        };
        $scope.saveDetail = function() {
            if (!$scope.detail.fullpackage || $scope.detail.fullpackage == '') {
                ModalAlert.popup({ msg: "Please upload a package" }, 2500)
                return false;
            }
            if (!$scope.detail.updatenote || $scope.detail.updatenote == '') {
                ModalAlert.popup({ msg: "The updatenote is required" }, 2500)
                return false;
            }
            $scope.detail.target = Number($scope.detail.target);
            if (!$scope.detail.target || $scope.detail.target <= 0 || isNaN(Number($scope.detail.target))) {
                $scope.checkNum = true;
                return false;
            }
            for (var i = 0; i < $scope.detail.segment.items.length; i++) {
                var item = $scope.detail.segment.items[i];
                if (item.items) {
                    var arr = item.items;
                    for (var i = 0; i < arr.length; i++) {
                        if (arr[i].key === "clientId") {
                            if (arr[i].value1 === "") {
                                ModalAlert.error({ msg: "clientId can not be empty!" }, 2500);
                                return false;
                            }
                            if (arr[i].condition !== "in") {
                                if (arr[i].value1.length < 32 || arr[i].value1.length > 93) {
                                    ModalAlert.error({ msg: "clientId length is not correct!" }, 2500);
                                    return false;
                                };
                            }
                        }
                    }
                } else if (item.key === "clientId") {
                    if (item.value1 === "") {
                        ModalAlert.error({ msg: "clientId can not be empty!" }, 2500);
                        return false;
                    }
                    if (item.condition !== "in") {
                        if (item.value1.length < 32 || item.value1.length > 93) {
                            ModalAlert.error({ msg: "clientId length is not correct!" }, 2500);
                            return false;
                        };
                    }
                }

            }
            $scope.segment = $scope.detail.segment;
            $scope.detail.segment = JSON.stringify($scope.setSegment($scope.detail.segment));
            var url = urlAPI.update_saveVersion;
            if ($stateParams.param == "edit") {
                url = urlAPI.update_editappver;
            };
            serviceAPI.saveData(url, $scope.detail).then(function(result) {
                if (result.status == 0 && result.code == 0) {
                    history.go(-1);
                } else {
                    $scope.detail.segment = $scope.getSegment($scope.segment);
                    ModalAlert.popup({ msg: result.msg }, 2500)
                }
            });
        };
        $scope.init = function() {
            if ($stateParams.param == "edit") {
                $scope.loadDetail($stateParams.id);
            } else {
                $scope.getDetail();
                $scope.detail.appid = $stateParams.id;
                $scope.getImg($stateParams.package);
            };
            $scope.loadDevice();
            $scope.loadCountry();
            $scope.loadAndroidVersion();
        };
        $scope.init();
    }
];
return scope;
