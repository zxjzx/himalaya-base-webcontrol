/*

<upload-muti-image get-img-data="getImgData" img-amount="2" bussiness-id="id" ></upload-muti-image>


    */
(function() {
    'use strict';

    angular.module('uploadImageModule', [])

        .directive('uploadMutiImage',[function(){
            return {
                restrict:'AE',
                scope:{
                    getImgData:'=',//返回给页面关于图片的数据信息
                    imgAmount:'@',//上传图片数量的限制
                    bussinessId:'=',//上传图片所属业务id
                    imgWidth:'@',
                    imgHeight:'@'
                },
                templateUrl:'../baseStatic/upload/preViewImage.html',
                controller:['$scope','getUserInfo','$http','$modal',function($scope,getUserInfo,$http,$modal){

                    // 图片长宽尺寸 $scope.imgWidth $scope.imgHeight
                    $scope.canvasList = [{}];
                    //添加
                    $scope.addCanvas = function(index){
                        $scope.canvasList.push({});
                        $scope.canvasList[index].showImage = "";
                    };
                //返回文件
                    $scope.getFile = function(file,index){
                        //覆盖第index个
                        $scope.canvasList[index] = {image:file};
                        var len = $scope.canvasList.length;

                        if($scope.imgAmount != len){//限制上传图片数量
                            //使最后一个显示添加图片
                            $scope.canvasList[len-1].showImage = true;
                        }
                        $scope.getImgData = $scope.canvasList;
                        $scope.$apply();
                    };

                    var userId = getUserInfo.userInfo().userId;
                    var bussinessId = $scope.bussinessId;

                    //上传操作
                    $scope.getPicInfo = function(dataList){
                        var image = new FormData();
                        //dataList需要上传到后台的数据
                        dataList.forEach(function (item) {
                            image.append('files',item.image);
                        });
                        $http({
                            method:"post",    　　// 可以是get,post,put, delete,head,jsonp;常使用的是get,post
                            url:'basewebcontrol/upload/common/uploadFiles/'+bussinessId+'/0/'+userId, 　　  //请求路径
                            headers: {'Content-Type':undefined},
                            // transformRequest: angular.identity,
                            data:image　　　　　　//通常在发送post请求时使用。
                        }).success(function(response){
                            //返回上传成功图片的信息
                            console.log(response.datas.dataList);
                        });
                    };

                    //双击编辑图片
                    /**
                     * TODO
                     * @param item
                     */
                    $scope.editImg = function (item) {
                        $modal.open({
                            templateUrl: '../baseStatic/upload/editImageModal.html',
                            controller: editImageModalController,
                            size: 'lg',
                            resolve: {
                                requestResults: function () {
                                    return item;
                                }
                            }
                        })
                    }

                    function editImageModalController(requestResults,$scope,$modalInstance) {

                        $scope.imgInfo = requestResults;
                        // console.log($scope.imgInfo);
                        $scope.ok = function() {
                            $modalInstance.close();
                        };
                        // 取消按钮
                        $scope.cancel = function() {
                            // 跳转到列表页面
                            //$location.path('/opUser_list.html');
                            $modalInstance.dismiss('cancel');
                        };
                    }


                }]
            }
        }])

    //点击上传操作
        .directive('fileModel', function ($parse) {/*$parse是AngularJS的内置directive*/
            return {
                restrict: 'A',/*限制该directive的声明方式 为Attribute*/
                link:function (scope, element, attrs) {
                    element.bind('change',function (event) {/*页面加载时执行*/
                        var imgFile = this.files[0];
                        scope.getFile(imgFile,scope.$index)
                    });
                }
            };
        })
        //显示
        .directive('ngShowCanvas',[function(){
            return {
                restrict: 'A',
                template: '<canvas/>',
                controller:['$scope',function($scope){
                }],
                link: function(scope, element, attributes) {
                    //图片要求尺寸
                    var imgWidth = scope.imgWidth;
                    var imgHeight = scope.imgHeight;

                    var params = scope.$eval(attributes.ngShowCanvas);
                    if(!params.file){
                        return;
                    }
                    var canvas = element.find('canvas');
                    var reader = new FileReader();
                    reader.onload = onLoadFile;
                    reader.readAsDataURL(params.file);
                    function onLoadFile(event) {
                        var img = new Image();
                        img.onload = onLoadImage;
                        img.src = event.target.result;
                    }
                    function onLoadImage() {
                        //this.width,this.height 图片的原始尺寸-宽度和高度
                        if((imgWidth && (imgWidth != this.width)) || (imgHeight && imgHeight != this.height)) {
                            console.log("您上传的图片尺寸为"+this.width+"X"+this.height+";此处图片格式要求为"+imgWidth+'X'+imgHeight);
                            scope.unsatisfySize = true;
                        }
                        var width = params.width || this.width / this.height * params.height;
                        var height = params.height || this.height / this.width * params.width;

                        var scale = this.width / this.height;
                        if(width>800 || height>500){
                            if(height*scale>width){
                                height = 500,
                                width = 500*scale;
                            }else{
                                width = 800;
                                height = 800/scale;
                            }
                        }
                        canvas.attr({ width: width, height: height });
                        canvas[0].getContext('2d').drawImage(this, 0, 0, width, height);
                    }
                },

            }
        }])

})();



