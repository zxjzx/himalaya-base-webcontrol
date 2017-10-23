/**
 *  行政地址选择指令
 *  例 : <administrative-address selected-data="selectedData" level-number="2"></administrative-address>
 */
(function(){
	'use strict' ;
	
	angular.module("administrativeAddressModule" ,[])
	
	.directive("administrativeAddress",[function($http, $q, $compile){
	return {
		restrict : 'EA',
		scope : {
			fullName : '=' ,
			selectedData : '=',
			levelNumber : '@',
			selectedAddressFun : '=' //选择具体城市的触发函数
		},
		templateUrl:'../baseStatic/administrativeAddress/administrativeAddress.html' ,
		controller:function($scope,$element,$http,CityRegionService){
			
			//初始化入参
			$scope.vo = {} ;
			//初始化返回参数
			$scope.selectedData = {} ;
			
			if($scope.fullName){
				$scope.vo.address = $scope.fullName ; 
			}
			
			//收集的选中的城市的名称的集合
            var selectedList = [] ;
            //收集选中的城市数据对象集合
            var selectedObjList  = [] ;
            
          /**
           * 根据$scope.leveleNumber的值判断显示省份，城市，区县，街道的显示
           * $scope.leveleNumber : 1(显示省份) ,2(显示省份，城市),3(显示省份，城市，区县),4(显示省份,城市,区县,街道)
           */
            $scope.levelNumber = $scope.levelNumber ? $scope.levelNumber : 4 ; //默认为四级联动
            if($scope.levelNumber == "1"){
            	$scope.cityLevelNameList = [
                    {'levelNum' : '0' ,'name' : '省份','classCss' :'citySel', 'dataList' : []}, 
                 ]
            }else if($scope.levelNumber == "2"){
            	$scope.cityLevelNameList = [
	                {'levelNum' : '0' ,'name' : '省份','classCss' :'citySel', 'dataList' : []}, 
	                {'levelNum' : '1' ,'name' : '城市'},
	             ]
            }else if($scope.levelNumber == "3"){
            	$scope.cityLevelNameList = [
	                {'levelNum' : '0' ,'name' : '省份','classCss' :'citySel', 'dataList' : []}, 
	                {'levelNum' : '1' ,'name' : '城市'},
	                {'levelNum' : '2' ,'name' : '区县'},
	             ]
            }else if($scope.levelNumber == "4"){
            	$scope.cityLevelNameList = [
	                {'levelNum' : '0' ,'name' : '省份','classCss' :'citySel', 'dataList' : []}, 
	                {'levelNum' : '1' ,'name' : '城市'},
	                {'levelNum' : '2' ,'name' : '区县'},
	                {'levelNum' : '3' ,'name' : '街道'},
	             ]
            }
            
            //默认不显示
            $scope.isOpenModel = false ;
            //点击打开城市选择框
            $scope.openAddressModel = function(){
            	$scope.isOpenModel = true ;
            	selectedList = [] ;
            	angular.forEach($scope.cityLevelNameList,function(levelItem){
            		levelItem.classCss = ""  ;
            		$scope.cityLevelNameList[0].classCss = "citySel" ;
            	})
            }
            
            //关闭选择框
            $scope.close = function(){
            	$scope.isOpenModel = false ;
            }
            
            //点击省，市，区，街道。切换样式,数据
            $scope.clickedCityLevel = function(item){
            	var levelNum = item.levelNum ;
            	if(levelNum != 0){
            		$scope.cityLevelNameList[levelNum].dataList = [] ;
            	}else if(levelNum == 0){
            		$scope.vo.address = "" ;
            		selectedList = [] ;
            	}
            	angular.forEach($scope.cityLevelNameList,function(levelItem){
            		levelItem.classCss = ""  ;
            		if(levelItem.levelNum == item.levelNum){
            			levelItem.classCss = "citySel" ;
            		}
            	})
            }
            
            /**
             * 点击具体的省市县街道时触发函数
             * code : 根据省，市，区的code获取相应的数据
             * levelNum ： 判断当前是处于什么tab页(省:0,市：1，区：2，街道：3)
             */
            var getDataListByCode = function(code,levelNum){
	        	 CityRegionService.findDirectChildrenByParentCode(code).then(function(data){
	        		 $scope.cityLevelNameList[levelNum].dataList = data.list;
	             });
            }
            getDataListByCode(0,0);//初始化省
            
            
            //选择具体的省市县街道触发函数
            $scope.clickedA = function(levelItem,dataItem){
            	selectedObjList.push(dataItem);
            	selectedList.push(dataItem.name);
            	$scope.vo.address = selectedList.join(" / ");
            	var levelNum = Number(levelItem.levelNum) ;
            	var nextLevelNum = Number(levelItem.levelNum) + 1;
            	if(nextLevelNum < $scope.cityLevelNameList.length){
            		$scope.cityLevelNameList[levelNum].classCss = "" ;
                	$scope.cityLevelNameList[nextLevelNum].classCss = "citySel" ;
                	getDataListByCode(dataItem.code,nextLevelNum);
            	}else { //选择街道之后关闭弹框
            		$scope.isOpenModel = false ;
            		$scope.cityLevelNameList[levelNum].classCss = "" ;
                	$scope.cityLevelNameList[0].classCss = "citySel" ;
            		getDataListByCode(0,0);//初始化省
            	}
            	$scope.selectedData.selectedObjList = selectedObjList ;
            	$scope.selectedData.fullName = $scope.vo.address ;
            	return $scope.selectedData ;
            }
		}
	}
}])
}())
