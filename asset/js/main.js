var config = {
    host: 'http://m.birdvpn.cn/'
};

$(function(){
    var userInfo = null;
    var url = location.pathname.toLowerCase();
    var ua = navigator.userAgent.toLowerCase();

    function common(){
        userInfo = localStorage.getItem('birdVPNUserInfo') && JSON.parse(localStorage.getItem('birdVPNUserInfo'));
        if (userInfo && userInfo.token) {
            $('.signin').hide();
            $('.user-nickname').html('<a href="/my.html">' + (userInfo.nickName || userInfo.loginId) + '</a>').show();
            $('.user-logout').show();
        }else{
            $('.user-nickname').hide();
            $('.user-logout').hide();
            $('.signin').show();
        }

        $('.user-logout').click(function(){
            $.ajax({
                type: "POST",
                url: config.host + "/api/v1/user/005-logout",
                dataType: "json",
                data: {
                    token: userInfo.token,
                },
                success: function (data) {
                    if (data.code === "0") {
                        localStorage.removeItem('birdVPNUserInfo');
                        location.href = '/';
                    } else {
                        alert(data.message);
                    }
                }
            });
        })
    }
    common();
    

    function productList(){
        $.ajax({
            type: "POST",
            url: config.host + "/api/v1/002-productList",
            dataType: "json",
            data: {},
            success: function (data) {
                if (data.code === "0") {
                    var productListData = data.rows;
                    $('.pricing-box').each(function(index){
                        $(this).find('.pricing-heading').text(productListData[index].name);
                        $(this).find('.pricing-price').text(productListData[index].extend2);
                        $(this).find('.old-price').text(productListData[index].extend1);
                        $(this).find('.clientNum').text(productListData[index].clientNum);

                        if (userInfo && userInfo.token) {
                            $('.btn-login').hide();
                            $('.btn-buy').eq(index).attr('data-id', productListData[index].id).show();
                        }else{
                            $('.btn-buy').hide();                            
                            $('.btn-login').show();
                        }
                    })

                    $('.btn-buy').click(function(){
                        cycleList($(this).data('id'));
                    })
                } else {
                    alert(data.message);
                }
            }
        });
    }

    function cycleList(id){
        $('#cycleList').modal('show');
        
        $.ajax({
            type: "POST",
            url: config.host + "/api/v1/003-cycleList",
            dataType: "json",
            data: {
                productId: id
            },
            success: function (data) {
                if (data.code === "0") {
                    var cycleListData = data.rows;
                    var listHTML = '';
                    
                    $('.cycleVersion').text(cycleListData[0].productName);

                    cycleListData.forEach(function(item, index){
                        listHTML += '<span class="'+ (index == 0 && 'active') +'" data-id="'+ item.id +'">￥ '+ item.cycleName +'</span>'
                    })

                    $('.cycleList-box').html(listHTML);
                    $('.cycleList-box span').click(function(){
                        $('.cycleList-box span').removeClass('active');
                        $(this).addClass('active');
                    })
                } else {
                    alert(data.message);
                }
            }
        });
    }

    function buy(){
        $('#J_buy').click(function(){

            var cycleId = '';
            
            $('.cycleList-box span').each(function(){
                if ($(this).hasClass('active')) {
                    cycleId = $(this).data('id');
                }
            })

            var type = 2;

            if (ua.match(/mobile/i) == 'mobile') {
                type = 1;
            }

            location.href = config.host + '/api/v1/addOrderWeb?token=' + userInfo.token + '&cycleId=' + cycleId + '&type=' + type;
        })
    }

    if (url.match(/vip.php.html/i) == 'vip.php.html') {
        productList();
        buy();
    }

    
    function getEndTime(){
        $.ajax({
            type: "POST",
            url: config.host + "/api/v1/user/007-getEndTime",
            dataType: "json",
            data: {
                token: userInfo.token
            },
            success: function (data) {
                if (data.code === "0") {
                    $('#J_endTime').text('到期时间：' + data.rows);
                } else {
                    alert(data.message);
                }
            }
        });
    }

    function myVpn(){
        $.ajax({
            type: "POST",
            url: config.host + "/api/v1/user/006-myVpn",
            dataType: "json",
            data: {
                token: userInfo.token
            },
            success: function (data) {
                if (data.code === "0") {
                    var qrcode = new QRCode(document.getElementById("J_qrcode"), {
                        width : 196,//设置宽高
                        height : 196
                    });

                    if(JSON.stringify(data.rows).indexOf('ss')!=-1){
                        qrcode.makeCode(data.rows);
                    }                    
                } else {
                    alert(data.message);
                }
            }
        });
    }

    function testAccount(){
        $.ajax({
            type: "POST",
            url: config.host + "/api/v1/user/008-getTestAccount",
            dataType: "json",
            success: function (data) {
                if (data.code === "0") {
                    var qrcode = new QRCode(document.getElementById("J_qrcode"), {
                        width : 196,//设置宽高
                        height : 196
                    });

                    if(JSON.stringify(data.rows).indexOf('ss')!=-1){
                        qrcode.makeCode(data.rows);
                    }                    
                } else {
                    alert(data.message);
                }
            }
        });
    }

    if (url.match(/my.html/i) == 'my.html') {
        getEndTime();
        myVpn();
    }

    testAccount();
})