var matkul = {
  index: window.localStorage.getItem("matkul:index"),
  $table: document.getElementById("matkul-table"),
  $form: document.getElementById("form-matkul"),
  $button_save: document.getElementById("matkul-op-save"),
  $button_discard: document.getElementById("matkul-op-discard"),

  init: function() {
    // initialize the storage index
    if (!matkul.index) {
      window.localStorage.setItem("matkul:index", matkul.index = 1);
    }

    // initialize the form
    matkul.$form.reset();
    matkul.$button_discard.addEventListener("click", function(event) {
      matkul.$form.reset();
      matkul.$form.id_entry.value = 0;
    }, true);

    //matkul.$button_save.addEventListener("click",,true );
    matkul.$form.addEventListener("submit", function(event) {

      if (matkul.$form.mata_kuliah.value != 0 &&
        matkul.$form.sks_kuliah.value != 0 && matkul.$form.hurufMutu_kuliah.value != "null") {
      var entry = {
        id: parseInt(this.id_entry.value),
        mata_kuliah: this.mata_kuliah.value,
        sks_kuliah: this.sks_kuliah.value,
        hurufMutu_kuliah: this.hurufMutu_kuliah.value
      };

        if (entry.id === 0) { // add
          matkul.storeAdd(entry);
          matkul.tableAdd(entry);
        } else { // edit
          matkul.storeEdit(entry);
          matkul.tableEdit(entry);
        }

        this.reset();
        this.id_entry.value = 0;
        gpa();
        event.preventDefault();
        // placeholder setting autoreload
        //location.reload(false); //load from cache
      } else {
        //Materialize.toast('Silahkan isi formnya!', 4000)
        alert("Silahkan lengkapi formnya terlebih dahulu.");

      }

    }, true);



    // initialize the table
    if (window.localStorage.length - 1) {
      var matkul_list = [],
        i, key;
      for (i = 0; i < window.localStorage.length; i++) {
        key = window.localStorage.key(i);
        if (/matkul:\d+/.test(key)) {
          matkul_list.push(JSON.parse(window.localStorage.getItem(key)));
        }
      }

      if (matkul_list.length) {
        matkul_list
          .sort(function(a, b) {
            return a.id < b.id ? -1 : (a.id > b.id ? 1 : 0);
          })
          .forEach(matkul.tableAdd);
      }
    }

    matkul.$table.addEventListener("click", function(event) {
      var op = event.target.getAttribute("data-op");
        var entry = JSON.parse(window.localStorage.getItem("matkul:" + event.target.getAttribute("data-id")));
        if (op == "edit") {
          matkul.$form.mata_kuliah.value = entry.mata_kuliah;
          matkul.$form.sks_kuliah.value = entry.sks_kuliah;
          matkul.$form.hurufMutu_kuliah.value = entry.hurufMutu_kuliah;
          matkul.$form.id_entry.value = entry.id;
          //window.scrollTo(0, 0); //to top
          $('html, body').animate({
    scrollTop: $("body").offset().top
}, 300);
        } else if (op == "remove") {
           $('#mdl-rm-matkul').openModal({
             dismissible:false
           });
           document.getElementById('mdl-rm-text').innerHTML = 'Yakin ingin menghapus "' + entry.mata_kuliah + '", ' + entry.sks_kuliah + ' sks, dengan nilai ' + entry.hurufMutu_kuliah + ' dari daftar?';
           document.getElementById('mdl-cancel-button').addEventListener("click", function(){
              entry = 0;
           });
           document.getElementById('mdl-rm-button').addEventListener("click", function(){
             matkul.storeRemove(entry);
             matkul.tableRemove(entry);
             gpa();
           });
        }
        event.preventDefault();
    }, true);
  },



  storeAdd: function(entry) {
    entry.id = matkul.index;
    window.localStorage.setItem("matkul:" + entry.id, JSON.stringify(entry));
    window.localStorage.setItem("matkul:index", ++matkul.index);
  },
  storeEdit: function(entry) {
    window.localStorage.setItem("matkul:" + entry.id, JSON.stringify(entry));
  },
  storeRemove: function(entry) {
    window.localStorage.removeItem("matkul:" + entry.id);
  },

  tableAdd: function(entry) {
    var $tr = document.createElement("tr"),
      $td, key;
    for (key in entry) {
      if (entry.hasOwnProperty(key)) {
        $td = document.createElement("td");
        $td.appendChild(document.createTextNode(entry[key]));
        $tr.appendChild($td);
      }
    }
    $td = document.createElement("td");
    $td.innerHTML = '<a class="waves-effect waves-grey btn-floating blue tooltipped" data-position="left" data-delay="50" data-tooltip="Edit" data-op="edit" data-id="' + entry.id + '"><i class="material-icons left" data-op="edit" data-id="' + entry.id + '">mode_edit</i></a>  <a class="waves-effect waves-grey btn-floating red tooltipped" data-position="right" data-delay="50" data-tooltip="Remove" data-op="remove" data-id="' + entry.id + '" ><i class="material-icons left" data-op="remove" data-id="' + entry.id + '">delete</i></a>';
    $tr.appendChild($td);
    $tr.setAttribute("id", "entry-" + entry.id);
    //matkul.$table.appendChild($tr); //Last entry on bottom
    matkul.$table.prepend($tr); //Last entry on top
  },
  tableEdit: function(entry) {
    var $tr = document.getElementById("entry-" + entry.id),
      $td, key;
    $tr.innerHTML = "";
    for (key in entry) {
      if (entry.hasOwnProperty(key)) {
        $td = document.createElement("td");
        $td.appendChild(document.createTextNode(entry[key]));
        $tr.appendChild($td);
      }
    }
    $td = document.createElement("td");
    $td.innerHTML = '<a class="waves-effect waves-grey btn-floating blue" data-op="edit" data-id="' + entry.id + '"><i class="material-icons left" data-op="edit" data-id="' + entry.id + '">mode_edit</i></a>  <a class="waves-effect waves-grey btn-floating red" data-op="remove" data-id="' + entry.id + '" ><i class="material-icons left" data-op="remove" data-id="' + entry.id + '">delete</i></a>';
    $tr.appendChild($td);

  },
  tableRemove: function(entry) {
    matkul.$table.removeChild(document.getElementById("entry-" + entry.id));
  }
};
matkul.init();

