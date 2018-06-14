//清除文字
FB.clearBtnShow(".clean>input", ".clean-btn");

//搜索按钮
$(".search-btn").click(function () {
    if ($(this).hasClass("off")) return false;
    $(this).find("span.search-animate").addClass("active");
    $(this).parents(".header-cont").addClass("focus");
    $(".search-close").addClass("active");
    $("#searchBG").show();
    $(".search-cont").slideDown(300);
});

$(".search-close").click(function () {
    if (!$(this).hasClass("share")) {
        $(this).parents(".header-cont").find("span.search-animate").removeClass("active");
        $(this).parents(".header-cont").removeClass("focus");
        $(this).removeClass("active");
        $("#searchBG").hide();
        $(".search-cont").hide();
        $(".none-data").hide();
        $(this).parents(".header-cont").find("input.search-input").val("").blur();
        $("#searchText").text("");
    }
});

//监听搜索内容
FB.inputChange(".search-input", function (val) {
    $("#searchText").text(val);
});

//点击搜索
$(".search-cont a").click(function () {
    var val = $("#searchText").text();
    if (val === null || val === "") {
        $(".none-data").show();
        $("#searchBG").hide();
        $(".search-cont").hide();
    }
});

//显示选择地址遮罩
FB.showDiskPop({
    clickEle: "#showArea",
    diskEle: ".location-pop"
});

//选择省份
$(document).on("click", ".city-box.province a", function () {
    $(this).addClass("active").siblings().removeClass("active");
    var $province = $(this).parents(".city-box");
    var $city = $(".city-box.city");
    var $loading = $(".fb-disk-loading");
    $loading.show();
    setTimeout(function () {
        $loading.hide();
        $province.hide();
        $(".fb-back-btn").show();
        $city.empty().show();
        for (var i = 0; i < 10; i++) {
            $city.append("<a href='javascript:;'>加载城市" + (i + 1) + "</a>");
        }
    }, 1000);
});

//选择市区
$(document).on("click", ".city-box.city a", function () {
    $(this).addClass("active").siblings().removeClass("active");
    var $btn = $("#showArea");
    if ($btn.find("input").length === 0) {
        $btn.find(".text").removeClass("def").text($(this).text());
    } else {
        $btn.find("input.text").val($(this).text());
    }
    $(".fb-close-btn").click();
});

//返回
$(document).on("click", ".fb-back-btn", function () {
    var $province = $(".city-box.province");
    var $city = $(".city-box.city");
    $(".fb-back-btn").hide();
    $city.hide();
    $province.show();
});


/**
 * 头像上传
 * 静态模拟过程
 * @param option
 * @param type
 */
var $image, canvasData, cropBoxData;
var croppedCanvas, roundedCanvas;
var cropped = false;

function uploadCropperImage(option, type) {
    option.isChange = true;
    /*判断模式*/
    if (type === "post") {
        uploadImage(option.element, function (url) {
            $(option.diskElement).find(".upload-pop-bar").append('<label class="upload-img"><img id="uploadImg" src="' + url + '"></label>');
            $(option.diskElement).show();
            $(option.diskElement).find(".upload-pop-box").addClass("active");
            initCropper();
        });
    }

    function initCropper() {
        //初始化cropper
        $image = $("#uploadImg");
        if (!$image) return false;
        cropperInit(".view-handle", option.type || "radius", option.cropper || {}, function () {
            option.cropper_width = $image.cropper("getCropBoxData").width;
        });
    }

    return {
        cancel: function () {
            $(option.diskElement).hide();
            $(option.diskElement).find(".upload-pop-box").removeClass("active");
            $(option.diskElement).find(".upload-img").remove();
            $image.cropper("destroy");
            $image = undefined;
            cropped = false;
        },
        sure: function () {
            if (!$image) return false;
            //裁剪图片
            if (option.isChange) {
                $(option.diskElement).hide();
                $(option.diskElement).find(".upload-pop-box").removeClass("active");
                croppedCanvas = $image.cropper("getCroppedCanvas");
                roundedCanvas = getRoundedCanvas(croppedCanvas, option.type || "radius");
                var newImgURL = option.isChange ? roundedCanvas.toDataURL() : option.imgUrl;
                option.ensureFun && option.ensureFun.call(this, $image, newImgURL, option);
            }
        }
    }
}

//头像上传剪切-cropper
function cropperInit(btn, type, opts, callback) {
    var defaults = {
        aspectRatio: 1,
        autoCropArea: 1,
        viewMode: 2,
        dragMode: "move",
        checkCrossOrigin: true,
        background: false,
        /*cropBoxMovable: false,
        cropBoxResizable: false,
        toggleDragModeOnDblclick: false,
        minCropBoxWidth: $(window).width()-2,*/
        ready: function () {
            cropped = true;
            callback && callback.call();
        }
    };

    var options = {};
    if (type === "radius") {
        options = {
            aspectRatio: 1,
            // preview: ".preview-box .img",
            autoCropArea: 0.8
        };
    } else if (type === "rect") {
        options = {
            aspectRatio: 1,
            autoCropArea: 1
        };
    }

    var opt = $.extend({}, defaults, options, opts);
    $image.cropper(opt);

    //按钮操作
    $(btn).on("click", "[data-method]", function () {
        var $this = $(this);
        var data = $this.data();
        var cropper = $image.data("cropper");
        if ($this.prop("disabled") || $this.hasClass("disabled")) {
            return;
        }
        if (cropper && data.method) {
            data = $.extend({}, data);
            $image.cropper(data.method, data.option);
        }
    });
    //重新选择图片绑定
    var $inputImage = $("#resetImage");
    uploadImage($inputImage[0], function (url) {
        $image.cropper('destroy').attr('src', url).cropper(opt);
    });
}

//canvas裁剪图片
function getRoundedCanvas(sourceCanvas, type) {
    var canvas = document.createElement('canvas');
    var context = canvas.getContext('2d');
    var width = sourceCanvas.width;
    var height = sourceCanvas.height;

    canvas.width = width;
    canvas.height = height;
    context.beginPath();
    if (type === "radius") {
        context.arc(width / 2, height / 2, Math.min(width, height) / 2, 0, 2 * Math.PI);
    } else if (type === "rect") {
        context.rect(0, 0, width, height);
    }
    context.strokeStyle = 'rgba(0,0,0,0)';
    context.stroke();
    context.clip();
    context.drawImage(sourceCanvas, 0, 0, width, height);

    return canvas;
}

//上传image-window.URL
function uploadImage(input, callback) {
    var URL = window.URL || window.webkitURL;
    var $inputImage = $(input);
    var uploadedImageType = 'image/jpeg';
    var uploadedImageURL;
    if (URL) {
        $inputImage.change(function () {
            var files = this.files;
            var file;
            if (files && files.length) {
                file = files[0];
                if (/^image\/\w+$/.test(file.type) && !file.name.match(/.gif$/)) {
                    uploadedImageType = file.type;
                    if (uploadedImageURL) {
                        URL.revokeObjectURL(uploadedImageURL);
                    }
                    uploadedImageURL = URL.createObjectURL(file);
                    callback && callback.call($inputImage[0], uploadedImageURL);
                } else {
                    $.jBox.error("只支持JPG,PNG格式的图片！");
                }
            }
        });
    } else {
        $.jBox.error("该浏览器不支持window.URL");
    }
}
