/*下拉框枚举*/
(function () {
	'use strict';
	var dropDownSelectModule = angular.module("dropDownSelectModule",[]);
	dropDownSelectModule.directive("dropDownSelect",[function(){
		return{
			restrict:'E',
			scope:{
				labelName:'@',
				labCol:'@',
				selCol:'@',
				isShow:'@',
				ngModel:'=',
				typeCode:'@'
			},
			templateUrl:'../baseStatic/dropDownSelect/dropDownSelect.html',
			controller:['$scope','$http',function($scope,$http){
				$scope.dropDownSelect=function(){
					 $http.get('basewebcontrol/dictionary/getDictionaryType/' + $scope.typeCode + '.action').success(function(response){
		                	if(response.result=='success'){
		                		$scope.dropDownSelectList=response.data.items;
		                	}
		                })
					
				}
				$scope.dropDownSelect();
			}]
				
			
		}
	}])
}()) 