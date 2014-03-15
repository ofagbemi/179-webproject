$(document).ready(function(){
  var term = $('#term');
  var imageview = $('#imageview');
  var imageviewimg = $('#imageviewimg');
  var imageviewterm = $('#imageviewterm');
  var imageviewclose = $('#imageviewclose');
  var clicktostart = $('#clicktostart');
  var started = false;
  var colors = ['7fffff', '7fc504', 'a1133f', '8779a6', '85a857', '78793d', 'a4dd2e', '678034', '156d5c', 'b97246', '8d7dbe', '79652b', '705531', '94e3bc', '99ce06', '6dfa43', '921ff2', '547453', '5db8ba', '595182', 'b205bb', '3923a2', '93eab2', '746737', '75e9e1', '5cf41e', '8bf487', '5ac082', '82de00', 'cde69a', '6f1a9f', 'c97f61', '797f62', '9f6fd1', '9e3bcc', '77ef9d', '92617b', 'a8ef34', '677318', '7d14e3', '915b56', 'cef9da', '6fbe76', '6425ae', '890ff8', '695182', '89096b', '8b2feb', '77318f', '7e7d55', '8e5c91', '9a1cab', '9c154b', 'a75253', '883e41', '510624', '681061', 'a3c9ee', '63afb7', '856041', '7ea4a8', '93c360', '7f9db1', '773eaa', '913a92', '6793dd', '85a1ca', '95b573', 'b68db8', '536112', '7a64c2', '8a3d70', '228f5c', '7eb1c3', '8c2267', '8ce075', '7fa43f', '8b7802', '4bb98c', '1eab36', '90a3d6', '4b2fec', '7432c9', '910cb2', '5b295e', '16c8b4', '989374', '847453', '79c779', 'bc56d5', '6a9fbe', '56a7ef', '9ced90', '89e83d', 'b1f212', '5f34d6', '863f13', 'cf9db1', 'a9096b', '2460aa', '9e0dec', '6dc5d5', '7ba5e2', '92bd3b', '61c432', '5c91d0', '5acd9e', '656041', '88240a', 'b0aa64', 'acfaac', '67318f', '9faacc', '9020c4', '7a5e34', '4a6b50', 'c49ba5', '8353f7', 'af559a', '60ff96', '3c6a7e', '3c8b43', '5ed916', 'd0e55f', '3a5119', '923a29', '79096b', '969445', '8c3610', '8652bc', '3e978d', 'bb5dcb', '632617', '55e353', 'aff971', '75fd8a', '6d14e3', 'bbfb14', 'e4c2f7', '521964', '60ded2', '76e2ea', 'b0aa64', '693dd9', '961133', '6793dd', '9e76c8', '7d844c', '9652bc', '64816e', '7aa64b', '8ed915', '748e89', '4d97f5', 'a86594', '61411f', '92bd3b', 'a9fbe6', '9ae147', '97e90f', '90be0d', '46bb98', '89b3cf', 'a88658', '7a1cab', '56f006', 'a05bbf', '862b6a', '80b77f', 'cb4394', '84bc69', '66872a', '77ef9d', '90d1b6', 'a0f908', '90068d', '81ff2d', '8020c4', '8ef34c', '491d14', '881061', 'e710ca', 'b3dd97', '5f6fd1', '581d7d', '8f6fd1', '8a64c2', '88b438', '85f06e', '757a77', '5aa64b', '3f27ba', '44d6a1', 'b87fca', '7b295e', 'a13a92', '760aa5', '404188', '5b2feb', '9710ca', '78c7e2', 'f44d00', '812d76', '658e21', '96d5cf', '74bc6a', '8a43fd', '692a2f', '8b50b0', '4e703a', '80899f', 'c0c49a', 'bc710b', '62d0e4', '85f6fc', '704ea4', '64b5dc', 'd4f765', '934d69', '8f62b6', '71a9fb', '6c91d0', '894af4', '639c0e', 'a3126d', '9d3c35', '7a0f90', '5e69ac', 'b288cd', '48e219', '8fb7e8', '952bd3', '0', '91de69', '6288ce', '6985f0', '54f0d7', 'f9eecb', '5e2eb1', '61a36d', 'a00d1a', 'a0ded1', '77c84a', '761133', '83dd97', '8930bd', '9edfa3', '6d5cfa', '434d69', '92b6ad', '77d566', '9d6387', '82c3c9', '5ec56c', '873eaa', '5809d4', '81d7db', '994af4', '7a29c6', '6d6a15', '686594', '581d7d', '7b9239', '7b7e90', '843fe5', '7e703a', '936e2e', '7a8587', '73c9ee', '7c3c9e', '81f8a0', '7dab9e', '7f765f', '7ebedf', '82d0e4', '7eb851', '8240b6', '84a233', '7d7731', '7ff2e4', '7e5c91', '813a92', '7f0d83', '801a36', '7fe5c8', '80346d', '7fffff', '7fffff', '7fffff', '7fffff', '7fffff'];

  function nullimg(){
	this.css = ret;
	this.attr = ret;
	this.hide = ret;
	function ret(){
	  return;
	}
  }
  function nullstage(){
	this.find = newnullelem;
	this.attr = ret;
	function newnullelem(){
	  return new nullelem;
	}
	function ret(){
	  return;
	}
  }
  function nullelem(){
	this.html = ret;
	this.show = ret;
	this.css = ret;
	this.height = retnum;
	function ret(){
	  return;
	}
	function retnum(){
	  return 0;
	}
  }


  var lastImg;
  var currentImg = new nullimg;
  var lastStage;
  var currentStage = new nullstage;
  var nextImgNum = 0;

  $('.stage_term').click(showTerm);
  $('.stage').click(showTermStageClick);
  
  
  function showTerm() {
      var stage = $(this).parent();
      var img = stage.find('.audio_img');
      var src = img.attr('src');
      var term = img.attr('term');
      imageviewimg.attr('src', src);
      imageviewterm.html(term);
      imageview.show();
      stage.css('background', stage.attr('altcolor'));
  }
  
  function showTermStageClick() {
      var stage = $(this);
      var img = stage.find('.audio_img');
      var src = img.attr('src');
      var term = img.attr('term');
      imageviewimg.attr('src', src);
      imageviewterm.html(term);
      imageview.show();
      stage.css('background', stage.attr('altcolor'));
  }
  
  function showScreen() {
    var width = window.innerWidth;
    var height = window.innerHeight;
    var screen = $('#screen');
    screen.css('width', width + 'px').css('height', height + 'px');
    $('#screenwrap').show();
  }
  
  function hideScreen() {
    $('#screenwrap').hide();
  }
  
  function showImageWide() {
    var width = window.innerWidth;
    var height = window.innerHeight;
    showScreen();
    var imagewidestagewrap = $('#imagewidestagewrap');
    var imagewidestage = $('#imagewidestage');
    // imagewidestage.css('min-width', width * (2/3) + 'px').css('min-height', height * (2/3) + 'px');
    // imagewidestage.css('top', (height - (height * 2/3))/2 + 'px');
    // imagewidestage.css('left', (width - (width * 2/3))/2 + 'px');
    imagewidestagewrap.show();
    $('#showimagewide').html('¿');
  }
  
  function closeImageWide() {
    hideScreen();
    $('#imagewidestagewrap').hide();
    $('#showimagewide').html('!');
  }
  
  $('#showimagewide').click(
    function(){
      if($(this).html() == '!'){
        showImageWide();
      } else {
        closeImageWide();
      }
  });
  
  imageviewclose.click(
    function(){
      imageview.hide();
  });
  
  $(window).load(function(){
    if(!started){
      clicktostart.show();
    }
  });
  
  var time = 24000;
  setTimeout(function(){
    if(!started){
      clicktostart.show();
    }
  }, time);
  
  clicktostart.click(function() {
    $('#term').html('。。。');
    start();
  });
  
  function start() {
    started = true;
    var wait_ms = 541;
    $('#song').get(0).play();
    setInterval(function(){
      lastImg = currentImg;
      lastStage = currentStage;
      currentStage.attr('altcolor', '#' + colors[nextImgNum]);
      var stage_term = lastStage.find('.stage_term');
      stage_term.html(lastImg.attr('term'));
      var term_height = stage_term.height();
      stage_term.css('margin-top', 40 - (term_height/2) + 'px');
      stage_term.css('display', 'inline-block');
      lastImg.hide();
      currentImg = $("#img" + nextImgNum);
      currentStage = currentImg.parent();
      currentStage.show();
      term.html(currentImg.attr('term'));
      var imagewidestageimg = $('#imagewidestageimg');
      imagewidestageimg.css('max-height', window.innerHeight - 80 + 'px');
      imagewidestageimg.css('max-width', window.innerWidth - 80 + 'px');
      imagewidestageimg.attr('src', currentImg.attr('src'));
      
      $('#imagewidestage').css('left', (window.innerWidth - imagewidestageimg.width() - 40)/2 + 'px');
      $('#imagewidestage').css('top', (window.innerHeight - imagewidestageimg.height() - 40)/2 + 'px');
      
      nextImgNum++;
    }, wait_ms);
  }
});