// Активный пункт меню
(function(){
	let funActiveMenu__item= (event, el)=>{
		for(let i= 0, l= el.length; l > i; i++){
			el[i].addEventListener(event, function(e){
				for(let j= 0, l2= el.length; l2 > j; j++){
					el[j].classList.remove('active');
				}

				for(let j= 0, l= e.path.length; l > j; j++){
					if( e.path[j].tagName == 'LI' ){
						e.path[j].classList.add('active');
						break;
					}
				}
			});
		}
	}
	
	let nav_header= document.querySelectorAll('.nav_header .nav__item');
	funActiveMenu__item('click', nav_header);
	funActiveMenu__item('touch', nav_header);
})();