var express = require('express')
var router = express.Router()

var email = require('emailjs')
var mailcomposer = require('mailcomposer')
var fs = require('fs')
var async = require('async')
var _ = require('underscore')
var winston = require('winston')
var util = require('util')
var nconf = require('nconf')
var path = require('path')
const data = require('../translation.json')
var request = require('request')
var moment = require('moment')
// save to zoho
var zoho = require('./zoho')
var chroma = require('chroma-js')
var sortBy = require('lodash/sortBy')

const getTranslation = (key, lang) => {
  return data[key]
    ? data[key][lang] || data[key]['en']
    : key
}

const formatNumber = (numberString) => {
  return Number(numberString).toLocaleString("en-US");
}

const numberToWord = (number) => {
  const numberWords = {
    '1' : 'one',
    '2' : 'two',
    '3' : 'three',
    '4' : 'four',
    '5' : 'five',
  };

  return numberWords[`${number.toString()}`];
  
}

const formatDateTimezone = (dateString, format = 'MM/DD/YYYY', timeZone) => {
  if (!dateString) {
    return ''
  }

  const date = moment(dateString)

  if (!date._isValid) {   //eslint-disable-line
    return 'N/A'
  }
  // check if timeZone is available
  if (timeZone) {
    return moment(new Date(dateString).toLocaleString('en', { timeZone })).format(format)
  }

  return date.format(format)
}

/* GET home page. */
router.get('/', function (req, res) {
  const langIndex = req.rawHeaders.indexOf('Accept-Language')
  const langIndex2 = req.rawHeaders.indexOf('accept-language')
  const lang = req.rawHeaders[langIndex + 1].split(',')[0]
  const lang2 = req.rawHeaders[langIndex2 + 1].split(',')[0]
  console.log('===================lang===================', lang)
  if (
    lang === 'en' ||
    lang === 'en-CA' ||
    lang2 === 'en' ||
    lang2 === 'en-CA'
  ) {
    res.redirect('/en')
  } else if (lang === 'ja' || lang2 === 'ja') {
    res.redirect('/ja')
  } else if (lang === 'fr' || lang2 === 'fr') {
    res.redirect('/fr')
  } else {
    res.redirect('/en')
  }
})

