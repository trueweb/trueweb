'use strict';

var ajax = function ajax(url, data, callback) {
	var cb = callback || function () {};
	var xhr = new XMLHttpRequest();
	xhr.open('POST', url, false);
	xhr.send(data);
	return (xhr.onreadystatechange = function () {
		if (xhr.readyState == 4 && xhr.status == 200) {
			if (xhr.responseText != '') return cb(xhr.responseText);
		} else {
			console.log('err');
		}
	})();
};
'use strict';

(function () {
	var toggleBtn = function toggleBtn(idBtn) {
		/*
  	idBtn - id кнопки при нажатии на которую происходит прерключение
  	data-id-control - id елемента которому добавляется/удаляется класс ".active" после нажатия на кнопку 
  */
		// Клик
		var btn = document.getElementById(idBtn);
		if (btn) {
			btn.addEventListener('click', function () {
				this.classList.toggle('active');
				var idControl = this.getAttribute('data-id-control');
				document.getElementById(idControl).classList.toggle('active');
			});
			// Касание
			btn.addEventListener('touch', function () {
				this.classList.toggle('active');
				var idControl = this.getAttribute('data-id-control');
				document.getElementById(idControl).classList.toggle('active');
			});
		}
	};

	// Кнопка бургер header - преключение навигации
	toggleBtn('btn_burger-header');
})();
'use strict';

(function () {

	if (document.getElementById('chat')) {

		$('#chat__list').niceScroll({ cursorcolor: "#fff" });
		var chat__form = document.getElementById('chat__form');
		var chat__formTextarea = document.getElementById('chat__form-textarea');
		var chat__formFile = document.getElementById('chat__form-file');
		var ctr = chat__form.getAttribute('data-ctr');
		var chat__list = document.getElementById('chat__list');
		var chat__formBtn = document.getElementById('chat__form-btn');
		var chat__listOut = document.getElementById('chat__list-out');

		var template = function template(data) {
			var file = '';
			var date = '';
			if (data) {
				// Файлы
				if (data.img) {
					for (var i = 0, l = data.img.length; l > i; i++) {
						// Если это картинка
						if (data.img[i].search(/[\w](.jpg|.png|.gif|.jpeg)$/gi) + 1) {
							file += '<a href="/img/' + data.img[i] + '" data-lightbox="roadtrip" class="chat__list-box-img chat__list-box-img_file">\n\t\t\t\t\t\t\t<img class="chat__list-img" src="/img/' + data.img[i] + '" alt="" role="presentation">\n\t\t\t\t\t\t</a>\n\t\n\t\t\t\t\t\t<a href="/img/' + data.img[i] + '" class="chat__list-link chat__list-link_download" download>\n\t\t\t\t\t\t\t<i class="fa fa-file"></i> \n\t\t\t\t\t\t\t' + data.img[i] + '\n\t\t\t\t\t\t</a>';
						} else {
							// Ссылка для скачки
							file += '<a href="/img/' + data.img[i] + '" class="chat__list-link chat__list-link_download" download>\n\t\t\t\t\t\t\t<i class="fa fa-file"></i> \n\t\t\t\t\t\t\t' + data.img[i] + '\n\t\t\t\t\t\t\t</a>';
						}
					}
				}

				// Если дата текущего сообщения отличается от предидущей
				if (data.date) {
					date = '<div class="chat__list-item" data-timestamp="' + data.timestamp + ' data-id="' + data.id + '">\n\t\t\t\t\t<div class="chat__list-date chat__list-date_new-day">\n\t\t\t\t\t\t' + data.date + '\n\t\t\t\t\t</div>\n\t\t\t\t</div>';
				}

				return date + '<div class="chat__list-item" data-timestamp="' + data.timestamp + '" data-id="' + data.id + '">\n\t\t\t\t\t<div class="chat__list-col chat__list-col_1">\n\t\t\t\t\t\t<div class="chat__list-box-img chat__list-box-img_user"><img class="chat__list-img" src="/img/' + data.imgAvatar + '" alt="" role="presentation">\n\t\t\t\t\t\t</div>\n\t\t\t\t\t</div>\n\t\t\t\t\t<div class="chat__list-col chat__list-col_2">\n\t\t\t\t\t\t<div class="chat__list-row chat__list-row_1">\n\t\t\t\t\t\t\t<div class="chat__list-name">\n\t\t\t\t\t\t\t\t' + data.name + '\n\t\t\t\t\t\t\t</div>\n\t\t\t\t\t\t\t<div class="chat__list-time">\n\t\t\t\t\t\t\t\t' + moment.unix(data.timestamp).format('hh:mm') + '\n\t\t\t\t\t\t\t</div>\n\t\t\t\t\t\t</div>\n\t\t\t\t\t\t<div class="chat__list-row chat__list-row_2">\n\t\t\t\t\t\t\t<div class="chat__list-text ' + (data.status == 'true' ? '' : 'chat__list-text_error') + '">\n\t\t\t\t\t\t\t\t' + (data.status == 'true' ? data.text : 'Error') + '\n\t\t\t\t\t\t\t</div>\n\t\t\t\t\t\t\t' + file + '\n\t\t\t\t\t\t</div>\n\t\t\t\t\t</div>\n\t\t\t\t</div>';
			}
		};

		// Добавить сообщение в чат
		chat__formBtn.addEventListener('click', function (e) {

			e.preventDefault();
			var chat__item_lastId = document.querySelector('#chat__list-out .chat__list-item') ? document.querySelector('#chat__list-out .chat__list-item:last-child').getAttribute('data-id') : 0;

			var formData = new FormData(chat__form);
			formData.append('id', chat__item_lastId);
			ajax(ctr + '?action=add', formData, function (data) {
				chat__formTextarea.value = '';
				chat__formFile.value = '';
				var dataJ = JSON.parse(data);

				for (var i = 0, l = dataJ.length; l > i; i++) {
					chat__listOut.insertAdjacentHTML("beforeEnd", template(dataJ[i]));
				}
				$(chat__list).animate({ scrollTop: $(chat__listOut).height() }, 500, 'swing', function () {});
			});
		});

		// Принять сообщение в чат
		setInterval(function () {

			var chat__item_lastId = document.querySelector('#chat__list-out .chat__list-item:last-child');

			chat__item_lastId = chat__item_lastId ? chat__item_lastId.getAttribute('data-id') : 0;

			ajax(ctr + '?action=accept&id=' + chat__item_lastId, '', function (data) {

				if (data) {
					var dataJ = JSON.parse(data);
					var templateArr = [];

					for (var i = 0, l = dataJ.length; l > i; i++) {
						if (dataJ[i + 1]) {
							if (moment.unix(dataJ[i].timestamp).format('DD.MM.YYYY') != moment.unix(dataJ[i + 1].timestamp).format('DD.MM.YYYY')) {
								dataJ[i].date = moment.unix(dataJ[i].timestamp).format('DD.MM.YYYY');
							}
						}

						templateArr.push(template(dataJ[i]));
					}
					chat__listOut.insertAdjacentHTML("beforeEnd", templateArr.join(' '));
					$(chat__list).animate({ scrollTop: $(chat__listOut).height() }, 500, 'swing', function () {});
				}
			});
		}, 2000);
	}
})();
'use strict';

