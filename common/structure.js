
var content_data_step_obj = {}
var content_code_array = []
// var content_code_array_blank = []
var con_cod_arr = [] // 여러개 입력시 
var con_cod_taget = 0

function get_json_paser(code, step) {

  var serverAddress = 'contest_json/' + code + '.json';

  $.ajax({
    url: serverAddress,
    type: 'GET',
    success: function onData(data) {
      // console.log(data)
      var content_lan = data.content_lan
      var content_code = data.content_code
      var content_name = data.content_name
      var content_sample = data.content_sample.split("/")
      var content_sample_prev = new Array(0, 0)
      var content_chasi = data.content_chasi.split("/")
      var content_chasi_prev = new Array(0, 0)
      var content_size = data.content_size
      var content_cm = data.content_cm
      var content_data = data.content_data


      var prev_chasi_sum = 0;
      var content_chasi_page = 0
      if (content_chasi.length == 1) {
        data.content_code = content_code + "_step0"
        for (i = 0; i < content_data.length; i++) {
          content_chasi_page += content_data[i]['page_name'].length
        }
        data.content_page = content_chasi_page
        content_data_step_obj[content_code + "_step0"] = data

      } else {

        $.each(content_chasi, function (i, val) {

          var content_data_step = new Array()
          content_chasi_page = 0
          content_chasi_prev[i + 1] = Number(content_chasi_prev[i]) + Number(content_chasi[i])

          for (j = content_chasi_prev[i]; j < content_chasi_prev[i + 1]; j++) {
            // content_data_step[i].push(content_data[j])
            content_chasi_page += content_data[j]['page_name'].length
            content_data_step.push(content_data[j])
          }
          jsonTxt = JSON.stringify(data, (key, value) => {
            return key === 'content_code' ? value + '_step' + (i + 1)
              : key === 'content_chasi' ? content_chasi[i]
              : key === 'content_sample' ? content_sample[i] - content_chasi_prev[i]
              : key === 'content_data' ? content_data_step
              : value;
          })

          jsonData = JSON.parse(jsonTxt)
          jsonData.content_page = content_chasi_page
          content_data_step_obj[content_code + '_step' + (i + 1)] = jsonData
          // content_data_step_obj[content_code + "_" + index].content_code = content_code + "_" + index
          // console.log(value, index, array)
        })
      }

      if (con_cod_arr.length > 1 && con_cod_arr.length - con_cod_taget != 1) {
        con_cod_taget++
        get_json_paser(con_cod_arr[con_cod_taget], 0)
        return
      }
      // console.log(content_data_step_obj)
      main_display_table()
    },
    error: function onError(error) {
      console.error(error);
      // content_code_array.pop()
      // content_code_array_blank.pop()
      alert(con_cod_arr[con_cod_taget]+" 과정은 확인되지 않습니다.")
      if (con_cod_arr.length > 1 && con_cod_arr.length - con_cod_taget != 1) {
        con_cod_taget++
        get_json_paser(con_cod_arr[con_cod_taget], 0)
        return
      }
      main_display_table()
    }
  })
}

function export_table() {
  $(".h_loader").attr('class', 'loader')
  con_cod_arr = $('#con_cod').val().trim().split(" ")
  get_json_paser(con_cod_arr[0], 0)
}

