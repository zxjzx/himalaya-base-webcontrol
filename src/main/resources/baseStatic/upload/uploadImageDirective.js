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
                    imgSize:'='//图片尺寸
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

                    //上传到后台的操作
                    $scope.getPicInfo = function(dataList){
                        var image = new FormData();
                        //dataList需要上传到后台的数据
                        dataList.forEach(function (item) {
                            image.append('files',item.image);
                        });

                        // image.append('files',fileBlob,'image.png')

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
                     * @param item
                     */
                    var fileBlob;
                    $scope.editImg = function (item) {
                        var index = this.$index;
                        $modal.open({
                            templateUrl: '../baseStatic/upload/editImageModal.html',
                            controller: editImageModalController,
                            size: 'lg',
                            resolve: {
                                requestResults: function () {
                                    return {
                                        item:item,
                                        imgSize:$scope.imgSize//图片尺寸
                                    };
                                }
                            }
                        }).result.then(function (resultImg) {
                            if(resultImg){
                                fileBlob = dataURLtoBlob(resultImg);
                                if(fileBlob){
                                    $scope.canvasList[index].image = fileBlob;
                                    $scope.canvasList[index].resultImg = resultImg;
                                }

                            }


                        })
                    };

                    // base64编码转为file
                    function dataURLtoBlob(dataurl) {
                        var arr = dataurl.split(','), mime = arr[0].match(/:(.*?);/)[1],
                            bstr = atob(arr[1]), n = bstr.length, u8arr = new Uint8Array(n);
                        while(n--){
                            u8arr[n] = bstr.charCodeAt(n);
                        }
                        return new Blob([u8arr], {type:mime});
                    }

                    function editImageModalController(requestResults,$scope,$modalInstance) {

                        $scope.imgInfo = requestResults.item;
                        $scope.imgSize = requestResults.imgSize;
                        $scope.ok = function() {
                            //返回经过处理的图片
                            $modalInstance.close($scope.resultImg);
                        };
                        // 取消按钮
                        $scope.cancel = function() {
                            // 跳转到列表页面
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
        //预览上传的图片
        .directive('ngShowCanvas',[function(){
            return {
                restrict: 'AE',
                scope:{
                    triggerFun:'&',//不满足格式要求的图片触发函数
                    fileInfo:'='
                },
                template: '<canvas/>',
                link: function(scope, element, attributes) {
                    //图片要求尺寸
                    var imgWidth = 400;
                    var imgHeight = 300;

                    var params = scope.fileInfo;

                    if(!params){
                        return;
                    }
                    params.width = 400;

                    var canvas = element.find('canvas');

                    var reader = new FileReader();
                    reader.onload = onLoadFile;
                    reader.readAsDataURL(params);
                    function onLoadFile(event) {
                        var img = new Image();
                        img.onload = onLoadImage;
                        img.src = event.target.result;
                    }
                    function onLoadImage() {
                        //this.width,this.height 图片的原始尺寸-宽度和高度
                        if((imgWidth && (imgWidth != this.width)) || (imgHeight && imgHeight != this.height)) {
                            console.log("您上传的图片尺寸为"+this.width+"X"+this.height+";此处图片格式要求为"+imgWidth+'X'+imgHeight);
                            scope.triggerFun();
                            return;
                        }
                        var width = params.width || this.width / this.height * params.height;
                        var height = params.height || this.height / this.width * params.width;

                        var scale = this.width / this.height;
                        if(width>800 || height>500){
                            if(height*scale>width){
                                height = 500;
                                width = 500*scale;
                            }else{
                                width = 800;
                                height = 800/scale;
                            }
                        }
                        canvas.attr({ width: width, height: height });
                        canvas[0].getContext('2d').clearRect(this, 0, 0, width, height);
                        canvas[0].getContext('2d').drawImage(this, 0, 0, width, height);
                    }
                },

            }
        }])

        //在弹窗中编辑图片
        .directive('editImgDirect',[function () {
            return {
                restrict:'AE',
                scope:{
                    imgInfo:'=',//点击上传时页面传递过来的原始图片信息
                    imgSize:'=',//目标尺寸，即阴影部分的宽高
                    resultImg:'='//返回的已处理（裁剪）图片
                },
                templateUrl:'../baseStatic/upload/html/editDiv.html',
                controller:['$scope',function ($scope) {
                }],
                link : function (scope,element,attribute,ctrl) {

                    //新建canvas
                    var newCanvas =  document.createElement("canvas");
                    angular.element("#mydiv").append(angular.element(newCanvas));

                    var zr = zrender.init(newCanvas,{width:800,height:500});
                    var img = new Image();
                    var reader = new FileReader();
                    reader.onload = function (event) {
                        img.onload = onLoadImage;
                        img.src = event.target.result;
                    };
                    reader.readAsDataURL(scope.imgInfo);


                    var imageInfo;//原图片信息
                    var reduceScale;//缩小倍数-为了防止过大的图片超出页面范围，因此缩小预览

                    var orinImgWidth,orinImgHeight,orinImgScale;//原始图片的宽度和高度和比例
                    var preImgWidth,preImgHeight;//预览原始的宽度
                    var changeWidth,changeHeight;//变化中的宽度，高度


                    function onLoadImage() {
                        //原始图片的大小
                        var aimW = 800;
                        var aimH = 500;
                        var aimScale = aimW/aimH;

                        var width = orinImgWidth = this.width;//原始图片的大小
                        var height = orinImgHeight =this.height;//原始图片的大小

                        var scale = orinImgScale = this.width / this.height;//比例
                        if(width>aimW && height<aimH){
                            width = aimW;
                            height = width/scale;
                        }
                        if(width < aimW && height>aimH){
                            height = aimH;
                            width = height*scale;
                        }
                        if(width>aimW && height>aimH){
                            if(scale>aimScale){
                                width = aimW;
                                height = width/scale;
                            }else{
                                height = aimH;
                                width = height*scale;
                            }
                        }

                        reduceScale = this.width/width;//原始图片/预览图片 = 缩小倍数

                        preImgWidth = changeWidth = width;
                        preImgHeight = changeHeight = height;

                        imageInfo = this;
                        var backgroundImage = new zrender.Image({
                            position: [0,0],
                            scale: [1, 1],//缩放比例
                            style: {
                                x: 0,
                                y: 0,
                                image: this,
                                width: width,
                                height: height
                            },
                            draggable: false
                        });
                        zr.add(backgroundImage);
                        zr.add(circle);
                        getImgCut();//初次加载时默认执行的截取图片操作
                    }

                    // 遮罩层
                    var circle = new zrender.Rect({
                        shape: {
                            x: 0,
                            y: 0,
                            width: scope.imgSize[0],
                            height:scope.imgSize[1]
                        },
                        style: {
                            fill: '#ccc',
                            stroke: 'white',
                            lineWidth:'1',
                            opacity:0.5
                        },
                        draggable:true
                    });

                    var resultCanvas =  document.createElement("canvas");
                    resultCanvas.style.display = "none";
                    angular.element("#mydiv").append(angular.element(resultCanvas));

                    circle.on('mouseup',function () {
                        getImgCut();
                    });

                    //鼠标滑动-放大缩小图片
                    zr.on('mousewheel',function (e) {
                        //e.wheelDelta:鼠标向上滚动为1,下为-1
                        var num = 20;
                        //源图片的宽高比例
                        changeWidth -= num*e.wheelDelta;
                        changeHeight -= num/reduceScale*e.wheelDelta;

                        var changeImage = new zrender.Image({
                            position: [0,0],
                            scale: [1, 1],//缩放比例
                            style: {
                                x: 0,
                                y: 0,
                                image: imageInfo,
                                width: changeWidth,
                                height: changeHeight
                            },
                            draggable: false
                        });
                        var group = new zrender.Group();
                        group.add(changeImage);
                        group.add(circle);
                        zr.clear();
                        zr.add(group);
                        getImgCut();
                    });


                    //进行裁剪具体操作
                    function getImgCut() {
                        //为什么要*reduceScale，因为在页面预览的图片的size已经经过扩大或者缩小，不是原始图片的宽高，若要得到选中的区域，必须得到源图片的真实宽高才能得到正确的预览图
                        var changeScale = preImgWidth/changeWidth;//变化中变化的比例
                        var sx = circle.position[0]*reduceScale*changeScale;//开始剪切的 x 坐标位置
                        var sy = circle.position[1]*reduceScale*changeScale;
                        var sw = scope.imgSize[0]*reduceScale*changeScale;//被剪切图像的宽度
                        var sh = scope.imgSize[1]*reduceScale*changeScale;

                        var cw = scope.imgSize[0];//要使用的图像的宽度。（伸展或缩小图像）
                        var ch = scope.imgSize[1];

                        //新建canvas显示裁剪后的图片
                        var canvas = element.find('canvas');

                        canvas[1].width=cw;
                        canvas[1].height=ch;
                        canvas[1].getContext('2d').drawImage(imageInfo, sx, sy, sw, sh,0,0,cw,ch);

                        var image = new Image();
                        image.src = canvas[1].toDataURL("image/png");
                        image.onload = function () {
                            scope.resultImg = image.src;
                            scope.$apply();
                            // canvas[1].getContext('2d').clearRect(0,0,cw,ch);
                        };
                    }




                }
            }
        }])

})();



