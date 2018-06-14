import $ from "../../dist/js/jquery-1.11.1.min";
import jBox from "../../dist/js/jQuery.jBox";
import LazyLoad from "../../dist/js/jquery.lazyload.min";

const PUBLIC = window.PUBLIC || {};

class GOLBAL {
    constructor() {
    }

    //预加载
    ImageLazyLoad(ele, cont, sucFun, errFun) {
        $(ele).find("img").lazyload({
            placeholder: "../img/icon/loading.gif",
            effect: "fadeIn",
            threshold: 50,
            container: cont,
            load: function () {
                $(this).addClass("load-success").removeAttr("data-original");
                $(this).parents(ele).find(".image-loading").hide();
                if (sucFun) sucFun.call(this, $(this).parents(ele));
            },
            error: function () {
                $(this).addClass("load-error");
                $(this).parents(ele).find(".image-loading").hide();
                if (errFun) errFun.call(this, $(this).parents(ele));
            }
        });
    }
}