function main_display_table() {
  var mainObj = '';
  var eng_num = jpn_num = chn_num = etc_num = kor_num = 0;
  $.each(content_data_step_obj, function (key, val) {
    if ($("." + key).length < 1) {

      mainObj += '<tr class = ' + key + ' >'
      mainObj += '  <td>' + 'no' + '</td>'//no
      mainObj += '  <td>' + val.content_lan + '</td>'//구분
      mainObj += '  <td class="cp_code"><input type="text" style="width:100px" name="cp_code" value = ""></td>'//과정코드
      mainObj += '  <td>' + val.content_code.split("_")[0] + '</td>'//내부코드
      mainObj += '  <td>' + val.content_code.split("_")[1] + '</td>'//step
      mainObj += '  <td class="cp_name"><input type="text" style="width:290px" name="cp_name" value = "' + val.content_name + '"></td>'//과정명
      mainObj += '  <td>' + val.content_sample + '</td>'//샘플차시
      mainObj += '  <td>' + val.content_chasi + '</td>'//차시수
      mainObj += '  <td>' + val.content_page + '</td>'//페이지수
      mainObj += '  <td>' + val.content_size + '</td>'//사이즈
      mainObj += '  <td>' + val.content_cm + '</td>'//컨텐츠 담당자
      // mainObj += '  <td><input type="button" onclick="content_xls_down2(' + val.content_code + ", " + '\'' + val.content_code.split("_")[1] + '\')" value="download"></td>'
      // mainObj += '  <td><input type="button" onclick="content_xls_download(\'table_' + val.content_code + '\')" value="download"></td>'
      // mainObj += '  <td><input type="button" onclick="porting_xls_setting(this.name, this.value)" value="bind_path"></td>'
      mainObj += '  <td><input type="button" onclick="row_remove(this, \'' + key + '\')" value="-"></td>'
      // mainObj += '  <td><input type="button" onclick="xls_set_hunet_index(this.name)" name="' + val.content_code + '" value="index"> <input type="button" onclick="xls_set_hunet_frame(this.name)" name="' + val.content_code + '" value="frame"></td>'
      mainObj += '  <td><input type="button" onclick="popup(' + "\'hunet'" + ',this.name)" name="' + val.content_code + '" value="CA정보"></td>'
      mainObj += '  <td><input type="button" onclick="popup(' + "\'kg'" + ',this.name)" name="' + val.content_code + '" value="CA정보"></td>'
      mainObj += '  <td><input type="button" onclick="popup(' + "\'meganext'" + ',this.name)" name="' + val.content_code + '" value="CA정보"></td>'
      // mainObj += '  <td><input type="button" onclick="porting_xls_setting(this.name, this.value)" name="' + val.content_code + '" value="도서관"></td>'
      mainObj += '  <td><input type="button" onClick="rowMoveEvent(\'up\', $(this));" value="▲" style="width:30px;"/>'
      mainObj += '  <input type="button" onClick="rowMoveEvent(\'down\', $(this));" value="▼" style="width:30px;"/></td>'

      mainObj += '</tr>'
    }

    if (val.content_lan=="영어") {
      eng_num++
    } else if (val.content_lan=="일본어") {
      jpn_num++        
    } else if (val.content_lan=="중국어") {
      chn_num++
    } else if (val.content_lan=="기타외국어") {
      etc_num++
    } else if (val.content_lan=="한국어") {
      kor_num++
    }


  })
  let total_step = eng_num + jpn_num + chn_num + etc_num + kor_num
  $("#total_step").text(total_step+"step (영 "+eng_num+", 일 "+jpn_num+", 중 "+chn_num+", 기타 "+etc_num+", 한국어 "+kor_num+")")
  $(".loader").attr('class', 'h_loader')
  $("#content_list").append(mainObj);
  $(".h_btn").attr('class', 'btn')
  row_num_set();
}

