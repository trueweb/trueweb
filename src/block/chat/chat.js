(function(){

	if( document.getElementById('chat') ){
		
		$('#chat__list').niceScroll({cursorcolor:"#fff"});
		let chat__form= document.getElementById('chat__form');
		let chat__formTextarea= document.getElementById('chat__form-textarea');
		let chat__formFile= document.getElementById('chat__form-file');
		let ctr= chat__form.getAttribute('data-ctr');	
		let chat__list= document.getElementById('chat__list');
		let chat__formBtn= document.getElementById('chat__form-btn');
		let chat__listOut= document.getElementById('chat__list-out');
	
	
		let template= (data)=>{
			let file= '';
			let date= '';
			if(data){
				// Файлы
				if(data.img){
					for(let i= 0, l= data.img.length; l > i; i++){
						// Если это картинка
						if(data.img[i].search( /[\w](.jpg|.png|.gif|.jpeg)$/gi ) + 1 ){
							file+= `<a href="/img/${ data.img[i] }" data-lightbox="roadtrip" class="chat__list-box-img chat__list-box-img_file">
							<img class="chat__list-img" src="/img/${ data.img[i] }" alt="" role="presentation">
						</a>
	
						<a href="/img/${ data.img[i] }" class="chat__list-link chat__list-link_download" download>
							<i class="fa fa-file"></i> 
							${ data.img[i] }
						</a>`;
						} else {
							// Ссылка для скачки
							file+= `<a href="/img/${ data.img[i] }" class="chat__list-link chat__list-link_download" download>
							<i class="fa fa-file"></i> 
							${ data.img[i] }
							</a>`;
						}
					}
				}
	
	
				// Если дата текущего сообщения отличается от предидущей
				if( data.date ){
					date= `<div class="chat__list-item" data-timestamp="${ data.timestamp } data-id="${ data.id }">
					<div class="chat__list-date chat__list-date_new-day">
						${ data.date }
					</div>
				</div>`;
				}
	
				
	
				return `${ date }<div class="chat__list-item" data-timestamp="${ data.timestamp }" data-id="${ data.id }">
					<div class="chat__list-col chat__list-col_1">
						<div class="chat__list-box-img chat__list-box-img_user"><img class="chat__list-img" src="/img/${ data.imgAvatar }" alt="" role="presentation">
						</div>
					</div>
					<div class="chat__list-col chat__list-col_2">
						<div class="chat__list-row chat__list-row_1">
							<div class="chat__list-name">
								${ data.name }
							</div>
							<div class="chat__list-time">
								${ moment.unix(data.timestamp).format('hh:mm') }
							</div>
						</div>
						<div class="chat__list-row chat__list-row_2">
							<div class="chat__list-text ${ data.status == 'true' ? '' : 'chat__list-text_error' }">
								${ data.status == 'true' ? data.text : 'Error' }
							</div>
							${ file }
						</div>
					</div>
				</div>`;
			}
		}
	
		// Добавить сообщение в чат
		chat__formBtn.addEventListener('click', function(e){
	
			e.preventDefault();
			let chat__item_lastId= document.querySelector('#chat__list-out .chat__list-item') ? document.querySelector('#chat__list-out .chat__list-item:last-child').getAttribute('data-id') : 0;
	
			let formData= new FormData(chat__form);
			formData.append('id', chat__item_lastId);
			ajax(ctr + '?action=add', formData, function(data){
				chat__formTextarea.value= '';
				chat__formFile.value= '';
				let dataJ= JSON.parse( data );
	
				for(let i= 0, l= dataJ.length; l > i; i++){
					chat__listOut.insertAdjacentHTML("beforeEnd", template(dataJ[i]) );
				}
				$(chat__list).animate({scrollTop: $(chat__listOut).height()}, 500, 'swing', function() {});
			});
		});
	
		// Принять сообщение в чат
		setInterval(function(){
	
			let chat__item_lastId= document.querySelector('#chat__list-out .chat__list-item:last-child');
	
			chat__item_lastId= chat__item_lastId ? chat__item_lastId.getAttribute('data-id') : 0;
	
			ajax(ctr + '?action=accept&id=' + chat__item_lastId, '', function(data){
	
				if(data){
					let dataJ= JSON.parse( data );
					let templateArr= [];
	
					for(let i= 0, l= dataJ.length; l > i; i++){
						if(dataJ[i + 1]){
							if( moment.unix(dataJ[i].timestamp).format('DD.MM.YYYY') != moment.unix(dataJ[i + 1].timestamp).format('DD.MM.YYYY')){
								dataJ[i].date= moment.unix(dataJ[i].timestamp).format('DD.MM.YYYY');
							}
						}
	
						templateArr.push( template(dataJ[i]) );
					}
					chat__listOut.insertAdjacentHTML("beforeEnd", templateArr.join(' '));
					$(chat__list).animate({scrollTop: $(chat__listOut).height()}, 500, 'swing', function() {});
				}
			})
		}, 2000);
	
	}
})();