/**
 * select2下拉框的单选or多选
 * 
 */
(function(){
	'use strict' ;
	
	//定义模块名
	angular.module("ejpSelect2Module" , [])
	
	//定义指令
	.directive("ejpSelect2",[function(){
		return {
			restrict:'A',
			link:function($scope,element,attr){
				if(attr.multiple){
					element.css('border','1px solid #ddd') ;
				}
				var idName = attr.id ;
				$('#'+idName).select2({
					placeholder : "请选择" ,
					allowClear : true ,
				});
			},
		}
	}])
}())