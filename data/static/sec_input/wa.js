
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
  rowHeaders: ['BondID','발행일','주당가'], colHeaders: false,
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
	
//전환권
var container = document.getElementById('conversion');
var conversion_hot = new Handsontable(container, {licenseKey:'non-commercial-and-evaluation',
  minCols: 5, maxCols: 5,
  minRows: 1,
  rowHeaders: false, colHeaders: ['리픽싱일','행사시작일','행사종료일','전환가','비확실'],
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
    if (changes && conversion_hot.getDataAtCell(0,0) != '신규업체' && changes[0][2] != changes[0][3]){
      var meta = this.getCellMeta(changes[0][0],changes[0][1]);
      meta.changed = 1;
      this.render();
    }
  } else if (changes) {
    var meta = this.getCellMeta(changes[0][0],changes[0][1]);
    meta.changed = null;
    this.render()
  }
}, conversion_hot);

function highlight_yellow(instance, td, row, col, prop, value, cellProperties) {
  Handsontable.renderers.TextRenderer.apply(this, arguments);
  Handsontable.renderers.NumericRenderer.apply(this, arguments);
  if (cellProperties.changed != null){td.style.background = '#FFFFCC';}
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
		bond_hot.setCellMeta(0,0,'readOnly',true)
		bond_hot.setCellMeta(1,0,'readOnly',true)
		conversion_hot.loadData(data.conversion);
		if (data.convstock[0][0] != '' & data.convstock[0][0] != null){
		convstock_hot.setDataAtCell(0,0,data.convstock[0][0]);
		}
		h.innerHTML = data.header;
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
      //convstock_highlights
      convstock_hot.updateSettings({cells:function(row, col, prop){
        var cellProperties = {};
        for (r=0; r<convstock_hot.countRows(); r++){
            if (data.highlights.convstock_highlights[r] != null){if (row==r){cellProperties.className = 'set_yellow';}}
        } // convstock_hot.setCellMeta(r,0,'changed',data.highlights.convstock_highlights[r])
        return cellProperties
      }})
      //conversion_highlights
      conversion_hot.updateSettings({cells: function(row, col, prop){
        var cellProperties = {};
        for (r=0; r<conversion_hot.countRows(); r++){
          for (c=0; c<conversion_hot.countCols(); c++){
            if (data.highlights.conversion_highlights[r][c] != null){if(row==r & col==c){cellProperties.className = 'set_yellow';}
            } //conversion_hot.setCellMeta(r, c, 'changed', data.highlights.conversion_highlights[r][c]);}
          }
        } return cellProperties
      }})
			// bond_hot.render();
			// convstock_hot.render();
			// conversion_hot.render();
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
  if (checkUnload) {
    alert("수정된 내용이 없을경우 저장불가");
    return
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

	    var convstock_highlights = []
	    for (r=0; r<convstock_hot.countCols(); r++){
	      convstock_highlights.push(convstock_hot.getCellMeta(0, r).changed);
	    }

	    var conversion_highlights = []
	    for (r=0; r<conversion_hot.countRows(); r++){
	      tmp = []
	      for (c=0; c<conversion_hot.countCols(); c++){tmp.push(conversion_hot.getCellMeta(r, c).changed)}
	      conversion_highlights.push(tmp);
	    }

		$.ajax({
			url: "/pricer/sdvsaveinfo",
			data: {'bondmemo':bondmemo_hot.getDataAtCell(0,0),
			'bond': JSON.stringify(bond_hot.getData()),
			'convstock': JSON.stringify(convstock_hot.getData()),
			'conversion': JSON.stringify(conversion_hot.getData()),
			'bond_highlights': JSON.stringify(bond_highlights),
			'convstock_highlights': JSON.stringify(convstock_highlights),
			'conversion_highlights': JSON.stringify(conversion_highlights),
			},
			dataType: 'json',
			success: function (data) {alert(data.msg);}
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


