var type = 0;
var files = [];

document.addEventListener('DOMContentLoaded', function () {
    var box = refs('dragandrop');
    box.addEventListener('dragenter', dragOverHandler, false);
    box.addEventListener('dragleave', dragOverHandler, false);
    box.addEventListener('dragover', dragOverHandler, false);
    box.addEventListener('drop', dropHandler, false);
    setItem(0)
    new SimpleBar(document.querySelector('.item'));
    new SimpleBar(document.querySelector('.side-menu'));

    var inputs = document.querySelectorAll('.input-material .input');

    inputs.forEach(e => e.addEventListener('blur', function(event){
        if(e.value.length !== 0){
            event.target.classList.add('filled');
        } else {
            event.target.classList.remove('filled');
        }
    }));

    let tooltips = document.querySelectorAll('[tooltip]')

    document.addEventListener('mouseover', (e) => {
        if(e.target.tagName === 'SPAN') {
            tooltips.value = e.target.outerHTML
        }
    })
})


function dropHandler(ev) {
    
    ev.preventDefault();
  
    if (ev.dataTransfer.items) {
    
      for (var i = 0; i < ev.dataTransfer.items.length; i++) {
    
        if (ev.dataTransfer.items[i].kind === 'file') {
          var file = ev.dataTransfer.items[i].getAsFile();
          if(validExt(file)){
            loadFile(file);
          }
        }
      }
    } else {
    
      for (var i = 0; i < ev.dataTransfer.files.length; i++) {
        let file = ev.dataTransfer.files[i];
        if(validExt(file)){
            loadFile(file);
        }
      }
    } 

    removeDragData(ev)
  }

  function dragOverHandler(ev) {
    ev.preventDefault();
  }

  function removeDragData(ev) {
    if (ev.dataTransfer.items) {
      ev.dataTransfer.items.clear();
    } else {
      ev.dataTransfer.clearData();
    }
  }

function validExt(file){
    var exts = [
        'pdf',
        'doc',
        'xls',
        'ppt',
        'jpg',
        'zip',
        'png',
        'xml',
        'txt',
        'sql',
        'php',
        'gif',
        'html',
        'js',
        'mp3',
        'css',
        'psd',
        'ai',
        'svg',
        'eps',
        'cad',
        'bmp',
        'wmv',
        'flv',
        'fla',
        'midi',
        'ps',
        'aac',
        'dmg',
        '3ds',
        'avi'
    ];
    var ex = ext(file);
    return exts.some(e => e === ex);
  }

  function loadFile(file){

    
    if(sizeAllFiles(file)){
        var reader = new FileReader();
        var d = new Date();
        var newId = 'e'+ d.getHours()+d.getMinutes()+d.getSeconds()+d.getMilliseconds() + getRandomInt(0,10000);

        appendFileList(file,newId);

        reader.onabort =  function(){
            reader.abort();
        }

        reader.onload = function(){
            var bar = document.querySelector('#'+newId);
            bar.style.width = '100%';
            // bar.textContent = '100%';
        }

        reader.onloadend = function(){
            var btn = refs('send');
            if(files.length == 0){
                btn.disabled = true;
            } else {
                btn.disabled = false;
            }
        }

        reader.onerror = function(event) {
            console.log('error ->',event);
            reader.abort();
        };

        reader.onprogress = function(data){
            var bar = document.querySelector('#'+newId);
            if (data.lengthComputable) {                                            
                var progress = parseInt( ((data.loaded / data.total) * 100), 10 );
                if (progress < 100) {
                    bar.style.width = progress + '%';
                    // bar.textContent = progress + '%';
                }
            }
        }

        if(file){
            reader.readAsDataURL(file);
        } else {

        }
    } else {
        // alert max size permitido
    }
  }

function handleFiles(el){
    Array.from(el.files).map(file => {
        if(validExt(file)){
            loadFile(file);
        }
    })
}

function appendFileList(file,id){
    files.push(file);
    var ex = ext(file);
    var list = refs('list');
    var card = document.createElement('div');
    card.className = 'card';
    var f =  document.createElement('div');
    f.className = 'file';
    var x = document.createElement('i');
    x.className = 'fas fa-times-circle closed';
    var p = document.createElement('p');
    p.className = "file-text";
    var progress = document.createElement('div');
    p.innerHTML = `<img src="/assets/images/mimetypes/${ex}.png"/> ${file.name}`; 
    var tmp = `<div class="progress">
        <div id="${id}" class="progress-bar" role="progressbar" aria-valuenow="" aria-valuemin="0" aria-valuemax="100"></div>
    </div>`;
    progress.innerHTML = tmp;

    x.addEventListener('click', function(){
        var parent = this.parentNode.parentNode;
        parent.parentNode.removeChild(parent);
        files.find(e => {
            if(e === file){
                return remove(file);
            }
        });

        var btn = refs('send');

        if(files.length == 0){
            btn.disabled = true;
        } else {
            btn.disabled = false;
        }
    })

    f.appendChild(x);
    f.appendChild(p);
    f.appendChild(progress);
    card.appendChild(f);
    list.appendChild(card);
}

function getRandomInt(min, max) {
    return Math.floor(Math.random() * (max - min)) + min;
  }

  function remove(file){
    files.find((i,index) => {
        if(i.name.toString().toLowerCase().trim() === file.name.toString().toLowerCase().trim()){
            files.splice(index,1);
            return files;
        } else {
            console.log('no encontrado', file)
        }
    })
}

