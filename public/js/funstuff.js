$(document).ready(function(){
	var $img = $('img');
	var $body = $('body');
	var $welcome = $('#welcome');
		

	function randCol() { //function name
    var color = '#'; // hexadecimal starting symbol
    // hexadecimal starting symbol
   
    var letters = '0123456789ABCDEF'.split(''); //hexadecimal color letters


 		for (var i = 0; i < 6; i++) {
        color += letters[Math.round(Math.random() * 15)];
       
        
    }
 
    $body.animate({backgroundColor: color}, 3000); // Setting the random color on body.
	}


	randCol();

	

	$img.velocity("slideDown",{ duration: 2000 });

	setTimeout(function(){
  
    $img.velocity (
    	{ rotateZ: -360 },
    	// { easing: [ 6 ], loop: 2},
    	{ queue: false });
		}, 1000 )

	setTimeout(function(){
  
    $img.velocity (
    	{ rotateZ: 360 },
    	// { easing: [ 6 ], loop: 2},
    	{ queue: false });
		}, 500 )
		

	setInterval(function(){
		randCol()
	}, 2500)

	// $welcome.slideDown(2500)

	setTimeout(function(){
		$welcome.velocity ( {
			opacity: .8,
			translateX: "-200px",
	    rotateZ: "-45deg" 
	  })
  }, 3000 );




$('#phone').leanModal({ top : 500, overlay : 0.4, closeButton: ".modal_close" });

$('#message').leanModal({ top : 500, overlay : 0.4, closeButton: ".modal_close" });
















});