function sub_display_table() {

  var subObj = ""
  $.each(content_data_step_obj, function (key, val) {
    if ($(".table_" + key).length < 1) {
      //   var subObj = '<table class="main_contable hidden ' + set_cod_step + '" >' //style="display:none"
      subObj += '<table class="main_contable hidden table_' + key + '" >' //style="display:none" 

      subObj += '	<thead>'
      subObj += '		<tr>'
      subObj += '		</tr>'
      subObj += '		<tr>'
      subObj += '			<th>CP코드</th>'
      subObj += '			<td>' + val.cp_code + '</td>'
      subObj += '			<th>구분</th>'
      subObj += '			<td>' + val.content_lan + '</td>'
      subObj += '		</tr>'
      subObj += '		<tr>'
      subObj += '			<th>과정코드</th>'
      subObj += '			<td>' + key + '</td>'
      subObj += '			<th>페이지수</th>'
      subObj += '			<td>' + val.content_page + '</td>'
      subObj += '		</tr>'
      subObj += '		<tr>'
      subObj += '			<th>과정명</th>'
      subObj += '			<td>' + val.content_name + '</td>'
      subObj += '			<th>담당자</th>'
      subObj += '			<td>' + val.content_cm + '</td>'
      subObj += '		</tr>'
      subObj += '		<tr>'
      subObj += '			<th>사이즈</th>'
      subObj += '			<td>' + val.content_size + '</td>'
      subObj += '			<th>샘플차시</th>'
      subObj += '			<td>' + val.content_sample + '</td>'
      subObj += '		</tr>'
      subObj += '	</thead>'
      // subObj += '	<tbody>'
      // subObj += '		<tr>'
      // subObj += '		</tr>'
      // subObj += '	</tbody>'

      subObj += '	<tthead>'
      subObj += '		<tr>'
      subObj += '			<th>No</th>'
      subObj += '			<th>차시명</th>'
      subObj += '			<th>차시명(특수기호제거)</th>'
      subObj += '			<th>시작파일</th>'
      subObj += '			<th>시작파일</th>'
      // subObj += '			<th>맛보기차시</th>'
      var content_data_page_maxnum = 0;
      for (i = 0; i < val.content_data.length; i++) {
        content_data_page_count = val.content_data[i]["page_name"].length;
        if (content_data_page_maxnum < content_data_page_count) {
          content_data_page_maxnum = content_data_page_count
        }
      }
      for (i = 0; i < content_data_page_maxnum; i++) {
        subObj += '			<th >' + Number(i + 1) + ' 페이지명</th>'
      }
      subObj += '		</tr>'
      subObj += '	</tthead>'
      subObj += '	<ttbody>' //id = "'+content_code+'"

      $.each(val.content_data, function (i, value) {
        subObj += '		<tr>'
        subObj += '			<td>' + Number(i + 1) + '</td>'//no
        subObj += '			<td>' + value.title_a + '</td>'//차시명
        subObj += '			<td>' + value.title_b + '</td>'//차시명(특수기호제거)
        subObj += '			<td>/' + key + '/' + twolength(Number(i + 1)) + '/01.htm</td>'//차시명(특수기호제거)
        // if(content_sample[step] == idx+1+content_chasi_prev){
        // subObj += '			<td>'+"Y("+Number(idx+1)+")"+'</td>'//맛보기차시
        // } else{
        // subObj += '			<td>N</td>'//맛보기차시
        // }
        subObj += '			<td>' + value.mp4_bind_path.split("/")[value.mp4_bind_path.split("/").length-1] + '</td>'//차시명(특수기호제거)
        $.each(value.page_name, function (j, title) {
          subObj += '			<td>' + title + '</td>'//메뉴1
        });
        subObj += '		</tr>'

      })
      subObj += '	</ttbody>'
      subObj += '	<tr><td></td></tr>'
      subObj += '</table>'
    }
  })
  $('body').append(subObj)
}