router.get('/a1/app', function (req, res) {
  res.render('../views/download', { title: 'Downloaad instaprotek app' })
})
router.get('/a2/app', function (req, res) {
  res.render('../views/download2', { title: 'Download instaprotek app' })
})
router.get('/a3/app', function (req, res) {
  res.render('../views/download3', { title: 'Download instaprotek app' })
})
router.get('/a4/app', function (req, res) {
  res.render('../views/download4', { title: 'Download instaprotek app' })
})
router.get('/a5/app', function (req, res) {
  res.render('../views/downloadtech21', { title: 'Download instaprotek app' })
})
router.get('/otterprotect/app', function (req, res) {
  res.render('../views/download6', { title: 'Download instaprotek app' })
})
router.get('/otterprotect/error', function (req, res) {
  const lang = req.query.lang || req.query.language_code || 'en'
  const params = {}
  params.getTranslation = getTranslation
  params.message = getTranslation('lbl_barcode_does_not_exist', lang)
  res.render('../views/en/product_error_otterbox', params)
})
router.get('/a20/app', function (req, res) {
  res.render('../views/download5', { title: 'Download instaprotek app' })
})
router.get('/a35/app', function (req, res) {
  res.render('../views/downloadmysimpleus', {
    title: 'Download instaprotek app',
  })
})
router.get('/a54/app', function (req, res) {
  res.render('../views/powerlab', { title: 'Download instaprotek app' })
})
router.get('/privacy', function (req, res) {
  const langIndex = req.rawHeaders.indexOf('Accept-Language')
  const langIndex2 = req.rawHeaders.indexOf('accept-language')
  const lang = req.rawHeaders[langIndex + 1].split(',')[0]
  const lang2 = req.rawHeaders[langIndex2 + 1].split(',')[0]
  console.log('===================lang===================', lang)
  if (
    lang === 'en' ||
    lang === 'en-CA' ||
    lang2 === 'en' ||
    lang2 === 'en-CA'
  ) {
    res.redirect('/en/privacy')
  } else if (lang === 'ja' || lang2 === 'ja') {
    res.redirect('/ja/privacy')
  } else if (lang === 'fr' || lang2 === 'fr') {
    res.redirect('/fr/privacy')
  } else {
    res.redirect('/en/privacy')
  }
})
router.get('/terms', function (req, res) {
  const langIndex = req.rawHeaders.indexOf('Accept-Language')
  const langIndex2 = req.rawHeaders.indexOf('accept-language')
  const lang = req.rawHeaders[langIndex + 1].split(',')[0]
  const lang2 = req.rawHeaders[langIndex2 + 1].split(',')[0]
  console.log('===================lang===================', lang)
  if (
    lang === 'en' ||
    lang === 'en-CA' ||
    lang2 === 'en' ||
    lang2 === 'en-CA'
  ) {
    res.redirect('/en/terms')
  } else if (lang === 'ja' || lang2 === 'ja') {
    res.redirect('/ja/terms')
  } else if (lang === 'fr' || lang2 === 'fr') {
    res.redirect('/fr/terms')
  } else {
    res.redirect('/en/terms')
  }
})
router.get('/contact', function (req, res) {
  const langIndex = req.rawHeaders.indexOf('Accept-Language')
  const langIndex2 = req.rawHeaders.indexOf('accept-language')
  const lang = req.rawHeaders[langIndex + 1].split(',')[0]
  const lang2 = req.rawHeaders[langIndex2 + 1].split(',')[0]
  console.log('===================lang===================', lang)
  if (
    lang === 'en' ||
    lang === 'en-CA' ||
    lang2 === 'en' ||
    lang2 === 'en-CA'
  ) {
    res.redirect('/en/contact')
  } else if (lang === 'ja' || lang2 === 'ja') {
    res.redirect('/ja/contact')
  } else if (lang === 'fr' || lang2 === 'fr') {
    res.redirect('/fr/contact')
  } else {
    res.redirect('/en/contact')
  }
})
router.get('/contactus', function (req, res) {
  res.render('../views/contact', { title: 'Contact Us' })
})
router.get('/support', function (req, res) {
  const langIndex = req.rawHeaders.indexOf('Accept-Language')
  const langIndex2 = req.rawHeaders.indexOf('accept-language')
  const lang = req.rawHeaders[langIndex + 1].split(',')[0]
  const lang2 = req.rawHeaders[langIndex2 + 1].split(',')[0]
  console.log('===================lang===================', lang)
  if (
    lang === 'en' ||
    lang === 'en-CA' ||
    lang2 === 'en' ||
    lang2 === 'en-CA'
  ) {
    res.redirect('/en/support')
  } else if (lang === 'ja' || lang2 === 'ja') {
    res.redirect('/ja/support')
  } else if (lang === 'fr' || lang2 === 'fr') {
    res.redirect('/fr/support')
  } else {
    res.redirect('/en/support')
  }
})

router.get('/validate-otp', function (req, res) {
  res.render('../views/set-reset-password', { data })
})

router.get('/self-service-claim', function (req, res) {
  res.render('../views/self-service-claim',{ data })
})

router.get('/product/reviews', function (req, res) {
  const isOtter = req.query.app === 'otterprotect'

  const api = isOtter ? nconf.get('API_OTTERBOX') : nconf.get('API')
  const uploadApi = isOtter ? nconf.get('UPLOAD_API_OTTERBOX') : nconf.get('UPLOAD_API')
  const username = nconf.get('API_USERNAME')
  const password = nconf.get('API_PASSWORD')

  const { filter } = req.query;

  const barcode = req.query.barcode
  const page = req.query.page
  const requestUrl = `${api}/product/${barcode}/review`
  const perPage = 5
  const requestBody = {
    start: perPage * (page - 1),
    limit: perPage,
    sort_column: 'created_date',
    sort_direction: 'desc'
  }
  
  if(filter){
    requestBody.filter = filter;
  }
  
  request.post(requestUrl, {
    body: requestBody,
    auth: {
      user: username,
      pass: password
    },
    headers: {
      'content-type': 'application/json'
    },
    json: true
  }, function(error, response, body) {
    if (error) {
      console.log('error: ', error)
    }
    if (response.statusCode === 200) {
      console.log(body)
      // format customer reviews
      body.image_path = `${uploadApi}/file?path=${body.file_path}`
      body.product_reviews.data = body.product_reviews.data.map(e => {
        e.formatted_name = `${e.customer_last_name}, ${e.customer_first_name[0]}.`
        e.formatted_date = formatDateTimezone(e.created_date, 'll', Intl.DateTimeFormat().resolvedOptions().timeZone)
        e.formatted_rating = [
          ...new Array(e.rating).fill('green_star'),
          ...new Array(5 - e.rating).fill('gray_star'),
        ]
        return e
      })

      return res.send(body.product_reviews)
      
      // res.json(body.product_reviews)
    }
  })
})

