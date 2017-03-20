'use strict';

//Directive used to set metisMenu and minimalize button
angular.module('app.directive')
    .directive('sideNavigation', function($timeout) {
        return {
            restrict: 'A',
            link: function(scope, element) {
                // Call metsi to build when user signup
                scope.$watch('authentication.user', function() {
                    $timeout(function() {
                        element.metisMenu();
                    });
                });

                // Colapse menu in mobile mode after click on element
                var menuElement = angular.element('#side-menu a:not([href$="\\#"])');
                menuElement.click(function() {
                    if (angular.element(window).width() < 769) {
                        angular.element("body").toggleClass("mini-navbar");
                    }
                });

                // Enable initial fixed sidebar
                if (angular.element("body").hasClass('fixed-sidebar')) {
                    var sidebar = element.parent();
                    sidebar.slimScroll({
                        height: '100%',
                        railOpacity: 0.9
                    });
                }

            }
        };
    })
    .directive('minimalizaSidebar', function($timeout) {
        return {
            restrict: 'A',
            template: '<a class="navbar-minimalize minimalize-styl-2 btn btn-primary " href="" ng-click="minimalize()"><i class="fa fa-bars"></i></a>',
            controller: function($scope) {
                $scope.minimalize = function() {

                    angular.element('body').toggleClass('mini-navbar');
                    if (!angular.element('body').hasClass('mini-navbar') || angular.element('body').hasClass('body-small')) {
                        // Hide menu in order to smoothly turn on when maximize menu
                        angular.element('#side-menu').hide();
                        // For smoothly turn on menu
                        $timeout(function() {
                            angular.element('#side-menu').fadeIn(400);
                        }, 200);
                    } else {
                        // Remove all inline style from jquery fadeIn function to reset menu state
                        angular.element('#side-menu').removeAttr('style');
                    };
                    setTimeout(function() {
                        $(window).resize();
                    }, 500);
                };
            }
        };
    }).directive('initChart', [function() {
        return {
            restrict: 'AE',
            link: function(scope, ele, attrs) {
                scope[attrs.fieldName] = echarts.init(ele[0], "reva-bright");
                $(window).resize(function() {
                    scope[attrs.fieldName].resize();
                });
            }
        };
    }]).directive('operationBar', function() {
        return {
            restrict: 'AE',
            link: function(scope, ele, attrs) {
                ele.find('.collapse-link').on('click', function() {
                    var ibox = $(this).closest('div.ibox');
                    var button = $(this).find('i:first');
                    var content = ibox.children('.ibox-content');
                    content.slideToggle(200);
                    button.toggleClass('fa-chevron-up').toggleClass('fa-chevron-down');
                    ibox.toggleClass('').toggleClass('border-bottom');
                    // setTimeout(function() {
                    //     ibox.resize();
                    //     ibox.find('[id^=map-]').resize();
                    // }, 50);
                });
                ele.find('.close-link').on('click', function() {
                    var content = $(this).closest('div.ibox');
                    content.remove();
                })
            }
        };
    }).directive('multiSelectMenu', [
        '$timeout',
        function($timeout) {
            return {
                restrict: 'AE',
                templateUrl: "app/components/template/multi_select.html",
                replace: true,
                require: '?ngModel',
                scope: {
                    placehoderText: "@",
                    confirm: "&"
                },
                controller: function($scope) {
                    $scope.noSelect = true;
                    $scope.menuItems = [];
                    $scope.selectItem = [];
                    $scope.init = function() {
                        $scope.filter_value = "";
                        $scope.menuItems = [];
                        $scope.selectItem = [];
                        $scope.selactAll = true;
                        $scope.noSelect = true;
                    };
                    $scope.isSelect = function(event, value) {
                        $scope.operation = true;
                        var selectValue = value;
                        if (selectValue == "ALL" && !$scope.selactAll) {
                            $scope.selactAll = true;
                            $scope.selectItem = [];
                            $scope.placehoderText = "ALL";
                        } else if (selectValue == "ALL") {
                            $scope.selectItem = [];
                            $scope.selactAll = false;
                            $scope.placehoderText = "ALL";
                            // thisDom.siblings().find('i').addClass('fa-square-o').removeClass('fa-check-square');
                        } else {
                            if ($scope.selactAll) {
                                $scope.selectItem = $scope.menuItems.map(function(data) {
                                    return data;
                                });
                                $scope.selectItem.shift();
                            };
                            var index = $scope.selectItem.indexOf(selectValue);
                            if (index >= 0) {
                                $scope.selectItem.splice(index, 1);
                            } else {
                                $scope.selectItem.push(selectValue);
                            };
                            $scope.selactAll = false;
                        };
                        if ($scope.selectItem.length > 0) {
                            $scope.placehoderText = "Multiple Values";
                            $scope.selactAll = false;
                        } else {
                            $scope.placehoderText = "ALL";
                        }
                    };
                    $scope.delItem = function(index) {
                        $scope.selectItem = [];
                        $scope.placehoderText = "ALL";
                    };
                    $scope.init();
                },
                link: function(scope, ele, attrs, ngModel) {
                    scope.selectDom = ele.siblings('select');
                    ele.click(function() {
                        scope.menuItems = [];
                        ele.addClass('chosen-with-drop chosen-container-active');
                        scope.menuItems.push('ALL');
                        scope.selectDom.find('option').each(function(index, dom) {
                            if ($(dom).text() != "") {
                                scope.menuItems.push($(dom).text());
                            }
                        });
                        scope.$apply();
                        ele.find('.chosen-results .active-result').hover(function() {
                            $(this).addClass('highlighted');
                            $(this).find('i').removeClass('text-navy');
                        }).mouseleave(function() {
                            $(this).removeClass('highlighted');
                            $(this).find('i').addClass('text-navy');
                        });
                    });

                    $(document).click(function(event) {
                        var dom = $(event.target).closest('.chosen-container');
                        if (ele.hasClass('chosen-with-drop') && (dom.length == 0 || !dom.is(ele))) {
                            ele.removeClass('chosen-with-drop chosen-container-active');
                            if (scope.operation) {
                                ngModel.$setViewValue(scope.selectItem);
                                scope.confirm();
                                scope.operation=false;
                            };
                        }
                    });
                }
            }
        }
    ]).directive('singleSelect', [
        '$timeout',
        function($timeout) {
            return {
                restrict: 'AE',
                templateUrl: "app/components/template/single_select.html",
                replace: true,
                require: '?ngModel',
                scope: {
                    placehoderText: "@",
                    confirm: "&"
                },
                link: function(scope, ele, attrs, ngModel) {
                    scope.filter_value = "";
                    scope.selectDom = ele.siblings('select');
                    ele.find('.chosen-single').click(function() {
                        scope.menuItems = [];
                        ele.addClass('chosen-with-drop chosen-container-active');
                        scope.selectDom.find('option').each(function(index, dom) {
                            if ($(dom).text() != "") {
                                scope.menuItems.push($(dom).text());
                            }
                        });
                        scope.$apply();
                        ele.find('.chosen-results .active-result').hover(function() {
                            $(this).addClass('highlighted');
                            $(this).find('i').removeClass('text-navy');
                        }).mouseleave(function() {
                            $(this).removeClass('highlighted');
                            $(this).find('i').addClass('text-navy');
                        });
                    });
                    scope.isSelect = function(event, value) {
                        ele.removeClass('chosen-with-drop chosen-container-active');
                        scope.placehoderText = value;
                        scope.filter_value = "";
                        ngModel.$setViewValue(scope.placehoderText);
                        scope.confirm();
                    };
                    $(document).click(function(event) {
                        var dom = $(event.target).closest('.chosen-container');
                        if (ele.hasClass('chosen-with-drop') && (dom.length == 0 || !dom.is(ele))) {
                            ele.removeClass('chosen-with-drop chosen-container-active');
                            scope.filter_value = "";
                        };
                    });
                }
            }
        }
    ]).directive('chosenSelect', [
        '$timeout',
        function($timeout) {
            var CHOSEN_OPTION_WHITELIST, NG_OPTIONS_REGEXP, isEmpty, snakeCase;
            NG_OPTIONS_REGEXP = /^\s*(.*?)(?:\s+as\s+(.*?))?(?:\s+group\s+by\s+(.*))?\s+for\s+(?:([\$\w][\$\w]*)|(?:\(\s*([\$\w][\$\w]*)\s*,\s*([\$\w][\$\w]*)\s*\)))\s+in\s+(.*?)(?:\s+track\s+by\s+(.*?))?$/;
            CHOSEN_OPTION_WHITELIST = ['noResultsText', 'allowSingleDeselect', 'disableSearchThreshold', 'disableSearch', 'enableSplitWordSearch', 'inheritSelectClasses', 'maxSelectedOptions', 'placeholderTextMultiple', 'placeholderTextSingle', 'searchContains', 'singleBackstrokeDelete', 'displayDisabledOptions', 'displaySelectedOptions', 'width'];
            snakeCase = function(input) {
                return input.replace(/[A-Z]/g, function($1) {
                    return "_" + ($1.toLowerCase());
                });
            };
            isEmpty = function(value) {
                var key;
                if (angular.isArray(value)) {
                    return value.length === 0;
                } else if (angular.isObject(value)) {
                    for (key in value) {
                        if (value.hasOwnProperty(key)) {
                            return false;
                        }
                    }
                }
                return true;
            };
            return {
                restrict: 'A',
                require: '?ngModel',
                priority: 1,
                link: function(scope, element, attr, ngModel) {
                    var __indexOf = [].indexOf || function(item) {
                        for (var i = 0, l = this.length; i < l; i++) {
                            if (i in this && this[i] === item) return i;
                        }
                        return -1;
                    };
                    var chosen, defaultText, disableWithMessage, empty, initOrUpdate, match, options, origRender, removeEmptyMessage, startLoading, stopLoading, valuesExpr, viewWatch;
                    element.addClass('localytics-chosen');
                    options = scope.$eval(attr.chosen) || {};
                    angular.forEach(attr, function(value, key) {
                        if (__indexOf.call(CHOSEN_OPTION_WHITELIST, key) >= 0) {
                            return options[snakeCase(key)] = scope.$eval(value);
                        }
                    });
                    options.width = "100%";
                    startLoading = function() {
                        return element.addClass('loading').attr('disabled', true).trigger('chosen:updated');
                    };
                    stopLoading = function() {
                        return element.removeClass('loading').attr('disabled', false).trigger('chosen:updated');
                    };
                    chosen = null;
                    defaultText = null;
                    empty = false;
                    initOrUpdate = function() {
                        if (chosen) {
                            return element.trigger('chosen:updated');
                        } else {
                            chosen = element.chosen(options).data('chosen');
                            return defaultText = chosen.default_text;
                        }
                    };
                    removeEmptyMessage = function() {
                        empty = false;
                        return element.attr('data-placeholder', defaultText);
                    };
                    disableWithMessage = function() {
                        empty = true;
                        return element.attr('data-placeholder', chosen.results_none_found).attr('disabled', true).trigger('chosen:updated');
                    };
                    if (ngModel) {
                        origRender = ngModel.$render;
                        ngModel.$render = function() {
                            origRender();
                            return initOrUpdate();
                        };
                        if (attr.multiple) {
                            viewWatch = function() {
                                return ngModel.$viewValue;
                            };
                            scope.$watch(viewWatch, ngModel.$render, true);
                        }
                    } else {
                        initOrUpdate();
                    }
                    attr.$observe('disabled', function() {
                        return element.trigger('chosen:updated');
                    });
                    if (attr.ngOptions && ngModel) {
                        match = attr.ngOptions.match(NG_OPTIONS_REGEXP);
                        valuesExpr = match[7];
                        scope.$watchCollection(valuesExpr, function(newVal, oldVal) {
                            var timer;
                            return timer = $timeout(function() {
                                if (angular.isUndefined(newVal)) {
                                    return startLoading();
                                } else {
                                    if (empty) {
                                        removeEmptyMessage();
                                    }
                                    stopLoading();
                                    if (isEmpty(newVal)) {
                                        return disableWithMessage();
                                    }
                                }
                            });
                        });
                        return scope.$on('$destroy', function(event) {
                            if (typeof timer !== "undefined" && timer !== null) {
                                return $timeout.cancel(timer);
                            }
                        });
                    }
                }
            };
        }
    ]).directive('datepicker', function() {
        return {
            restrict: 'AE',
            link: function(scope, ele, attrs) {
                ele.datepicker({
                    // endDate: "new Date()",
                    todayBtn: "linked",
                    todayHighlight: true,
                    format: "yyyy/mm/dd",
                    autoclose: true
                });
            }
        };
    }).directive("sparklineChart", ["sparklineConfig", function(sparklineConfig) {
        return {
            restrict: 'A',
            scope: {
                sparkData: '=',
                sparkOptions: '@',
            },
            link: function(scope, element, attrs) {
                scope.$watch("sparkData", function() {
                    render();
                });
                var render = function() {
                    $(element).sparkline(scope.sparkData, sparklineConfig[scope.sparkOptions]);
                };
            }
        }
    }]).directive('rangeDate', [function() {
        return {
            restrict: 'A',
            link: function(scope, ele, attrs) {
                ele.daterangepicker({
                    "locale": {
                        "format": 'YYYY/MM/DD',
                        "separator": ' ~ '
                    },
                    "opens": "left",
                    "maxDate": moment().subtract(1, 'days'),
                    // "showCustomRangeLabel": false,
                    "autoApply": true,
                    "ranges": {
                        "Last Day": [
                            moment().subtract(1, 'days'),
                            moment().subtract(1, 'days')
                        ],
                        "Last 7 Days": [
                            moment().subtract(7, 'days'),
                            moment().subtract(1, 'days')
                        ],
                        "Last 30 Days": [
                            moment().subtract(30, 'days'),
                            moment().subtract(1, 'days')
                        ]
                    },
                    "startDate": moment().subtract(30, 'days'),
                    "endDate": moment().subtract(1, 'days')
                });
                ele.on('apply.daterangepicker', function(ev, picker) {
                    $(this).val(picker.startDate.format('YYYY/MM/DD') + '-' + picker.endDate.format('YYYY/MM/DD'));
                    scope[ele.attr('data-start')] = picker.startDate.format('YYYY/MM/DD');
                    scope[ele.attr('data-end')] = picker.endDate.format('YYYY/MM/DD');
                    scope.setTime(picker.startDate.format('YYYY/MM/DD'), picker.endDate.format('YYYY/MM/DD'));
                });
            }
        };
    }]).directive("spinnerThreeBounce", function() {
        return {
            restrict: 'E',
            replace: true,
            template: '<div class="sk-spinner sk-spinner-three-bounce"><div class="sk-bounce1"></div><div class="sk-bounce2"></div><div class="sk-bounce3"></div></div>'
        }
    }).directive("nullData", function() {
        return {
            restrict: 'E',
            replace: true,
            template: '<div class="null_data text-center"><h3 class="margin-top margin-bottom-lg text-warning"><i class="fa fa-meh-o" aria-hidden="true"></i>  {{errorMsg}}</h3></div>'
        }
    });