function firzzle_display_table() {

  var subObj = ""
  count = 1
  $.each(content_data_step_obj, function (key, val) {
    if ($(".table_" + key).length < 1) {
      //   var subObj = '<table class="main_contable hidden ' + set_cod_step + '" >' //style="display:none"
      subObj += '<table class="firzzle_contable hidden table_' + key + '" >' //style="display:none"
      if(count == 1){
        subObj += '	<thead>'
        subObj += '		<tr>'
        subObj += '			<th>CP CODE</th>'
        subObj += '			<th>콘텐츠 타입</th>'
        subObj += '			<th>콘텐츠명</th>'
        subObj += '			<th>모듈번호</th>'
        subObj += '			<th>모듈명</th>'
        subObj += '			<th>차시번호</th>'
        subObj += '			<th>차시명</th>'
        subObj += '			<th>HTML 콘텐츠위치</th>'
        subObj += '			<th>HTML 정렬순서</th>'
        //      subObj += '			<td>' + key + '</td>'
        //      subObj += '			<td>' + val.content_lan + '</td>'
        //      subObj += '			<td>' + val.content_name + '</td>'
        //      subObj += '			<td>' + val.content_page + '</td>'
        //      subObj += '			<td>' + val.content_sample + '</td>'
        //      subObj += '			<td>' + val.content_cm + '</td>'
        //      subObj += '			<td>' + val.content_size + '</td>'
        subObj += '		</tr>'
        subObj += '	</thead>'

        subObj += '	<ttbody>' //id = "'+content_code+'"
      }
      $.each(val.content_data, function (i, value) {
        subObj += '		<tr>'
        subObj += '			<td>C008</td>'//no
        subObj += '			<td>VIDEO</td>'//no
        subObj += '			<td>' + val.content_name + '</td>'//no
        subObj += '			<td>1</td>'//no
        subObj += '			<td>' + val.content_name + '</td>'//no
        subObj += '			<td>' + Number(i + 1) + '</td>'//no
        subObj += '			<td>' + value.title_a + '</td>'//차시명
        //subObj += '			<td>' + value.title_b + '</td>'//차시명(특수기호제거)
        //subObj += '			<td>/' + key + '/' + twolength(Number(i + 1)) + '/01.htm</td>'//차시명(특수기호제거)
        // if(content_sample[step] == idx+1+content_chasi_prev){
        // subObj += '			<td>'+"Y("+Number(idx+1)+")"+'</td>'//맛보기차시
        // } else{
        // subObj += '			<td>N</td>'//맛보기차시
        // }
        //$.each(value.page_name, function (j, title) {
        //  subObj += '			<td>' + title + '</td>'//메뉴1
        //});
        subObj += '		</tr>'

      })
      subObj += '	</ttbody>'
      subObj += '</table>'
    }
    count++
  })
  $('body').append(subObj)
}

function porting_xls_setting(item, cp) {
  alert("작업예정")
}

function content_xls_download(file_name) {
  json_update()
  if(file_name == "main_contable"){
    sub_display_table()
  }else if(file_name == "firzzle_contable"){
    firzzle_display_table()
  }
  
  // console.log("s")
  // $(".main_contable").css("height","10")
  $.each($('input[name=cp_name]'), function (key, item) {
    $(this).parent().text(item.value)
  });
  $.each($('input[name=cp_code]'), function (key, item) {
    $(this).parent().text(item.value)
  });
  var table = $('.' + file_name);
  table.tableExport({
    type: 'excel',
    mso: {
      styles: ['background-color', 'border', 'border-spacing', 'border-collapse', 'vertical-align',
        'border-top-color', 'border-left-color', 'border-right-color', 'border-bottom-color',
        'border-top-width', 'border-left-width', 'border-right-width', 'border-bottom-width',
        'border-top-style', 'border-left-style', 'border-right-style', 'border-bottom-style',
        'color', 'text-align', 'border-width']
    }
  }, file_name);
  $.each($('.cp_name'), function (key, item) {
    $(this).html('<input type="text" style="width:290px" name="cp_name" value = "' + $(this).text() + '">')
  });
  $.each($('.cp_code'), function (key, item) {
    $(this).html('<input type="text" style="width:100px" name="cp_code" value = "' + $(this).text() + '">')
  });
}

var open01
function popup(name, cod) {
  json_update()
  // console.log(type, cod)
  if (open01) {
    open01.close();
  }
  
  const popupMap = {
    bind(){
      open01 = window.open("popup.html", name, 'menubar=no, scrollbars=no, status=yes, resizable=auto, titlebar=no, width=1600, height=380, left=0, top=0', false)
    },
    bind_500k(){
      open01 = window.open("popup.html", name, 'menubar=no, scrollbars=no, status=yes, resizable=auto, titlebar=no, width=1600, height=380, left=0, top=0', false)
    },
    firb(){
      open01 = window.open("popup.html", name, 'menubar=no, scrollbars=no, status=yes, resizable=auto, titlebar=no, width=1500, height=510, left=0, top=0', false)
    },
    firb_CA(){
      open01 = window.open("popup.html", name, 'menubar=no, scrollbars=no, status=yes, resizable=auto, titlebar=no, width=1500, height=510, left=0, top=0', false)
    },
    code(){
      open01 = window.open("popup.html", name, 'menubar=no, scrollbars=no, status=yes, resizable=auto, titlebar=no, width=300, height=380, left=0, top=0', false)
    },
    name(){
      open01 = window.open("popup.html", name, 'menubar=no, scrollbars=no, status=yes, resizable=auto, titlebar=no, width=500, height=380, left=0, top=0', false)
    },
    hunet(){
      open01 = window.open("popup.html?cod=" + cod, name, 'menubar=no, scrollbars=no, status=yes, resizable=auto, titlebar=no, width=800, height=600, left=0, top=0', false)
    },
    kg(){
      open01 = window.open("popup.html?cod=" + cod, name, 'menubar=no, scrollbars=no, status=yes, resizable=auto, titlebar=no, width=800, height=600, left=0, top=0', false)
    },
    meganext(){
      open01 = window.open("popup.html?cod=" + cod, name, 'menubar=no, scrollbars=no, status=yes, resizable=auto, titlebar=no, width=800, height=600, left=0, top=0', false)
    }
  }

  const popupFn = (thisName) => popupMap[thisName]()
  popupFn(name)

  // open01.document.write(bind_data)
  // return open01
}

