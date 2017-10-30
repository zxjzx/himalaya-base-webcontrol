//uploadImgSingleDirective.js
(function (){
	'use strict';
	angular.module('uploadImgSingleModule',[])
	.directive('uploadImgSingle',[function(){
		return {
			restrict:'AE',
			scope:{
				uploaderName:'=',
			},
			templateUrl:'../baseStatic/uploadImg/uploadImgSingle.html',
			controller : ['$scope','getUserInfo','FileUploader','ejpAlert','$http','picFilter','fileReader',
			              function($scope,getUserInfo,FileUploader,ejpAlert,$http,picFilter,fileReader){
				$scope.uploaderName = $scope.uploader = new FileUploader({
		            url: 'common/uploadFile/-1/2/' + getUserInfo.userInfo().userId + '.action',
		        });
				
				$scope.uploaderName.onAfterAddingFile = function (fileItem) {//预览成功
					console.log(fileItem)
		        };
		        
		        
		      //上传成功
		        /*$scope.uploaderName.onSuccessItem = function (fileItem, response, status, headers) {
		            if (response.result == 'success') {
		            	$scope.setList($scope.picList);
		            }
				};*/
			

			}]
			
		}
	}])
})();