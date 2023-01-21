function error_response(description, result){
	
	return {"success" : description,"data": result}
}


function success_response(description, result){
	
	return {"success" : description,"data": result}
}

module.exports = {
    error_response : error_response,
    success_response : success_response
   }
   