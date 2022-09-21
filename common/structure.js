
var content_data_step_obj = {}
var content_code_array = []
var content_code_array_blank = []
var con_cod_arr = [] // 여러개 입력시 
var con_cod_taget = 0

function get_json_paser(code,step)  {
  var overlap_condition = true
  arry_cod = code+"_"+step
  content_code_array_blank.push(arry_cod)

  content_code_array_blank.forEach((element) => { //코드가 중복되는지 확인
    if (!content_code_array.includes(element)) {
      content_code_array.push(element);
      overlap_condition = true  //처음으로 입력된 상태
    } else {
      overlap_condition = false //중복으로 입력된 상태
    }
  });

  // if (overlap_condition == false) return;

  // console.log(Array.isArray(content_code_array_blank))
  // console.log("arry = " , content_code_array)
  // console.log("blank = " , content_code_array_blank)
  

  var serverAddress = 'contest_json/'+code+'.json';

  // jQuery의 .get 메소드 사용
  $.ajax({
      url: serverAddress,
      type: 'GET',
      success: function onData (data) {
        console.log(data);
        
        var content_lan = data.content_lan
        var content_code = data.content_code
        var content_name = data.content_name
        var content_sample = data.content_sample.split("/")
        var content_chasi = data.content_chasi.split("/")
        // var content_chasi_page = data.content_chasi_page.split("/")
        var content_size = data.content_size
        var content_cm = data.content_cm
        var content_data = data.content_data


        //스텝의 맛보기 확인
        var content_sample_set = "";
        var content_chasi_prev = 0;
        for(i=0; i<step; i++){
          content_chasi_prev += Number(content_chasi[i])  // step2 이상일 경우, 이전 step 차시의 총 합  
        }

        if (step == 0){
          content_sample_set = content_sample[step]
          content_sample_set2 = content_sample_set
        }else{
          content_sample_set = content_sample[step]-content_chasi_prev; // 1, 2, 3...
          content_sample_set2 = content_sample[step]-content_chasi_prev+"("+content_sample[step]+")"; // 1(21), 2(22), 3(23)...  
        }

        //스텝의 번호 확인
        var content_step_set = ""
        if(content_chasi.length >1){
          content_step_set = "step"+ Number(step+1)
        }else{
          content_step_set = "step0"
        }

        //스텝의 정보 확인
        var content_data_step = new Array();
        var content_chasi_page = 0; //과정(step)별 총 페이지 수
        var set_cod_step = content_code + "_" + content_step_set  //코드_step$

        if(step==0){
          for(i=0; i<Number(content_chasi[step]); i++){
            content_data_step.push(content_data[i])
            content_chasi_page += content_data[i]['page_name'].length
          }
        }else{
          for(i=content_chasi_prev; i<content_chasi_prev+Number(content_chasi[step]); i++){
            content_data_step.push(content_data[i])
            content_chasi_page += content_data[i]['page_name'].length
          }
        }
        
        content_data_step_obj[set_cod_step] = []
        data.content_code = set_cod_step
        data.content_sample = String(content_sample_set)
        data.content_chasi = content_chasi[step]
        data.content_data = content_data_step

        /**************** 코드_스텝 별 데이터 ****************/
        content_data_step_obj[set_cod_step] = data  
        /**************** 코드_스텝 별 데이터 ****************/
 
        if($("."+arry_cod).length < 1) {
          
          var newContent = '';

          newContent += '<tr class = ' +arry_cod+ ' >'
          newContent += '  <td>'+'no'+'</td>'//no
          newContent += '  <td>'+content_lan+'</td>'//구분
          newContent += '  <td class="cp_code"><input type="text" style="width:80px" name="cp_code" value = ""></td>'//과정코드
          newContent += '  <td>'+content_code+'</td>'//내부코드
          newContent += '  <td>'+content_step_set +'</td>'//step
          newContent += '  <td class="cp_name"><input type="text" style="width:290px" name="cp_name" value = "'+content_name+'"></td>'//과정명
          newContent += '  <td>'+content_sample_set2+'</td>'//샘플차시
          newContent += '  <td>'+content_chasi[step]+'</td>'//차시수
          newContent += '  <td>'+content_chasi_page+'</td>'//페이지수
          newContent += '  <td>'+content_size+'</td>'//사이즈
          newContent += '  <td>'+content_cm+'</td>'//컨텐츠 담당자
          newContent += '  <td><input type="button" onclick="content_xls_down2('+content_code+", " + '\''  + content_step_set + '\')" value="download"></td>'
          newContent += '  <td><input type="button" onclick="#" value="bind_path"></td>'
          newContent += '  <td><input type="button" onclick="row_remove(this, \'' + arry_cod + '\')" value="-"></td>'
          newContent += '  <td><input type="button" onclick="xls_set_hunet_index(this.name)" name="'+set_cod_step+'" value="index"> <input type="button" onclick="xls_set_hunet_frame(this.name)" name="'+set_cod_step+'" value="frame"></td>'
          newContent += '  <td><input type="button" onclick="porting_xls_setting(this.name, this.value)" name="'+set_cod_step+'" value="KG에듀원"></td>'
          newContent += '  <td><input type="button" onclick="porting_xls_setting(this.name, this.value)" name="'+set_cod_step+'" value="메가넥스트"></td>'
          newContent += '  <td><input type="button" onclick="porting_xls_setting(this.name, this.value)" name="'+set_cod_step+'" value="도서관"></td>'
          newContent += '  <td><input type="button" onClick="rowMoveEvent(\'up\', $(this));" value="▲" style="width:30px;"/>'
          newContent += '  <input type="button" onClick="rowMoveEvent(\'down\', $(this));" value="▼" style="width:30px;"/></td>'
          newContent += '</tr>'
          
          $("#content_list").append(newContent);

          row_num_set();

          //////////////////////////////////////////////////////////////////////////////////////////////////

          var content_seq = '<table class="main_contable '+set_cod_step +'" style="display:blank">' //style="display:none"
          
          content_seq += '	<thead>'
          content_seq += '		<tr>'
          content_seq += '			<th>구분</th>'
          content_seq += '			<th>과정코드</th>'
          content_seq += '			<th>과정명</th>'
          content_seq += '			<th>샘플차시</th>'
          content_seq += '			<th>페이지수</th>'
          content_seq += '			<th>사이즈</th>'
          content_seq += '			<th>담당자</th>'
          content_seq += '		</tr>'
          content_seq += '	</thead>'
          content_seq += '	<tbody>'
          content_seq += '	</tbody>'
          content_seq += '		<tr>'
          content_seq += '			<td>'+content_lan+'</td>'
          content_seq += '			<td>'+set_cod_step+'</td>'
          content_seq += '			<td>'+content_name+'</td>'
          content_seq += '			<td>'+content_sample_set+'</td>'
          content_seq += '			<td>'+content_chasi_page+'</td>'
          content_seq += '			<td>'+content_size+'</td>'
          content_seq += '			<td>'+content_cm+'</td>'
          content_seq += '		</tr>'

          content_seq += '	<thead>'
          content_seq += '		<tr>'
          content_seq += '			<th>No</th>'
          content_seq += '			<th>차시명</th>'
          content_seq += '			<th>차시명(특수기호제거)</th>'
          // content_seq += '			<th>맛보기차시</th>'
          var content_data_page_maxnum = 0;
          for(i=0; i<content_data_step.length; i++){
            content_data_page_count = content_data_step[i].page_name.length;
            if(content_data_page_maxnum < content_data_page_count){
              content_data_page_maxnum = content_data_page_count
            }
          }
          for(i=0; i<content_data_page_maxnum; i++){
            content_seq += '			<th >'+Number(i+1)+'page</th>'
          }

          content_seq += '		</tr>'
          content_seq += '	</thead>'
          content_seq += '	<tbody>' //id = "'+content_code+'"
        
          $.each(content_data_step, function(idx, value){
            //console.log(content_data[idx].no)
            content_seq += '		<tr>'
            content_seq += '			<td>'+Number(content_data_step[idx].chasi-content_chasi_prev)+'</td>'//no
            content_seq += '			<td>'+content_data_step[idx].title_a+'</td>'//차시명
            content_seq += '			<td>'+content_data_step[idx].title_b+'</td>'//차시명(특수기호제거)
            // if(content_sample[step] == idx+1+content_chasi_prev){
            //   content_seq += '			<td>'+"Y("+Number(idx+1)+")"+'</td>'//맛보기차시
            // } else{
            //   content_seq += '			<td>N</td>'//맛보기차시
            // }
            $.each(content_data_step[idx].page_name, function(idxx, value){
              content_seq += '			<td>'+content_data_step[idx].page_name[idxx]+'</td>'//메뉴1
            });
            content_seq += '		</tr>'

          })

          content_seq += '	</tbody>'
          content_seq += '</table>'
          $('body').append(content_seq)
        }
        
        // $(".table-1").tableDnD();
        if(step < content_chasi.length-1){
          step++
          get_json_paser(code,step)
          return
        }
        if(con_cod_arr.length>1 && con_cod_arr.length-con_cod_taget != 1){
          con_cod_taget++
          get_json_paser(con_cod_arr[con_cod_taget],0)
          return
        }
      },
      error: function onError (error) {
        console.error(error);
        content_code_array.pop()
        content_code_array_blank.pop()
        alert("확인되지 않습니다.")
      }
    }
  )}
  