function json_update() {
  $.each(content_data_step_obj, function (key, item) {
    // item.content_name = $("." + key + " .cp_name input").val()
    // item.cp_code = $("." + key + " .cp_code input").val()
    content_data_step_obj[key].content_name = $("." + key + " .cp_name input").val()
    content_data_step_obj[key].cp_code = $("." + key + " .cp_code input").val()
  })
}

function hunet_index(item) {
  this_step_data = content_data_step_obj[item]
  this_step_chasi = this_step_data["content_data"]
  content_code = this_step_data["content_code"]

  var subObj = ''
  subObj += '순번\t장/절번호\t장/절명\t제목\t단원평가출제여부\t진도반영여부\t프레임' + '\n'
  subObj += '0' + '\t' + '0100' + '\t' + '제1장' + '\t' + this_step_data["content_name"] + '\t' + 'N' + '\t' + 'N' + '\t' + '0' + '\n'
  for (i = 0; i < this_step_chasi.length; i++) {
    subObj += (i + 1) + '\t' + '01' + twolength(i + 1) + '\t' + '제' + (i + 1) + '절' + '\t' + this_step_chasi[i]["title_a"] + '\t' + 'N' + '\t' + 'Y' + '\t' + this_step_chasi[i]["page_name"].length + '\n'
  }

  return subObj.trim()
}

function hunet_frame(item) {
  this_step_data = content_data_step_obj[item]
  this_step_chasi = this_step_data["content_data"]
  content_code = this_step_data["content_code"]

  var subObj = ''
  subObj = '장/절 번호\t프레임 번호\t컨텐츠경로\t동영상여부\t동영상컨텐츠경로\t동영상경로' + '\n'
  for (i = 0; i < this_step_chasi.length; i++) {
    for (j = 0; j < this_step_chasi[i]["page_name"].length; j++) {
      subObj += '01' + twolength(i + 1) + '\t' + (j + 1) + '\t' + "/" + twolength(i + 1) + "/" + twolength(j + 1) + '.htm' + '\t' + 'N' + '\n'
    }
  }

  return subObj.trim()
}

function kg_eduone(item) {
  this_step_data = content_data_step_obj[item]
  this_step_chasi = this_step_data["content_data"]
  content_code = this_step_data["content_code"]
  cp_code = this_step_data["cp_code"]

  var subObj = ''
  subObj = 'part\tpage\t학습일\t제목\t모바일 동영상과정 경로\t미지원안내\tPDF경로\t웹경로\t기준시간(초)\tPC 동영상과정 경로' + '\n'
  for (i = 0; i < this_step_chasi.length; i++) {
    subObj += twolength(i + 1) + "0100" + "\t" + "0" + "\t" + (i + 1) + "\t" + twolength(i + 1) + ". " + this_step_chasi[i]["title_a"] + "\n";
    for (j = 0; j < this_step_chasi[i]["page_name"].length; j++) {
      subObj += twolength(i + 1) + twolength(j + 1) + '01' + '\t' + '0' + twolength(j + 1) + '\t' + (i + 1) + '\t' + this_step_chasi[i]["page_name"][j] + '\t' + "5205/cybercampus/" + cp_code + '/' + twolength(i + 1) + "/" + twolength(j + 1) + '.mp4' + '\n'
    }
  }

  return subObj.trim()
}

