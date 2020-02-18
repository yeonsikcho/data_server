
/*-----------
전환사채 관련 Javascript
-----------*/

function cellRenderer(instance, td, row, col, prop, value, cellProperties) {
    Handsontable.renderers.TextRenderer.apply(this, arguments);
    td.style.background = '#ffcab3';
  }

//관련메모
var container = document.getElementById('bondmemo');
var bondmemo_hot = new Handsontable(container, {licenseKey:'non-commercial-and-evaluation',
  minCols: 1, maxCols: 1,
  minRows: 1, maxRows: 1,
  rowHeights: [70],
  colWidths:[500],
  className: "htLeft",
});
var container = document.getElementById('changehistory');
var changehistory_hot = new Handsontable(container, {licenseKey:'non-commercial-and-evaluation',
  minCols: 3, maxCols: 3,
  colHeaders: ['수정시간','수정자','수정전내역조회'],
  columns: [{readOnly:true},{readOnly:true},{readOnly:true, renderer:"html"}],
  colWidths:[200,150,150],
  className: "htCenter",
});
  
//채권부분
var container = document.getElementById('bond');
var bond_hot = new Handsontable(container, {licenseKey:'non-commercial-and-evaluation',
  minCols: 1, maxCols: 1,
  minRows: 3, maxRows: 3,
  rowHeaderWidth: 150,
  rowHeaders: ['BondID','발행일', '주당 매매가격'], colHeaders: false,
  contextMenu: true,
  colWidths: [250],
  className: "htCenter",
  // cells: function(row, col, prop){
  //   var cellProperties = {};
  //   if (row>=2){cellProperties.renderer = highlight_yellow;}
  //   else {cellProperties.renderer = cellRenderer;}
  //   return cellProperties;
  // }
});

//기업등급
var container = document.getElementById('pgcode');
var pgcode_hot = new Handsontable(container, {licenseKey:'non-commercial-and-evaluation',
  minCols: 4, maxCols: 4,
  rowHeaders: false, colHeaders: ['flag','날짜','등급','출처'],
  columns: [{},{},{type:'autocomplete', source:['AAA','AA+','AA','AA-','A+','A','A-','BBB+','BBB','BBB-','BB+','BB','BB-','B+','B','B-','CCC','CC','C'], strict:true},{type:'dropdown', source:['KISLINE(모형)','KISLINE(평가)','회사채등급','이크레더블','나이스디앤비','Shadow','기타']}],
  contextMenu: true,
  colWidths: [150,150,150,150],
  className: "htCenter",
  manualColumnResize: true,
  manualRowResize: true,
  // cells: function(row, col, prop){
  //   var cellProperties = {};
  //   cellProperties.renderer = highlight_yellow;
  //   return cellProperties;
  // }
});

//전환주식
var container = document.getElementById('convstock');
var convstock_hot = new Handsontable(container, {licenseKey:'non-commercial-and-evaluation',
  minCols: 2, maxCols: 2,
  minRows: 1, maxRows: 1,
  rowHeaders: false, colHeaders: ['업체코드','업체명'],
  contextMenu: true,
  columns: [{},{readOnly:true}],
  colWidths: [150,450],
  className: "htCenter",
  manualColumnResize: true,
  manualRowResize: true,
  // cells: function(row, col, prop){
  //   var cellProperties = {};
  //   cellProperties.renderer = highlight_yellow;
  //   return cellProperties;
  // }
});

// //투입변수 선택시 값 조회
// Handsontable.hooks.add('afterChange', function(changes, source) {
// 	if (changes != null){
// 		if (changes[0][1] == '0'){ //선택시
// 			$.ajax({
// 			url: "/pricer/getupchename",
// 			data: {'upchecd': changes[0][3]},
// 			dataType: 'json',
// 			success: function (data) {convstock_hot.setDataAtCell(0,1,data.name)}
// 			})
// 	}}}, convstock_hot);
	