var timeOut;
function scrollToTop() {
	if (document.body.scrollTop!=0 || document.documentElement.scrollTop!=0){
		window.scrollBy(0,-50);
		timeOut=setTimeout('scrollToTop()',10);
	}
	else clearTimeout(timeOut);
}

function gpa() {
  /**
   * Buat getitem sks_kuliah dari localstorage
   * terus disimpen di var jumlahSKS
   * @type {Number}
   */

  var ip = 0;
  var jumlahSKS = 0;
  var jumlahAngkaMutu = 0;
  var AngkaMutu = 0;
  var sks = 0;

  for (var i = 0; i < matkul.index; i++) {
    var obj = JSON.parse(localStorage.getItem("matkul:" + i));
    if (obj !== null) {
      sks = parseInt(obj["sks_kuliah"]);
      jumlahSKS += sks;
      switch (obj["hurufMutu_kuliah"]) {
        case 'A':
          AngkaMutu = 4;
          break;
        case 'B':
          AngkaMutu = 3;
          break;
        case 'C':
          AngkaMutu = 2;
          break;
        case 'D':
          AngkaMutu = 1;
          break;
        case 'E':
          AngkaMutu = 0;
          break;
        default:
          alert("Something wrong");
      }
      jumlahAngkaMutu += AngkaMutu * sks;
    }
  }
  ip = jumlahAngkaMutu / jumlahSKS;
  $("#txttotalSKS").html("SKS Total: " + jumlahSKS);
  $("#txttotalAM").html("Angka Mutu: " + jumlahAngkaMutu);
  if(jumlahSKS != 0){
  $("#txtIP").html("IP: " + ip.toFixed(2));}
  else{$("#txtIP").html("IP: " + 0);}
}

$("#btnReset").on("click", function(){
  $('#mdl-reset').openModal({
    dismissible:false
  });
  document.getElementById('mdl-reset-text').innerHTML = 'Yakin ingin menghapus semua dari daftar?';
  document.getElementById('mdl-reset-no').addEventListener("click", function(){
     entry = 0;
  });
  document.getElementById('mdl-reset-yes').addEventListener("click", function(){
    matkul.$form.reset();
    matkul.$form.id_entry.value = 0;
      for (var i = 0; i < matkul.index; i++) {
        var obj = JSON.parse(localStorage.getItem("matkul:" + i));
        if (obj !== null) {
        var id = parseInt(obj["id"]);
        window.localStorage.removeItem("matkul:" + id);
        matkul.$table.removeChild(document.getElementById("entry-" + id));}
      }
      $("#txttotalSKS").html("SKS Total: " + 0);
      $("#txttotalAM").html("Angka Mutu: " + 0);
      $("#txtIP").html("IP: " + 0);
      matkul.index = 1;
      window.localStorage.setItem("matkul:index", matkul.index);
  });
});
//$('#push,section').pushpin({ top:$('#push').height() });
