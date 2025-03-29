$(document).ready(function() {

	$.fn.animateRotate = function(angle, duration, easing, complete) {
	  var args = $.speed(duration, easing, complete);
	  var step = args.step;
	  return this.each(function(i, e) {
		args.complete = $.proxy(args.complete, e);
		args.step = function(now) {
		  $.style(e, 'transform', 'rotate(' + now + 'deg)');
		  if (step) return step.apply(e, arguments);
		};

		$({deg: 0}).animate({deg: angle}, args);
	  });
	};
	
	$("#main-page").css("background-color", "#e74c3c");
	$("#main-page").css("height", "100vh");
	$("#main-page").css("width", "100%");
	$("#main-page").fadeIn();
	$(".maincontent").fadeIn();
	
	$(".mainlink").on("click", function() {
		$(".maincontent").fadeOut();
		$("#main-page").animate({
			width: "25px",
			height: "375px"
		}, function() {
			$(this).animateRotate(90);
		});
		
		setTimeout(function() {
			$("#main-page").fadeOut();		 
		}, 1500);
		
		setTimeout(function() {
			$("#next-page").animateRotate(0, 0);
			$("#next-page").css("height", "25px");
			$("#next-page").css("width", "375px");
			$("#next-page").fadeIn();
			$("#next-page").animate({
				backgroundColor: "#27ae60"
			}, function() {
				$(this).animate({
					height: "100vh"
				}, function() {
					$(this).animate({
						width: "100%"
					}, function() {
						$(".nextcontent").fadeIn(300);
					});
				});
			});
		}, 800);
	});
		
	$(".nextlink").on("click", function() {
		$(".nextcontent").fadeOut();
		$("#next-page").animate({
			width: "25px",
			height: "375px"
		}, function() {
			$(this).animateRotate(-90);
		});
		
		setTimeout(function() {
			$("#next-page").fadeOut();			
		}, 1500);
		
		setTimeout(function() {
		$("#main-page").animateRotate(0, 0);
		$("#main-page").css("height", "25px");
		$("#main-page").css("width", "375px");
			$("#main-page").fadeIn();
			$("#main-page").animate({
				height: "100vh"
			}, function() {
				$(this).animate({
					width: "100%"
				}, function() {
					$(".maincontent").fadeIn(300);
				});
			});
		}, 1400);
	});
	
});

const images = [
	"./Img/image1.jpg",
	"./Img/image2.jpg",
	"./Img/image3.jpg",
	"./Img/image4.jpg"
  ];
  
  const links = [
	"../profile_01/profile_jihun.html",
	"../profile_01/profile_minji.html",
	"../profile_01/profile_suhyeon.html",
	"../profile_01/profile_hyunwoo.html"
  ];
  
  let currentIndex = 0;
  const imageElement = document.getElementById("carousel-image");
  
  function updateImage(index) {
	imageElement.style.opacity = 0;
	setTimeout(() => {
	  imageElement.src = images[index];
	  imageElement.style.opacity = 1;
	}, 200);
  }
  
  $(".prev-btn").on("click", function() {
	currentIndex = (currentIndex - 1 + images.length) % images.length;
	updateImage(currentIndex);
  });
  
  $(".next-btn").on("click", function() {
	currentIndex = (currentIndex + 1) % images.length;
	updateImage(currentIndex);
  });
  
  $("#carousel-image").on("click", function() {
	window.location.href = links[currentIndex];
  });

  fetch('../navi/navi.html')
      .then(response => response.text())
      .then(data => {
        document.getElementById('navi-container').innerHTML = data;
      })
      .catch(error => console.error('Error loading navi:', error));