//풋콜정보
var container = document.getElementById('ptclinfo');
var ptclinfo_hot = new Handsontable(container, {licenseKey:'non-commercial-and-evaluation',
  minCols: 5, maxCols: 5,
  minRows: 1,
  rowHeaders: false, colHeaders: ['시작일','종료일','계산주기','생산주기','IRR'],
  contextMenu: true,
  colWidths: [150,150,150,150,150],
  className: "htCenter",
  manualColumnResize: true,
  manualRowResize: true,
  // cells: function(row, col, prop){
  //   var cellProperties = {};
  //   cellProperties.renderer = highlight_yellow;
  //   return cellProperties;
  // }
});

//풋콜스케줄
var container = document.getElementById('ptclschedule');
var ptclschedule_hot = new Handsontable(container, {licenseKey:'non-commercial-and-evaluation',
  minCols: 3, maxCols:3,
  minRows: 1,
  rowHeaders: false, colHeaders: ['시작일','종료일','행사가'],
  contextMenu: true,
  colWidths: [150,150,150],
  className: "htCenter",
  manualColumnResize: true,
  manualRowResize: true,
  // cells: function(row, col, prop){
  //   var cellProperties = {};
  //   cellProperties.renderer = highlight_yellow;
  //   return cellProperties;
  // }
});

Handsontable.hooks.add('afterChange', function(changes, source){
  if (source != 'loadData'){
    if (changes[0][2] != changes[0][3]){
      checkUnload = false;
    }
  }
}, bondmemo_hot)

Handsontable.hooks.add('afterChange', function(changes, source){
  if (source != 'loadData'){
    if (changes[0][2] != changes[0][3]){
      checkUnload = false;
    }
    if (changes && bond_hot.getDataAtCell(0,0) != '신규업체' && changes[0][2] != changes[0][3]){
      var meta = this.getCellMeta(changes[0][0],changes[0][1]);
      meta.changed = 1;
      this.render();
    }
  } else if (changes) {
    var meta = this.getCellMeta(changes[0][0],changes[0][1]);
    meta.changed = null;
    this.render()
  }
}, bond_hot);

Handsontable.hooks.add('afterChange', function(changes, source){
  if (source != 'loadData'){
    if (changes[0][2] != changes[0][3]){
      checkUnload = false;
    }
    if (changes[0][1] == 3 & changes[0][3] == '기타'){
        var pgcode_source = prompt('기업등급 출처');
        if (pgcode_source != null){
          pgcode_hot.setCellMeta(changes[0][0],3,'source',['KISLINE(모형)','KISLINE(평가)','회사채등급','이크레더블','나이스디앤비','Shadow','기타','기타('+pgcode_source+')']);
          pgcode_hot.setDataAtCell(changes[0][0],3, '기타('+pgcode_source+')');
        } else {
          alert('기타등급 사용시 출처를 입력하세요');
          pgcode_hot.setCellMeta(changes[0][0],3,'source',['KISLINE(모형)','KISLINE(평가)','회사채등급','이크레더블','나이스디앤비','Shadow','기타',changes[0][2]]);
          pgcode_hot.setDataAtCell(changes[0][0],3, changes[0][2]);
        }
    }
    if (changes && changes[0][2] != changes[0][3] && choosesec_hot.getDataAtCell(0,0) != '신규엽체'){
      var meta = this.getCellMeta(changes[0][0],changes[0][1]);
      meta.changed = 1;
      this.render();
    }
  } else if (changes) {
    var meta = this.getCellMeta(changes[0][0],changes[0][1]);
    meta.changed = null;
    this.render()
  }
}, pgcode_hot);

