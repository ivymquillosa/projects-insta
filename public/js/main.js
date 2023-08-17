$(document).ready(function () {
  // initialize materialize-css
  M.AutoInit()

  // hide preloader when page is loaded
  $('.preloader').addClass('done')

  // scrollspy navigation
  scrollSpy()

  $('.slider').slick({
    arrows: false,
    dots: true,
    pauseOnHover: true,
    swipeToSlide: true,
    autoplay: true,
    autoplaySpeed: 10000
  })

  // chart
  initChart()

  // menu jump
  $('.scrollspy').click(function (e) {
    e.preventDefault()
    var target = '#' + $(this).data('scrollspy')
    $target = $(target)
    var n = (target != '#index-banner') ? 40 : 63.99
    // 
    $('html, body').animate({
      scrollTop: ($target.offset().top - n)
    }, 1000, function () {
      // Callback after animation
      // Must change focus!
      // $target.focus()
      // if ($target.is(":focus")) { // Checking if the target was focused
      //  return false
      // } else {
      //  $target.attr('tabindex','-1'); // Adding tabindex for elements not focusable
      //  $target.focus(); // Set focus again
      // };
    });
  })

  //--Getstarted Close button
  $(".form-close.modal-close").on('click', function(){
    $(".form-reset").trigger('click')
    $('.form__getstarted').removeClass('done')
    $('#modalGetStarted').removeClass('done')
    $('.form-submit').removeClass('disabled')
  })

  $('#form_phone_number').formatter({
    'pattern': '({{999}}) {{999}}-{{9999}}',
    'persistent': false
  });


  // inview animation
  $('.anim').on('inview', function (event, isInView) {
    var element = $(this)
    var delay = element.attr("data-delay")
    var duration = element.attr("data-duration")
    var animEnd = 'webkitAnimationEnd mozAnimationEnd MSAnimationEnd oanimationend animationend';
    var animation = ''
    var animControl = {
      animationDuration: duration,
      animationDelay: delay
    };

    animation = ' animated ' + element.attr("data-anim")
    if (isInView) {
      if (!element.hasClass(animation)) {
        element.css(animControl)
        element.addClass(animation)
      }
    } else {
      if (element.hasClass('reanim')) {
        element.removeClass(animation)
      }
    }
  });

  $('.pricingChart').on('inview', function (ev, isInView) {
    if (isInView) {
      $(this).addClass('animate')
    } else {
      $(this).removeClass('animate')
    }
  })

  // device box animation
  $('.device__box').on('mouseenter', function (ev) {
    $(this).addClass('hover')
  }).on('mouseleave', function (ev) {
    $(this).removeClass('hover')
  })
  $('.device__box--warranty').on('mouseenter', function (ev) {
    $(this).addClass('hover')
  }).on('mouseleave', function (ev) {
    $(this).removeClass('hover')
  })


  // get started form
  initSignupForm()
  $('.form-submit').on('click', function (e) {
    $('.form__getstarted').submit()
    // $('.form__getstarted').addClass('done')
    // $('#modalGetStarted').addClass('done')
  })
  $('.form-resubmit').on('click', function (e) {
    $('.form__getstarted').removeClass('done')
    $('#modalGetStarted').removeClass('done')
  })

  $('.footer__content_left_btn').on('click', function (e) {
    // M.toast({ html: ""})

    // var sg = require('sendgrid')(process.env.SENDGRID_API_KEY);
    // var request = sg.emptyRequest({
    //   method: 'POST',
    //   path: '/v3/mail/send',
    //   body: {
    //     personalizations: [
    //       {
    //         to: [
    //           {
    //             email: 'test@example.com'
    //           }
    //         ],
    //         subject: 'Sending with SendGrid is Fun'
    //       }
    //     ],
    //     from: {
    //       email: 'test@example.com'
    //     },
    //     content: [
    //       {
    //         type: 'text/plain',
    //         value: 'and easy to do anywhere, even with Node.js'
    //       }
    //     ]
    //   }
    // });
  })

  // antimoderate
  antimoderate_images = document.querySelectorAll('.antimoderate')
  $('.antimoderate-bg').each(function (e, i) {
    var _this = $(this)
    _this.css('background-image', 'url(' + _this.attr('data-ldsrc') + ')')
  });
  $('.antimoderate').each(function (i) {
    // 
    var temp_img = $(this)

    $(temp_img).on('inview', function (ev, isInView) {
      if (isInView) {
        preloadImage(temp_img, i)
      }
    })
  });

  // form
  $('.form-cancel, .form-submit').on('click', function (ev) {
    ev.preventDefault()
  })

  // back to top
  $('.backtop').on('click', function (ev) {
    ev.preventDefault()

    $([document.documentElement, document.body]).animate({
      scrollTop: $("#app-container").offset().top
    }, 600);
  })

});

