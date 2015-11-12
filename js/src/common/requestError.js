define(function(require,exports){
	var errorMes = function(xhr, errorType, error){
		switch (xhr.status){
        case 404:
            alert("接口木有了哦~，亲，联系我们的客服！");
            break;
        case 502:
            alert("亲，服务器开小差了~，请稍后重试！");
            break;
        default:
            alert("接口返回错误，请稍后重试！");
            break;
        }
	};
	var requestError = {
		errorMes:errorMes
	};
	return requestError;
});