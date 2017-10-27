

(function() {
	'use strict';

	angular.module('uploadImgModule', [])
	
	.directive('uploadImg', [ function() {
		return {
			restrict:'AE',
			scope:{
				uploaderName:'@',
				picList:'=',
				id:'='
			},
			templateUrl:'../baseStatic/uploadImg/uploadImgMuti.html',
			controller : ['$scope','getUserInfo','FileUploader','ejpAlert','$http',function($scope,getUserInfo,FileUploader,ejpAlert,$http){
				
				var uploader = $scope.uploader = new FileUploader({
					url: 'common/uploadFile/' + $scope.id + '/0/' + getUserInfo.userInfo().userId + '.action',
				});
				$scope.uploaderName = $scope.uploader;
				console.log($scope.picList);
				
				//上传预览成功
				uploader.onAfterAddingFile = function (fileItem) {
		            console.info('onAfterAddingFile', fileItem);
		        };
		        
		        //上传成功
				uploader.onSuccessItem = function (fileItem, response, status, headers) {
		            /*if (response.result == 'success') {
		                $scope.picList.push(response.data);
		            }*/
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
})();