$(window).scroll(function (e) {
  scrollSpy();
});

if ($('.main__nav')) {
  $('.main__nav .main__nav--toggle').on('click', function (ev) {
    ev.preventDefault();

    $('.main__nav').toggleClass('show');
  })
}


// SCROLLSPY
var scrollSpy = function () {
  var top = $(window).scrollTop();
  // highlight navigation if section is in view
  $('.scrollspy').removeClass('active')
  var n = $('html').hasClass('page-scroll') ? 41 : 63.99
  $('.section').each(function (i, e) {
    var $section = $(this)
    var start = $(this).offset().top - n
    var limit = $(this).offset().top + ($(this).height() - n)
    var $nav = $('.scrollspy[data-scrollspy=' + $(this).attr('id') + ']')
    // 
    if (top >= start && top <= limit) {
      if (!$nav.hasClass('active')) {
        $nav.addClass('active')
      }
    }
  })

  // main navigation scroll event
  if (top >= 50) {
    $('body').addClass('pagescroll')
  } else {
    $('body').removeClass('pagescroll')
  }
}

var companies = []
var devices = []
var initChart = function () {

  $.getJSON('/chart_data.json', function (data) {

    // devices
    $.each(data.devices, function (key, val) {
      var image = "<div class='pricingChart__devices__image'><div style='background-image:url(" + val.file + ");'></div></div>"
      var tooltip = "<div class='pricingChart__devices__tooltip'><h2>" + val.title + "</h2><h3>" + val.subtitle + "</h3></div>"
      devices.push("<li class='pricingChart__devices__listItem" + (val.default ? " active" : "") + "' data-chartID='" + val.id + "'>" + image + tooltip + "</li>")


      // display default graph
      if (val.default) {
        getGraph(val.prices, data)
        // set graph title
        $('.pricingChart__titleGroup h2').html(val.title)
        $('.pricingChart__titleGroup h3.dynamic--en').html(val.subtitle.en)
        $('.pricingChart__titleGroup h3.dynamic--ja').html(val.subtitle.ja)
      }
    })
    $("<ul/>", {
      "class": "pricingChart__devices__list",
      html: devices.join("")
    }).appendTo('.pricingChart__devices')
      .ready(function () {
        // events
        $('.pricingChart__devices__image').each(function (i, e) {
          $(this).on('mouseenter', function (e) {
            $('.pricingChart__devices__listItem').removeClass('active')
            $(this).closest('.pricingChart__devices__listItem').addClass('active')
            var chartID = $(this).closest('.pricingChart__devices__listItem').attr('data-chartID')
            getGraph(data.devices[chartID].prices, data)
            // 

            // set graph title
            $('.pricingChart__titleGroup h2').html(data.devices[chartID].title)
            $('.pricingChart__titleGroup h3').html(data.devices[chartID].subtitle)
          })
        })
      })
  })
}

