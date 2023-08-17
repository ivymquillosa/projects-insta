
    function displayImage(imgs) {
        var displayImg = document.getElementById("displayedImg");
        displayImg.src = imgs.src;
        displayImg.parentElement.style.display = "block";
      }
      $(document).ready(function(){
        var reviewsTotalCount = 0;
        var reviewsCount = 0;
        var expandDescription = document.querySelector(".readMore");
        var descriptionHeight = document.querySelector(".description");
        var seeAllReviews = document.querySelector(".reviews");
        // var allReviewsNavigator = document.querySelector(".overAll__totalCount--count");
        var shieldRating = document.querySelector(".shield--rating__img");
        var sheildRatingValue = document.querySelector("#shield--rating");
        const reviewFilter = document.querySelector('.review__filter--select');
        var descriptionContainer = document.querySelector(".descriptionContainer");
        var shieldValue = document.querySelector("#shield--rating");
        sampleComment = document.querySelector(".review__container")

        if(shieldValue){
          shieldValue.innerHTML = (parseFloat(shieldValue.innerHTML)).toFixed(1);
        }
        formatReviewQuestions()
        formatComments();
        
        if(expandDescription && $('.descriptionContainer').text().length < 100){
          expandDescription.style.display = 'none'
        }
        if (expandDescription && (descriptionHeight)) {
          expandDescription.onclick = function(){
              if(window.innerWidth <= 650){
                  if(descriptionHeight.style.height == "auto"){
                    descriptionHeight.style.height = "130px";
                    expandDescription.classList.remove("open");
                    expandDescription.innerHTML = localStorage.getItem('lbl_read_more');
                  }
                  else{
                    descriptionHeight.style.height = "auto";
                    expandDescription.classList.add("open");
                    expandDescription.innerHTML = localStorage.getItem('lbl_see_less');
                  }
              }
              else{
                if(descriptionHeight.style.height == "auto"){
                  descriptionHeight.style.height = "125px";
                  expandDescription.classList.remove("open");
                  expandDescription.innerHTML = localStorage.getItem('lbl_read_more');
                }
                else{
                  descriptionHeight.style.height = "auto";
                  expandDescription.classList.add("open");
                  expandDescription.innerHTML = localStorage.getItem('lbl_see_less');
                }
              }
          }
        }
        if (seeAllReviews) {
          seeAllReviews.onclick = onSeeAllReviews
        }
        if(reviewFilter){
          reviewFilter.onchange = changeFilter
        }
        if (shieldRating || sheildRatingValue){
          if(shieldRating){
            shieldRating.onclick = navigateToAllReviews
          }
          if(sheildRatingValue){
            sheildRatingValue.onclick = navigateToAllReviews
          }
        }
        
        //change the filter of reviews
        function changeFilter(){
          const reviewFilter = document.querySelector('.review__filter--select');
          const selected = reviewFilter.options[reviewFilter.selectedIndex].value;
          var seeAllReviewsContainer = document.querySelector(".seeAllReviews");
          var seeAllReviews = document.querySelector(".seeAllReviews a");
          if(seeAllReviewsContainer){
            seeAllReviewsContainer.style.display= 'block'
            seeAllReviewsContainer.style.pointerEvents= 'auto'
          }
          if(seeAllReviews){
            seeAllReviews.innerHTML = localStorage.getItem('lbl_see_all_reviews')
          }
          fetchData(selected,true)
        }

        // back button
        const backButton = document.querySelector('#back__button')
        backButton.addEventListener('click', function() {
          var userAgent = window.navigator.userAgent
          var isIos =/iPhone|iPad|iPod/i.test(userAgent)
			    var isAndoid = /Android/i.test(userAgent)
          if (isAndoid) {
            Android.onClicked()
          }
          if (isIos) {
            window.webkit.messageHandlers["scriptHandler"].postMessage("close_review");
          }
        })

        // done button
        const doneButton = document.querySelector('#done__button')
        doneButton.addEventListener('click', function() {
          var userAgent = window.navigator.userAgent
          var isIos =/iPhone|iPad|iPod/i.test(userAgent)
          if (isIos) {
            window.webkit.messageHandlers["scriptHandler"].postMessage("done_review");
          }
        })
      })
  
      $(document).on('touchmove', onScroll); // for mobile
      function onScroll(){
        if(($(window).scrollTop() > $(document).height() - $(window).height()-100) && shouldFetch()) {
          const reviewFilter = document.querySelector('.review__filter--select');
          const selected = reviewFilter.options[reviewFilter.selectedIndex].value;
          fetchData(selected);
        }
      }
      $(window).scroll(function(){
        var position = $(window).scrollTop();
        var bottom = $(document).height() - $(window).height();
        if( position == bottom && shouldFetch()){
          const reviewFilter = document.querySelector('.review__filter--select');
          const selected = reviewFilter.options[reviewFilter.selectedIndex].value;
          fetchData(selected); 
          
        }
      });
      var width = $(window).width();
      $(window).on('resize', function() {
        if ($(this).width() !== width) {
          formatComments()
        }
      });
  
      function onSeeAllReviews() {
        const reviewFilter = document.querySelector('.review__filter--select');
        const selected = reviewFilter.options[reviewFilter.selectedIndex].value;
        fetchData(selected)
      }

      function navigateToAllReviews() {
        const targetElement = document.querySelector("#customer_reviews_title");
        var headerOffset = 70;
        var elementPosition = targetElement.getBoundingClientRect().top;
        var offsetPosition =
          elementPosition + window.pageYOffset - headerOffset;

        window.scrollTo({
          top: offsetPosition,
          behavior: "smooth",
        });
      }
  
      // function shouldFetch() {
      //   const allReviewsTotal = JSON.parse('!{product_reviews.count}')
      //   const fetchedTotal = document.querySelectorAll('.review__container').length
      //   var seeAllReviewsContainer = document.querySelector(".seeAllReviews");
      //   var seeAllReviews = document.querySelector(".seeAllReviews a");
      //   return document.querySelector(".reviews").innerHTML !== 'See all reviews'
      //     && fetchedTotal < allReviewsTotal
      //     && !(seeAllReviews.innerHTML === 'Loading...' && seeAllReviewsContainer.style.display === 'block')
          
      // }
      function dateIsValid(date) {
        if (
          typeof date === 'object' &&
          date !== null &&
          typeof date.getTime === 'function' &&
          !isNaN(date)
        ) {
          return true;
        }
      
        return false;
      }
  
      function fetchData(filter,filterChange=false) {
        const params = new URLSearchParams(location.search)
        const barcode = params.get('barcode')
        const app = params.get('app')
        if(!filterChange){
          var seeAllReviewsContainer = document.querySelector(".seeAllReviews");
          var seeAllReviews = document.querySelector(".seeAllReviews a");
          seeAllReviewsContainer.style.display= 'block'
          seeAllReviewsContainer.style.pointerEvents= 'none'
          seeAllReviews.innerHTML = localStorage.getItem('lbl_loading')
        }
        const fetchedTotal = document.querySelectorAll('.review__container').length
        const perPage = 5
        const currentPage = !filterChange ? fetchedTotal / perPage : 0
        const reviews_container = document.querySelector('#reviews_container');

        
        let url = `/product/reviews?barcode=${barcode}&page=${currentPage + 1}&app=${app}`

        if(filter !== ""){
          url = `/product/reviews?barcode=${barcode}&page=${currentPage + 1}&app=${app}&filter[0][key]=rating&filter[0][value][]=${filter}`
        }

        $.ajax({
          url: url,
          type: 'GET',
          contentType: 'application/json',
          success: function (reviews) {
            var seeAllReviewsContainer = document.querySelector(".seeAllReviews");
            var countReviewsElement = document.querySelector(".reviewCount--count"); 
            countReviewsElement.innerHTML = `${Number((reviews.count).toString()).toLocaleString("en-US")} reviews`
            reviewsTotalCount = reviews.count;
            reviewsCount = reviews.data.length;
            localStorage.setItem('reviewsTotalCount', reviewsTotalCount)
            localStorage.setItem('reviewsCount', reviewsCount)
            localStorage.setItem('filterChange', filterChange)
            if(!filterChange || (filterChange && reviewsTotalCount <= reviewsCount)){
              if(seeAllReviewsContainer){
                seeAllReviewsContainer.style.display = 'none'
              }
            }

            const allReviews = reviews.data.map((review) => {
              const comment = createComment(review)
              formatComment(comment)
              return comment;
            })
            if(filterChange){
              $(reviews_container).empty().append(allReviews);
            }else{
              $(reviews_container).append(allReviews);
            }
          }
        });
      }
  
      function createComment(review) {
        var comment = sampleComment ? sampleComment : document.querySelector(".review__container")
        var checked_star = document.createElement('span')
        var unchecked_star = document.createElement('span')
        checked_star.className = 'fa fa-star checked'
        unchecked_star.className = 'fa fa-star unchecked'
  
        var commentTemplate = comment.cloneNode(true)
        commentTemplate.querySelector('.user_logo').innerHTML = review.customer_last_name[0]
        commentTemplate.querySelector('.review__title h2').innerHTML = review.review_title
        commentTemplate.querySelector('.review__title h4').innerHTML = `${review.customer_last_name}, ${review.customer_first_name[0]}.`
        commentTemplate.querySelector('.review__title h5').innerHTML = dateIsValid(new Date(review.created_date)) ? new Date(review.created_date).toLocaleDateString('en-us', { year:"numeric", month:"short", day:"numeric", timeZone : review.timezone}) : 'N/A'
        commentTemplate.querySelector('.review__description p').innerHTML = review.review_message
        var review_stars = commentTemplate.querySelector('.review_stars')
        review_stars.innerHTML = ''
        new Array(review.rating).fill().forEach(function() {
          review_stars.appendChild(checked_star.cloneNode(true))
        })
        new Array(5 - review.rating).fill().forEach(function() {
          review_stars.appendChild(unchecked_star.cloneNode(true))
        })
    
        return commentTemplate.cloneNode(true)
      }
      
      
      function formatComments(){
        let comments = document.querySelectorAll(".review__container");
        comments.forEach(formatComment)
      }
      function formatComment(comment) {
        const maxChar = 110;
        const content = comment.querySelector('.review__content')
        const btn = comment.querySelector('.readMore')
        console.log(content.textContent.length)
        if((countLines(content) < 4) && content.textContent.length < maxChar){
          content.classList.remove("show");
          content.nextElementSibling.classList.add("hide");
        } else {
          content.classList.add("show");
          btn.classList.remove("hide")
          btn.innerHTML = localStorage.getItem('lbl_read_more')
        }
        return comment
      }
      function countLines(el) {
        var divHeight = el.offsetHeight
        var fontSize = parseInt(window.getComputedStyle(el).fontSize);
        return parseInt(divHeight / fontSize)
      }
      function readMore(btn){
        let content = btn.previousElementSibling;
        if(btn.textContent == localStorage.getItem('lbl_read_more')) {
          btn.textContent = localStorage.getItem('lbl_read_less');
          content.classList.remove("show");
        } 
        else{
          btn.textContent = localStorage.getItem('lbl_read_more');
          content.classList.add("show");
        }
      }
      function showBackButton() {
        const backButton = document.querySelector('#back__button')
        if (backButton) {
          backButton.style.display = 'block'
        }
      }
      function hideBackButton() {
        const backButton = document.querySelector('#back__button')
        if (backButton) {
          backButton.style.display = 'none'
        }
      }
      function showDoneButton() {
        const doneButton = document.querySelector('#done__button')
        if (doneButton) {
          doneButton.style.display = 'block'
        }
      }
      function hideDoneButton() {
        const doneButton = document.querySelector('#done__button')
        if (doneButton) {
          doneButton.style.display = 'none'
        }
      }
      function formatReviewQuestions() {
        const setValues = document.querySelector(":root");
        const review_questions = JSON.parse(localStorage.getItem('review_questions_string') || '[]')
        const has_review_question =  document.querySelector('.review_question_0')
        if (!has_review_question) {
          return
        }
        review_questions.map((review_question, index) => {
          const class_selector = `.review_question_${index}`
          const { avg_question_rating, options, maxOption } = review_question
          const colors = options
            .map(e => e.color)
            .join(', ')
          
          const inputContainer = document.querySelector(class_selector).parentElement
          const installationRating = document.querySelector(class_selector)
            ? document.querySelector(class_selector).value
            : 0;

          const pointer = document.querySelector(class_selector)
          const colorRating = document.querySelector(class_selector).parentElement.parentElement.nextSibling
          const label = document.querySelector(class_selector).parentElement.previousSibling
          pointer.style.backgroundColor = review_question.pointer_hex
          colorRating.style.background = `linear-gradient(to right, ${colors})`;

          const containerWidth = inputContainer.offsetWidth
          const pointerWidth = pointer.offsetWidth
          const labelWidth = label.offsetWidth
          const percentage = avg_question_rating
            ? (avg_question_rating - 1) / (maxOption - 1)
            : 0
          const fromLeftLabel = percentage
            ? (containerWidth * percentage) - (labelWidth / 2)
            : 0
          const fromLeftPointer = percentage
            ? (containerWidth * percentage) - (pointerWidth / 2)
            : 0
          pointer.style.left = `${(fromLeftPointer / containerWidth) * 100}%`
          label.style.left = `${(fromLeftLabel / containerWidth) * 100}%`
          
          var installationValueColor = setColor(((installationRating-1)*50)/100); 
          setValues.style.setProperty("--pseudo-installation-color", '#' + installationValueColor);
          })
      }
      function extractColor(colors){
          
        var match = colors.split(', ')
        var extract = match;
        console.log(match)
        for (var a in match)
        {
            extract[a] = match[a].substring(1)
            // console.log(variable)
        }
        // return variable;
        // console.log(extract)
        return extract;
    }
      function setColor(ratings){
        var color1 = '5fb61d';
        var color2 = 'd39b2f';
        var hex = function(x){
          x= x.toString(16);
          return (x.length == 1) ? '0' + x : x;
        }
        var r = Math.ceil(parseInt(color1.substring(0,2), 16) * ratings + parseInt(color2.substring(0,2), 16) * (1-ratings));
        var g = Math.ceil(parseInt(color1.substring(2,4), 16) * ratings + parseInt(color2.substring(2,4), 16) * (1-ratings));
        var b = Math.ceil(parseInt(color1.substring(4,6), 16) * ratings + parseInt(color2.substring(4,6), 16) * (1-ratings));

        var colorRating = hex(r) + hex(g) + hex(b);
        return colorRating;
      }

      // function calculateValue(value, numberOfOptions){
      //   value = Number(value || 0)
      //   numberOfOptions = Number(numberOfOptions || 0)
      //   console.log({ value, numberOfOptions })
      //   var leftValue = (value / numberOfOptions) * 100;
      //   return parseInt(leftValue)
      // }
  
      function contentValue(value, id){
        var rating;
        const levelOneMax = 1.5
        const levelTwoMax = 2.5
  
        if (value <= levelOneMax) {
          rating = id === 'installation_rating'
            ? `"${localStorage.getItem('lbl_difficult')}"`
            : `"${localStorage.getItem('lbl_not_protective')}"`;
        } else if (value <= levelTwoMax ) {
          rating = id === 'installation_rating'
            ? `"${localStorage.getItem('lbl_manageable')}"`
            : `"${localStorage.getItem('lbl_ok')}"`;
        } else {
          rating = id === 'installation_rating'
            ? `"${localStorage.getItem('lbl_super_easy')}"`
            : `"${localStorage.getItem('lbl_excellent')}"`;
        }
        return rating
      }


      const button = document.querySelector('.scroll-top');
      
      const displayButton = () => {
        if (button) {
          window.addEventListener('scroll', () => {
            if (window.scrollY > 100) {
              button.style.display = "flex";
            } else {
              button.style.display = "none";
            }
          });
        }
      };

      const scrollToTop = () => {
        button.addEventListener("click", () => {
          window.scroll({
            top: 0,
            left: 0,
            behavior: 'smooth'
          }); 
          console.log(event);
        });
      };

      displayButton();
      scrollToTop();