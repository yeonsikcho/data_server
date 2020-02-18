function openTab(evt, tabName, loadind=true) {
	if (!valid_job_index){
		alert('업무번호가 세팅되어 있지 않습니다');
		return
	}
	
	if (changed){
		if (! confirm("저장안하고 넘어가시겠습니까?")){return}
	}
	
    // Declare all variables
    var i, tabcontent, tablinks;
		
	//이동탭의 fid
	curtarget = evt.currentTarget
	new_fid = tabName

	$.ajax({
		url: "/pricer/pefvloadpage/",
		data: {	'keys':JSON.stringify(keys_hot.getData()),	'new_fid':new_fid, 'jobinfo':JSON.stringify(jobinfo_hot.getData())},
		dataType: 'json',
		type:'POST',
		success: function (data) {
			if (data.status==0){
				alert(data.msg);
				return;
			}
			if (new_fid == 'investments'){
				document.getElementById('investments').style.display = "block";
				itemlist_hot.loadData(data.itemlist);
				itemlist_hot.updateSettings({
					comments:true,
					cell:data.commentlist,
				});
				makeuploader(data.itemfile_list);
			}
			else{
				document.getElementById('fund').style.display = "block";
				fundlabel.innerHTML = "<h4>"+new_fid+"</h4>"
				inv_hot.loadData(data.inv);
				if (data.inv.length>0){//투자자산 이론가 재 계산
					inv_hot.setDataAtCell(0,3,inv_hot.getDataAtCell(0,3));
					changed = false;
				}
				if (data.bs != null){
					bs_hot.loadData(data.bs);
				}
				else{
					bs_hot.loadData([['재무제표 기준일','재무제표 기준일',null, null,null,null,null,jobinfo_hot.getDataAtCell(2,1),jobinfo_hot.getDataAtCell(2,1),null],
				['자산','현금성자산',null,null,null,null,null,null,null,null],
				[null,'투자자산',null,null,null,null,null,null,null,null],
				[null,'기타자산',null,null,null,null,null,null,null,null],
				[null,'자산총계',null,null,null,null,null,null,null,null],
				['부채','부채항목',null,null,null,null,null,null,null,null],
				[null,'부채총계',null,null,null,null,null,null,null,null],
				['자본','순자산가치',null,null,null,null,null,null,null,null],
				['출자금','좌수',null,null,null,null,null,null,null,null],
				['표시단위','표시단위',1,null,null,null,null,null,null,null],
				['평가가치','좌당가치',null,null,null,null,null,null,null,null],
				['평가가치(우손충)',null,null,null,null,null,null,null,null,null]]);
				}
				make_fund_uploader(keys_hot.getDataAtCell(0,0), new_fid)
			}
			// Get all elements with class="tabcontent" and hide them
			tabcontent = document.getElementsByClassName("tabcontent");
			for (i = 0; i < tabcontent.length; i++) {
				tabcontent[i].style.display = "none";
			}

			// Get all elements with class="tablinks" and remove the class "active"
			tablinks = document.getElementsByClassName("tablinks");
			for (i = 0; i < tablinks.length; i++) {
				tablinks[i].className = tablinks[i].className.replace(" active", "");
			}
			//alert(new_fid);
			// Show the current tab, and add an "active" class to the button that opened the tab
			if (new_fid == 'investments'){
				document.getElementById('investments').style.display = "block";
				}
			else{document.getElementById('fund').style.display = "block";}
			curtarget.className+=" active";
			
			fid = new_fid
		}
	})
}

String.prototype.replaceAll = function(search, replacement) {
    var target = this;
    return target.replace(new RegExp(search, 'g'), replacement);
};



function update_warning(container){
	container.innerHTML = 
	"<table style='font-size:12px'><tbody><tr><td>장부상 투자자산:</td><td>"+indsign(bsprice_ind)+"</td><td style='width:40px'>&nbsp;</td><td >장부상 자본:</td><td>"+indsign(cap_ind[0])+"</td></tr>"+
	"<tr><td>추가출자:</td><td>"+indsign(cap_ind[1])+"</td><td>&nbsp;</td><td>원금분배:</td><td>"+indsign(cap_ind[2])+"</td></tr>"+
	"<tr><td>이익분배:</td><td>"+indsign(cap_ind[3])+"</td><td>&nbsp;</td><td>자산/부채변동:</td><td>"+indsign(cap_ind[4])+"</td></tr></tbody></table>"
	/*
	"<p>장부상 투자자산:" + indsign(bsprice_ind) + "장부상 자본:" + indsign(cap_ind[0])+"</p>"+
	"<p>추가출자:" + indsign(cap_ind[1]) +"원금분배:" + indsign(cap_ind[2])+"</p>"+
	"<p>이익분배:" + indsign(cap_ind[3]) +"자산/부채변동:" + indsign(cap_ind[4])+"</p>"*/
}

function indsign(indicator){
	if (indicator){return '<font color = "green">OK</font>'}
	return '<font color = "red">ERROR</font>'
}


function cellRenderer_red(instance, td, row, col, prop, value, cellProperties) {
	Handsontable.renderers.TextRenderer.apply(this, arguments);
	Handsontable.renderers.NumericRenderer.apply(this, arguments);
	td.style.background = '#ffcab3';
	cellProperties.readOnly = true;
}
function cellRenderer_blue(instance, td, row, col, prop, value, cellProperties) {
	Handsontable.renderers.NumericRenderer.apply(this, arguments);
	td.style.background = '#9bd4f5';
}
 
function cellRenderer_yellow(instance, td, row, col, prop, value, cellProperties) {
	Handsontable.renderers.NumericRenderer.apply(this, arguments);
	td.style.background = '#E5E500';
}

function cellRenderer_maincat(instance, td, row, col, prop, value, cellProperties) {
	Handsontable.renderers.NumericRenderer.apply(this, arguments);
	td.style.background = '#696969';
	td.style.color = 'white';
	cellProperties.readOnly = true;
}

function cellRenderer_black(instance, td, row, col, prop, value, cellProperties) {
	Handsontable.renderers.NumericRenderer.apply(this, arguments);
	td.style.background = '#E7E7E7';
}

function cellRenderer_grey(instance, td, row, col, prop, value, cellProperties) {
	Handsontable.renderers.NumericRenderer.apply(this, arguments);
	td.style.background = '#f2f2f2';
}

function partof(arr, item){
	if (arr.indexOf(item)>-1){
		return true
	}
	return false
}

function add(a, b) {
	a = parseFloat(a)
	b = parseFloat(b)
    return a + b;
}

