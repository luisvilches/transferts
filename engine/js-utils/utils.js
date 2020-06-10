module.exports = function createTemplateFunction($$_s_require, $$_filepath, $$_s, code) {
	let mkrange = $$_s.mkrange
	let val = $$_s.val
	let $$_error_line = 0;
	return eval(`module.exports = function ($$_options){
		try {
			with($$_options){
				return ${code}
			}
		} catch (e) { 
			e.fileStack = [...(e.fileStack||[]), [$$_filepath, $$_error_line]]
			throw e
		}
	}`)
}