function row_num_set(){
  $('#content_list > tr').each(function(idx, item){
    $(this).find('td:first').text(idx+1)
    $(this).parent().find('tr:odd').attr('style', 'border: 1px solid; text-align: center; background-color:#f0f0f0;');
    $(this).parent().find('tr:even').attr('style', 'border: 1px solid; text-align: center; background-color:#ffffff;');
  });
  //console.log(row_num.length)
}

function row_remove(obj,cod){
    del_arry = content_code_array.indexOf(cod)
    if(del_arry > -1){
      content_code_array.splice(del_arry, 1)
    }
    // console.log(obj,cod)
    console.log(content_code_array);
    console.log(content_code_array_blank);
    var tr = $(obj).parent().parent();
    tr.remove();
    row_num_set();
}

function key_event(){
  $("#con_cod").keydown(function(key){
    if(key.keyCode== 13){
      export_table()
    }
  });
}

function export_table(){

  con_cod_arr = $('#con_cod').val().trim().split(" ")
  //   /다/gi replace 전부
  // console.log(con_cod_arr, $('#con_cod').val())
  get_json_paser(con_cod_arr[0],0)
  // for(i=0; i<con_cod_arr.length; i++){
  //   (function(x){
  //     setTimeout(function(){
  //       get_json_paser(con_cod_arr[x],0);
  //     }, 500*x);
  //   })(i);
  // }
  // if(Number($('#con_cod').val())){
  //   console.log("key = ", "true")
  //   get_json_paser($('#con_cod').val(),0);
  // }else{
  //   var con_cod_arr = $('#con_cod').val().split(" ")
  //   for(i=0; i<con_cod_arr.length; i++){
  //     (function(x){
  //       setTimeout(function(){
  //         get_json_paser(con_cod_arr[x],0);
  //       }, 100*x);
  //     })(i);
  //   }
  // }
}