// CUSTOM GRAPH
var getGraph = function (obj, data) {
  $('.pricingChart__graph').empty()
  $('.pricingChart__legend').empty()
  var legends = []
  var graph = []
  var priceArray = []

  // get min and max price
  $.each(obj, function (company, companyData) {
    priceArray.push(companyData.price)
  })
  var minPrice = 0 // always zero
  var maxPrice = Math.max.apply('null', priceArray)


  $.each(obj, function (company, companyData) {
    var tcompany = data.company[company]

    var price = String(companyData.price).indexOf('.') !== -1 ? String(companyData.price).split('.')[0] : companyData.price
    var decimal = String(companyData.price).indexOf('.') !== -1 ? String(companyData.price).split('.')[1] : null

    // get chart height
    var chartHeight = $('.pricingChart__graph').height() - 80

    // 

    var bubble = "<div class='pricingChart__graph__item__bubble' style='background-color:" + tcompany.bgcolor + "; color:" + tcompany.textcolor + ";'><div class='text__money'><span class='text__money--symbol'>" + companyData.symbol + "</span><span class='text__money--amount'>" + (price ? price : '') + "</span><span class='text__money--decimal'>" + (decimal ? '.' + decimal : '') + "</span></div></div>"
    var percentageValue = Math.round((companyData.price - 0) / maxPrice * 100)
    var calculatedHeight = (percentageValue / 100 * (chartHeight - 80)) - 45
    // 
    var line = "<div class='pricingChart__graph__item__line' style='height:" + calculatedHeight + "px;'></div>"
    var label = "<div class='pricingChart__graph__item__label'><span class='label'>" + (!data.company[company].uselogo ? "<div class='pricingChart__graph__item__label--title'>" : "") + data.company[company].label + (!data.company[company].uselogo != 0 ? "</div>" : "") + "<div class='pricingChart__graph__item__label--subtitle'>" + companyData.deductible + "</div></span></div>"
    graph.push("<div class='pricingChart__graph__item'>" + bubble + line + label + "</div>")
  })

  // round of max to nearest 100s
  maxPrice = roundHundred(maxPrice) + 100;
  var rangeMax = maxPrice / 5
  // create price range
  for (var i = 0; i != 5; i++) {
    var val = i * rangeMax
    legends.push("<li class='pricingChart__legend__listItem'>$" + val + "</li>")
  }
  // push maxprice
  legends.push("<li class='pricingChart__legend__listItem'>$" + maxPrice + "</li>")
  // generate legends DOM
  $("<ul/>", {
    "class": "pricingChart__legend__list",
    html: legends.join("")
  }).appendTo('.pricingChart__legend')


  // generate graph DOM 
  $("<div/>", {
    "class": "pricingChart__graph__list",
    html: graph.join("")
  }).appendTo('.pricingChart__graph')
}

function roundHundred(value) {
  return Math.round(value / 100) * 100
}

