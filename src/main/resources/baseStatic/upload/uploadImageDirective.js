/**
 使用教程：
 1、在首页导入"uploadImageDirective.js"和"zrender.min.js"文件
 2、在app.js中注入"uploadImageModule"
 3、在页面按照如下使用指令

指令解释：
 <upload-muti-image limit-amount-img="1" bussiness-id="id" limit-img-size="[500,400]" identify-image="image2"
 response-img-id-list="responseImgIdList" response-fun="responseFun()"></upload-muti-image>

limit-amount-img：表示限制同时上传数量为2
bussiness-id：业务id，可不传
limit-img-size：图片尺寸
responseImgIdList：图片上传成功到后台后返回的图片id等相关信息
upload-during-preview：不传值则默认为true,表示是否在预览时，图片处理完成后立即上传,true:立即上传，false表示必须点击上传操作才能上传
identify-image:标识哪一张图片,便于同一个页面多次调用该指令时，用于区分图片id分别所属对象
*/
(function() {
    'use strict';
    angular.module('uploadImageModule', [])
        .directive('uploadMutiImage',[function(){
            return {
                restrict:'AE',
                scope:{
                    limitAmountImg:'@',//上传图片数量的限制
                    bussinessId:'=',//上传图片所属业务id
                    limitImgSize:'=',//图片尺寸限制
                    responseImgIdList:'=',
                    responseFun:'&',
                    identifyImage:'@',
                    uploadDuringPreview:'@',//是否在预览时，图片处理完成后立即上传,true:立即上传，false表示必须点击上传操作才能上传
                    existImageUrl:'=',//已经存在的单个图片url
                    existImageUrlList:'='//已经存在的图片url,List
                },
                templateUrl:'../baseStatic/upload/html/returnImageForView.html',
                controller:function($scope,getUserInfo,$http,$modal){


                    var identifyImage = $scope.identifyImage;

                    $scope.limitImgSize = $scope.limitImgSize?$scope.limitImgSize:[400,300];//设置图片默认尺寸
                    $scope.uploadDuringPreview = $scope.uploadDuringPreview?$scope.uploadDuringPreview:true;//默认立即上传
                    var userId = getUserInfo.userInfo().userId;//上传人id
                    var bussinessId = $scope.bussinessId?$scope.bussinessId:null;//业务id，可以不传

                    // 图片长宽尺寸 $scope.imgWidth $scope.imgHeight
                    $scope.canvasList = [{}];//上传图片临时存储数组

                    if($scope.existImageUrl){
                        $scope.canvasList[0].resultImg = $scope.existImageUrl;
                    }

                    //添加上传按钮
                    $scope.addCanvas = function(index){
                        $scope.canvasList.push({});
                        $scope.canvasList[index].showImage = "";
                    };

                    //点击打开图片-图片信息
                    $scope.getImageFile = function(file,index){
                        //覆盖第index个
                        $scope.canvasList[index] = {image:file};
                        var len = $scope.canvasList.length;

                        if($scope.limitAmountImg != len){//限制上传图片数量
                            //使最后一个显示添加图片
                            $scope.canvasList[len-1].showImage = true;
                        }
                        $scope.isCanUploadOprate = true;//是否显示上传按钮
                        $scope.$apply();
                    };

                    //满足要求的图片触发的函数1
                    $scope.uploadImageFun = function (index) {
                        $scope.canvasList[index].showSelectButton = true;
                        if($scope.uploadDuringPreview != "false"){
                            $scope.isCanUploadOprate = false;
                            $scope.uploadAllImageFun();//是否立即执行上传操作
                        }
                    };

                    // 删除操作
                    $scope.deleteImage = function (item,index) {
                        $scope.canvasList[index].showSelectButton = false;
                        if($scope.responseImgIdList[identifyImage]){//如果已经上传到后台，则可点击删除
                            var picId = $scope.responseImgIdList[identifyImage].id;
                            $http.post('basewebcontrol/upload/common/deletePic/'+picId).success(function (response) {
                                if(response.result === "success"){
                                    $scope.responseImgIdList[identifyImage] = "";
                                    $scope.canvasList[index].resultImg = "";
                                    $scope.canvasList[index].image = "";
                                }
                            })
                        }
                    };


                    //点击上传到后台的操作
                    $scope.uploadAllImageFun = function(){
                        var image = new FormData();
                        //dataList需要上传到后台的数据
                        $scope.canvasList.forEach(function (item) {
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
                            if(response.result === 'success'){
                                response.datas.dataList.forEach(function (t) {
                                    $scope.responseImgIdList[identifyImage] = t;
                                });
                                $scope.responseFun();//成功返回imgid后触发函数
                            }
                        });
                    };

                    //不满足要求的图片触发的函数2
                    /**
                     * @param item
                     */
                    var fileBlob;
                    $scope.editImg = function (item) {
                        $scope.isCanUploadOprate = false;//是否显示上传按钮
                        var index = this.$index;
                        $scope.canvasList[index].image = null;

                        $modal.open({
                            templateUrl: '../baseStatic/upload/html/editImageForOperateModal.html',
                            controller: editImageModalController,
                            size: 'lg',
                            resolve: {
                                requestResults: function () {
                                    return {
                                        item:item,
                                        limitImgSize:$scope.limitImgSize//图片尺寸
                                    };
                                }
                            }
                        }).result.then(function (resultImg) {
                            if(resultImg){
                                fileBlob = dataURLtoBlob(resultImg);
                                if(fileBlob){
                                    $scope.canvasList[index].image = fileBlob;
                                    $scope.canvasList[index].resultImg = resultImg;
                                    $scope.isCanUploadOprate = true;
                                    $scope.uploadImageFun(index);//立即上传操作
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

                    //editImageModal.html的controller
                    function editImageModalController(requestResults,$scope,$modalInstance) {
                        $scope.originImageInfo = requestResults.item;
                        $scope.limitImgSize = requestResults.limitImgSize;
                        $scope.handleImg = function() {
                            //返回经过处理的图片
                            $modalInstance.close($scope.resultImg);
                        };
                        // 取消按钮
                        $scope.cancel = function() {
                            // 跳转到列表页面
                            $modalInstance.dismiss('cancel');
                        };

                        $scope.uploadOriginImg = function () {
                            // 上传原图
                            var reader = new FileReader();
                            reader.onload = function (event) {
                                $modalInstance.close(event.target.result);
                            };
                            reader.readAsDataURL($scope.originImageInfo);
                        }
                    }

                }
            }
        }])


    //点击上传操作
        .directive('fileChangeModel', function ($parse) {/*$parse是AngularJS的内置directive*/
            return {
                restrict: 'A',/*限制该directive的声明方式 为Attribute*/
                link:function (scope, element) {
                    element.bind('change',function (event) {/*页面加载时执行*/
                        var imgFile = this.files[0];
                        var index = scope.$index ? scope.$index : 0;
                        scope.getImageFile(imgFile,index);
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
                    uploadImageFun:'&',//上传到后台触发函数
                    imageFileInfo:'='//源图片
                },
                template: '<canvas/>',
                link: function(scope, element) {
                    //图片要求尺寸
                    var imgWidth = 400;
                    var imgHeight = 300;

                    var params = scope.imageFileInfo;

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
                        var blob = dataURLtoBlob(this.src);
                        //this.width,this.height 图片的原始尺寸-宽度和高度
                        if((imgWidth && (imgWidth != this.width)) || (imgHeight && imgHeight != this.height)) {
                            //console.log("您上传的图片size为"+parseInt(blob.size/1024)+"k;尺寸为"+this.width+"X"+this.height+";此处图片格式要求为"+imgWidth+'X'+imgHeight);
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
                        scope.uploadImageFun();

                    }

                    function dataURLtoBlob(dataurl) {
                        var arr = dataurl.split(','), mime = arr[0].match(/:(.*?);/)[1],
                            bstr = atob(arr[1]), n = bstr.length, u8arr = new Uint8Array(n);
                        while(n--){
                            u8arr[n] = bstr.charCodeAt(n);
                        }
                        return new Blob([u8arr], {type:mime});
                    }
                }

            }
        }])

        //在弹窗中编辑图片
        .directive('editImgDirect',[function () {
            return {
                restrict:'AE',
                scope:{
                    originImageInfo:'=',//点击上传时页面传递过来的原始图片信息
                    limitImgSize:'=',//目标尺寸，即阴影部分的宽高
                    resultImg:'='//返回的已处理（裁剪）图片
                },
                templateUrl:'../baseStatic/upload/html/editImageForViewDiv.html',
                /*controller:['$scope',function ($scope) {

                }],*/
                link : function (scope,element,attribute,ctrl) {
                    //新建canvas-用于预览实时操作的图片
                    var newCanvas =  document.createElement("canvas");
                    angular.element("#mydiv").append(angular.element(newCanvas));

                    //初始化zrender
                    var zr = zrender.init(newCanvas,{width:800,height:500});

                    // 处理结果-canvas
                    var resultCanvas =  document.createElement("canvas");
                    resultCanvas.style.display = "none";
                    angular.element("#mydiv").append(angular.element(resultCanvas));


                    // 初次打开弹窗时预览图片
                    var initImg = new Image();//源图片信息
                    var reader = new FileReader();
                    reader.onload = function (event) {
                        initImg.onload = onLoadImage;
                        initImg.src = event.target.result;
                    };
                    reader.readAsDataURL(scope.originImageInfo);


                    var reduceScale;//缩小倍数-为了防止过大的图片超出页面范围，因此缩小预览

                    var orinImgWidth,orinImgHeight,orinImgScale;//原始图片的宽度和高度和比例
                    var preImgWidth,preImgHeight;//预览大图的宽度
                    var changeWidth,changeHeight;//图片放大缩小变化中的宽度，高度

                    var temporarySaveImageList = {};

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
                            draggable: true
                        });
                        zr.add(backgroundImage);
                        temporarySaveImageList.backgroundImage = backgroundImage;
                        zr.add(circle);
                        getImgCut();//初次加载时默认执行的截取图片操作
                    }

                    // 遮罩层
                    var circle = new zrender.Rect({
                        shape: {
                            x: 0,
                            y: 0,
                            width: scope.limitImgSize[0],
                            height:scope.limitImgSize[1]
                        },
                        style: {
                            fill: '#ccc',
                            stroke: 'white',
                            lineWidth:'1',
                            opacity:0.5
                        },
                        draggable:true
                    });

                    // 遮罩层鼠标移动抬起事件
                    circle.on('mouseup',function () {
                        getImgCut();
                    });


                    //图层移动
                    var selectTextNum;//表示第几个文字层
                    var smallIconSelectNum;//表示第几张小图片
                    var poX=0,poY=0;//图片的坐标/位置
                    zr.on('mouseup',function (event) {

                        poX = temporarySaveImageList.backgroundImage.position[0];
                        poY = temporarySaveImageList.backgroundImage.position[1];
                        if(!changeImage){
                            getImgCut();
                            return;
                        }
                        dragNum++;
                        if(dragNum == 1){//第一次拖拽的时候的位置
                            poX=changeImage.position[0];
                            poY=changeImage.position[1];
                            if(temporarySaveImageList.newImg){
                                poX=temporarySaveImageList.newImg.position[0]+temporarySaveImageList.newImg.style.x+changeImage.position[0];
                                poY=temporarySaveImageList.newImg.position[1]+temporarySaveImageList.newImg.style.y+changeImage.position[1];
                            }
                        }else{
                            poX=temporarySaveImageList.newImg.position[0]+temporarySaveImageList.newImg.style.x;
                            poY=temporarySaveImageList.newImg.position[1]+temporarySaveImageList.newImg.style.y;
                        }

                        //缩放后拖拽的图片
                        var newImg = new zrender.Image({
                            position: [0,0],
                            scale: [1, 1],//缩放比例
                            style: {
                                x: poX,
                                y: poY,
                                image: initImg,
                                width: changeImage.style.width,
                                height: changeImage.style.height
                            },
                            draggable: true
                        });
                        var group = new zrender.Group();
                        group.add(newImg);
                        temporarySaveImageList.newImg = newImg;
                        // temporarySaveImageList.changeImage = changeImage;
                        group.add(circle);
                        //点击添加文字按钮后才添加文字
                        textList.forEach(function (item) {
                            group.add(item);
                        });

                        smallIconList.forEach(function (item) {
                            group.add(item);
                        });
                        zr.clear();
                        zr.add(group);
                        getImgCut();

                    });

                    //鼠标滑动-放大缩小图片
                    var changeImage;
                    var dragNum = 0;////缩放图片后的第几次移动
                    zr.on('mousewheel',function (e) {
                        //e.wheelDelta:鼠标向上滚动为1,下为-1
                        var num = 20;
                        //扩大缩小时图片的宽高
                        changeWidth -= num*e.wheelDelta;
                        changeHeight -= num/orinImgScale*e.wheelDelta;

                        if(temporarySaveImageList.newImg){
                            changeImage = new zrender.Image({
                                position: [0,0],
                                scale: [1, 1],//缩放比例
                                style: {
                                    x: temporarySaveImageList.newImg.style.x?temporarySaveImageList.newImg.style.x:0,
                                    y: temporarySaveImageList.newImg.style.y?temporarySaveImageList.newImg.style.y:0,
                                    image: initImg,
                                    width: changeWidth,
                                    height: changeHeight
                                },
                                draggable: true
                            });
                        }else{
                            changeImage = new zrender.Image({
                                position: [poX,poY],
                                scale: [1, 1],//缩放比例
                                style: {
                                    x: 0,
                                    y: 0,
                                    image: initImg,
                                    width: changeWidth,
                                    height: changeHeight
                                },
                                draggable: true
                            });
                        }

                    var group = new zrender.Group();
                        group.add(changeImage);
                        group.add(circle);
                        textList.forEach(function (item) {
                            group.add(item);
                        });
                        smallIconList.forEach(function (item) {
                            group.add(item);
                        });
                        zr.clear();
                        zr.add(group);
                        getImgCut();
                        dragNum = 0;
                    });



//begin-------------文字处理
                    var addOperateFlag = false;//判断是否已经能添加文字
                    var textList = [];//文字列表，用于存放多个文字

                    scope.showAddText = function () {
                        scope.showAddTextFlag = !scope.showAddTextFlag;
                    };

                    scope.textSizeList = [
                        {size:10,name:'极小(10px)'},
                        {size:12,name:'特小(12px)'},
                        {size:14,name:'小(14px)'},
                        {size:18,name:'中(18px)'},
                        {size:24,name:'大(24px)'},
                        {size:32,name:'特大(32px)'},
                        {size:48,name:'极大(48px)'}
                    ];

                    //font-family: Helvetica, Tahoma, Arial, "PingFang SC", "Hiragino Sans GB", "Heiti SC", STXihei, "Microsoft YaHei", SimHei, "WenQuanYi Micro Hei";
                    scope.fontFamilyList = [
                        {fontFamily:'SimSun',name:'宋体'},
                        {fontFamily:'FangSong_GB2312',name:'仿宋体'},
                        {fontFamily:'SimHei',name:'黑体'},
                        {fontFamily:'KaiTi_GB2312',name:'楷体'},
                        {fontFamily:'Microsoft YaHei',name:'微软雅黑'},
                        {fontFamily:'Times New Roman',name:'Times New Roman'},
                        {fontFamily:'Comic Sans MS',name:'Comic Sans MS'},
                        {fontFamily:'Courier New',name:'Courier New'}
                    ];

                    //设置默认字体颜色和默认字体大小
                    scope.vo = {
                        color:"#e74e4d",
                        fontSize:18,
                        fontFamily:'Microsoft YaHei'
                    };
                    //点击添加文字操作
                    scope.addTextFun = function () {
                        //初始化新增文字
                        var initText = new zrender.Text({
                            position:[0,0],
                            style:{
                                text:'添加文字',
                                fontSize: 20,//默认20
                                fontFamily:"Microsoft YaHei",
                                textFill:"#e74e4d"
                            },
                            draggable: true
                        });

                        scope.addTextShow = true;//输入框显示
                        if(!scope.vo.textContent){//如果输入框没有值,则添加操作失效
                            return;
                        }
                        addOperateFlag = true;
                        initText.style.text=scope.vo.textContent;
                        scope.vo.textContent = "";
                        if(scope.vo.color){
                            initText.style.textFill = scope.vo.color;
                        }
                        if(scope.vo.fontSize){
                            initText.style.fontSize = scope.vo.fontSize;
                        }

                        if(scope.vo.fontFamily){
                            initText.style.fontFamily = scope.vo.fontFamily;
                        }

                        var group = new zrender.Group();
                        group.add(initText);
                        textList.push(initText);
                        zr.add(group);
                        getImgCut();
                    };


                    scope.$watch('vo.color',function (oldValue,newValue) {
                        scope.selectFontChange();
                    });

                    //选择字体或者或者字体后
                    scope.selectFontChange = function () {
                        if(selectTextNum == undefined){
                            return;
                        }
                        textList[selectTextNum].style.fontSize = scope.vo.fontSize;
                        textList[selectTextNum].style.textFill = scope.vo.color;
                        textList[selectTextNum].style.fontFamily = scope.vo.fontFamily;
                        var group = new zrender.Group();
                        group.add(temporarySaveImageList.backgroundImage);
                        group.add(circle);
                        textList.forEach(function (item) {
                            group.add(item);
                        });
                        smallIconList.forEach(function (item) {
                            group.add(item);
                        });
                        zr.clear();
                        zr.add(group);
                        getImgCut();
                    };


                    //双击后可以编辑
                    zr.on('dblclick',function (event) {
                        //如何获取拖动的文字对象
                        var e = event || window.event;
                        var triggerLeft = e.offsetX;//鼠标相对位置
                        var triggerTop = e.offsetY;

                        // 鼠标在文字的移动范围内
                        var overlapFlag = false;//重叠
                        var textNum = 0;
                        for(var i=0;i<textList.length;i++){
                            var textPosition = textList[i].position;
                            if(!textList[i]._rect){
                                return;
                            }
                            var textWidth = textList[i]._rect.width;
                            var textHeight = textList[i].style.fontSize;
                            if((triggerLeft-textPosition[0]>0) && ((triggerLeft-textPosition[0])<textWidth) && (triggerTop-textPosition[1]>0) && ((triggerTop-textPosition[1])<textHeight)){
                                selectTextNum = i;
                                textNum++;
                                if(textNum>1){
                                    overlapFlag = true;//重叠时，默认取最后添加的，即最高层
                                }
                            }
                        }



                        var smallIconNum = 0;
                        for(var i=0;i<smallIconList.length;i++){

                            var smallIconPosition = smallIconList[i].position;
                            var smallIconWidth = smallIconList[i]._image.width;
                            var smallIconHeight = smallIconList[i]._image.height;

                            if((triggerLeft-smallIconPosition[0]>0) && ((triggerLeft-smallIconPosition[0])<smallIconWidth) && (triggerTop-smallIconPosition[1]>0) && ((triggerTop-smallIconPosition[1])<smallIconHeight)){
                                smallIconSelectNum = i;
                                smallIconNum++;
                                if(smallIconNum>1){
                                    overlapFlag = true;//重叠时，默认取最后添加的，即最高层
                                }
                            }

                        }
                    });




                    function deleteLayer() {
                        var group = new zrender.Group();
                        group.add(temporarySaveImageList.backgroundImage);
                        group.add(circle);
                        textList.forEach(function (item) {
                            group.add(item);
                        });
                        smallIconList.forEach(function (item) {
                            group.add(item);
                        });
                        zr.clear();
                        zr.add(group);
                        getImgCut();
                    }
                    //按下删除按钮
                    document.onkeydown = function (event) {
                        if(event.keyCode == 8 || event.keyCode == 46){
                            if(selectTextNum != undefined){
                                textList.splice(selectTextNum,1);
                                deleteLayer();
                            }

                            if(smallIconSelectNum != undefined){
                                smallIconList.splice(smallIconSelectNum,1);
                                deleteLayer();
                            }
                        }
                    };



//end-----文字结束

//begin-在弹窗中打开图片
                    var smallIconList = [];//临时所有打开的小图标
                    scope.getImageFile = function (file,index) {
                        var logoImg = new Image();//源图片信息
                        var reader = new FileReader();
                        reader.onload = function (event) {
                            logoImg.onload = onLoadImage;
                            logoImg.src = event.target.result;
                        };
                        reader.readAsDataURL(file);

                        function onLoadImage() {

                            var canvas = new zrender.util.createCanvas();
                            canvas.width=this.width;
                            canvas.height=this.height;

                            var logCanvas = canvas.getContext('2d');

                            logCanvas.drawImage(logoImg, 0, 0, this.width, this.height);

                            var image = new Image();
                            image.src = canvas.toDataURL("image/png");
                            image.onload = function () {
                                scope.resultImg = image.src;
                                var icon = new zrender.Image({
                                    position: [0,0],
                                    scale: [1, 1],//缩放比例
                                    style: {
                                        x: 0,
                                        y: 0,
                                        image: image,
                                        width: this.width,
                                        height: this.height
                                    },
                                    draggable: true
                                });

                                smallIconList.push(icon);
                                var group = new zrender.Group();
                                group.add(icon);
                                zr.add(group);
                            };
                        }


                    };
//end-添加图标

                    //进行裁剪具体操作
                    function getImgCut() {
                        //为什么要*reduceScale，因为在页面预览的图片的size已经经过扩大或者缩小，不是原始图片的宽高，若要得到选中的区域，必须得到源图片的真实宽高才能得到正确的预览图
                        var changeScale = preImgWidth/changeWidth;//变化中变化的比例
                        // var poX,poY;//图片的位置
                        var sx = circle.position[0]*reduceScale*changeScale-poX*reduceScale*changeScale;//开始剪切的 x 坐标位置
                        var sy = circle.position[1]*reduceScale*changeScale-poY*reduceScale*changeScale;
                        var sw = scope.limitImgSize[0]*reduceScale*changeScale;//被剪切图像的宽度
                        var sh = scope.limitImgSize[1]*reduceScale*changeScale;

                        var cw = scope.limitImgSize[0];//要使用的图像的宽度。（伸展或缩小图像）
                        var ch = scope.limitImgSize[1];

                        //新建canvas显示裁剪后的图片
                        var canvas = element.find('canvas');

                        canvas[1].width=cw;
                        canvas[1].height=ch;

                        var canvas1 = canvas[1].getContext('2d');
                        canvas1.clearRect(0, 0, sw, sh);
                        canvas1.fillStyle = '#FFFFFF';//填充背景色颜色
                        canvas1.fillRect(0, 0, cw, cw);
                        canvas1.drawImage(initImg, sx, sy, sw, sh,0,0,cw,ch);


                        // 开始绘制文字
                        //字体大小
                        textList.forEach(function (item) {
                            var textX = item.position[0] - circle.position[0];
                            var textY = item.position[1] - circle.position[1] + item.style.fontSize;
                            // begin- 开始绘制文字
                            //设置字体样式
                            //fontSize
                            var font= item.style.fontSize+'px '+item.style.fontFamily;
                            canvas1.font = font;
                            //设置字体填充颜色
                            canvas1.fillStyle = item.style.textFill;
                            // scope.vo.fontFamily;

                            //从坐标点(50,50)开始绘制文字
                            canvas1.fillText(item.style.text,textX,textY);
                        });
                        //end

                        //开始绘制图标
                        smallIconList.forEach(function (item) {
                            var textX = item.position[0] - circle.position[0];
                            var textY = item.position[1] - circle.position[1] + item.style.fontSize;
                            // begin- 开始绘制文字
                            canvas1.drawImage(item.style.image, textX,textY);
                        });

                        var image = new Image();
                        image.src = canvas[1].toDataURL("image/png");
                        image.onload = function () {
                            scope.resultImg = image.src;
                            scope.$apply();
                        };
                    }
                    // end-裁剪等操作层


                    //end
                }
            }
        }])

})();



