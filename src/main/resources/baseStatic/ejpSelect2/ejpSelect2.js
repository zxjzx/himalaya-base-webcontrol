/**
 * select2下拉框的单选or多选
 * <select class="form-control" ng-model="vo.shopId" ejp-select2 id="dealer" multiple
		ng-options = "optionItem.id as optionItem.name for optionItem in allDealerList"></select>
 * 必填 ： ejp-select2 id=""(任意定义值) 
 * 选填 ：multiple(填写则表示多选，得到的数据为[id集合],不填，则默认单选)。 
 * 
 * 清空选中值:在调用指令的js中,在清空的函数中调用这句。$("#dealer").val("").trigger("change");
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
				var idCtrl = $('#'+ attr.id );
				idCtrl.select2({
					placeholder : "请选择" ,
					allowClear : true ,
				});
			},
		}
	}])
}())