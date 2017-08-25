/*时间选择*/

/**
* 使用示例
* 时间范围：<input type="text" id="beginTime" laydate-select  ng-model="vo.rangeDate" show-range="show">
* 单个时间<input type="text" id="single" laydate-select time-type="datetime" ng-model="vo.single">   
* js对时间范围进行控制：
* 	if($scope.vo.rangeDate){
		$scope.vo.beginDate = $scope.vo.rangeDate.slice(0,10);
		$scope.vo.endDate = $scope.vo.rangeDate.slice(13,23);
	}                           
*/

(function () {
	'use strict';
	var layDateDirective = angular.module("layDateModule",[]);
	
	layDateDirective.directive("laydateSelect",['$timeout',function($timeout){
		return{
			require:'?ngModel',
			restrict:'AE',
			scope:{
				ngModel:'=',
				showRange:'@',
				timeType:'@'
			},
			link:function(scope,element,attr,ngModel){
				
				var _date = null,rangeConfig={},singleConfig={};
				$timeout(function(){
					//有范围的选择
					var rangeConfig = ({
						elem: '#' + attr.id, //指定元素
						range:true,//显示时间范围，用于一个输入框
						theme: '#3598DC',//主题颜色
						mark:'true',
						type: attr.timeType?attr.timeType:'datetime',
						done: function(value,date) {//选择好日期的回调
							ngModel.$setViewValue(value);//将得到的日期返回给页面显示
						},
					});
					var singleConfig = ({
						elem: '#' + attr.id, //指定元素
						theme: '#3598DC',//主题颜色
						mark:'true',
						type: attr.timeType?attr.timeType:'datetime',
						done: function(value,date) {//选择好日期的回调
							ngModel.$setViewValue(value);//将得到的日期返回给页面显示
						},
					})
					if(attr.showRange){
						var _date = laydate.render(rangeConfig);
					}else{
						var _date = laydate.render(singleConfig);
					}
					
				},0)
			}
		}
	}]);
}()) 