function meganext(item) {
  this_step_data = content_data_step_obj[item]
  this_step_chasi = this_step_data["content_data"]
  content_code = this_step_data["content_code"]
  cp_code = this_step_data["cp_code"]

  var subObj = ''
  subObj = '장번호\t주차명(장)\t절번호\t컨텐츠명(절)\t총학습시간(분)\t경로\t총페이지(절구성)\t완료인정시간\t모바일여부' + '\n'
  for (i = 0; i < this_step_chasi.length; i++) {
    for (j = 0; j < this_step_chasi[i]["page_name"].length; j++) {
      subObj += twolength(i + 1) + "\t" + twolength(i + 1) + ". " + this_step_chasi[i]["title_a"] + "\t" + twolength(j + 1) + "\t" + this_step_chasi[i]["page_name"][j] + "\t" + "1" + "\t" + twolength(i + 1) + "/index.htm?page=" + twolength(j + 1) + "\t" + "1" + "\t" + "1" + "\t" + "Y" + "\n";
    }
  }

  return subObj.trim()
}




function bind_path_all() {
  // data_obj = Object.keys(content_data_step_obj)
  var bind_data = ""
  var list_number = 0
  for (var cod in content_data_step_obj) {
    list_number++ 
    for (i = 0; i < content_data_step_obj[cod]["content_data"].length; i++) {
      // console.log(content_data_step_obj[cod]["content_data"])
      dataConNum = $("."+cod+" td:nth-child(1)").text()
      dataConLan = $("."+cod+" td:nth-child(2)").text()
      dataConCode = $("."+cod+">.cp_code>input[name=cp_code]").val()
      dataFolder = cod
      dataConName = $("."+cod+">.cp_name>input[name=cp_name]").val()
      dataCount = twolength(Number(i + 1))
      dataChasiName = content_data_step_obj[cod]["content_data"][i]["title_b"]
      dataPath = content_data_step_obj[cod]["content_data"][i]["mp4_bind_path"]
      dataPath = dataPath.split("/").join("\\")
      dataXcopy = "echo f | xcopy \""+ dataPath + "\""
      bind_data += twolength(dataConNum) + "\t" + dataConLan + "\t" + dataConCode + "\t" + dataFolder + "\t" + dataConName + "\t" + dataCount + "\t" + dataChasiName + "\t" + dataPath + "\t" + dataXcopy + "\n"
      // console.log(cod,_this[bind_count]["mp4_bind_path"])
    }
    bind_data += "\n"
  }
  return bind_data.trim()
}

function bind_500k_path_all() {
  // data_obj = Object.keys(content_data_step_obj) 
  var bind_data = ""
  var list_number = 0
  for (var cod in content_data_step_obj) {
    list_number++ 
    for (i = 0; i < content_data_step_obj[cod]["content_data"].length; i++) {
      // console.log(content_data_step_obj[cod]["content_data"])
      dataConNum = $("."+cod+" td:nth-child(1)").text()
      dataConLan = $("."+cod+" td:nth-child(2)").text()
      dataConCode = $("."+cod+">.cp_code>input[name=cp_code]").val()
      dataFolder = cod
      dataConName = $("."+cod+">.cp_name>input[name=cp_name]").val()
      dataCount = twolength(Number(i + 1))
      dataChasiName = content_data_step_obj[cod]["content_data"][i]["title_b"]
      dataPath = content_data_step_obj[cod]["content_data"][i]["mp4_bind_path_500k"]
      dataPath = dataPath.split("/").join("\\")
      dataXcopy = "echo f | xcopy \""+ dataPath + "\""
      bind_data += twolength(dataConNum) + "\t" + dataConLan + "\t" + dataConCode + "\t" + dataFolder + "\t" + dataConName + "\t" + dataCount + "\t" + dataChasiName + "\t" + dataPath + "\t" + dataXcopy + "\n"
      // console.log(cod,_this[bind_count]["mp4_bind_path"])
    }
    bind_data += "\n"
  }
  return bind_data.trim()
}

