module.exports = function (req,res,next){
    res['response'] = function(file,data){
        res.setHeader('Set-Cookie', setCookie('_simplicity',JSON.stringify(data)));
        res.render(file,data);
    }
    next();
}