// FORMS
var initSignupForm = function () {
  // 

  $('.form-reset').on('click', function (ev) {
    ev.preventDefault()

    $('.input-field').each(function (i, e) {
      var $fieldset = $(this)

      $fieldset.removeClass('prefix active').find('label').removeClass('active')

      var $field = $fieldset.find('.input')

      $field.removeClass('valid invalid').blur()

      if ($field.attr('type') == 'checkbox') {
        $field.prop('checked', false)
      } else {
        $field.val('')
      }
    })

    $('.input-field').removeClass('prefix active').find('label').removeClass('active')
  })
  var form = $('.formjs'),
    messagebox = form.find('.form__message'),
    current = 0

  form.submit(function (ev) {
    // 
    ev.preventDefault()

    var error_msg = ''

    form.addClass('process')
    $('.form-submit').addClass('disabled')

    var form_first_name = $('#form_first_name').val()
    if ((form_first_name.charAt(0) == " ")) {
      var new_val = $('#form_first_name').val().replace(/^\s+|\s+$/g, "")
      $('#form_first_name').val(new_val)
    }

    var form_last_name = $('#form_last_name').val();
    if ((form_last_name.charAt(0) == " ")) {
      var new_val = $('#form_last_name').val().replace(/^\s+|\s+$/g, "")
      $('#form_last_name').val(new_val)
    }

    var form_company_name = $('#form_company_name').val()
    if ((form_company_name.charAt(0) == " ")) {
      var new_val = $('#form_company_name').val().replace(/^\s+|\s+$/g, "")
      $('#form_company_name').val(new_val)
    }

    // validate form fields
    var err_count = 0
    var tot_field = form.find('.validate').length

    form.find('.validate').each(function (i, e) {
      var $input = $(e)
      // 

      if ($input.val().length === 0 || !$input.val()) {
        if ($input.attr('required') && $input.attr('required').length != 0) {
          err_count++
          form.removeClass('process')

          // 
          $input.focus()
          $input.addClass('has-error')

          error_msg += '<p>' + $input.attr('data-placeholder') + ' </p>'

          return false
        }
      } else {
        if ($input.data('inputtype') == 'alphanumeric') {
          if ($input.val().length < 3) {
            // 
            err_count++
            $input.focus()
            $input.addClass('has-error')

            error_msg += '<p>' + $input.attr('data-placeholder') + ' : Should be at least 3 characters long.</p>'

            return false
          }
          else if (!isValidString($input.val())) {
            // 
            err_count++
            $input.focus()
            $input.addClass('has-error')

            error_msg += '<p>' + $input.attr('data-placeholder') + ' : Use alphabets and numbers only. (No special characters)</p>'

            return false
          }
          else if (($input.val().charAt(0) == " ")) {
            // 
            err_count++
            $input.focus()
            $input.addClass('has-error')

            error_msg += '<p>' + $input.attr('data-placeholder') + ' : Invalid first character found.</p>'

            return false
          }
        }
        else if ($input.data('inputtype') == 'alphabet') {
          if ($input.val().length < 3) {
            // 
            err_count++
            $input.focus()
            $input.addClass('has-error')

            error_msg += '<p>' + $input.attr('data-placeholder') + ' : Should be at least 3 characters long.</p>'

            return false
          }
          else if (!isValidName($input.val())) {
            // 
            err_count++
            $input.focus()
            $input.addClass('has-error')

            error_msg += '<p>' + $input.attr('data-placeholder') + ' : Use alphabets only.</p>'

            return false
          }
        }
        else if ($input.data('inputtype') == 'numeric') {
          if ($input.hasClass('input-zipcode') && $input.val().length != 5) {
            // 
            err_count++
            $input.focus()
            $input.addClass('has-error')

            error_msg += '<p>' + $input.attr('data-placeholder') + ' : Invalid ZIP code</p>'

            return false
          }
        }
        else if ($input.data('inputtype') == 'phone') {
          if ($input.val().length != 14) {
            // 
            err_count++
            $input.focus()
            $input.addClass('has-error')

            error_msg += '<p>' + $input.attr('data-placeholder') + ' : Invalid PHONE number</p>'

            return false
          }
          else if (!isValidPhone($input.val())) {
            // 
            err_count++
            $input.focus()
            $input.addClass('has-error')

            error_msg += '<p>' + $input.attr('data-placeholder') + ' : Invalid PHONE number</p>'

            return false
          }
        }
        else if ($input.data('inputtype') == 'email') {
          if (!isValidEmailAddress($input.val())) {
            // 
            err_count++
            $input.focus()
            $input.addClass('has-error')

            error_msg += '<p>' + $input.attr('data-placeholder') + ' : Invalid EMAIL address</p>'

            return false
          }
        }
        else if ($input.data('inputtype') == 'state') {
          if ($input.val().length < 2) {
            // 
            err_count++
            $input.focus()
            $input.addClass('has-error')

            error_msg += '<p>' + $input.attr('data-placeholder') + ' : Should be at least 2 characters long. </p>'

            return false
          }
        }
      }
    })

    if (err_count > 0) {
      // toastbox_showmsg(error_msg);
      M.toast({ html: error_msg })
      form.removeClass('process')
      $('.form-submit').removeClass('disabled')
    } else {

      // var name=$('#signup_first_name').val().split(' ');
      // var fn,ln
      var formObject = {}
      formObject.lead_source = "Site Registration";
      formObject.recipient_name = $('#form_targetname').val()
      formObject.recipient_email = $('#form_targetemail').val()
      formObject.form_emailtitle = $('#form_emailtitle').val()
      formObject.first_name = $('#form_first_name').val()
      formObject.last_name = $('#form_last_name').val()
      formObject.company = $('#form_company_name').val()
      formObject.email = $('#form_email_address').val()
      formObject.phone = $('#form_phone_number').val()
      formObject.message = $('#form_message').val()

      // request sendEmail
      $.ajax({
        type: 'POST',
        url: '/sendEmail',
        data: formObject,
        error: function (err) {
          var data = require('../../translation.json')
          var lang =  window.location.pathname.split('/')[1]
          console.log('data: ', window.location.pathname.split('/'))
          var msg = "<p>Could not connect to the registration server. Please try again later.</p>"
          var email_err_msg ="<p> " + data.err_txt_email_address_sendapi[lang] + " </p>"
          // M.toast({ html: err.responseJSON.response.body.errors[0].message })
          M.toast({ html: email_err_msg })
          
          
          form.removeClass('process')
          $('.form-submit').removeClass('disabled')
        },
        success: function (data) {
          // 
          // form.removeClass('process');
          // form.addClass('done');
          $('.form__getstarted').removeClass('process')
          $('.form__getstarted').addClass('done')
          $('#modalGetStarted').addClass('done')
        }
      })//end ajax
    }
  })
}