function content_xls_down2(con_code, con_step){
  // console.log(con_code, con_step)
   var file_name = con_code+"_"+con_step;
  // if(con_step==""){
  //   file_name = con_code+"_"+con_name;
  // }else{
  //   file_name = con_code+"_"+con_step +"_"+con_name;
  // }

  content_xls_download("main_contable")
}

function content_xls_download(file_name){

  $.each($('input[name=cp_name]'), function( key, item ){
    $(this).parent().text(item.value)
  });
  $.each($('input[name=cp_code]'), function( key, item ){
    $(this).parent().text(item.value)
  });
  var table = $('.'+file_name);
  table.tableExport({type:'excel',
  mso: {
    styles:['background-color', 'border', 'border-spacing', 'border-collapse', 'vertical-align', 
            'border-top-color', 'border-left-color', 'border-right-color', 'border-bottom-color',
            'border-top-width', 'border-left-width', 'border-right-width', 'border-bottom-width',
            'border-top-style', 'border-left-style', 'border-right-style', 'border-bottom-style',
            'color', 'text-align', 'border-width']
    }},file_name);
  $.each($('.cp_name'), function( key, item ){
    $(this).html('<input type="text" style="width:290px" name="cp_name" value = "'+$(this).text()+'">')
  });
  $.each($('.cp_code'), function( key, item ){
    $(this).html('<input type="text" style="width:80px" name="cp_code" value = "'+$(this).text()+'">')
  });
}

function porting_xls_setting(item, cp){
  // console.log(item+"/"+cp)
  // this_step_data = content_data_step_obj[item]
  // console.log(this_step_data)
  if(cp=="휴넷1"){
    
  }else  if(cp=="휴넷1"){
    
  }else  if(cp=="휴넷2"){
    
  }else  if(cp=="KG에듀원"){
    
  }else  if(cp=="메가넥스트"){
    
  }else  if(cp=="도서관"){
    
  }else  if(cp=="VOD통합본"){
    
  }
  
}

