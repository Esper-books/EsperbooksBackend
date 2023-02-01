var axios = require('axios');
const configs = require('../config/config');
var qs = require('qs');

    function fetch_token(callback){
            var data = qs.stringify({
            'userName': '0000285420',
            'password': '173a56a358c15d1ce046634b343e3fe9f4c6ecb2e037cc0e5aea2eba32320e76',
            'sessionLength': '1200000000' 
            });
            var config = {
            method: 'post',
            url: 'http://sandbox.readycashng.com:8080/rc/rest/agent/login',
            headers: { 
                'Authorization': 'Basic MDAwMDI4NTQyMDoxNzNhNTZhMzU4YzE1ZDFjZTA0NjYzNGIzNDNlM2ZlOWY0YzZlY2IyZTAzN2NjMGU1YWVhMmViYTMyMzIwZTc2', 
                'Content-Type': 'application/x-www-form-urlencoded', 
                'Cookie': 'JSESSIONID=node056h3u5bu629hxyzk4y2qjwvd6.node0'
            },
            data : data
            };

            axios(config)
            .then(function (response) {
          //  console.log(JSON.stringify(response.data));
            callback(response.data);
            })
            .catch(function (error) {
          //  console.log(error);
            callback(error);
            });
    }


    function create_wallet(phone,email,callback){

        fetch_token(function(response_callback){

            var axios = require('axios');
                var data = JSON.stringify({
                "phone": phone,
                "address": "400 Herbert Macaulay Way, Yaba",
                "email": email,
                "addressState": "Lagos",
                "addressCity": "Yaba",
                "firstName": "Gbenga ls",
                "lastName": "Agoro",
                "gender": "M",
                "dateOfBirth": "1992-11-08",
                "bvn": "22146755068",
                "account": {
                    "alias": "Main Account",
                    "currencyCode": "566"
                }
                });

                var config = {
                method: 'post',
                url: 'http://62.173.32.30:8080/api/provider/wallets/create',
                headers: { 
                    'Authorization': response_callback.Authorization, 
                    'Content-Type': 'application/json'
                },
                data : data
                };

                axios(config)
                .then(function (response) {
               // console.log(JSON.stringify(response.data));
                callback(response.data)
                })
                .catch(function (error) {
                //console.log(error);
                callback(error);
                });
        
        });

    }



    module.exports = {
        fetch_token : fetch_token,
        create_wallet : create_wallet
       }