router.get('/product/app', function (req, res) {
  const isOtter = req.query.app === 'otterprotect'

  const api = isOtter ? nconf.get('API_OTTERBOX') : nconf.get('API')
  const uploadApi = isOtter ? nconf.get('UPLOAD_API_OTTERBOX') : nconf.get('UPLOAD_API')
  const username = nconf.get('API_USERNAME')
  const password = nconf.get('API_PASSWORD')

  const barcode = req.query.barcode
  const lang = req.query.lang || req.query.language_code || 'en'
  const requestUrl = `${api}/product/${barcode}/review`
  const perPage = 5
  const requestBody = {
    start: 0,
    limit: perPage,
    sort_column: 'created_date',
    sort_direction: 'desc'
  }

  request.post(requestUrl, {
    body: requestBody,
    auth: {
      user: username,
      pass: password
    },
    headers: {
      'content-type': 'application/json'
    },
    json: true
  }, function(error, response, body) {
    if (error) {
      console.log('error: ', error)
    }
    body.lang = lang
    body.getTranslation = getTranslation
    body.formatNumber = formatNumber
    body.numberToWord = numberToWord
    if (response.statusCode === 200) {
      console.log(body)
      // format customer reviews
      body.image_path = `${uploadApi}/file?path=${body.file_path}`
      body.product_reviews.data = body.product_reviews.data.map(e => {
        e.formatted_name = `${e.customer_last_name}, ${e.customer_first_name[0]}.`
        e.formatted_date = formatDateTimezone(e.created_date, 'll', Intl.DateTimeFormat().resolvedOptions().timeZone)
        e.formatted_rating = [
          ...new Array(e.rating).fill('green_star'),
          ...new Array(5 - e.rating).fill('gray_star'),
        ]
        return e
      })
      body.review_questions = (body.review_questions || []).map(review_question => {
        review_question.translated_title = review_question.title_translation[lang] || review_question.title_translation['en']
        review_question.options = sortBy(review_question.options, 'value')
        const option = review_question.options.find(e => {
          const max = e.value + .5
          const min = e.value - .5
          return review_question.avg_question_rating >= min && review_question.avg_question_rating <= max
        })

        review_question.maxOption = Math.max(...review_question.options.map(e => e.value))
        review_question.minOption = Math.min(...review_question.options.map(e => e.value))
        if (option) {
          review_question.translated_option = option.name_translation[lang] || option.name_translation['en'] 
        }

        if (!review_question.avg_question_rating) {
          const minOption = review_question.options.find(e => e.value === 1)
          review_question.translated_option = minOption.name_translation[lang] || minOption.name_translation['en'] 
        }

        const colors = review_question.options.map(e => e.color)
        const scale = chroma.scale(colors)
        const percentage = (review_question.avg_question_rating - 1) / (review_question.maxOption - 1)
        review_question.pointer_hex = scale(percentage).hex()
        return review_question
      })
      body.review_questions_string = JSON.stringify(body.review_questions)
      if (!body.is_product_review_allowed) {
        body.name = 'InstaProtek'
        
        body.hideIcon = true
        body.message = getTranslation('lbl_review_is_not_available_for_this_product', lang)
        body.noReview = true
        res.render(isOtter ? '../views/en/product_error_otterbox' : '../views/en/product_error', body)
      } else {
        res.render(isOtter ? '../views/en/product_otterbox' : '../views/en/product', body)
      }
    } else if (body.message) {
      if (body.message === 'Barcode does not exists.') {
        body.message = getTranslation('lbl_barcode_does_not_exist', lang)
      }
      res.render(isOtter ? '../views/en/product_error_otterbox' : '../views/en/product_error', body)
    }
  })
})

