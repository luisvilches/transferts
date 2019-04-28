window['$s'] = {}
window['$s']['observer'] = Obs;

document.addEventListener('DOMContentLoaded', function(){
    eventsTemplate();
});

function eventsTemplate(){

    var eventsList = ['click','blur','change','dblclick','drag','drop','focus','focusin','focusout','input','keydown','keypress','keyup','mousedown','mouseenter','mouseleave','mousemove','mouseover','mouseout','mouseup','submit','dragend','dragenter','dragleave','dragover','dragstart'];

    eventsList.map(e => {
        Array.from(document.querySelectorAll('['+e+']')).map(element => {
            createOneTimeListener(element, e);
        });
    })
}

function createOneTimeListener(element, event) {    
    var ev = element.getAttribute(event).split('('), name = ev[0], args = ev[1].split(')')[0];
    element.addEventListener(event, function(){
        eval(name+'('+args+');');
    });
    element.removeAttribute(event);
}

function refs(name){
    return document.querySelector('[ref='+name+']');
}

function getCookie(cname) {
    var name = cname + "=";
    var decodedCookie = decodeURIComponent(document.cookie);
    var ca = decodedCookie.split(';');
    for(var i = 0; i <ca.length; i++) {
      var c = ca[i];
      while (c.charAt(0) == ' ') {
        c = c.substring(1);
      }
      if (c.indexOf(name) == 0) {
        return c.substring(name.length, c.length);
      }
    }
    return "";
}

function deleteAllCookies() {
    var cookies = document.cookie.split(";");

    for (var i = 0; i < cookies.length; i++) {
        var cookie = cookies[i];
        var eqPos = cookie.indexOf("=");
        var name = eqPos > -1 ? cookie.substr(0, eqPos) : cookie;
        document.cookie = name + "=;expires=Thu, 01 Jan 1970 00:00:00 GMT";
    }
}

function Obs(){
    this.subscriptores = [];
}

Obs.prototype = {
    subscribe:function(sub){
        this.subscriptores.push(sub);
    },

    notify:function(cb){
        this.subscriptores.forEach(element => {
            cb(element);
        });
    }
}

function GlobalState(obj){
    var self  = this;
    self.subscriptores = [];
    self.state = obj;
    
    document.querySelectorAll('[data-state]').forEach(selector => {
        self.subscribe(selector,function(){
            selector.textContent = self.getState()[selector.dataset.state];
        }); 
        self.notify();
    })
}

GlobalState.prototype = {

    subscribe: function(sub,cb){
        let obj = {el:sub,action:cb}
        this.subscriptores.push(obj);
    },

    notify: function(){
        this.subscriptores.forEach(element => {
            element.action(element.el);
        });
    },

    setState: function(property,value){
        this.state[property] = value;
        this.notify();
    },

    getState:function(){
        return this.state;
    }
}

Array.prototype.Observer = function(callback){
    var self = this;

    function notify(){
       callback(self);
    }

    var func = ['map','includes','join','reduce','every','entries','toString','slice','lastIndexOf','indexOf','filter','find','findIndex','forEach','keys','some',];
    var funcObs = ['push','pop','shift','splice','unshift','concat','reverse','sort','unshift','copyWithin','fill']
    var methods = {length: self.length}

    for(let i in func){
        methods[func[i]] = self[func[i]];
    }

    for(let e in funcObs){
        methods[funcObs[e]] = function(){
            self[funcObs[e]](...arguments);
            notify();
        }
    }

    methods['set'] = function(a){
        self = a;
        notify();
    }

    return methods;
}