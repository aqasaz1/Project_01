
var content_data_step_obj = {}
var content_code_array = []
var content_code_array_blank = []
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
      alert("확인되지 않습니다.")
    }
  })
}

function main_display_table() {
  var newContent = '';
  $.each(content_data_step_obj, function (key, val) {
    if ($("." + key).length < 1) {

      newContent += '<tr class = ' + key + ' >'
      newContent += '  <td>' + 'no' + '</td>'//no


      newContent += '  <td>' + val.content_lan + '</td>'//구분
      newContent += '  <td class="cp_code"><input type="text" style="width:100px" name="cp_code" value = ""></td>'//과정코드
      newContent += '  <td>' + val.content_code.split("_")[0] + '</td>'//내부코드
      newContent += '  <td>' + val.content_code.split("_")[1] + '</td>'//step
      newContent += '  <td class="cp_name"><input type="text" style="width:290px" name="cp_name" value = "' + val.content_name + '"></td>'//과정명
      newContent += '  <td>' + val.content_sample + '</td>'//샘플차시
      newContent += '  <td>' + val.content_chasi + '</td>'//차시수
      newContent += '  <td>' + val.content_page + '</td>'//페이지수
      newContent += '  <td>' + val.content_size + '</td>'//사이즈
      newContent += '  <td>' + val.content_cm + '</td>'//컨텐츠 담당자
      // newContent += '  <td><input type="button" onclick="content_xls_down2(' + val.content_code + ", " + '\'' + val.content_code.split("_")[1] + '\')" value="download"></td>'
      newContent += '  <td><input type="button" onclick="content_xls_down2(\'table_' + val.content_code +'\')" value="download"></td>'
      newContent += '  <td><input type="button" onclick="porting_xls_setting(this.name, this.value)" value="bind_path"></td>'
      newContent += '  <td><input type="button" onclick="row_remove(this, \'' + key + '\')" value="-"></td>'
      newContent += '  <td><input type="button" onclick="xls_set_hunet_index(this.name)" name="' + val.content_code + '" value="index"> <input type="button" onclick="xls_set_hunet_frame(this.name)" name="' + val.content_code + '" value="frame"></td>'
      newContent += '  <td><input type="button" onclick="porting_xls_setting(this.name, this.value)" name="' + val.content_code + '" value="KG에듀원"></td>'
      newContent += '  <td><input type="button" onclick="porting_xls_setting(this.name, this.value)" name="' + val.content_code + '" value="메가넥스트"></td>'
      newContent += '  <td><input type="button" onclick="porting_xls_setting(this.name, this.value)" name="' + val.content_code + '" value="도서관"></td>'
      newContent += '  <td><input type="button" onClick="rowMoveEvent(\'up\', $(this));" value="▲" style="width:30px;"/>'
      newContent += '  <input type="button" onClick="rowMoveEvent(\'down\', $(this));" value="▼" style="width:30px;"/></td>'

      newContent += '</tr>'
    }
  })

  $("#content_list").append(newContent);

  var content_seq = ""
  $.each(content_data_step_obj, function (key, val) {
    if ($(".table_" + key).length < 1) {
      //   var content_seq = '<table class="main_contable hidden ' + set_cod_step + '" >' //style="display:none"
      content_seq += '<table class="main_contable table_' + key + '" >' //style="display:none"

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
      content_seq += '		<tr>'
      content_seq += '			<td>' + val.content_lan + '</td>'
      content_seq += '			<td>' + key + '</td>'
      content_seq += '			<td>' + val.content_name + '</td>'
      content_seq += '			<td>' + val.content_sample + '</td>'
      content_seq += '			<td>' + val.content_page + '</td>'
      content_seq += '			<td>' + val.content_size + '</td>'
      content_seq += '			<td>' + val.content_cm + '</td>'
      content_seq += '		</tr>'
      content_seq += '	</tbody>'

      content_seq += '	<tthead>'
      content_seq += '		<tr>'
      content_seq += '			<th>No</th>'
      content_seq += '			<th>차시명</th>'
      content_seq += '			<th>차시명(특수기호제거)</th>'
      // content_seq += '			<th>맛보기차시</th>'
      var content_data_page_maxnum = 0;
      for (i = 0; i < val.content_data.length; i++) {
        content_data_page_count = val.content_data[i]["page_name"].length;
        if (content_data_page_maxnum < content_data_page_count) {
          content_data_page_maxnum = content_data_page_count
        }
      }
      for (i = 0; i < content_data_page_maxnum; i++) {
        content_seq += '			<th >' + Number(i + 1) + 'page</th>'
      }
      content_seq += '		</tr>'
      content_seq += '	</tthead>'
      content_seq += '	<ttbody>' //id = "'+content_code+'"

      $.each(val.content_data, function (i, value) {
        content_seq += '		<tr>'
        content_seq += '			<td>' + Number(i + 1) + '</td>'//no
        content_seq += '			<td>' + value.title_a + '</td>'//차시명
        content_seq += '			<td>' + value.title_b + '</td>'//차시명(특수기호제거)
        // if(content_sample[step] == idx+1+content_chasi_prev){
        // content_seq += '			<td>'+"Y("+Number(idx+1)+")"+'</td>'//맛보기차시
        // } else{
        // content_seq += '			<td>N</td>'//맛보기차시
        // }
        $.each(value.page_name, function (j, title) {
          content_seq += '			<td>' + title + '</td>'//메뉴1
        });
        content_seq += '		</tr>'

      })
      content_seq += '	</ttbody>'
      content_seq += '	<tr><td></td></tr>'
      content_seq += '</table>'
    }
  })
  $('body').append(content_seq)
  // }
  row_num_set();
}

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
  console.log(content_code_array);
  console.log(content_code_array_blank);
  var tr = $(obj).parent().parent();
  tr.remove();
  row_num_set();
}