// router.get('/set-password', function (req, res) {
//   res.render('../views/setpassword', {data})
// })

router.get('/download-app', function (req, res) {
  // res.render('../views/resetpassword', {data})
  const langIndex = req.rawHeaders.indexOf('Accept-Language')
  const userAgentIndex = req.rawHeaders.indexOf('User-Agent')
  const langIndex2 = req.rawHeaders.indexOf('accept-language')
  const lang = req.rawHeaders[langIndex + 1].split(',')[0]
  const lang2 = req.rawHeaders[langIndex2 + 1].split(',')[0]
  console.log('===================lang===================', req.rawHeaders)
  if (
    lang === 'en' ||
    lang === 'en-CA' ||
    lang2 === 'en' ||
    lang2 === 'en-CA'
  ) {
    res.redirect('/en/download-app')
  } else if (lang === 'ja' || lang2 === 'ja') {
    res.redirect('/ja/download-app')
  } else if (lang === 'fr' || lang2 === 'fr') {
    res.redirect('/fr/download-app')
  } else {
    res.redirect('/en/download-app')
  }
})

router.get('/apple-app-site-association', function (req, res) {
  res.send({
    applinks: {
      apps: [],
      details: [
        {
          appID: '2BADYYK3A9.com.instaprotek.app',
          paths: ['*'],
        },
        {
          appID: 'CXUD7FAPBU.com.instaProtek.GearProtek',
          paths: ['*'],
        },
      ],
    },
  })
})

router.get('/download-app', function (req, res) {
  res.render('../views/en/en/download-app', { data })
})

router.get('/register', function (req, res) {
  res.redirect('https://register.instaprotek.com/login')
})
router.get('/cterms', function (req, res) {
  res.render('../views/cterms', {
    title: 'Terms and Conditions ',
    htmlClass: 'ctermsPage',
  })
})

// ======================
//      ENGLISH ROUTE
// ======================
router.get('/en', function (req, res) {
  res.render('../views/en/index', { data })
})
router.get('/en/support', function (req, res) {
  res.render('../views/en/support', { data })
})
router.get('/en/contact', function (req, res) {
  res.render('../views/en/contact', { data, title: data.title_contact_us.en })
})
router.get('/en/warranty', function (req, res) {
  res.render('../views/en/warranty', { data })
})
router.get('/en/privacy', function (req, res) {
  res.render('../views/en/privacy', { data, title: data.title_privacy.en })
})
router.get('/en/email-thankyou', function (req, res) {
  res.render('../views/en/email-thankyou',{ data })
})
router.get('/en/terms', function (req, res) {
  res.render('../views/en/terms', {
    data,
    title: data.title_terms.en,
    htmlClass: 'ctermsPage',
  })
})
router.get('/en/cterms', function (req, res) {
  res.render('../views/en/cterms', {
    data,
    title: data.title_terms.en,
    htmlClass: 'ctermsPage',
  })
})
router.get('/en/download-app', function (req, res) {
  res.render('../views/en/download-app', { data })
})

// ======================
//    JAPANESE ROUTE
// ======================
router.get('/ja', function (req, res) {
  res.render('../views/ja/index', { data })
})
router.get('/ja/support', function (req, res) {
  res.render('../views/ja/support', { data })
})
router.get('/ja/contact', function (req, res) {
  res.render('../views/ja/contact', { data, title: data.title_contact_us.ja })
})
// router.get('/ja/warranty', function (req, res) {
//   res.render('../views/ja/warranty', { data })
// })
router.get('/ja/privacy', function (req, res) {
  res.render('../views/ja/privacy', { data, title: data.title_privacy.ja })
})
router.get('/ja/terms', function (req, res) {
  res.render('../views/ja/terms', {
    data,
    title: data.title_terms.ja,
    htmlClass: 'ctermsPage',
  })
})
router.get('/ja/cterms', function (req, res) {
  res.render('../views/ja/cterms', {
    data,
    title: data.title_terms.ja,
    htmlClass: 'ctermsPage',
  })
})
router.get('/ja/download-app', function (req, res) {
  res.render('../views/en/download-app', { data })
})