var hooks_change = true;
Handsontable.hooks.add('afterChange', function(changes, source){
  if (changes != null){
    var meta = this.getCellMeta(changes[0][0],changes[0][1]);
    meta.changed = null;
    this.render()
    if (changes[0][1] == '0'){ //선택시
      $.ajax({
        url: "/pricer/getupchename",
        data: {'upchecd': changes[0][3]},
        dataType: 'json',
        success: function (data) {convstock_hot.setDataAtCell(0,1,data.name)}
      })
    } else {
    	if (this.getCellMeta(0,0).changed == null){hooks_change=true;}
    }
  }
  if (source != 'loadData'){
    if (changes && convstock_hot.getDataAtCell(0,0) != '신규업체' && changes[0][2] != changes[0][3] && hooks_change == false){
      checkUnload = false;
      var meta = this.getCellMeta(changes[0][0],changes[0][1]);
      meta.changed = 1;
      this.render();
    }
    hooks_change = false;
  }
}, convstock_hot);

Handsontable.hooks.add('afterChange', function(changes, source){
  if (source != 'loadData'){
    if (changes[0][2] != changes[0][3]){
      checkUnload = false;
    }
    if (changes && ptclinfo_hot.getDataAtCell(0,0) != '신규업체' && changes[0][2] != changes[0][3]){
      var meta = this.getCellMeta(changes[0][0],changes[0][1]);
      meta.changed = 1;
      this.render();
    }
  } else if (changes) {
    var meta = this.getCellMeta(changes[0][0],changes[0][1]);
    meta.changed = null;
    this.render()
  }
}, ptclinfo_hot);

Handsontable.hooks.add('afterChange', function(changes, source){
  if (source != 'loadData'){
    if (changes[0][2] != changes[0][3]){
      checkUnload = false;
    }
    if (changes && ptclschedule_hot.getDataAtCell(0,0) != '신규업체' && changes[0][2] != changes[0][3]){
      var meta = this.getCellMeta(changes[0][0],changes[0][1]);
      meta.changed = 1;
      this.render();
    }
  } else if (changes) {
    var meta = this.getCellMeta(changes[0][0],changes[0][1]);
    meta.changed = null;
    this.render()
  }
}, ptclschedule_hot);

var checkbox_status_dict = {};
function initialize_checkbox_dict(){
  checkbox_status_dict['option_auto'] = [$("#option_auto").is(":checked"), 0];
}
function checkbox_ischange(id){
  if (checkbox_status_dict[id][0] != $("#"+id).is(":checked")){
    checkbox_status_dict[id][1] = 1;
  } else {
    checkbox_status_dict[id][1] = 0;
  }
}
function highlight_yellow(instance, td, row, col, prop, value, cellProperties) {
  Handsontable.renderers.TextRenderer.apply(this, arguments);
  Handsontable.renderers.NumericRenderer.apply(this, arguments);
  if (cellProperties.changed != null){td.style.background = '#FFFFCC';}
} 

function makecallput(){
	if ($("#option_auto").is(":checked")){
		$.ajax({
		url: "/pricer/sdvmakecallput",
		data: {'bond':  JSON.stringify(bond_hot.getData()),'ptclinfo':JSON.stringify(ptclinfo_hot.getData())},
		dataType: 'json',
		success: function (data) {
			if (data.hasOwnProperty('msg')){alert(data.msg);}
			if (data.hasOwnProperty('cf')){ptclschedule_hot.loadData(data.cf);}
		}})
	} else {
    	alert('수기입력 상태에서는 스케줄을 생성할 수 없습니다');
  	}
}

