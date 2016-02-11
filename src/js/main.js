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

    // title变化
    var OriginTitile = document.title;
    var titleTime;
    document.addEventListener('visibilitychange', function () {
        if (document.hidden) {
            $('[rel="shortcut icon"]').attr('href', "//www.anotherhome.net/wp-content/themes/Amativeness/fail.ico");
            document.title = '(●—●)喔哟，崩溃啦！';
            clearTimeout(titleTime);
        }
        else {
            $('[rel="shortcut icon"]').attr('href', "//www.anotherhome.net/wp-content/themes/Amativeness/favicon.ico");
            document.title = '(/≧▽≦/)咦！又好了！' + OriginTitile;
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

    // 顶部头像动画
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
        $.getJSON("https://www.anotherhome.net/api/vote/like.php?action=add", function (data) {
            if (data.success) {
                $('.like-vote span').html(data.like);
                $('.like-title').html('我也喜欢你 (*≧▽≦)');
            }
            else {
                $('.like-title').html('你的爱我已经感受到了~');
            }
        });
    });

    // 博客已运行XXX
    show_date_time();

    // 当页面向下滚动时，导航条消失，当页面向上滚动时，导航条出现
    var head = document.getElementsByClassName('navbar')[0];
    var headroom = new Headroom(head, {
        "tolerance": 5,
        "offset": 205,
        "classes": {
            "initial": "head-animated",
            "pinned": "slideDown",
            "unpinned": "slideUp"
        }
    });
    headroom.init();

    // 版权信息
    var arCon = document.getElementsByClassName('article-content');
    for (var i = 0; i < arCon.length; i++) {
        arCon[i].addEventListener('copy', function (e) {
            if (window.getSelection().toString() && window.getSelection().toString().length > 42) {
                setClipboardText(e);
                //alert('商业转载请联系作者获得授权，非商业转载请注明出处，谢谢合作。');
                notie('info', '商业转载请联系作者获得授权，非商业转载请注明出处，谢谢合作。', true)
            }
        });
    }

    function setClipboardText(event) {
        var clipboardData = event.clipboardData || window.clipboardData;
        if (clipboardData) {
            event.preventDefault();

            var htmlData = ''
                + '著作权归作者所有。<br>'
                + '商业转载请联系作者获得授权，非商业转载请注明出处。<br>'
                + '作者：DIYgod<br>'
                + '链接：' + window.location.href + '<br>'
                + '来源：Anotherhome<br><br>'
                + window.getSelection().toString();
            var textData = ''
                + '著作权归作者所有。\n'
                + '商业转载请联系作者获得授权，非商业转载请注明出处。\n'
                + '作者：DIYgod\n'
                + '链接：' + window.location.href + '\n'
                + '来源：Anotherhome\n\n'
                + window.getSelection().toString();

            clipboardData.setData('text/html', htmlData);
            clipboardData.setData('text/plain', textData);
        }
    }

    // ASpace
    aSpace(document.getElementById('content'));
    if (document.getElementById('comment-content')) {
        document.getElementById('comment-content').addEventListener('change', function () {
            this.value = aSpace(this.value);
        });
    }

    // poi
    // var poi = new Audio('https://dn-diygod.qbox.me/poi.wav');
    // poi.play();

    // 关闭侧边栏
    document.getElementsByClassName('close-side')[0].addEventListener('click', function () {
        document.getElementsByClassName('side')[0].style.display = 'none';
        document.getElementsByClassName('main')[0].style.width = '100%';
    });

    // 小工具跟随
    var $sidebar = $("#text-4"),
        $last = $("#secondary"),
        $window = $(window),
        offset = $last.offset().top + $last.height();
    $window.scroll(function () {
        if ($window.scrollTop() > offset) {
            $sidebar.css({"position": "fixed", "top": "40px", "width": "22%", "animation": "fade-in 0.5s"});
        } else {
            $sidebar.css({"position": "relative", "top": "0", "width": "initial", "animation": "initial"});
        }
    });

    // 防重复评论
    if (document.getElementById('submit')) {
        document.getElementById('submit').addEventListener('click', function () {
            this.value = '正在提交,好累呀~';
        });
    }

    // 搜索
    //function search() {
    //    var searchInput = this.getElementsByClassName('search-input')[0];
    //    if (searchInput.value) {
    //        var url = 'https://www.google.com/search?q=site:anotherhome.net%20' + searchInput.value;
    //        window.open(url, "_blank");
    //        return false;
    //    } else {
    //        return false;
    //    }
    //}

});

// 博客已运行XXX
function show_date_time() {
    window.setTimeout("show_date_time()", 1000);
    var BirthDay = new Date("2/9/2014 11:30:00");
    var today = new Date();
    var timeold = (today.getTime() - BirthDay.getTime());
    var msPerDay = 24 * 60 * 60 * 1000;
    var e_daysold = timeold / msPerDay;
    var daysold = Math.floor(e_daysold);
    var e_hrsold = (e_daysold - daysold) * 24;
    var hrsold = Math.floor(e_hrsold);
    var e_minsold = (e_hrsold - hrsold) * 60;
    var minsold = Math.floor((e_hrsold - hrsold) * 60);
    var seconds = Math.floor((e_minsold - minsold) * 60);
    span_dt_dt.innerHTML = "博客已萌萌哒运行" + daysold + "天" + hrsold + "小时" + minsold + "分" + seconds + "秒";
}