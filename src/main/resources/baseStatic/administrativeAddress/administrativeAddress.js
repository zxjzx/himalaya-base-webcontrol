/**
 *  行政地址选择指令
 *  例 : <administrative-address selected-data="selectedData" level-number="4" selected-address-fun="" address-list=""></administrative-address>
 */
(function(){
	'use strict' ;
	
	angular.module("administrativeAddressModule" ,[])
	
	.directive("administrativeAddress",[function($http, $q, $compile){
	return {
		restrict : 'EA',
		scope : {
			fullName : '=' , //已选中的地址集合
			selectedData : '=', //选中之后的返回参数
			levelCodeber : '@', //显示levelCodeber级联动
			selectedAddressFun : '=' //选择具体城市的触发函数
		},
		templateUrl:'../baseStatic/administrativeAddress/administrativeAddress.html' ,
		controller:function($scope,$element,$http,CityRegionService){
			
			//初始化入参
			$scope.vo = {} ;
			
			//收集的选中的城市的名称的集合
            var selectedList = [] ;
            //收集选中的城市数据对象集合
            var selectedObjList  = [] ;
            
          /**
           * 根据$scope.leveleNumber的值判断显示省份，城市，区县，街道的显示
           * $scope.leveleNumber : 1(显示省份) ,2(显示省份，城市),3(显示省份，城市，区县),4(显示省份,城市,区县,街道)
           */
            $scope.levelCodeber = $scope.levelCodeber ? $scope.levelCodeber : 4 ; //默认为四级联动
            if($scope.levelCodeber == "1"){
            	$scope.cityLevelNameList = [
                    {'levelCode' : '0' ,'name' : '省份','classCss' :'citySel', 'dataList' : []}, 
                 ]
            }else if($scope.levelCodeber == "2"){
            	$scope.cityLevelNameList = [
	                {'levelCode' : '0' ,'name' : '省份','classCss' :'citySel', 'dataList' : []}, 
	                {'levelCode' : '1' ,'name' : '城市'},
	             ]
            }else if($scope.levelCodeber == "3"){
            	$scope.cityLevelNameList = [
	                {'levelCode' : '0' ,'name' : '省份','classCss' :'citySel', 'dataList' : []}, 
	                {'levelCode' : '1' ,'name' : '城市'},
	                {'levelCode' : '2' ,'name' : '区县'},
	             ]
            }else if($scope.levelCodeber == "4"){
            	$scope.cityLevelNameList = [
	                {'levelCode' : '0' ,'name' : '省份','classCss' :'citySel', 'dataList' : []}, 
	                {'levelCode' : '1' ,'name' : '城市'},
	                {'levelCode' : '2' ,'name' : '区县'},
	                {'levelCode' : '3' ,'name' : '街道'},
	             ]
            }
            
            //默认不显示
            $scope.isOpenModel = false ;
            //点击打开城市选择框
            $scope.openAddressModel = function(){
            	$scope.isOpenModel = true ;
            	angular.forEach($scope.cityLevelNameList,function(levelItem){
            		levelItem.classCss = ""  ;
            		$scope.cityLevelNameList[0].classCss = "citySel" ;
            	})
            }
            
            //关闭选择框
            $scope.close = function(){
            	$scope.isOpenModel = false ;
            }
            
            //点击省，市，区，街道tab页签，切换样式、数据。
            $scope.clickedCityLevel = function(item){
            	var levelCode = item.levelCode ;
            	angular.forEach($scope.cityLevelNameList,function(levelItem){
            		levelItem.classCss = ""  ;
            		if(levelItem.levelCode == item.levelCode){
            			levelItem.classCss = "citySel" ;
            		}
            	})
            }
            
            /**
             * 点击具体的省市县街道名称时触发函数
             * code : 根据省，市，区的code获取相应的数据
             * levelCode ： 判断当前是处于什么tab页(省:0,市：1，区：2，街道：3)
             */
            var getDataListByCode = function(code,levelCode){
	        	 CityRegionService.findDirectChildrenByParentCode(code).then(function(data){
	        		 $scope.cityLevelNameList[levelCode].dataList = data.list;
	             });
            }
            getDataListByCode(0,0);//初始化省
            
            var selectedDataObjList = [];
            var convertSelectedDate = function(selectedObjList){
            	selectedDataObjList['province'] = selectedObjList[0];
            	selectedDataObjList['city'] = selectedObjList[1];
            	selectedDataObjList['county'] = selectedObjList[2];
            	selectedDataObjList['street'] = selectedObjList[3];
            }
            
            //选择具体的省市县街道触发函数
            $scope.clickedA = function(levelItem,dataItem){
            	var levelCode = Number(levelItem.levelCode) ;
            	var nextlevelCode = Number(levelItem.levelCode) + 1;
            	var deleteNum;//删除几项
            	if(levelCode === 0){ //省
            		deleteNum = 4;
            	}else if(levelCode === 1){ //市
            		deleteNum = 3;
            	}else if(levelCode === 2){ //区
            		deleteNum = 2;
            	}else if(levelCode === 3){ //街道
            		deleteNum = 1;
            	}
            	selectedList.splice(levelCode,deleteNum);
            	selectedObjList.splice(levelCode,deleteNum);
            	selectedList.push(dataItem.name);
            	selectedObjList.push(dataItem);
            	$scope.vo.address = selectedList.join(" / ");
            	
            	//切换selectedCss样式
            	$scope.cityLevelNameList[levelCode].dataList.forEach(function(codeItem){
            		codeItem.selectedCss = "";
            	});
            	dataItem.selectedCss = "selectedCity";
            	
            	if(nextlevelCode < $scope.cityLevelNameList.length){
            		$scope.cityLevelNameList[levelCode].classCss = "" ;
                	$scope.cityLevelNameList[nextlevelCode].classCss = "citySel" ;
                	getDataListByCode(dataItem.code,nextlevelCode);
            	}else { //选择最后一级之后关闭弹框
            		$scope.isOpenModel = false ;
            		$scope.cityLevelNameList[levelCode].classCss = "" ;
                	$scope.cityLevelNameList[0].classCss = "citySel" ;
            	}
            	
            	convertSelectedDate(selectedObjList);
            	$scope.selectedData.selectedObjList =  selectedDataObjList;
            	$scope.selectedData.fullName = $scope.vo.address ;
            	return $scope.selectedData ;
            }
            
            /**
             * 当省 / 市 / 区 / 街道存在时初始化数据
             */
            var initAddressDataFun = function(code,levelCode){
            	CityRegionService.findDirectChildrenByParentCode(code).then(function(data){
            		if($scope.cityLevelNameList[levelCode]){
            			$scope.cityLevelNameList[levelCode].dataList = data.list;
      	        		$scope.cityLevelNameList[levelCode].dataList.forEach(function(dataItem){
      	        			if(dataItem.name == $scope.initAddressList[levelCode]){
      	        				dataItem.selectedCss = 'selectedCity' ;
      	        				selectedObjList.push(dataItem);
      	        				convertSelectedDate(selectedObjList) ;
      	        				$scope.selectedData.selectedObjList = selectedDataObjList ;
      	        				initAddressDataFun(dataItem.code,levelCode+1);
      	        			}
      	        		})
            		}
  	             });
            }
            //将传入的行政地址全称按照“ / ”分割成数组
            if($scope.fullName){
            	 $scope.initAddressList = $scope.fullName.split(" / ") ;
            }
            if($scope.initAddressList){
            	if($scope.initAddressList[0]){ //省
            		initAddressDataFun(0,0);
            		selectedList.push($scope.initAddressList[0]);
            	}
            	if($scope.initAddressList[1]){ //市
            		selectedList.push($scope.initAddressList[1]);
            	}
            	if($scope.initAddressList[2]){ //区
            		selectedList.push($scope.initAddressList[2]);
            	}
            	if($scope.initAddressList[3]){ //街道
            		selectedList.push($scope.initAddressList[3]);
            	}
            	$scope.vo.address = selectedList.join(' / ');
            }
		}
	}
}])
}())