function loadinfo(bond_id, edittime, editor){
	if (bond_id ==null){
		bond_id = bond_hot.getDataAtCell(0,0)
	}
	if (check_copyandpaste == true){
		bond_id2 = choosesec_hot.getDataAtCell(0,0);
	} else {
		bond_id2 = null;
	}
	var h = document.getElementById('secheader');
	hooks_change = true;
	$.ajax({
	url: "/pricer/sdvloadinfo",
	data: {'bond_id': bond_id,'edittime':edittime,'editor':editor, 'bond_id2':bond_id2},
	dataType: 'json',
	success: function (data) {
		if (data.msg != null){alert(data.msg)}
		bondmemo_hot.loadData(data.bondmemo);
		bond_hot.loadData(data.bond);
		bond_hot.setCellMeta(0,0,'readOnly',true);
		bond_hot.setCellMeta(1,0,'readOnly',true);
		pgcode_hot.loadData(data.pgcode);
		//conversion_hot.loadData(data.conversion);
		if (data.convstock[0][0] != '' & data.convstock[0][0] != null){
			convstock_hot.setDataAtCell(0,0,data.convstock[0][0]);
		}
		ptclinfo_hot.loadData(data.ptclinfo);
		ptclschedule_hot.loadData(data.ptclschedule);
    if (data.option_auto == '0'){$('#option_auto').prop('checked', false);} else {$('#option_auto').prop('checked', true);}
		h.innerHTML = data.header;
    initialize_checkbox_dict();
		changehistory_hot.loadData(data.changehistory);
    if (edittime != 'none' && edittime != undefined) {
      //bond_highlights
      bond_hot.updateSettings({cells:function(row, col, prop){
        var cellProperties = {};
        if (row<2){cellProperties.className = 'set_render'};
        for (r=0; r<bond_hot.countRows(); r++){
            if (data.highlights.bond_highlights[r] != null){if (row==r & col==0){cellProperties.className = 'set_yellow';}}
        } // bond_hot.setCellMeta(r,0,'changed',data.highlights.bond_highlights[r])
        return cellProperties
      }})
      //pgcode_highlights
      pgcode_hot.updateSettings({cells: function(row, col, prop){
        var cellProperties = {};
        for (r=0; r<pgcode_hot.countRows(); r++){
          for (c=0; c<pgcode_hot.countCols(); c++){
            if (data.highlights.pgcode_highlights[r][c] != null){if(row==r & col==c){cellProperties.className = 'set_yellow';}
            } //pgcode_hot.setCellMeta(r, c, 'changed', data.highlights.pgcode_highlights[r][c]);}
          }
        } return cellProperties
      }})
      //convstock_highlights
      convstock_hot.updateSettings({cells:function(row, col, prop){
        var cellProperties = {};
        for (r=0; r<convstock_hot.countRows(); r++){
            if (data.highlights.convstock_highlights[r] != null){if (row==r){cellProperties.className = 'set_yellow';}}
        } // convstock_hot.setCellMeta(r,0,'changed',data.highlights.convstock_highlights[r])
        return cellProperties
      }})
      //ptclinfo_highlights
      ptclinfo_hot.updateSettings({cells: function(row, col, prop){
        var cellProperties = {};
        for (r=0; r<ptclinfo_hot.countRows(); r++){
          for (c=0; c<ptclinfo_hot.countCols(); c++){
            if (data.highlights.ptclinfo_highlights[r][c] != null){if(row==r & col==c){cellProperties.className = 'set_yellow';}
            } //ptclinfo_hot.setCellMeta(r, c, 'changed', data.highlights.ptclinfo_highlights[r][c]);}
          }
        } return cellProperties
      }})
			//ptclschedule_highlights
			for (r=0; r<ptclschedule_hot.countRows(); r++){
				for (c=0; c<ptclschedule_hot.countCols(); c++){ptclschedule_hot.setCellMeta(r, c, 'changed', data.highlights.ptclschedule_highlights[r][c]);}
			}
      //ptclschedule_highlights
      ptclschedule_hot.updateSettings({cells: function(row, col, prop){
        var cellProperties = {};
        for (r=0; r<ptclschedule_hot.countRows(); r++){
          for (c=0; c<ptclschedule_hot.countCols(); c++){
            if (data.highlights.ptclschedule_highlights[r][c] != null){if(row==r & col==c){cellProperties.className = 'set_yellow';}
            } //ptclschedule_hot.setCellMeta(r, c, 'changed', data.highlights.ptclschedule_highlights[r][c]);}
          }
        } return cellProperties
      }})

			// bond_hot.render();
			// pgcode_hot.render();
			// convstock_hot.render();
			// ptclinfo_hot.render();
			// ptclschedule_hot.render();
	    } else {
      //bond_highlights
      bond_hot.updateSettings({cells:function(row, col, prop){
        var cellProperties = {};
        if (row<2){cellProperties.className = 'set_render'};
        return cellProperties
      }})
    }
		document.title = data.bond[0][0].split("|")[1] + "정보 " + data.header;
	}})
}

