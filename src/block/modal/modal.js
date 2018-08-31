(function(){
	let modal__close= function(el){
		let modal__close= document.querySelectorAll(el);
		for(let i= 0, l= modal__close.length; l > i; i++){
			modal__close[i].addEventListener('click', function(){
				document.querySelector('.modal.active').classList.remove('active');
			});

			modal__close[i].addEventListener('touch', function(){
				document.querySelector('.modal.active').classList.remove('active');
			});
		}
	}

	modal__close('.modal__close');
})();