(function () {
	var reset = function reset(form) {
		var field = form.querySelectorAll('[name]');
		for (var i = 0, l = field.length; l > i; i++) {
			field[i].value = '';
		}
	};

	// document.querySelector('form [type="submit"]').addEventListener("click", function(e){
	// 	e.preventDefault();
	// 	for(let i= 0, l= e.path.length; l > i; i++ ){
	// 		if( e.path[i].tagName.toLowerCase() == 'form' ){
	// 			reset(e.path[i]);
	// 			break;
	// 		}
	// 	}
	// });
})();
'use strict';

(function () {
	var modal__close = function modal__close(el) {
		var modal__close = document.querySelectorAll(el);
		for (var i = 0, l = modal__close.length; l > i; i++) {
			modal__close[i].addEventListener('click', function () {
				document.querySelector('.modal.active').classList.remove('active');
			});

			modal__close[i].addEventListener('touch', function () {
				document.querySelector('.modal.active').classList.remove('active');
			});
		}
	};

	modal__close('.modal__close');
})();
'use strict';

(function () {
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

	$('.more-info__btn-toggle').on("click", function (e) {
		var moreInfo__item = $(this).parents('.more-info__item');
		var moreInfo__boxToggle = moreInfo__item.find('.more-info__box-toggle');
		if (!moreInfo__item.hasClass('active')) {
			moreInfo__boxToggle.stop().fadeIn(600);
		} else {
			moreInfo__boxToggle.stop().fadeOut(0);
		}
		moreInfo__item.toggleClass('active');
	});
})();
'use strict';