function key_event() {
  $("#con_cod").keydown(function (key) {
    if (key.keyCode == 13) {
      export_table()
    }
  });
}

function export_table() {
  con_cod_arr = $('#con_cod').val().trim().split(" ")
  get_json_paser(con_cod_arr[0], 0)

}

function content_xls_down2(con_code) {
  content_xls_download(con_code)
}

function content_xls_download(file_name) {
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

function porting_xls_setting(item, cp) {
  alert("작업예정")
}

function xls_set_hunet_index(item) {
  this_step_data = content_data_step_obj[item]
  this_step_chasi = content_data_step_obj[item]["content_data"]
  content_code = this_step_data["content_code"]
  file_name = content_code + "_hunet_index"

  $row = $.each(this_step_data, function (key, value) {

  });

  var content_seq = '<table class="hunet hidden ' + file_name + '" >' //style="display:none"
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
  content_seq += '			<td>' + this_step_data["content_name"] + '</td>'
  content_seq += '			<td>N</td>'
  content_seq += '			<td>N</td>'
  content_seq += '			<td>0</td>'
  content_seq += '		</tr>'

  for (i = 0; i < this_step_chasi.length; i++) {
    content_seq += '		<tr>'
    content_seq += '			<td>' + (i + 1) + '</td>'
    content_seq += '			<td data-tableexport-msonumberformat="\\@">01' + twolength(i + 1) + '</td>'
    content_seq += '			<td>제' + (i + 1) + '절</td>'
    content_seq += '			<td>' + this_step_chasi[i]["title_a"] + '</td>'
    content_seq += '			<td>N</td>'
    content_seq += '			<td>Y</td>'
    content_seq += '			<td>' + this_step_chasi[i]["page_name"].length + '</td>'
    content_seq += '		</tr>'
  }

  content_seq += '	</tbody>'
  content_seq += '</table>'

  // xlshtml  data-tableexport-msonumberformat="\\@"
  // xlsx     data-tableexport-xlsxformatid="49"
  if ($("." + file_name).length < 1) {
    $('body').append(content_seq)
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

  var content_seq = '<table class="hunet hidden ' + file_name + '" >' //style="display:none"
  content_seq += '	<thead>'
  content_seq += '		<tr>'
  content_seq += '			<th>장/절 번호</th> <th>프레임 번호</th> <th>컨텐츠경로</th> <th>동영상여부</th> <th>동영상컨텐츠경로</th> <th>동영상경로</th>'
  content_seq += '		</tr>'
  content_seq += '	</thead>'
  content_seq += '	<tbody>'

  for (i = 0; i < this_step_chasi.length; i++) {
    for (j = 0; j < this_step_chasi[i]["page_name"].length; j++) {
      content_seq += '		<tr>'
      content_seq += '			<td data-tableexport-msonumberformat="\\@">01' + twolength(i + 1) + '</td>'
      content_seq += '			<td>' + (j + 1) + '</td>'
      content_seq += '			<td>/' + twolength(i + 1) + "/" + twolength(j + 1) + '.htm</td>'
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

var open01
function popup(type) {
  if (open01) {
    open01.close();
  }

  if (type == "bind") {
    open01 = window.open("popup.html", type, 'menubar=no, scrollbars=no, status=yes, resizable=auto, titlebar=no, hotkey=0, width=800, height=380, left=0, top=0', false)
  } else if (type == "code") {
    open01 = window.open("popup.html", type, 'menubar=no, scrollbars=no, status=yes, resizable=auto, titlebar=no, hotkey=0, width=300, height=380, left=0, top=0', false)
  } else if (type == "name") {
    open01 = window.open("popup.html", type, 'menubar=no, scrollbars=no, status=yes, resizable=auto, titlebar=no, hotkey=0, width=500, height=380, left=0, top=0', false)
  } else if (type == "hunet") {
    open01 = window.open("popup.html", type, 'menubar=no, scrollbars=no, status=yes, resizable=auto, titlebar=no, hotkey=0, width=800, height=600, left=0, top=0', false)
  }
  // open01.document.write(bind_data)
  // return open01
}

function txt_update() {
  alert("업데이트 예정")
}

var bind_data = ""

function bind_path_all() {
  // data_obj = Object.keys(content_data_step_obj)
  bind_data = ""
  for (var cod in content_data_step_obj) {
    for (i = 0; i < content_data_step_obj[cod]["content_data"].length - 1; i++) {
      console.log(content_data_step_obj[cod]["content_data"])

      bind_data += cod + "\t" + twolength(Number(i + 1)) + "\t" + content_data_step_obj[cod]["content_data"][i]["mp4_bind_path"] + "\n"
      // console.log(cod,_this[bind_count]["mp4_bind_path"])
    }
    bind_data += "\n"
  }
  popup("bind")
  // console.log(bind_data)
  // alert(bind_data)
}

function bind_path_all_data() {
  return bind_data;
}