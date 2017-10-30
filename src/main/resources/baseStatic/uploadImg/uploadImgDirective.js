

(function() {
	'use strict';

	angular.module('uploadImgModule', [])
	
	.directive('uploadImg', [ function() {
		return {
			restrict:'AE',
			scope:{
				uploaderName:'@',
				picList:'=',//已上传成功的用以显示的图片数组
				id:'=',
				queueLimit:'@',
				setDefault:'='//图片上传成功后执行的操作
				
			},
			templateUrl:'../baseStatic/uploadImg/uploadImgMuti.html',
			controller : ['$scope','getUserInfo','FileUploader','ejpAlert','$http','picFilter','fileReader',
			              function($scope,getUserInfo,FileUploader,ejpAlert,$http,picFilter,fileReader){
				
				var uploader = $scope.uploader = new FileUploader({
					url: 'common/uploadFile/' + $scope.id + '/0/' + getUserInfo.userInfo().userId + '.action',
					removeAfterUpload: 'true',
//					queueLimit:$scope.queueLimit?$scope.queueLimit:10,//最多同时上传的文件个数,如果不设置默认为1
					// 限制文件大小为100k
	    			filters : [ picFilter.sizeFilter ]
				});
				$scope.uploaderName = $scope.uploader;
			
				
				//上传预览成功
				uploader.onAfterAddingFile = function (fileItem) {
		            fileReader.readAsDataUrl(fileItem._file, $scope).then(function(result) {
	                    var img = new Image();
	                    img.onload=function(){
	                    	if (this.width>400 || this.height>400){//获取上传图片的宽高
	                    		console.log("上传图片的宽高建议为400*400！")
	                    	}
	                    };
	                    img.src = result;
	                }); 
		            
		        };
		        
		        //上传成功
				uploader.onSuccessItem = function (fileItem, response, status, headers) {
		            if (response.result == 'success') {
		                $scope.picList.push(response.data);
		                if($scope.picList.length === 1){//设置默认图片
		                	$scope.setDefault($scope.picList);
		                }
		            }
				};
				
				//删除图片
		        $scope.remove = function (item) {
		        	ejpAlert.confirm("确定删除该图片？").result.then(function(){
		                $http.get('common/deletePic/' + item.id + '.action').success(function (result) {
		                    if (result.result == 'success') {
		                        angular.forEach($scope.picList, function (data, index) {
		                            if (item.id && data.id == item.id) {
		                                $scope.picList.splice(index, 1);
		                            }
		                        });
		                        ejpAlert.show("删除成功");
		                    }
		                });
		        	},function(){
		        		//点击了取消按钮
		        	})
		        };
			}]
			
		}
	} ])
	//file upload 限制图片大小和格式
	.service("picFilter",['ejpAlert',function(ejpAlert){
		this.sizeFilter = {
				name:"imgSizeFilter",
				fn:function(item){
					// 图片大小为100k
					var IMAGE_SIZE = 100 * 1024;
					if(item.size > IMAGE_SIZE){
						ejpAlert.show('活动图片最大为100k');
						return false;
					}
					return item.size <= IMAGE_SIZE;
				}
		};
	}])
	.factory('fileReader', ["$q", "$log", function($q, $log){  
        var onLoad = function(reader, deferred, scope) {  
            return function () {  
                scope.$apply(function () {  
                    deferred.resolve(reader.result);  
                });  
            };  
        };  
  
        var onError = function (reader, deferred, scope) {  
            return function () {  
                scope.$apply(function () {  
                    deferred.reject(reader.result);  
                });  
            };  
        };  
  
        var getReader = function(deferred, scope) {  
            var reader = new FileReader();  
            reader.onload = onLoad(reader, deferred, scope);  
            reader.onerror = onError(reader, deferred, scope);  
            return reader;  
        };  
  
        var readAsDataURL = function (file, scope) {  
            var deferred = $q.defer();  
            var reader = getReader(deferred, scope);  
            reader.readAsDataURL(file);  
            return deferred.promise;  
        };  
  
        return {  
            readAsDataUrl: readAsDataURL  
        };  
    }])
})();



