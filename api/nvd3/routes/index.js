var title = 'RTCお絵描き絵本';
/*LP*/

exports.index = function(req, res){
	res.render('index', { title:  title});
};

exports.kill = function(req, res){
	res.redirect('/');	
}
