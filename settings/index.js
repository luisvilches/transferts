
module.exports = {
    SERVER:{
        port:1989,
        static_url: "static",
        media_url: "media",
        cors:{
            allowed_host:['*']
        },
        security:{
            jwt_secret_key:"ufvghf_crexythj__bhgctwazes_xdcfvb8-65632a6t6_6hg438:76897098y_87g76f9"
        }
    },
    DATABASE:{
        development:{
            name:"trfst-transfers",
            user:"Trfst",
            password:"Andres2230",
            port:"45926",
            host:"ds145926.mlab.com",
            provider:"mlab"
        },
        producction:{
            name:"trfst-transfers",
            user:"Trfst",
            password:"Andres2230",
            port:"45926",
            host:"ds145926.mlab.com",
            provider:"mlab"
        }
    }
};