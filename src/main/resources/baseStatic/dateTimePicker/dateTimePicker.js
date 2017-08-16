

/**
* 使用示例
* 	<input class="form-control"  date-time-picker format="yyyy-mm-dd hh:ii" type="text" id="beginTime" ng-model="vo.beginDate" end-date="{{vo.endDate}}">
	<span class="input-group-addon">到</span>
	<input class="form-control"  date-time-picker format="yyyy-mm-dd hh:ii" type="text" id="endTime" show-level="1" ng-model="vo.endDate" begin-date="{{vo.beginDate}}">

datetimepicker详细用法可参考此链接：http://blog.csdn.net/hizzyzzh/article/details/51212867
*/

(function () {
	'use strict';
	var dateTimePicker = angular.module("dateTimePicker",[]);
	/**
	 * 选择时间-精确到时分秒
	 */
	dateTimePicker.directive("dateTimePicker",['$timeout',function($timeout){
		return{
			require:'?ngModel',
			restrict:'AE',
			scope:{
				ngModel:'=',
				beginDate:'@',
				endDate:'@',
                minView:'@',// 最精确的时间  0-4越小越精确  0-分钟; 1-小时; 2-天; 3-月 ; 4-年
                maxView : '@',//最高能展示的时间，默认为年
                startView:'@', //— 选完时间首先显示的视图 0:分钟；1：小时；2：天：3：月；4：年
                format:'@',//默认显示月视图，不显示时分秒
                todayBtn:'@',//今天按钮是否显示， 默认显示
                todayHighlight:'@',//当天显示是否高亮，默认显示
                showMeridian:'@',//是否显示上下午，默认不显示
                weekStart:'@',// 一周从哪一天开始显示,默认为7，表示从周日开始显示
                daysOfWeekDisabled:'@', //一周的周几不能选择[0,4,6]
                forceParse:'@',//强制解析,输入的可能不正规，但是它胡强制尽量解析成你规定的格式（format） 默认解析
                autoclose:'@'//选完时间后是否自动关闭 ,默认true，表示关闭
			},
			link:function(scope,element,attr,ngModel){
				$timeout(function(){
					element.datetimepicker({
						showMeridian:scope.showMeridian ? scope.showMeridian : false,
						todayBtn: scope.todayBtn ? scope.todayBtn : true,
						todayHighlight: scope.todayHighlight ? scope.todayHighlight : true,
						weekStart: scope.weekStart ? scope.weekStart : 0,
					    daysOfWeekDisabled: scope.daysOfWeekDisabled ? scope.daysOfWeekDisabled :[],
					    forceParse:scope.forceParse ? scope.forceParse : true,
					    autoclose:scope.autoclose ? scope.autoclose : true, //
				        minView : scope.minView ? scope.minView : 2,
				        maxView : scope.maxView ? scope.maxView : 4,
					    startView:scope.startView ?scope.startView : 2,
					    format: scope.format ? scope.format : 'yyyy-mm-dd',
					    		
			    		inline:true,
			    		language: 'cn',
			    		keyboardNavigation:true,//方向键改变日期
			    		/*onSelect: function(dateText) {
			    			console.log(dateText)
			    			var modelPath = $(this).attr('ng-model');
			    			putObject(modelPath, scope, dateText);
			    			scope.$apply();
			    		},*/
				    }).on('click',function(){//设置最大最小时间限制
				    	if(attr.hasOwnProperty('beginDate')){
				    		element.datetimepicker('setStartDate', attr.beginDate);
				    	}
				    	if(attr.hasOwnProperty('endDate')){
				    		element.datetimepicker('setEndDate', attr.endDate);
				    	}
				    });
				},0)
			}
		}
	}]);
}()) 