function xls_set_hunet_index(item){
  this_step_data = content_data_step_obj[item]
  this_step_chasi = content_data_step_obj[item]["content_data"]
  content_code = this_step_data["content_code"]
  file_name = content_code+"_hunet_index"

  $row = $.each(this_step_data, function( key, value ){ 
    
  });
  
  var content_seq = '<table class="hunet '+file_name +'" >' //style="display:none"
  content_seq += '	<thead>'
  content_seq += '		<tr>'
  content_seq += '			<th>순번</th> <th>장/절번호</th> <th>장/절명</th> <th>제목</th> <th>단원평가출제여부</th> <th>진도반영여부</th> <th>프레임</th>'
  content_seq += '		</tr>'
  content_seq += '	</thead>'
  content_seq += '	<tbody>'
  content_seq += '		<tr>'

  content_seq += '			<td>0</td>'
  content_seq += '			<td data-tableexport-msonumberformat="\\@">0100</td>'
  content_seq += '			<td>제1장</td>'
  content_seq += '			<td>'+this_step_data["content_name"]+'</td>'
  content_seq += '			<td>N</td>'
  content_seq += '			<td>N</td>'
  content_seq += '			<td>0</td>'
  content_seq += '		</tr>'

  for(i=0; i<this_step_chasi.length; i++){
    content_seq += '		<tr>'
    content_seq += '			<td>'+(i+1)+'</td>'
    content_seq += '			<td data-tableexport-msonumberformat="\\@">01'+twolength(i+1)+'</td>'
    content_seq += '			<td>제'+(i+1)+'절</td>'
    content_seq += '			<td>'+this_step_chasi[i]["title_a"]+'</td>'
    content_seq += '			<td>N</td>'
    content_seq += '			<td>Y</td>'
    content_seq += '			<td>'+this_step_chasi[i]["page_name"].length+'</td>'
    content_seq += '		</tr>'
  }

  content_seq += '	</tbody>'
  content_seq += '</table>'

  // xlshtml  data-tableexport-msonumberformat="\\@"
  // xlsx     data-tableexport-xlsxformatid="49"
  if($("."+file_name).length < 1) {
    $('body').append(content_seq)
  }
  content_xls_download(file_name)
}

function xls_set_hunet_frame(item){
  this_step_data = content_data_step_obj[item]
  this_step_chasi = content_data_step_obj[item]["content_data"]
  content_code = this_step_data["content_code"]
  file_name = content_code+"_hunet_frame"
  $row = $.each(this_step_data, function( key, value ){ 
    
  });
  
  var content_seq = '<table class="hunet '+file_name +'" >' //style="display:none"
  content_seq += '	<thead>'
  content_seq += '		<tr>'
  content_seq += '			<th>장/절 번호</th> <th>프레임 번호</th> <th>컨텐츠경로</th> <th>동영상여부</th> <th>동영상컨텐츠경로</th> <th>동영상경로</th>'
  content_seq += '		</tr>'
  content_seq += '	</thead>'
  content_seq += '	<tbody>'

  for(i=0; i<this_step_chasi.length; i++){
    for(j=0; j<this_step_chasi[i]["page_name"].length; j++){
      content_seq += '		<tr>'
      content_seq += '			<td data-tableexport-msonumberformat="\\@">01'+twolength(i+1)+'</td>'
      content_seq += '			<td>'+(j+1)+'</td>'
      content_seq += '			<td>/'+twolength(i+1)+"/"+twolength(j+1)+'.htm</td>'
      content_seq += '			<td>N</td>'
      content_seq += '			<td></td>'
      content_seq += '			<td></td>'
      content_seq += '		</tr>'
    }
  }

  content_seq += '	</tbody>'
  content_seq += '</table>'
  
  $('body').append(content_seq)

  content_xls_download(file_name)
}

function twolength(n) {
  return (n < 10 ? '0' : '') + n
}


function rowMoveEvent(direction, row){
  $row = row.parent().parent()
  var this_row_min = $row.index();
  var this_row_max = $('#content_list').find('tr').length-1;

  // console.log(this_row_min,this_row_max);
  if(direction == "up") {
    if(this_row_min == 0) { 
      console.log("처음입니다");
      return false;
    } else {
      $row.prev().before($row);
    }
  } else if(direction == "down") {
    if(this_row_min >= this_row_max) {
      console.log("마지막입니다");
      return false;
    } else {
      $row.next().after($row);
    }
  }
  row_num_set()
}

function popup(){
  window.open("popup.html","popup",'width=200,height=400',false)
  console.log("s")
}