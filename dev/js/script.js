function errorMessage(parent, message){
    parent.addClass("error");
    var errorElement = parent.find(".error");
    if(errorElement.length == 0){
        var error = $("<span></span>",{"class":"error"}).text(message);
        error.append("<div></div>");
        parent.append(error);
    }
    else{
        errorElement.text(message);
        errorElement.append("<div></div>")
    }
    
}

function validateField(field) {
    var emailRegex = new RegExp(/^((([a-z]|\d|[!#\$%&'\*\+\-\/=\?\^_`{\|}~]|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])+(\.([a-z]|\d|[!#\$%&'\*\+\-\/=\?\^_`{\|}~]|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])+)*)|((\x22)((((\x20|\x09)*(\x0d\x0a))?(\x20|\x09)+)?(([\x01-\x08\x0b\x0c\x0e-\x1f\x7f]|\x21|[\x23-\x5b]|[\x5d-\x7e]|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])|(\\([\x01-\x09\x0b\x0c\x0d-\x7f]|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF]))))*(((\x20|\x09)*(\x0d\x0a))?(\x20|\x09)+)?(\x22)))@((([a-z]|\d|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])|(([a-z]|\d|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])([a-z]|\d|-|\.|_|~|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])*([a-z]|\d|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])))\.)+(([a-z]|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])|(([a-z]|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])([a-z]|\d|-|\.|_|~|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])*([a-z]|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])))\.?$/i);
    var urlRegex = new RegExp(/(^|\s)((https?:\/\/)?[\w-]+(\.[\w-]+)+\.?(:\d+)?(\/\S*)?)/gi);
    var numberRegex = new RegExp('^[0-9]+$');
    var val = field.val(),
        parent = field.parent(".input--holder");
    if(!val && field.hasClass("required")){
      errorMessage(parent, field.attr("data-validation-required"));
    }  
    else if(field.hasClass("email") && !val.match(emailRegex)){
        errorMessage(parent,field.attr("data-validation-email"));
    }
    else if(field.hasClass("url") && !val.match(urlRegex)){
        errorMessage(parent,field.attr("data-validation-url"));
    }
    else if(field.hasClass("number") && !val.match(numberRegex)){
        errorMessage(parent,field.attr("data-validation-phone"));
    }
    else{
        parent.removeClass("error");
        parent.find(".error").remove();
    }
}

function validateForm(form) {
    $(".required:visible", form).each(function() {
        validateField($(this));
    });
    return form.find(".input--holder.error").length == 0 ? true : false;
}
function bindFormEvents(form,formType) {
    if(formType==1){
        $("input,textarea",form).on("input",function(){
            var holder = $(this).parent('.input--holder');
            holder.toggleClass('active',this.value != "");
        });    
    }
    else if(formType==2) {
        $("input,textarea",form).focusout(function(){
            validateField($(this));
            $(this).on("input",function(){
                validateField($(this));
            });
        });   
    }
}
function bindFormValidations(form) {
    $("input,texarea",form).on("input",function(){
        validateField($(this));
    });
}


function bindFormSubmit(form,formType) {
    form.submit(function(e) {
        e.preventDefault();
        $(".hide").removeClass("hide");
        $(".success--container").remove();
        var isValid = validateForm(form);
        if(formType==1)
            bindFormValidations(form);
        if(isValid){
            var downloadFileForm = form.siblings(".form--downloadFile");
            $.ajax({
                type: "POST",
                url: form.attr("action"),
                data: form.serialize(),
                success: function(response) {
                    if(response.trim()=="success"){
                        var text = $("<span></span>",{'class':'text'}).text(form.attr("data-success"));
                        var successContainer = $("<div></div>",{"class":"success--container"});
                        var icon ="<span class='icon-check-circle-forms'></span>";
                        if( formType == 1 ){
                            var inputHolder = form.find(".input--holder");
                            inputHolder.addClass("hide").removeClass("active");
                            successContainer.append(text, icon);
                            form.append(successContainer);
                        }
                        else {
                            if($(".form--small").length == 0){
                                var title = $("<p></p>").text(form.attr("data-success"));
                                text.text(form.attr("data-success-remember"));       
                                successContainer.append(icon,title,text);    
                            }
                            else{
                                successContainer.append(icon,text);
                            }
                            successContainer.addClass("alternative");
                            if($(".contact--form").length == 0){
                                form.addClass("hide");
                                form.after(successContainer);
                            } 
                            else{
                                $(".contact--form .wrapper").addClass("hide");
                                $(".contact--form").append(successContainer);
                            }
                            setTimeout(function(){location.hash = "#!";},3700);
                        }
                        if(downloadFileForm.length == 1){
                            if(form.parents(".herramientas").length == 1){
                                setTimeout(function(){ window.location = downloadFileForm.find("[name='resourceUrl']").val();},2000);
                            }
                            else
                                $(downloadFileForm).submit();
                        }
                        form.find("input[type='text']").val("");
                    }
                }
            });
            
        }
    })
}
function openPopup(data) {
        window.open(data, this.target, "width=600,height=400,toolbar=0, location=0, menubar=0, directories=0, scrollbars=0");
}
function share(parent, item) {
        var twitter = encodeURIComponent(parent.data("twitter-content")),
            facebookTitle = encodeURIComponent(parent.data("facebook-title")),
            facebookContent = encodeURIComponent(parent.data("facebook-content")),
            linkedinTitle = encodeURIComponent(parent.data("linkedin-title")),
            linkedinContent = encodeURIComponent(parent.data("linkedin-content")),
            url = encodeURIComponent(parent.data("url")),
            shortUrl = encodeURIComponent(parent.data("shorten-url")),
            imageUrl = encodeURIComponent(parent.data("thumb"));
            
            if(item.hasClass("icon-follow-twitter")){
                openPopup("https://twitter.com/intent/tweet?text=" + twitter + "&url=" + shortUrl + "&via=fromdoppler");
            }
            else if(item.hasClass("icon-follow-facebook")){
                openPopup("https://www.facebook.com/dialog/feed?app_id=359702597487910&link=" + url + "&picture=" + imageUrl + "&name=" + facebookTitle + "&description=" + facebookContent + "&href=" + url + "&caption=" + url + "&redirect_uri=https://www.facebook.com");
            }
            else if(item.hasClass("icon-follow-linkedin")){
                 openPopup("http://www.linkedin.com/shareArticle?mini=true&url=" + url + "&title=" + linkedinTitle + "&summary=" + linkedinContent + "&source=" + encodeURIComponent("Sitio Doppler"));
            }
}

function loadData(element,href){
    element.parents("nav").find(".active").removeClass("active");
    element.addClass("active");
    
    $.get(href, function( data ) {
      var htmlDocument = $.parseHTML(data); 
      var htmlShow = $(htmlDocument).find(".main-container").html(); 
      var newTitle = $(htmlDocument).filter("title").text();
      $("title").text(newTitle);
      $("meta[name='description']").attr("content",$(htmlDocument).filter("meta[name='description']"));
      $("meta[name='keywords']").attr("content",$(htmlDocument).filter("meta[name='keywords']"));
      var recaptcha = $(htmlDocument).find(".g-recaptcha");
      $(".main-container section").remove();
      $(".main-container").prepend(htmlShow);
      if(recaptcha.length==1){
         grecaptcha.render('g-recaptcha', {
          'sitekey' : '6LcTCgkTAAAAABTZ0nbsUiCeRTzAoSlouueubZiU'
        });
      }
      $(".language a").attr("href",$(htmlDocument).filter(".language a").first().attr("href"));
      bindsForms();
      if($(".section-header--resources").length==1)
        bindResources();
      if($(".section-header--pricing").length==1)
        bindPricing();
      $(".overlay").addClass("fade");
    });
}

function bindsForms(){
    bindFormSubmit($("#form--contact"),2);
    bindFormEvents($("#form--contact"),2);
}

function bindResources(){
    $.each($(".form--download"),function(index,element){
        bindFormEvents($(element),2);
        bindFormSubmit($(element),2);
    });
    $(".video--container .icon-player").click(function(){
        var resourceUrl = $(this).attr("data-resourceUrl");
        var popup = $("<div/>",{"class":"modal--container"});
        var iframe = $("<iframe/>",{"type":"text/html","src":resourceUrl+"?autoplay=1&modestbranding=1&rel=0&showinfo=0","frameborder":"0"});
        var close = $("<a></a>",{"class":"close"}).append("<span class='text semi-bold'>CERRAR</span><div class='cross'></div>");
        close.click(function(){
            $(".modal--container").remove();
        });
        popup.append(iframe,close);
        $("body").append(popup);
    });
    $(".share").click(function(){
        var parent = $(this).parent();
        share(parent,$(this));
    });
    $(".button__download").click(function(){
        $(".input--holder").removeClass("error");
    });
    
    $.each($(".shares"),function(index,element){
        var longUrl = $(element).data("url");
        $.ajax({
            type:'POST',
            url : './resources/functions.php',
            data: {long_url: longUrl },
            success: function(response){
                $(element).data("shorten-url",response);
            }
        });
    });
}

$(document).ready(function() {
        var isInternetExplorer = navigator.userAgent.indexOf('MSIE') !== -1 || navigator.appVersion.indexOf('Trident/') > 0;
        var sectionTopHeight = $(".section--top").height();
        if($("#secondary-nav").length==1){
            var secondaryNav = $(".secondary-nav");
            var secondaryNavHeight = $(".secondary-nav").height();
            var offset = $("#secondary-nav").offset().top;
            $(window).resize(function(){
                offset = $("#secondary-nav").offset().top;
            });
            $(window).scroll(function() {
                var scroll = $(window).scrollTop();
                secondaryNav.toggleClass("not--over-header",scroll >= (offset-60));
            });
        }
        else{
            var position = $(window).scrollTop();
            $(window).scroll(function() {
              var scroll = $(window).scrollTop();
              var header = $("#header--bar");
                if (scroll < sectionTopHeight) {
                    header.removeClass("header--hidden not--over-header");
              } else {
                if(isInternetExplorer){
                    header.addClass("not--over-header");
                }
                else{
                    header.toggleClass("header--hidden",scroll > position && header.hasClass("not--over-header"));
                    header.toggleClass("not--over-header",scroll < position);
                }
              }
              position = scroll;
                
            });
        }
    $(document).click(function(event) { 
        if(event.target.id!='responsive-menu'&& event.target.id!='open-menu' && event.target.id!='open-menu-icon') {
            $("#responsive-menu").removeClass("active"); 
        }        
    })
    $("#open-menu").click(function(e){
        e.preventDefault();
        $("#responsive-menu").addClass("active");
    });
    $("#close-menu").click(function(){
        $("#responsive-menu").removeClass("active"); 
    });

    bindFormSubmit($("#form--footer"),1);
    bindFormEvents($("#form--footer"),1);
    bindsForms();
    
    /*Home*/
    $(".client").click(function(){
        var parent = $(this).parent(); 
        if(!parent.hasClass('active')){
            $(".client").parent().removeClass('active');
            var parentClass = parent.attr('class');
            $(".testimonials h4").removeClass('active');
            $("h4."+parentClass).addClass('active');
            parent.addClass('active');
        }
    });

    /*Resources*/
    if($(".section-header--resources").length==1)bindResources();
    
    /*Subnav*/
    var height = $(".section--top").height();
    $(".section-header nav a").click(function(e){ 
        var data = { lastUrl : 'id'};
        var link = $(this).attr("href");
        if($(".overlay").length == 0){
            var overlay = $("<div></div>",{'class':"overlay"});
            $(".main-container").append(overlay);
        }
        else
            $(".overlay").removeClass("fade");
            
        $("html,body").animate({
            scrollTop : height - 100
        },500);    
        loadData($(this),link);
        history.pushState(data,null,link);
        e.preventDefault();
    });
    window.addEventListener('popstate', function(e) {
        if(location.hash == ""){
            var element = $(".section-header nav a[href='"+location.href+"']");
            loadData($(element),location.href);
        }
    });
    /*Contact*/
    $(".select-option").click(function(){
        $(".input--holder").removeClass("error");
    });
    var heightContact = $(".contact .wrapper").first().outerHeight();
    $(".contact--general label:not([for='support'])").click(function(){
        setTimeout(function(){
            $("html,body").animate({
                scrollTop : heightContact+height - 100
            },500);
        },1); 
    });
    $(".contact--options label,.contact--general label[for='support']").click(function(){
        setTimeout(function(){
            $("html,body").animate({
                scrollTop : $(".contact--form").offset().top - 80
            },500);
        },1); 
    });
});