function bind_path_firb() {
  // data_obj = Object.keys(content_data_step_obj)
  var bind_data = ""
  var list_number = 0
  for (var cod in content_data_step_obj) {
    list_number++ 
    for (i = 0; i < content_data_step_obj[cod]["content_data"].length; i++) {
      // console.log(content_data_step_obj[cod]["content_data"])
      dataConCode = $("."+cod+">.cp_code>input[name=cp_code]").val()
      dataFolder = twolength(list_number)+"_"+cod + "_" + dataConCode
      dataCount = twolength(Number(i + 1))
      dataPath = content_data_step_obj[cod]["content_data"][i]["mp4_bind_path"]
      dataPath = dataPath.split("/").join("\\")
      dataXcopy = "echo f | xcopy \""+ dataPath + "\"" + " " + dataFolder + "\\" + "0000"+ dataConCode + "_M01_0" + dataCount +".mp4"
      //bind_data += twolength(list_number)+"_"+cod + "\t" + twolength(Number(i + 1)) + "\t" + content_data_step_obj[cod]["content_data"][i]["mp4_bind_path"] + "\n"
      bind_data += dataFolder + "\t" + dataCount + "\t" + dataPath + "\t" + dataXcopy + "\n"
      // console.log(cod,_this[bind_count]["mp4_bind_path"])
    }
    bind_data += "\n"
  }
  return bind_data.trim()
}

function bind_path_firb_CA() {
  // data_obj = Object.keys(content_data_step_obj)
  var bind_data = ""
  var list_number = 0
  for (var cod in content_data_step_obj) {
    list_number++ 
    for (i = 0; i < content_data_step_obj[cod]["content_data"].length; i++) {
      // console.log(content_data_step_obj[cod]["content_data"])
      dataConCode = $("."+cod+">.cp_code>input[name=cp_code]").val()
      dataConName = $("."+cod+">.cp_name>input[name=cp_name]").val()
      dataCPCode = "C008"
      dataConType = "VIDEO"
      dataConChasiName = content_data_step_obj[cod]["content_data"][i]["title_a"]
      dataCount = Number(i + 1)
      
      bind_data += dataCPCode +"\t"+ dataConType +"\t"+ dataConName +"\t"+ "1" +"\t"+ dataConName+"\t"+ dataCount +"\t"+ dataConChasiName + "\n"

    }
  }
  return bind_data.trim()
}

////////////////////////////////////////////////////////////////////////////////////////////////
////////////////////////////////////////////////////////////////////////////////////////////////

function row_num_set() {
  $('#content_list > tr').each(function (idx, item) {
    $(this).find('td:first').text(idx + 1)
    $(this).parent().find('tr:odd').attr('style', 'border: 1px solid; text-align: center; background-color:#f0f0f0;');
    $(this).parent().find('tr:even').attr('style', 'border: 1px solid; text-align: center; background-color:#ffffff;');
  });
}

function row_remove(obj, cod) {
  del_arry = content_code_array.indexOf(cod)
  if (del_arry > -1) {
    content_code_array.splice(del_arry, 1)
  }
  // console.log(obj,cod)
  //console.log(content_code_array);
  // console.log(content_code_array_blank);
  var tr = $(obj).parent().parent();
  tr.remove();
  delete content_data_step_obj[cod]
  row_num_set();
}

function key_event() {
  $("#con_cod").keydown(function (key) {
    if (key.keyCode == 13) {
      export_table()
    }
  });
}

function twolength(n) {
  return (n < 10 ? '0' : '') + n
}

function rowMoveEvent(direction, row) {
  $row = row.parent().parent()
  var this_row_min = $row.index();
  var this_row_max = $('#content_list').find('tr').length - 1;

  // console.log(this_row_min,this_row_max);
  if (direction == "up") {
    if (this_row_min == 0) {
      console.log("처음입니다");
      return false;
    } else {
      $row.prev().before($row);
    }
  } else if (direction == "down") {
    if (this_row_min >= this_row_max) {
      console.log("마지막입니다");
      return false;
    } else {
      $row.next().after($row);
    }
  }
  row_num_set()
}


