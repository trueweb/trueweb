(function(){
	// let btnToggle= document.getElementsByClassName('more-info__btn-toggle');

	// for(let i= 0, l= btnToggle.length; l > i; i++){
	// 	btnToggle[i].addEventListener('click', function(e){
	// 		for(let j= 0, l2= e.path.length; l2 > j; j++){
	// 			if( e.path[j].classList.contains('more-info__item')){
	// 				e.path[j].classList.toggle('active');
	// 				break;
	// 			}
	// 		}
	// 	});
	// }

	$('.more-info__btn-toggle').on("click", function(e){
		let moreInfo__item= $(this).parents('.more-info__item');
		let moreInfo__boxToggle= moreInfo__item.find('.more-info__box-toggle');
		if( !moreInfo__item.hasClass('active') ){
			moreInfo__boxToggle.stop().fadeIn(600);
		}else{
			moreInfo__boxToggle.stop().fadeOut(0);
		}
		moreInfo__item.toggleClass('active');
	});

	
})();