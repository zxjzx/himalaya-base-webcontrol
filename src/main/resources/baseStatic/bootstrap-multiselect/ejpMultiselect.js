/**
 * bootstrap-multiselect指令
 * <div class="col-md-6">
			<div class="form-group">
				<label class="col-md-3 control-label">显示类型：</label>
				<div class="col-md-8">
					<select ng-model="vo.displayType" class="form-control"  ejp-multiselect multiple="multiple"
						id="multiselect" json-data="activePolymerizationTemplateList" ng-if="activePolymerizationTemplateList"
					>
						<option value="">请选择</option>
					</select>
				</div>
			</div>
		</div>
		多选加属性multiple="multiple",单选则不加。
 * 
 */
(function(){
	'use strict' ;
	
	angular.module("ejpMultiselectModule",[])
	
	/*指令*/
	.directive("ejpMultiselect",[function(){
		return {
			require:'?ngModel',
			restrict : 'AE' ,
			scope : {
				jsonData : '=' ,
			},
			link : function(scope,element,attr){
				//初始化下拉框数据
				if(scope.jsonData){
					var optionList = [] ;
					angular.forEach(scope.jsonData,function(item){
						//json转成option格式  
			            var obj = new Object();  
			            obj.label = item.name;  
			            obj.title = item.name;  
			            obj.value = item.id;  
			            optionList.push(obj);
			            //初始化multiselect参数
						element.multiselect({
							buttonWidth: '100%',
							inheritClass: true,//继承原来select的button的class  
							enableFiltering: true,
							includeSelectAllOption: true,//全选  
							selectAllText: '全选',//全选的checkbox名称  
							nonSelectedText: '请选择',//没有值的时候button显示值  
							numberDisplayed: 4,//当超过4个标签的时候显示n个被选中  
							templates: {  
						        button: '<button type="button" class="multiselect dropdown-toggle" data-toggle="dropdown" style="text-align:center;background-color: #ffffff;border: 1px solid #e5e5e5;"><span class="multiselect-selected-text"></span></button>',  
						        ul: '<ul class="multiselect-container dropdown-menu" style="max-height: 200px;overflow-x: hidden;overflow-y: auto;-webkit-tap-highlight-color: rgba(0,0,0,0);"></ul>',  
						        filter: '<li class="multiselect-item multiselect-filter"><div class="input-group"><span class="input-group-addon"><i class="glyphicon glyphicon-search"></i></span><input class="form-control multiselect-search" type="text"></div></li>',  
						        filterClearBtn: '<span class="input-group-btn"></span>',  
						        li: '<li><a tabindex="0"><label style="margin-left:20%;"></label></a></li>',  
						        divider: '<li class="multiselect-item divider"></li>',  
						        liGroup: '<li class="multiselect-item multiselect-group"><label></label></li>'  
						    }  ,
							onChange: function (option, checked) {//change事件改变   
								var selectValueStr = [];  
								element.each(function () {  
							        selectValueStr.push($(this).val());  
							    });  
							    return selectValueStr; 
					        }, 
						})
					})
					element.multiselect('dataprovider',optionList);
				}
			},
		}
	}])
}())