function sizeAllFiles(file){
    var size = 0;
    files.map(e => size + e.size)
    if(files.length > 0){
        size = files.reduce((total,f) => total + f.size,0);
    }
    return formatSizeUnits(size + file.size);
}

function formatSizeUnits(bytes){
    if( bytes >= 1073741824 ) {
        return false;
    } else {
        return true;
    }
}

function sendFiles(){
    
    var fd = new FormData();
    var name = refs('name');
    var email = refs('email');
    var msg = refs('msg');
    var password = refs('pass');
    var p_name = name.parentNode;
    var p_email = email.parentNode;
    var btn = refs('send');

    var options = Array.from( document.querySelectorAll('.box-options input'));

    var result;

    options.map(e => {
        if(e.checked == true){
            result = e.value;
        }
    });

    if(name == null || name.value.length == 0 || /^\S+$/.test(name.value)){
        name.style.borderBottom = '1px solid #EF5350';
        name.nextSibling.nextElementSibling.style.color = '#EF5350';
        return false;
    } else{
        name.style.borderBottom = '1px solid #007bff';
        name.nextSibling.nextElementSibling.style.color = '#007bff';
    }

    fd.append('name', name.value);
    fd.append('password',password.value);
    fd.append('type',type);
    fd.append('times',result);
    fd.append('message', msg.value);

    if(type == 0){
        var e = email.value.split(',');
        var el = e.map(element => validateEmail(element));
    
        if(!el.every(e => e)){
            email.style.borderBottom = '1px solid #EF5350';
            email.nextSibling.nextElementSibling.style.color = '#EF5350';
            return false;
        } else {
            email.style.borderBottom = '1px solid #007bff';
            email.nextSibling.nextElementSibling.style.color = '#007bff';
        }
        
        fd.append('email', email.value);
    } 



    
    if(files.length == 0){
        btn.disabled = true;
        return false;
    } else {

        for(var i in files ) {
            fd.append('files', files[i], files[i].name );
        }
        btn.disabled = false;
    }

    openLoader();

    fetch('/api/send',{
        method:'POST',
        body: fd
    })
    .then(res => res.json())
    .then(response => {
        var a = refs('link');
        var linkContent = refs('linkContent');
        if(response['success']){
            a.value = response.data.url;
            linkContent.href = response.data.url;
            reset();
            checkedTrue();
            if(type == 0){
                setItem(3);
            } else {
                setItem(2);
            }
        }
    })
}

function setType(value){
    type = value;
}

function ext(file){
    return file.name.split('.').pop();
}

function reset(){
    files = [];
    var list = refs('list');
    var email = refs('email');
    var msg = refs('msg');
    var name = refs('name');
    list.innerHTML = '';
    email.value = '';
    msg.value = '';
    name.value = '';
}


function openLoader(){
    var loader = refs('loader');
    loader.classList.add('active');
}


function closeLoader(){
    var loader = refs('loader');
    loader.classList.remove('active');
}


function checkedTrue(){
    var ck = `<div class="container-check">  
    <svg xmlns="http://www.w3.org/2000/svg" class="svg-success" viewBox="0 0 24 24">
      <g stroke-linecap="round" stroke-linejoin="round" stroke-miterlimit="10">
        <circle class="success-circle-outline" cx="12" cy="12" r="11.5"/>
        <circle class="success-circle-fill" cx="12" cy="12" r="11.5"/>
        <polyline class="success-tick" points="17,8.5 9.5,15.5 7,13"/>
      </g>
    </svg>
    <br/>
    <h5 class="gray text-center">Completado</h5>
  </div>`;

  var loader = refs('content-loader');
  loader.innerHTML = ck;

   setTimeout(() => closeLoader(),3000);
}

function validateEmail(email) {
    var re = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
    return re.test(String(email).toLowerCase());
}

function copyLink() {
    var copyText = refs('link');
    copyText.select();
    document.execCommand("copy");
    var n = refs('notify');
    n.classList.toggle('active');
    setTimeout(function(){n.classList.toggle('active');},2000)
}


function setItem(val){
    window['activeItems'] = val;
    var items = document.querySelectorAll('.item');

    items.forEach((e,i) => {
        if(i == val){
            e.classList.add('active')
        } else {
            e.classList.remove('active');
        }
    })

    var btns = document.querySelector('.btns');

    if(val == 2 || val == 3){
        btns.classList.add('desactive');
    } else {
        btns.classList.remove('desactive');
    }
}

function openConfig(el){
    var i = el.querySelector('i');
    if(window.activeItems == 0){
        setItem(1);
        i.textContent = 'reply';
        i.parentNode.setAttribute('tooltip','Volver');
    } else {
        setItem(0);
        i.parentNode.setAttribute('tooltip','Opciones');
        i.textContent = 'sort';
    }
}


function metodo(val){
    var n = refs("inputName");
    var m = refs("inputMail");

    if(val == 1){
        m.style.display = 'none';
        setType(1);
    } else {
        m.style.display = 'flex';
        setType(2);
    }
}


function activatePassword(input){
    var pass = refs('pass');
    if(input.checked){
        pass.disabled = false;
    } else {
        pass.disabled = true;
    }
}

function textAreaAdjust(el) {
    el.style.height = (el.scrollHeight > el.clientHeight) ? (el.scrollHeight)+"px" : "60px";
  }

  function menubar(ref){
    document.querySelectorAll('.side-menu').forEach(e => e.classList.remove('active'))
    var menu = refs(ref);
    menu.classList.add('active');
  }

  function closed(){
    document.querySelectorAll('.side-menu').forEach(e => e.classList.remove('active'))
  }