var checkUnload = true;
function saveinfo(){
  // 변동사항 없을 때 저장 불가
  var count = 0;
  if (checkUnload) {
    for (var key in checkbox_status_dict){
      count = count + checkbox_status_dict[key][1];
    }
    if (count == 0){
      alert("수정된 내용이 없을경우 저장불가");
      return
    }
  };
  if (!file_exists){
    alert("공용폴더에 파일이 없을경우 저장불가");
    return
  };
	if (choosesec_hot.getDataAtCell(0,0) == bond_hot.getDataAtCell(0,0) || choosesec_hot.getDataAtCell(0,0) == '신규입력'){//BondID 부터 체크 틀릴경유 저장 취소
    	var bond_highlights = []	
		for (r=0; r<bond_hot.countRows(); r++){
	      bond_highlights.push(bond_hot.getCellMeta(r, 0).changed);
	    }

	    var pgcode_highlights = []
	    for (r=0; r<pgcode_hot.countRows(); r++){
	      tmp = []
	      for (c=0; c<pgcode_hot.countCols(); c++){tmp.push(pgcode_hot.getCellMeta(r, c).changed)}
	      pgcode_highlights.push(tmp);
	    }

	    var convstock_highlights = []
	    for (r=0; r<convstock_hot.countCols(); r++){
	      convstock_highlights.push(convstock_hot.getCellMeta(0, r).changed);
	    }

	    var ptclinfo_highlights = []
	    for (r=0; r<ptclinfo_hot.countRows(); r++){
	      tmp = []
	      for (c=0; c<ptclinfo_hot.countCols(); c++){tmp.push(ptclinfo_hot.getCellMeta(r, c).changed)}
	      ptclinfo_highlights.push(tmp);
	    }

	    var ptclschedule_highlights = []
	    for (r=0; r<ptclschedule_hot.countRows(); r++){
	      tmp = []
	      for (c=0; c<ptclschedule_hot.countCols(); c++){tmp.push(ptclschedule_hot.getCellMeta(r, c).changed)}
	      ptclschedule_highlights.push(tmp);
	    }
		$.ajax({
			url: "/pricer/sdvsaveinfo",
			data: {'bondmemo':bondmemo_hot.getDataAtCell(0,0),
			'bond': JSON.stringify(bond_hot.getData()),
			'pgcode': JSON.stringify(pgcode_hot.getData()),
			'convstock': JSON.stringify(convstock_hot.getData()),
			'ptclinfo': JSON.stringify(ptclinfo_hot.getData()),
			'ptclschedule': JSON.stringify(ptclschedule_hot.getData()),
			'bond_highlights': JSON.stringify(bond_highlights),
			'pgcode_highlights': JSON.stringify(pgcode_highlights),
			'convstock_highlights': JSON.stringify(convstock_highlights),
			'ptclinfo_highlights': JSON.stringify(ptclinfo_highlights),
			'ptclschedule_highlights': JSON.stringify(ptclschedule_highlights),
      'option_auto': $("#option_auto").is(":checked"),
			},
			dataType: 'json',
			success: function (data) {
        alert(data.msg);
        initialize_checkbox_dict();
      }
			})
	}
	else{
		alert('Bond ID가 일치하지 않습니다');	
	}
}

var check_copyandpaste = false;
function copyandpaste(){
  var bond_id2 = document.getElementById('bond_id2').value;
  if (bond_id2 == '' | bond_id2 == null){alert('복사할 본드아이디가 없습니다'); return}
  bond_id = choosesec_hot.getDataAtCell(0,0);
  if (bond_id == bond_id2){alert('같은 본드아이디입니다'); return}
  check_copyandpaste = true;
  loadinfo(bond_id2, 'none','none');
  check_copyandpaste = false;
}