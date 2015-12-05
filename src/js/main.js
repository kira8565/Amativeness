$(document).ready(function ($) {
    // 利用 data-scroll 属性，滚动到任意 dom 元素
    $.scrollto = function (scrolldom, scrolltime) {
        $(scrolldom).click(function () {
            var scrolltodom = $(this).attr("data-scroll");
            $(this).addClass("active").siblings().removeClass("active");
            $('html, body').animate({
                scrollTop: $(scrolltodom).offset().top
            }, scrolltime);
            return false;
        });
    };
    // 判断位置控制 返回顶部的显隐
    $(window).scroll(function () {
        if ($(window).scrollTop() > 700) {
            $("#back-to-top").fadeIn(800);
        } else {
            $("#back-to-top").fadeOut(800);
        }
    });
    // 启用
    $.scrollto("#back-to-top", 800);

    // 新窗口打开链接
    $(".post a").attr("target", "_blank");

    // Ctrl + Enter 提交回复
    $('#comment-content').keydown(function (event) {
        if (event.ctrlKey && event.keyCode == 13) {
            $('#submit').click();
            return false;
        }
    });

    // 点击标签 收起/展开 内容
    $('.side .block .label').click(function () {
        $(this).siblings('.list').slideToggle("slow");
    });
    $('.main .block .comments').click(function () {
        $(this).siblings('.comment-list').slideToggle("slow");
    });
    $('.main .block .round-date').click(function () {
        $(this).siblings('.label').slideToggle("slow");
        $(this).siblings('.article-content').slideToggle("slow");
    });

    // 头图视差
    var scene = document.getElementById('scene');
    var parallax = new Parallax(scene);

    // title变化
    var OriginTitile = document.title;
    var titleTime;
    document.addEventListener('visibilitychange', function () {
        if (document.hidden) {
            document.title = '(つェ⊂)我藏好了哦~ ' + OriginTitile;
            clearTimeout(titleTime);
        }
        else {
            document.title = '(*´∇｀*) 被你发现啦~ ' + OriginTitile;
            titleTime = setTimeout(function () {
                document.title = OriginTitile;
            }, 2000);
        }
    });

    //  分页功能（异步加载）
    $("#pagination a").on("click", function () {
        $(this).addClass("loading").text("文章列表加载中...");
        $.ajax({
            type: "POST",
            url: $(this).attr("href") + "#thumbs",
            success: function (data) {
                result = $(data).find("#thumbs .post");
                nextHref = $(data).find("#pagination a").attr("href");
                // 渐显新内容
                $("#thumbs").append(result.fadeIn(300));
                $("#pagination a").removeClass("loading").text("点击加载更多");
                if (nextHref != undefined) {
                    $("#pagination a").attr("href", nextHref);
                } else {
                    // 若没有链接，即为最后一页，则移除导航
                    $("#pagination").remove();
                }
            }
        });
        return false;
    });

    document.getElementsByClassName('avatar')[0].onmouseover = function () {
        this.classList.add('animated', 'tada');
    };
    document.getElementsByClassName('avatar')[0].onmouseout = function () {
        this.classList.remove('animated', 'tada');
    };


    // Do you like me?
    $.getJSON("https://www.anotherhome.net/api/vote/like.php?action=get", function (data) {
        $('.like-vote span').html(data.like);
    });
    $('.like-vote').click(function () {
        if ($('.like-title').html() === 'Do you like me?') {
            $.getJSON("https://www.anotherhome.net/api/vote/like.php?action=add", function (data) {
                if (data.success) {
                    $('.like-vote span').html(data.like);
                    $('.like-title').html('我也喜欢你 (*≧▽≦)');
                }
                else {
                    $('.like-title').html('你的爱我已经感受到了~');
                }
            });
        }
    });

    show_date_time();

    (function () {
        $("*:not(textarea)").each(function (m) {
            if (this.title) {
                var c = this.title;
                var a = 30;
                $(this).mouseover(function (d) {
                    this.title = "";
                    $("body").append('<div id="pre_a">' + c + "</div>");
                    $("#pre_a").css({left: (d.pageX + a) + "px", top: d.pageY + "px", opacity: "0.7"}).fadeIn(250)
                }).mouseout(function () {
                    this.title = c;
                    $("#pre_a").remove()
                }).mousemove(function (d) {
                    $("#pre_a").css({left: (d.pageX + a) + "px", top: d.pageY + "px"})
                })
            }
        })
    })();
});

// 博客已运行XXX
function show_date_time() {
    window.setTimeout("show_date_time()", 1000);
    BirthDay = new Date("2/9/2014 11:30:00");
    today = new Date();
    timeold = (today.getTime() - BirthDay.getTime());
    sectimeold = timeold / 1000
    secondsold = Math.floor(sectimeold);
    msPerDay = 24 * 60 * 60 * 1000
    e_daysold = timeold / msPerDay
    daysold = Math.floor(e_daysold);
    e_hrsold = (e_daysold - daysold) * 24;
    hrsold = Math.floor(e_hrsold);
    e_minsold = (e_hrsold - hrsold) * 60;
    minsold = Math.floor((e_hrsold - hrsold) * 60);
    seconds = Math.floor((e_minsold - minsold) * 60);
    span_dt_dt.innerHTML = "博客已萌萌哒运行" + daysold + "天" + hrsold + "小时" + minsold + "分" + seconds + "秒";
}