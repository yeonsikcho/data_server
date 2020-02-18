//채권정보 조회시 외부스크립트 조회용
jQuery.loadScript = function (url, callback) {
	jQuery.ajax({
		url: url,
		dataType: 'script',
		complete: callback,
		async: true
	});
}

//float menu 용
$(document).ready(function(){
	$("#floatmenu").css({
		border: '2px solid #fff'
	})
	var floatPosition = parseInt($("#floatmenu").css('top'));
	var scrollHeight;
	$(window).scroll(function(){
		var scrollTop = $(window).scrollTop();
		scrollHeight = $(window).height();
		var newPosition = scrollTop + floatPosition + "px";
		$("#floatmenu").css('top',newPosition);
		$("#floatmenu").stop().animate({
			"top" : newPosition
		}, 500);
		if (scrollHeight >= 1000){
			$('#MOVE_TOP_BTN').fadeIn();
			$('#MOVE_BOTTOM_BTN').fadeIn();
		} else {
			$('#MOVE_TOP_BTN').fadeOut();
			$('#MOVE_BOTTOM_BTN').fadeOut();
		}
		// if ($(this).scrollTop() > 500) {
		// 	$('#MOVE_TOP_BTN').fadeIn();
		// } else {
		// 	$('#MOVE_TOP_BTN').fadeOut();
		// };
		// if ($(this).scrollTop() < scrollHeight - 1000){
		// 	$('#MOVE_BOTTOM_BTN').fadeIn();
		// } else {
		// 	$('#MOVE_BOTTOM_BTN').fadeOut();
		// }
	}).scroll();

	$('#MOVE_TOP_BTN').click(function(){
		$('html, body').animate({
			scrollTop : 0
		}, 400);
	});
	$('#MOVE_BOTTOM_BTN').click(function(){
		$('html, body').animate({
			scrollTop : scrollHeight
		}, 400);
	});
});