// Активный пункт меню
(function () {
	var funActiveMenu__item = function funActiveMenu__item(event, el) {
		for (var i = 0, l = el.length; l > i; i++) {
			el[i].addEventListener(event, function (e) {
				for (var j = 0, l2 = el.length; l2 > j; j++) {
					el[j].classList.remove('active');
				}

				for (var _j = 0, _l = e.path.length; _l > _j; _j++) {
					if (e.path[_j].tagName == 'LI') {
						e.path[_j].classList.add('active');
						break;
					}
				}
			});
		}
	};

	var nav_header = document.querySelectorAll('.nav_header .nav__item');
	funActiveMenu__item('click', nav_header);
	funActiveMenu__item('touch', nav_header);
})();
//# sourceMappingURL=data:application/json;charset=utf8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbImFqYXguanMiLCJidG4vYnRuLmpzIiwiY2hhdC9jaGF0LmpzIiwiZm9ybS9mb3JtLmpzIiwibW9kYWwvbW9kYWwuanMiLCJtb3JlLWluZm8vbW9yZS1pbmZvLmpzIiwibmF2L25hdi5qcyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiQUFBQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUNkQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQzNCQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUN6RkE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQ25CQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUNqQkE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FDMUJBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBIiwiZmlsZSI6ImFwcC5qcyIsInNvdXJjZXNDb250ZW50IjpbIid1c2Ugc3RyaWN0JztcblxudmFyIGFqYXggPSBmdW5jdGlvbiBhamF4KHVybCwgZGF0YSwgY2FsbGJhY2spIHtcblx0dmFyIGNiID0gY2FsbGJhY2sgfHwgZnVuY3Rpb24gKCkge307XG5cdHZhciB4aHIgPSBuZXcgWE1MSHR0cFJlcXVlc3QoKTtcblx0eGhyLm9wZW4oJ1BPU1QnLCB1cmwsIGZhbHNlKTtcblx0eGhyLnNlbmQoZGF0YSk7XG5cdHJldHVybiAoeGhyLm9ucmVhZHlzdGF0ZWNoYW5nZSA9IGZ1bmN0aW9uICgpIHtcblx0XHRpZiAoeGhyLnJlYWR5U3RhdGUgPT0gNCAmJiB4aHIuc3RhdHVzID09IDIwMCkge1xuXHRcdFx0aWYgKHhoci5yZXNwb25zZVRleHQgIT0gJycpIHJldHVybiBjYih4aHIucmVzcG9uc2VUZXh0KTtcblx0XHR9IGVsc2Uge1xuXHRcdFx0Y29uc29sZS5sb2coJ2VycicpO1xuXHRcdH1cblx0fSkoKTtcbn07IiwiJ3VzZSBzdHJpY3QnO1xuXG4oZnVuY3Rpb24gKCkge1xuXHR2YXIgdG9nZ2xlQnRuID0gZnVuY3Rpb24gdG9nZ2xlQnRuKGlkQnRuKSB7XG5cdFx0LypcclxuICBcdGlkQnRuIC0gaWQg0LrQvdC+0L/QutC4INC/0YDQuCDQvdCw0LbQsNGC0LjQuCDQvdCwINC60L7RgtC+0YDRg9GOINC/0YDQvtC40YHRhdC+0LTQuNGCINC/0YDQtdGA0LrQu9GO0YfQtdC90LjQtVxyXG4gIFx0ZGF0YS1pZC1jb250cm9sIC0gaWQg0LXQu9C10LzQtdC90YLQsCDQutC+0YLQvtGA0L7QvNGDINC00L7QsdCw0LLQu9GP0LXRgtGB0Y8v0YPQtNCw0LvRj9C10YLRgdGPINC60LvQsNGB0YEgXCIuYWN0aXZlXCIg0L/QvtGB0LvQtSDQvdCw0LbQsNGC0LjRjyDQvdCwINC60L3QvtC/0LrRgyBcclxuICAqL1xuXHRcdC8vINCa0LvQuNC6XG5cdFx0dmFyIGJ0biA9IGRvY3VtZW50LmdldEVsZW1lbnRCeUlkKGlkQnRuKTtcblx0XHRpZiAoYnRuKSB7XG5cdFx0XHRidG4uYWRkRXZlbnRMaXN0ZW5lcignY2xpY2snLCBmdW5jdGlvbiAoKSB7XG5cdFx0XHRcdHRoaXMuY2xhc3NMaXN0LnRvZ2dsZSgnYWN0aXZlJyk7XG5cdFx0XHRcdHZhciBpZENvbnRyb2wgPSB0aGlzLmdldEF0dHJpYnV0ZSgnZGF0YS1pZC1jb250cm9sJyk7XG5cdFx0XHRcdGRvY3VtZW50LmdldEVsZW1lbnRCeUlkKGlkQ29udHJvbCkuY2xhc3NMaXN0LnRvZ2dsZSgnYWN0aXZlJyk7XG5cdFx0XHR9KTtcblx0XHRcdC8vINCa0LDRgdCw0L3QuNC1XG5cdFx0XHRidG4uYWRkRXZlbnRMaXN0ZW5lcigndG91Y2gnLCBmdW5jdGlvbiAoKSB7XG5cdFx0XHRcdHRoaXMuY2xhc3NMaXN0LnRvZ2dsZSgnYWN0aXZlJyk7XG5cdFx0XHRcdHZhciBpZENvbnRyb2wgPSB0aGlzLmdldEF0dHJpYnV0ZSgnZGF0YS1pZC1jb250cm9sJyk7XG5cdFx0XHRcdGRvY3VtZW50LmdldEVsZW1lbnRCeUlkKGlkQ29udHJvbCkuY2xhc3NMaXN0LnRvZ2dsZSgnYWN0aXZlJyk7XG5cdFx0XHR9KTtcblx0XHR9XG5cdH07XG5cblx0Ly8g0JrQvdC+0L/QutCwINCx0YPRgNCz0LXRgCBoZWFkZXIgLSDQv9GA0LXQutC70Y7Rh9C10L3QuNC1INC90LDQstC40LPQsNGG0LjQuFxuXHR0b2dnbGVCdG4oJ2J0bl9idXJnZXItaGVhZGVyJyk7XG59KSgpOyIsIid1c2Ugc3RyaWN0JztcblxuKGZ1bmN0aW9uICgpIHtcblxuXHRpZiAoZG9jdW1lbnQuZ2V0RWxlbWVudEJ5SWQoJ2NoYXQnKSkge1xuXG5cdFx0JCgnI2NoYXRfX2xpc3QnKS5uaWNlU2Nyb2xsKHsgY3Vyc29yY29sb3I6IFwiI2ZmZlwiIH0pO1xuXHRcdHZhciBjaGF0X19mb3JtID0gZG9jdW1lbnQuZ2V0RWxlbWVudEJ5SWQoJ2NoYXRfX2Zvcm0nKTtcblx0XHR2YXIgY2hhdF9fZm9ybVRleHRhcmVhID0gZG9jdW1lbnQuZ2V0RWxlbWVudEJ5SWQoJ2NoYXRfX2Zvcm0tdGV4dGFyZWEnKTtcblx0XHR2YXIgY2hhdF9fZm9ybUZpbGUgPSBkb2N1bWVudC5nZXRFbGVtZW50QnlJZCgnY2hhdF9fZm9ybS1maWxlJyk7XG5cdFx0dmFyIGN0ciA9IGNoYXRfX2Zvcm0uZ2V0QXR0cmlidXRlKCdkYXRhLWN0cicpO1xuXHRcdHZhciBjaGF0X19saXN0ID0gZG9jdW1lbnQuZ2V0RWxlbWVudEJ5SWQoJ2NoYXRfX2xpc3QnKTtcblx0XHR2YXIgY2hhdF9fZm9ybUJ0biA9IGRvY3VtZW50LmdldEVsZW1lbnRCeUlkKCdjaGF0X19mb3JtLWJ0bicpO1xuXHRcdHZhciBjaGF0X19saXN0T3V0ID0gZG9jdW1lbnQuZ2V0RWxlbWVudEJ5SWQoJ2NoYXRfX2xpc3Qtb3V0Jyk7XG5cblx0XHR2YXIgdGVtcGxhdGUgPSBmdW5jdGlvbiB0ZW1wbGF0ZShkYXRhKSB7XG5cdFx0XHR2YXIgZmlsZSA9ICcnO1xuXHRcdFx0dmFyIGRhdGUgPSAnJztcblx0XHRcdGlmIChkYXRhKSB7XG5cdFx0XHRcdC8vINCk0LDQudC70Ytcblx0XHRcdFx0aWYgKGRhdGEuaW1nKSB7XG5cdFx0XHRcdFx0Zm9yICh2YXIgaSA9IDAsIGwgPSBkYXRhLmltZy5sZW5ndGg7IGwgPiBpOyBpKyspIHtcblx0XHRcdFx0XHRcdC8vINCV0YHQu9C4INGN0YLQviDQutCw0YDRgtC40L3QutCwXG5cdFx0XHRcdFx0XHRpZiAoZGF0YS5pbWdbaV0uc2VhcmNoKC9bXFx3XSguanBnfC5wbmd8LmdpZnwuanBlZykkL2dpKSArIDEpIHtcblx0XHRcdFx0XHRcdFx0ZmlsZSArPSAnPGEgaHJlZj1cIi9pbWcvJyArIGRhdGEuaW1nW2ldICsgJ1wiIGRhdGEtbGlnaHRib3g9XCJyb2FkdHJpcFwiIGNsYXNzPVwiY2hhdF9fbGlzdC1ib3gtaW1nIGNoYXRfX2xpc3QtYm94LWltZ19maWxlXCI+XFxuXFx0XFx0XFx0XFx0XFx0XFx0XFx0PGltZyBjbGFzcz1cImNoYXRfX2xpc3QtaW1nXCIgc3JjPVwiL2ltZy8nICsgZGF0YS5pbWdbaV0gKyAnXCIgYWx0PVwiXCIgcm9sZT1cInByZXNlbnRhdGlvblwiPlxcblxcdFxcdFxcdFxcdFxcdFxcdDwvYT5cXG5cXHRcXG5cXHRcXHRcXHRcXHRcXHRcXHQ8YSBocmVmPVwiL2ltZy8nICsgZGF0YS5pbWdbaV0gKyAnXCIgY2xhc3M9XCJjaGF0X19saXN0LWxpbmsgY2hhdF9fbGlzdC1saW5rX2Rvd25sb2FkXCIgZG93bmxvYWQ+XFxuXFx0XFx0XFx0XFx0XFx0XFx0XFx0PGkgY2xhc3M9XCJmYSBmYS1maWxlXCI+PC9pPiBcXG5cXHRcXHRcXHRcXHRcXHRcXHRcXHQnICsgZGF0YS5pbWdbaV0gKyAnXFxuXFx0XFx0XFx0XFx0XFx0XFx0PC9hPic7XG5cdFx0XHRcdFx0XHR9IGVsc2Uge1xuXHRcdFx0XHRcdFx0XHQvLyDQodGB0YvQu9C60LAg0LTQu9GPINGB0LrQsNGH0LrQuFxuXHRcdFx0XHRcdFx0XHRmaWxlICs9ICc8YSBocmVmPVwiL2ltZy8nICsgZGF0YS5pbWdbaV0gKyAnXCIgY2xhc3M9XCJjaGF0X19saXN0LWxpbmsgY2hhdF9fbGlzdC1saW5rX2Rvd25sb2FkXCIgZG93bmxvYWQ+XFxuXFx0XFx0XFx0XFx0XFx0XFx0XFx0PGkgY2xhc3M9XCJmYSBmYS1maWxlXCI+PC9pPiBcXG5cXHRcXHRcXHRcXHRcXHRcXHRcXHQnICsgZGF0YS5pbWdbaV0gKyAnXFxuXFx0XFx0XFx0XFx0XFx0XFx0XFx0PC9hPic7XG5cdFx0XHRcdFx0XHR9XG5cdFx0XHRcdFx0fVxuXHRcdFx0XHR9XG5cblx0XHRcdFx0Ly8g0JXRgdC70Lgg0LTQsNGC0LAg0YLQtdC60YPRidC10LPQviDRgdC+0L7QsdGJ0LXQvdC40Y8g0L7RgtC70LjRh9Cw0LXRgtGB0Y8g0L7RgiDQv9GA0LXQtNC40LTRg9GJ0LXQuVxuXHRcdFx0XHRpZiAoZGF0YS5kYXRlKSB7XG5cdFx0XHRcdFx0ZGF0ZSA9ICc8ZGl2IGNsYXNzPVwiY2hhdF9fbGlzdC1pdGVtXCIgZGF0YS10aW1lc3RhbXA9XCInICsgZGF0YS50aW1lc3RhbXAgKyAnIGRhdGEtaWQ9XCInICsgZGF0YS5pZCArICdcIj5cXG5cXHRcXHRcXHRcXHRcXHQ8ZGl2IGNsYXNzPVwiY2hhdF9fbGlzdC1kYXRlIGNoYXRfX2xpc3QtZGF0ZV9uZXctZGF5XCI+XFxuXFx0XFx0XFx0XFx0XFx0XFx0JyArIGRhdGEuZGF0ZSArICdcXG5cXHRcXHRcXHRcXHRcXHQ8L2Rpdj5cXG5cXHRcXHRcXHRcXHQ8L2Rpdj4nO1xuXHRcdFx0XHR9XG5cblx0XHRcdFx0cmV0dXJuIGRhdGUgKyAnPGRpdiBjbGFzcz1cImNoYXRfX2xpc3QtaXRlbVwiIGRhdGEtdGltZXN0YW1wPVwiJyArIGRhdGEudGltZXN0YW1wICsgJ1wiIGRhdGEtaWQ9XCInICsgZGF0YS5pZCArICdcIj5cXG5cXHRcXHRcXHRcXHRcXHQ8ZGl2IGNsYXNzPVwiY2hhdF9fbGlzdC1jb2wgY2hhdF9fbGlzdC1jb2xfMVwiPlxcblxcdFxcdFxcdFxcdFxcdFxcdDxkaXYgY2xhc3M9XCJjaGF0X19saXN0LWJveC1pbWcgY2hhdF9fbGlzdC1ib3gtaW1nX3VzZXJcIj48aW1nIGNsYXNzPVwiY2hhdF9fbGlzdC1pbWdcIiBzcmM9XCIvaW1nLycgKyBkYXRhLmltZ0F2YXRhciArICdcIiBhbHQ9XCJcIiByb2xlPVwicHJlc2VudGF0aW9uXCI+XFxuXFx0XFx0XFx0XFx0XFx0XFx0PC9kaXY+XFxuXFx0XFx0XFx0XFx0XFx0PC9kaXY+XFxuXFx0XFx0XFx0XFx0XFx0PGRpdiBjbGFzcz1cImNoYXRfX2xpc3QtY29sIGNoYXRfX2xpc3QtY29sXzJcIj5cXG5cXHRcXHRcXHRcXHRcXHRcXHQ8ZGl2IGNsYXNzPVwiY2hhdF9fbGlzdC1yb3cgY2hhdF9fbGlzdC1yb3dfMVwiPlxcblxcdFxcdFxcdFxcdFxcdFxcdFxcdDxkaXYgY2xhc3M9XCJjaGF0X19saXN0LW5hbWVcIj5cXG5cXHRcXHRcXHRcXHRcXHRcXHRcXHRcXHQnICsgZGF0YS5uYW1lICsgJ1xcblxcdFxcdFxcdFxcdFxcdFxcdFxcdDwvZGl2PlxcblxcdFxcdFxcdFxcdFxcdFxcdFxcdDxkaXYgY2xhc3M9XCJjaGF0X19saXN0LXRpbWVcIj5cXG5cXHRcXHRcXHRcXHRcXHRcXHRcXHRcXHQnICsgbW9tZW50LnVuaXgoZGF0YS50aW1lc3RhbXApLmZvcm1hdCgnaGg6bW0nKSArICdcXG5cXHRcXHRcXHRcXHRcXHRcXHRcXHQ8L2Rpdj5cXG5cXHRcXHRcXHRcXHRcXHRcXHQ8L2Rpdj5cXG5cXHRcXHRcXHRcXHRcXHRcXHQ8ZGl2IGNsYXNzPVwiY2hhdF9fbGlzdC1yb3cgY2hhdF9fbGlzdC1yb3dfMlwiPlxcblxcdFxcdFxcdFxcdFxcdFxcdFxcdDxkaXYgY2xhc3M9XCJjaGF0X19saXN0LXRleHQgJyArIChkYXRhLnN0YXR1cyA9PSAndHJ1ZScgPyAnJyA6ICdjaGF0X19saXN0LXRleHRfZXJyb3InKSArICdcIj5cXG5cXHRcXHRcXHRcXHRcXHRcXHRcXHRcXHQnICsgKGRhdGEuc3RhdHVzID09ICd0cnVlJyA/IGRhdGEudGV4dCA6ICdFcnJvcicpICsgJ1xcblxcdFxcdFxcdFxcdFxcdFxcdFxcdDwvZGl2PlxcblxcdFxcdFxcdFxcdFxcdFxcdFxcdCcgKyBmaWxlICsgJ1xcblxcdFxcdFxcdFxcdFxcdFxcdDwvZGl2PlxcblxcdFxcdFxcdFxcdFxcdDwvZGl2PlxcblxcdFxcdFxcdFxcdDwvZGl2Pic7XG5cdFx0XHR9XG5cdFx0fTtcblxuXHRcdC8vINCU0L7QsdCw0LLQuNGC0Ywg0YHQvtC+0LHRidC10L3QuNC1INCyINGH0LDRglxuXHRcdGNoYXRfX2Zvcm1CdG4uYWRkRXZlbnRMaXN0ZW5lcignY2xpY2snLCBmdW5jdGlvbiAoZSkge1xuXG5cdFx0XHRlLnByZXZlbnREZWZhdWx0KCk7XG5cdFx0XHR2YXIgY2hhdF9faXRlbV9sYXN0SWQgPSBkb2N1bWVudC5xdWVyeVNlbGVjdG9yKCcjY2hhdF9fbGlzdC1vdXQgLmNoYXRfX2xpc3QtaXRlbScpID8gZG9jdW1lbnQucXVlcnlTZWxlY3RvcignI2NoYXRfX2xpc3Qtb3V0IC5jaGF0X19saXN0LWl0ZW06bGFzdC1jaGlsZCcpLmdldEF0dHJpYnV0ZSgnZGF0YS1pZCcpIDogMDtcblxuXHRcdFx0dmFyIGZvcm1EYXRhID0gbmV3IEZvcm1EYXRhKGNoYXRfX2Zvcm0pO1xuXHRcdFx0Zm9ybURhdGEuYXBwZW5kKCdpZCcsIGNoYXRfX2l0ZW1fbGFzdElkKTtcblx0XHRcdGFqYXgoY3RyICsgJz9hY3Rpb249YWRkJywgZm9ybURhdGEsIGZ1bmN0aW9uIChkYXRhKSB7XG5cdFx0XHRcdGNoYXRfX2Zvcm1UZXh0YXJlYS52YWx1ZSA9ICcnO1xuXHRcdFx0XHRjaGF0X19mb3JtRmlsZS52YWx1ZSA9ICcnO1xuXHRcdFx0XHR2YXIgZGF0YUogPSBKU09OLnBhcnNlKGRhdGEpO1xuXG5cdFx0XHRcdGZvciAodmFyIGkgPSAwLCBsID0gZGF0YUoubGVuZ3RoOyBsID4gaTsgaSsrKSB7XG5cdFx0XHRcdFx0Y2hhdF9fbGlzdE91dC5pbnNlcnRBZGphY2VudEhUTUwoXCJiZWZvcmVFbmRcIiwgdGVtcGxhdGUoZGF0YUpbaV0pKTtcblx0XHRcdFx0fVxuXHRcdFx0XHQkKGNoYXRfX2xpc3QpLmFuaW1hdGUoeyBzY3JvbGxUb3A6ICQoY2hhdF9fbGlzdE91dCkuaGVpZ2h0KCkgfSwgNTAwLCAnc3dpbmcnLCBmdW5jdGlvbiAoKSB7fSk7XG5cdFx0XHR9KTtcblx0XHR9KTtcblxuXHRcdC8vINCf0YDQuNC90Y/RgtGMINGB0L7QvtCx0YnQtdC90LjQtSDQsiDRh9Cw0YJcblx0XHRzZXRJbnRlcnZhbChmdW5jdGlvbiAoKSB7XG5cblx0XHRcdHZhciBjaGF0X19pdGVtX2xhc3RJZCA9IGRvY3VtZW50LnF1ZXJ5U2VsZWN0b3IoJyNjaGF0X19saXN0LW91dCAuY2hhdF9fbGlzdC1pdGVtOmxhc3QtY2hpbGQnKTtcblxuXHRcdFx0Y2hhdF9faXRlbV9sYXN0SWQgPSBjaGF0X19pdGVtX2xhc3RJZCA/IGNoYXRfX2l0ZW1fbGFzdElkLmdldEF0dHJpYnV0ZSgnZGF0YS1pZCcpIDogMDtcblxuXHRcdFx0YWpheChjdHIgKyAnP2FjdGlvbj1hY2NlcHQmaWQ9JyArIGNoYXRfX2l0ZW1fbGFzdElkLCAnJywgZnVuY3Rpb24gKGRhdGEpIHtcblxuXHRcdFx0XHRpZiAoZGF0YSkge1xuXHRcdFx0XHRcdHZhciBkYXRhSiA9IEpTT04ucGFyc2UoZGF0YSk7XG5cdFx0XHRcdFx0dmFyIHRlbXBsYXRlQXJyID0gW107XG5cblx0XHRcdFx0XHRmb3IgKHZhciBpID0gMCwgbCA9IGRhdGFKLmxlbmd0aDsgbCA+IGk7IGkrKykge1xuXHRcdFx0XHRcdFx0aWYgKGRhdGFKW2kgKyAxXSkge1xuXHRcdFx0XHRcdFx0XHRpZiAobW9tZW50LnVuaXgoZGF0YUpbaV0udGltZXN0YW1wKS5mb3JtYXQoJ0RELk1NLllZWVknKSAhPSBtb21lbnQudW5peChkYXRhSltpICsgMV0udGltZXN0YW1wKS5mb3JtYXQoJ0RELk1NLllZWVknKSkge1xuXHRcdFx0XHRcdFx0XHRcdGRhdGFKW2ldLmRhdGUgPSBtb21lbnQudW5peChkYXRhSltpXS50aW1lc3RhbXApLmZvcm1hdCgnREQuTU0uWVlZWScpO1xuXHRcdFx0XHRcdFx0XHR9XG5cdFx0XHRcdFx0XHR9XG5cblx0XHRcdFx0XHRcdHRlbXBsYXRlQXJyLnB1c2godGVtcGxhdGUoZGF0YUpbaV0pKTtcblx0XHRcdFx0XHR9XG5cdFx0XHRcdFx0Y2hhdF9fbGlzdE91dC5pbnNlcnRBZGphY2VudEhUTUwoXCJiZWZvcmVFbmRcIiwgdGVtcGxhdGVBcnIuam9pbignICcpKTtcblx0XHRcdFx0XHQkKGNoYXRfX2xpc3QpLmFuaW1hdGUoeyBzY3JvbGxUb3A6ICQoY2hhdF9fbGlzdE91dCkuaGVpZ2h0KCkgfSwgNTAwLCAnc3dpbmcnLCBmdW5jdGlvbiAoKSB7fSk7XG5cdFx0XHRcdH1cblx0XHRcdH0pO1xuXHRcdH0sIDIwMDApO1xuXHR9XG59KSgpOyIsIid1c2Ugc3RyaWN0JztcblxuKGZ1bmN0aW9uICgpIHtcblx0dmFyIHJlc2V0ID0gZnVuY3Rpb24gcmVzZXQoZm9ybSkge1xuXHRcdHZhciBmaWVsZCA9IGZvcm0ucXVlcnlTZWxlY3RvckFsbCgnW25hbWVdJyk7XG5cdFx0Zm9yICh2YXIgaSA9IDAsIGwgPSBmaWVsZC5sZW5ndGg7IGwgPiBpOyBpKyspIHtcblx0XHRcdGZpZWxkW2ldLnZhbHVlID0gJyc7XG5cdFx0fVxuXHR9O1xuXG5cdC8vIGRvY3VtZW50LnF1ZXJ5U2VsZWN0b3IoJ2Zvcm0gW3R5cGU9XCJzdWJtaXRcIl0nKS5hZGRFdmVudExpc3RlbmVyKFwiY2xpY2tcIiwgZnVuY3Rpb24oZSl7XG5cdC8vIFx0ZS5wcmV2ZW50RGVmYXVsdCgpO1xuXHQvLyBcdGZvcihsZXQgaT0gMCwgbD0gZS5wYXRoLmxlbmd0aDsgbCA+IGk7IGkrKyApe1xuXHQvLyBcdFx0aWYoIGUucGF0aFtpXS50YWdOYW1lLnRvTG93ZXJDYXNlKCkgPT0gJ2Zvcm0nICl7XG5cdC8vIFx0XHRcdHJlc2V0KGUucGF0aFtpXSk7XG5cdC8vIFx0XHRcdGJyZWFrO1xuXHQvLyBcdFx0fVxuXHQvLyBcdH1cblx0Ly8gfSk7XG59KSgpOyIsIid1c2Ugc3RyaWN0JztcblxuKGZ1bmN0aW9uICgpIHtcblx0dmFyIG1vZGFsX19jbG9zZSA9IGZ1bmN0aW9uIG1vZGFsX19jbG9zZShlbCkge1xuXHRcdHZhciBtb2RhbF9fY2xvc2UgPSBkb2N1bWVudC5xdWVyeVNlbGVjdG9yQWxsKGVsKTtcblx0XHRmb3IgKHZhciBpID0gMCwgbCA9IG1vZGFsX19jbG9zZS5sZW5ndGg7IGwgPiBpOyBpKyspIHtcblx0XHRcdG1vZGFsX19jbG9zZVtpXS5hZGRFdmVudExpc3RlbmVyKCdjbGljaycsIGZ1bmN0aW9uICgpIHtcblx0XHRcdFx0ZG9jdW1lbnQucXVlcnlTZWxlY3RvcignLm1vZGFsLmFjdGl2ZScpLmNsYXNzTGlzdC5yZW1vdmUoJ2FjdGl2ZScpO1xuXHRcdFx0fSk7XG5cblx0XHRcdG1vZGFsX19jbG9zZVtpXS5hZGRFdmVudExpc3RlbmVyKCd0b3VjaCcsIGZ1bmN0aW9uICgpIHtcblx0XHRcdFx0ZG9jdW1lbnQucXVlcnlTZWxlY3RvcignLm1vZGFsLmFjdGl2ZScpLmNsYXNzTGlzdC5yZW1vdmUoJ2FjdGl2ZScpO1xuXHRcdFx0fSk7XG5cdFx0fVxuXHR9O1xuXG5cdG1vZGFsX19jbG9zZSgnLm1vZGFsX19jbG9zZScpO1xufSkoKTsiLCIndXNlIHN0cmljdCc7XG5cbihmdW5jdGlvbiAoKSB7XG5cdC8vIGxldCBidG5Ub2dnbGU9IGRvY3VtZW50LmdldEVsZW1lbnRzQnlDbGFzc05hbWUoJ21vcmUtaW5mb19fYnRuLXRvZ2dsZScpO1xuXG5cdC8vIGZvcihsZXQgaT0gMCwgbD0gYnRuVG9nZ2xlLmxlbmd0aDsgbCA+IGk7IGkrKyl7XG5cdC8vIFx0YnRuVG9nZ2xlW2ldLmFkZEV2ZW50TGlzdGVuZXIoJ2NsaWNrJywgZnVuY3Rpb24oZSl7XG5cdC8vIFx0XHRmb3IobGV0IGo9IDAsIGwyPSBlLnBhdGgubGVuZ3RoOyBsMiA+IGo7IGorKyl7XG5cdC8vIFx0XHRcdGlmKCBlLnBhdGhbal0uY2xhc3NMaXN0LmNvbnRhaW5zKCdtb3JlLWluZm9fX2l0ZW0nKSl7XG5cdC8vIFx0XHRcdFx0ZS5wYXRoW2pdLmNsYXNzTGlzdC50b2dnbGUoJ2FjdGl2ZScpO1xuXHQvLyBcdFx0XHRcdGJyZWFrO1xuXHQvLyBcdFx0XHR9XG5cdC8vIFx0XHR9XG5cdC8vIFx0fSk7XG5cdC8vIH1cblxuXHQkKCcubW9yZS1pbmZvX19idG4tdG9nZ2xlJykub24oXCJjbGlja1wiLCBmdW5jdGlvbiAoZSkge1xuXHRcdHZhciBtb3JlSW5mb19faXRlbSA9ICQodGhpcykucGFyZW50cygnLm1vcmUtaW5mb19faXRlbScpO1xuXHRcdHZhciBtb3JlSW5mb19fYm94VG9nZ2xlID0gbW9yZUluZm9fX2l0ZW0uZmluZCgnLm1vcmUtaW5mb19fYm94LXRvZ2dsZScpO1xuXHRcdGlmICghbW9yZUluZm9fX2l0ZW0uaGFzQ2xhc3MoJ2FjdGl2ZScpKSB7XG5cdFx0XHRtb3JlSW5mb19fYm94VG9nZ2xlLnN0b3AoKS5mYWRlSW4oNjAwKTtcblx0XHR9IGVsc2Uge1xuXHRcdFx0bW9yZUluZm9fX2JveFRvZ2dsZS5zdG9wKCkuZmFkZU91dCgwKTtcblx0XHR9XG5cdFx0bW9yZUluZm9fX2l0ZW0udG9nZ2xlQ2xhc3MoJ2FjdGl2ZScpO1xuXHR9KTtcbn0pKCk7IiwiJ3VzZSBzdHJpY3QnO1xuXG4vLyDQkNC60YLQuNCy0L3Ri9C5INC/0YPQvdC60YIg0LzQtdC90Y5cbihmdW5jdGlvbiAoKSB7XG5cdHZhciBmdW5BY3RpdmVNZW51X19pdGVtID0gZnVuY3Rpb24gZnVuQWN0aXZlTWVudV9faXRlbShldmVudCwgZWwpIHtcblx0XHRmb3IgKHZhciBpID0gMCwgbCA9IGVsLmxlbmd0aDsgbCA+IGk7IGkrKykge1xuXHRcdFx0ZWxbaV0uYWRkRXZlbnRMaXN0ZW5lcihldmVudCwgZnVuY3Rpb24gKGUpIHtcblx0XHRcdFx0Zm9yICh2YXIgaiA9IDAsIGwyID0gZWwubGVuZ3RoOyBsMiA+IGo7IGorKykge1xuXHRcdFx0XHRcdGVsW2pdLmNsYXNzTGlzdC5yZW1vdmUoJ2FjdGl2ZScpO1xuXHRcdFx0XHR9XG5cblx0XHRcdFx0Zm9yICh2YXIgX2ogPSAwLCBfbCA9IGUucGF0aC5sZW5ndGg7IF9sID4gX2o7IF9qKyspIHtcblx0XHRcdFx0XHRpZiAoZS5wYXRoW19qXS50YWdOYW1lID09ICdMSScpIHtcblx0XHRcdFx0XHRcdGUucGF0aFtfal0uY2xhc3NMaXN0LmFkZCgnYWN0aXZlJyk7XG5cdFx0XHRcdFx0XHRicmVhaztcblx0XHRcdFx0XHR9XG5cdFx0XHRcdH1cblx0XHRcdH0pO1xuXHRcdH1cblx0fTtcblxuXHR2YXIgbmF2X2hlYWRlciA9IGRvY3VtZW50LnF1ZXJ5U2VsZWN0b3JBbGwoJy5uYXZfaGVhZGVyIC5uYXZfX2l0ZW0nKTtcblx0ZnVuQWN0aXZlTWVudV9faXRlbSgnY2xpY2snLCBuYXZfaGVhZGVyKTtcblx0ZnVuQWN0aXZlTWVudV9faXRlbSgndG91Y2gnLCBuYXZfaGVhZGVyKTtcbn0pKCk7Il19
