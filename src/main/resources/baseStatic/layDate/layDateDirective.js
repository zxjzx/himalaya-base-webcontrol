/*时间选择*/

/**
* 使用示例
* <input def-laydate type="text" id="id1" ng-model="startTime"/>
*/

(function () {
	'use strict';
	var layDateDirective = angular.module("layDateDirective",[]);
	/**
	 * 选择时间-精确到时分秒
	 */
	layDateDirective.directive("laydateSelect",['$timeout',function($timeout){
		return{
			require:'?ngModel',
			restrict:'AE',
			scope:{
				ngModel:'=',
				maxDate:'@',
                minDate:'@',
                showhms:'@'//是否显示时分秒
			},
			link:function(scope,element,attr,ngModel){
				var _date = null,_config={};
				$timeout(function(){ 
					// 初始化参数 
					if(scope.showhms){
						_config={
								elem: '#' + attr.id,
								istime: true,
								istoday:true,//是否显示今天
								festival: true,//是否开启节日
								format: attr.format != undefined && attr.format != '' ? attr.format : 'YYYY-MM-DD hh:mm:ss',
								max:attr.hasOwnProperty('maxDate')?attr.maxDate:'',
								min:attr.hasOwnProperty('minDate')?attr.minDate:'',
								start: laydate.now(0, 'YYYY-MM-DD hh:mm:ss'),    //开始日期的设置
								choose: function(data) {//选择好日期的回调
									scope.$apply(setViewValue);
								},
								clear:function(){//清除时间
									ngModel.$setViewValue(null);
								}
								
							}
					}else if(!scope.showhms){
						_config={
								elem: '#' + attr.id,
								istoday:true,//是否显示今天
								festival: true,//是否开启节日
								format: attr.format != undefined && attr.format != '' ? attr.format : 'YYYY-MM-DD',
								max:attr.hasOwnProperty('maxDate')?attr.maxDate:'',
								min:attr.hasOwnProperty('minDate')?attr.minDate:'',
								start: getNowFormatDate(),    //开始日期
								choose: function(data) {
									scope.$apply(setViewValue);
								},
								clear:function(){
									ngModel.$setViewValue(null);
								}
								
							}
					}
					
					// 初始化参数 
					laydate.skin('yahui');
					_date = laydate(_config);
					
					// 监听日期最大值
                    if(attr.hasOwnProperty('maxDate')){
                        attr.$observe('maxDate', function (val) {
                            _config.max = val;
                        })
                    }
                    // 监听日期最小值
                    if(attr.hasOwnProperty('minDate')){
                       attr.$observe('minDate', function (val) {
                            _config.min = val;
                        })
                    }
					
					//// 模型值同步到视图上
					ngModel.$render = function() {
						element.val(ngModel.$viewValue || '');
					};
					
					// 监听元素上的事件
					element.on('blur keyup change', function() {
						scope.$apply(setViewValue);
					});
					
					setViewValue();
					
					// 更新模型上的视图值
					function setViewValue() {
						var val = element.val();
						ngModel.$setViewValue(element.val());
					}
					
					//获取当前时间
					function getNowFormatDate() {
					    var date = new Date();
					    var seperator1 = "-";
					    var seperator2 = ":";
					    var month = date.getMonth() + 1;
					    var strDate = date.getDate();
					    if (month >= 1 && month <= 9) {
					        month = "0" + month;
					    }
					    if (strDate >= 0 && strDate <= 9) {
					        strDate = "0" + strDate;
					    }
					    var currentdate = date.getFullYear() + seperator1 + month + seperator1 + strDate
					            + " " + date.getHours() + seperator2 + date.getMinutes()
					            + seperator2 + date.getSeconds();
					    return currentdate;
					}
				},0)
			}
		}
	}]);
}()) 