function isValidEmailAddress(emailAddress) {
  var pattern = new RegExp(/^(("[\w-+\s]+")|([\w-+]+(?:\.[\w-+]+)*)|("[\w-+\s]+")([\w-+]+(?:\.[\w-+]+)*))(@((?:[\w-+]+\.)*\w[\w-+]{0,66})\.([a-z]{2,6}(?:\.[a-z]{2})?)$)|(@\[?((25[0-5]\.|2[0-4][\d]\.|1[\d]{2}\.|[\d]{1,2}\.))((25[0-5]|2[0-4][\d]|1[\d]{2}|[\d]{1,2})\.){2}(25[0-5]|2[0-4][\d]|1[\d]{2}|[\d]{1,2})\]?$)/i)
  return pattern.test(emailAddress)
}

function isValidPhone(phone) {
  var pattern = new RegExp(/([0-9]{10})|(\([0-9]{3}\)\s+[0-9]{3}\-[0-9]{4})/)
  return pattern.test(phone)
}

function isValidPhonePh(phone) {
  var pattern = new RegExp(/([0-9]{11})|(\([0-9]{4}\)\s+[0-9]{3}\-[0-9]{4})/)
  return pattern.test(phone)
}

function isValidString(str) {
  return !/[~`!#$%\^&*+=\-\[\]\\';,/{}|\\":<>\?]/g.test(str)
}

function isValidName(str) {
  return /^[a-zA-Z() ]+$/.test(str)
}


/* TOASTBOX LIBRARY */
var toastbox_timeout = 0
var toastbox_delay = 10
var toastbox_init = function () {
  if ($('.toastbox').length > 0) {
    $('.toastbox-close').click(function (e) {
      e.preventDefault()
      toastbox_close()
    })
  }
},
  toastbox_close = function () {
    clearTimeout(toastbox_timeout);
    $('.toastbox').removeClass('display')
  },
  toastbox_showmsg = function (msg) {
    $('.toastbox .toastbox-content').html(msg);
    $('.toastbox').addClass('display')

    // 
    clearTimeout(toastbox_timeout)
    toastbox_timeout = setTimeout(function () {
      $('.toastbox').removeClass('display')
    }, (toastbox_delay * 1000))
  };
toastbox_init()


// ANTIMODERATE
// ====================================
var images_loaded = 0
var antimoderate_images = []
var images_interval = []

function preloadImage(i, n) {
  // 
  var img = $('<img class="antimoderate-hd" />').attr('src', i.attr('data-hdsrc'))
    .on('load', function () {
      if (!this.complete || typeof this.naturalWidth == "undefined" || this.naturalWidth == 0) {
        // 
      } else {
        images_loaded++
        // 

        if (!$(i).hasClass('converting')) {
          $(i).addClass('converting')
          // check if image is used as background
          if ($(i).hasClass('antimoderate-bg')) {
            var newBg = '<div id="antimoderate_' + n + '" class="antimoderate-bghd animated fadeIn ' + ($(i).attr('classnames') ? $(i).attr('classnames') : "") + '" style="background-image:url(' + i.attr('data-hdsrc') + ');"></div>'
            $(i).parent().append(newBg)
            // make original background float in front of the hd background
            $(i).addClass('antimoderate--float animated fadeOut delay1500')

            // if image is a normal image block
          } else {
            // add a wrapper
            $(i).wrap(function () {
              return '<div id="antimoderate_' + n + '" class="antimoderate-wrapper' + ($(i).attr('classnames') ? $(i).attr('classnames') : "") + '"></div>'
            })
            $(i).parent().append(img)
            // make original image float infront of the hd image
            $(i).addClass('antimoderate--float animated fadeOut delay1500')
            // animate the new image to fade in
            $(img).addClass('animated fadeIn')
            $(img).attr('alt', 'Instaprotek App Register Product page displaying on Smartphones screen')
          }
        }


        // timeout to delete the original image
        images_interval[n] = setTimeout(function () {
        }, 3000)
      }
    })
}


// FAQ
$('.faq__list__item--question').click(function (e) {
  e.preventDefault();
  $(this).closest('.faq__list__item').toggleClass('open');
})

$('.faq__search__clear, .noresultsfoundclear').click(function (e) {
  e.preventDefault();
  $('.faq__search__input').val('').keyup();
})

$('.faq__search__input').on('keyup', function (e) {
  var value = $(this).val().toLowerCase();
  if (value.length > 0) {
    $('.faq__search').addClass('hasValue')
  } else {
    $('.faq__search').removeClass('hasValue')
  }
  $(".faq__list__item").filter(function () {
    $(this).toggle($(this).text().toLowerCase().indexOf(value) > -1)
    // var $listItem = $(this)
    // if ($listItem.text().toLowerCase().indexOf(value) > -1) {
    //   $listItem.addClass('hidden')
    // } else {
    //   $listItem.removeClass('hidden')
    // }
  });

  // check if faq group is empty, show empty notification
  $('.faq__list').each(function (i, e) {
    var $list = $(this);
    var count = 0;
    var total = $list.find('li').length;
    $(this).find('li').each(function (i, e) {
      var $item = $(this);
      if ($item.attr('style')) count++;
    })

    if (count === total) {
      $list.closest('.faq__group').addClass('empty');
    } else {
      $list.closest('.faq__group').removeClass('empty');
    }
  })

  var grouptotal = $('.faq__group').length;
  var groupcount = 0;
  $('.faq__group').each(function (i, e) {
    if ($(this).hasClass('empty')) {
      groupcount = groupcount + 1;
    } else {
      groupcount = groupcount - 1;
    }
  })

  if (grouptotal === groupcount) {
    $('.faq__page').addClass('empty');
  } else {
    $('.faq__page').removeClass('empty');
  }
})

// $("#spain").click(function(e){
//   e.preventDefault()
   
//   $('.lang__france').removeClass('showflag')
//   $('.lang__canada').removeClass('showflag')
//   $('.lang__spain').addClass('showflag')
//   $('.lang__japan').removeClass('showflag')
//   $('.lang__icon').addClass('hideicon')
// })

// $("#france").click(function(e){
//   e.preventDefault()
   
//   $('.lang__spain').removeClass('showflag')
//   $('.lang__canada').removeClass('showflag')
//   $('.lang__france').addClass('showflag')
//   $('.lang__japan').removeClass('showflag')
//   $('.lang__icon').addClass('hideicon')
// })

// $("#canada").click(function(e){
//   e.preventDefault()
   
//   $('.lang__spain').removeClass('showflag')
//   $('.lang__france').removeClass('showflag')
//   $('.lang__canada').addClass('showflag')
//   $('.lang__japan').removeClass('showflag')
//   $('.lang__icon').addClass('hideicon')
// })

// $("#japan").click(function(e){
//   e.preventDefault()
   
//   $('.lang__spain').removeClass('showflag')
//   $('.lang__france').removeClass('showflag')
//   $('.lang__canada').removeClass('showflag')
//   $('.lang__japan').addClass('showflag')
//   $('.lang__icon').addClass('hideicon')
// })


window.addEventListener("scroll", function (e) {
  if (window.pageYOffset > 2800) {
    document.querySelector(".section__four").classList.add("margin-hero");
  }
  else {
    document.querySelector(".section__four").classList.remove("margin-hero");
  }

});