// ======================
//    FRENCH ROUTE
// ======================
router.get('/fr', function (req, res) {
  res.render('../views/fr/index', { data })
})
router.get('/fr/support', function (req, res) {
  res.render('../views/fr/support', { data })
})
router.get('/fr/contact', function (req, res) {
  res.render('../views/fr/contact', { data, title: data.title_contact_us.fr })
})
router.get('/fr/warranty', function (req, res) {
  res.render('../views/fr/warranty', { data })
})
router.get('/fr/privacy', function (req, res) {
  res.render('../views/fr/privacy', { data, title: data.title_privacy.fr })
})
router.get('/fr/terms', function (req, res) {
  res.render('../views/fr/terms', {
    data,
    title: data.title_terms.fr,
    htmlClass: 'ctermsPage',
  })
})
router.get('/fr/cterms', function (req, res) {
  res.render('../views/fr/cterms', {
    data,
    title: data.title_terms.fr,
    htmlClass: 'ctermsPage',
  })
})
router.get('/fr/download-app', function (req, res) {
  res.render('../views/en/download-app', { data })
})

// **************** POST

// **************** CONTACT FORM

router.post('/sendEmail', function (req, res, next) {
  winston.info('Router - SendEmail [data: %s]', util.inspect(req.body))
  var sendgrid = require('sendgrid')(nconf.get('sendgrid_api_key'))
  var recipientEmail = req.body.recipient_email
  var recipientName = req.body.recipient_name
  var emailTitle = req.body.form_emailtitle
  var name = (req.body.first_name + ' ' + req.body.last_name).trim()
  var sales = {
    to: [{ name: recipientName, email: recipientEmail }],
    // to: [{ name: 'instaProtek Support CARLO', email: 'carlo@dnamicro.com' }], // for development purpose
    from: {
      email: req.body.email,
      name: name,
    },
    name: name,
    emailTitle: emailTitle,
  }

  sales = _.extend(sales, req.body)

  var user = {
    to: [{ name: name, email: req.body.email }],
    from: {
      name: recipientName,
      email: recipientEmail,
    },
    // for development purpose
    // from: {
    //  name: 'instaProtek Support CARLO',
    //  email: 'carlo@dnamicro.com'
    // },
    name: name,
    emailTitle: emailTitle,
  }

  async.waterfall(
    [
      // send email to sales,
      sendEmail.bind(
        null,
        path.join(process.cwd(), 'templates/email-contact.html'),
        sales
      ),
      // send email to user
      sendEmail.bind(
        null,
        path.join(process.cwd(), 'templates/email-thankyou.html'),
        user
      ),
    ],
    function (err, result) {
      if (err) return res.status(500).send(err)
      else return res.status(200).send({ success: true })
    }
  )

  // internal function
  function prepareEmail(file, params, callback) {
    winston.info(
      'prepareEmailBody [file: %s] [params: %s]',
      file,
      util.inspect(params)
    )
    fs.readFile(file, 'utf8', function (err, fileData) {
      if (err) {
        winston.error('prepareEmailBody [Error: %s]', util.inspect(err))
        return callback(err, null)
      } else {
        for (var key in params) {
          if (params.hasOwnProperty(key))
            fileData = fileData
              .replace('${' + key + '}', params[key])
              .replace('${' + key + '}', params[key])
        }
        return callback(null, fileData)
      }
    })
  }

  function sendEmail(file, data, callback) {
    prepareEmail(file, data, function (err, response) {
      var request = sendgrid.emptyRequest({
        method: 'POST',
        path: '/v3/mail/send',
        body: {
          personalizations: [
            {
              to: data.to,
              subject: data.emailTitle,
            },
          ],
          from: data.from,
          content: [
            {
              type: 'text/html',
              value: response,
            },
          ],
        },
      })

      sendgrid.API(request, function (err, response) {
        if (err) {
          winston.error('Router - SendEmail [Error: %s]', util.inspect(err))
          return callback(err, null)
        } else {
          winston.info(
            'Router - SendEmail [Email sent to %s]',
            data.to[0].email
          )
          return callback(null)
        }
      })
    })
  }
})

module.exports = router
