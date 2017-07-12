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
				vo:'=vo',
				typeCode:'@'
			},
			templateUrl:'../static/dropDownSelect/dropDownSelect.html',
			controller:['$scope','$http',function($scope,$http){
				$scope.dropDownSelect=function(){
					 $http.post('components/common/findAllDicListByDicType/' + $scope.typeCode + '.action').success(function(data){
		                	if(data.result=='success'){
		                		$scope.dropDownSelectList=data.datas.dataList;
		                	}
		                })
					
				}
				$scope.dropDownSelect();
			}]
				
			
		}
	}])
}()) 