//////////////////////////////////////////////////////////////////////////////////////////////
//////////////////////////////////////////////////////////////////////////////////////////////
//////////////////////////////////////////////////////////////////////////////////////////////
//////////////////////////////////////////////////////////////////////////////////////////////


/*
function xls_set_hunet_index(item) {

  this_step_data = content_data_step_obj[item]
  this_step_chasi = content_data_step_obj[item]["content_data"]
  content_code = this_step_data["content_code"]
  file_name = content_code + "_hunet_index"

  $row = $.each(this_step_data, function (key, value) {

  });

  var subObj = '<table class="hunet hidden ' + file_name + '" >' //style="display:none"
  subObj += '	<thead>'
  subObj += '		<tr>'
  subObj += '			<th>순번</th> <th>장/절번호</th> <th>장/절명</th> <th>제목</th> <th>단원평가출제여부</th> <th>진도반영여부</th> <th>프레임</th>'
  subObj += '		</tr>'
  subObj += '	</thead>'
  subObj += '	<tbody>'
  subObj += '		<tr>'

  subObj += '			<td>0</td>'
  subObj += '			<td data-tableexport-msonumberformat="\\@">0100</td>'
  subObj += '			<td>제1장</td>'
  subObj += '			<td>' + this_step_data["content_name"] + '</td>'
  subObj += '			<td>N</td>'
  subObj += '			<td>N</td>'
  subObj += '			<td>0</td>'
  subObj += '		</tr>'

  for (i = 0; i < this_step_chasi.length; i++) {
    subObj += '		<tr>'
    subObj += '			<td>' + (i + 1) + '</td>'
    subObj += '			<td data-tableexport-msonumberformat="\\@">01' + twolength(i + 1) + '</td>'
    subObj += '			<td>제' + (i + 1) + '절</td>'
    subObj += '			<td>' + this_step_chasi[i]["title_a"] + '</td>'
    subObj += '			<td>N</td>'
    subObj += '			<td>Y</td>'
    subObj += '			<td>' + this_step_chasi[i]["page_name"].length + '</td>'
    subObj += '		</tr>'
  }

  subObj += '	</tbody>'
  subObj += '</table>'

  // xlshtml  data-tableexport-msonumberformat="\\@"
  // xlsx     data-tableexport-xlsxformatid="49"
  if ($("." + file_name).length < 1) {
    $('body').append(subObj)
  }
  content_xls_download(file_name)
}

function xls_set_hunet_frame(item) {

  this_step_data = content_data_step_obj[item]
  this_step_chasi = content_data_step_obj[item]["content_data"]
  content_code = this_step_data["content_code"]
  file_name = content_code + "_hunet_frame"
  $row = $.each(this_step_data, function (key, value) {

  });

  var subObj = '<table class="hunet hidden ' + file_name + '" >' //style="display:none"
  subObj += '	<thead>'
  subObj += '		<tr>'
  subObj += '			<th>장/절 번호</th> <th>프레임 번호</th> <th>컨텐츠경로</th> <th>동영상여부</th> <th>동영상컨텐츠경로</th> <th>동영상경로</th>'
  subObj += '		</tr>'
  subObj += '	</thead>'
  subObj += '	<tbody>'

  for (i = 0; i < this_step_chasi.length; i++) {
    for (j = 0; j < this_step_chasi[i]["page_name"].length; j++) {
      subObj += '		<tr>'
      subObj += '			<td data-tableexport-msonumberformat="\\@">01' + twolength(i + 1) + '</td>'
      subObj += '			<td>' + (j + 1) + '</td>'
      subObj += '			<td>/' + twolength(i + 1) + "/" + twolength(j + 1) + '.htm</td>'
      subObj += '			<td>N</td>'
      subObj += '			<td></td>'
      subObj += '			<td></td>'
      subObj += '		</tr>'
    }
  }

  subObj += '	</tbody>'
  subObj += '</table>'

  $('body').append(subObj)

  content_xls_download(file_name)
}
*/