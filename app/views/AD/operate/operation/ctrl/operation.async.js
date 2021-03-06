var scope = ["$scope", "ModalAlert", "serviceAPI", '$state','$stateParams', 'urlAPI', 
    function($scope, ModalAlert, serviceAPI, $state, $stateParams, urlAPI) {
        $scope.seachParam.orderBy = "id";
        $scope.seachParam.order = 0;
        $scope.loadList = function() {
            if ($scope.seachParam.adNetWork == 2) {
                $scope.loadAsList();
            } else if ($scope.seachParam.adNetWork == 1) {
                $scope.loadNetList();
            } else {
                $scope.loadOpList();
            }
        };
        //获取List详情页
        $scope.loadOpList = function() {
            serviceAPI.loadData(urlAPI.campaign_operate_list,$scope.seachParam).then(function(result) {
                $scope.list = result.operList;
                $scope.totalItems = result.totalCount;
            }).
            catch(function(result) {});
        };
        $scope.loadNetList = function() {
            serviceAPI.loadData(urlAPI.campaign_operate_netlist,$scope.seachParam).then(function(result) {
                $scope.list = result.operList;
                $scope.totalItems = result.totalCount;
            }).
            catch(function(result) {});
        };
        $scope.loadAsList = function(){
            if ($scope.seachParam.operationId) {
                var url = urlAPI.campaign_operate_singleAslist;
            } else {
                var url = urlAPI.campaign_operate_allAslist;
            }
            serviceAPI.loadData(url, $scope.seachParam).then(function(result) {
                $scope.aslist = result.offerList;
                $scope.totalItems = result.totalCount;
            }).
            catch(function(result) {});
        };
        $scope.searchBlur = function() {
            $scope.loadList();
        };
        //获取下拉列表数据
        $scope.loadAppList = function() {
            serviceAPI.loadData(urlAPI.campaign_appList).then(function(result) {
                $scope.appList = result.appList;
                $scope.appList.unshift({appId:'',name:'All'})
            }).
            catch(function(result) {});
        };
        //app下拉筛选
        $scope.appFilter = function(vo) {
            $scope.seachParam.appId = vo.appId;
            $scope.filterParam.appfilter = vo.name;
            $scope.loadList();
        };
        //切换operation net 数据
        $scope.detailList = function(num, id){
            $scope.seachParam.orderBy = "id";
            $scope.seachParam.order = 0;
            if ($scope.seachParam.adNetWork != num) {
                $scope.seachParam.currentPage = 1;
                $scope.seachParam.adNetWork = num;
                if (id) {
                    $scope.seachParam.operationId = id;
                } else {
                    delete $scope.seachParam.operationId;
                }
                if (num == 2) {
                    $scope.loadAsList();
                } else if (num == 1) {
                    $scope.loadNetList();
                } else {
                    $scope.loadOpList();
                }
            }
        }
        //列表排序
        $scope.orderBy = function(str, num) {
            if ($scope.seachParam.order == num && $scope.seachParam.orderBy == str) {
                return;
            }
            $scope.seachParam.order = num;
            $scope.seachParam.orderBy = str;
            $scope.loadList();
        };
        /*修改operation状态*/
        $scope.changeState = function(vo) {
            if (vo.status == 0) {
               var  alertValue = "Are you sure to turn it ON";
            }else{
                var  alertValue = "Are you sure to turn it OFF";
            };
            ModalAlert.alert({
                value: alertValue,
                closeBtnValue: "No",
                okBtnValue: "Yes",
                confirm: function() {
                    var num = 0;
                    if (vo.status == 0) {
                        num = 1;
                    };
                    var statusParam = {
                        id: vo.id, 
                        status: num
                    }
                    serviceAPI.updateData(urlAPI.campaign_operate_state, statusParam).then(function(result) {
                        if (result.result == 200) {
                            vo.status = num;
                        } else {
                            ModalAlert.popup({
                                msg: result.msg
                            }, 2500);
                        }
                    }).catch(function() {})
                }
            });
        };
        $scope.deleteItem = function(vo) {
            ModalAlert.alert({
                value: "Are you sure to delete it?",
                closeBtnValue: "No",
                okBtnValue: "Yes",
                confirm: function() {
                    var url = urlAPI.campaign_operate_delete;
                    var paramId = {
                        operationId: vo.id
                    }
                    serviceAPI.delData(url,paramId).then(function(result){
                        if (result.result == 200) {
                            $scope.loadList();
                        } else {
                            ModalAlert.popup({msg: result.msg}, 2500)
                        }
                    })
                }
            });
        };
        //operation获取详情数据
        $scope.editList = function(vo) {
            $state.go("campaign.operation.operation", {param: 'edit', id: vo.id});
            
        };
        //新增operation
        $scope.addData = function() {
            $state.go("campaign.operation.operation", {param: 'new', id: 0});
        };
        //net获取详情数据
        $scope.editNetList = function(net) {
            $state.go("campaign.operation.network", {param: 'edit', id: net.id});
        };
        //新增Net
        $scope.addNet = function() {
            $state.go("campaign.operation.network", {param: 'new', id: 0});
        };
        $scope.loadList();
        $scope.loadAppList();
    }
];
return scope;
