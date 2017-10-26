(function () {
    resize = function () {
        var B = document.documentElement.clientWidth == 0 ? document.body.clientWidth : document.documentElement.clientWidth || document.body.clientWidth;
        document.documentElement.style.fontSize = B / 7.5 + "px"
    };
})();
window.onload = function () {
    resize()
};
window.onresize = function () {
    resize()
};
