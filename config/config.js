var config = {};

config.twitter = {};
config.redis = {};
config.web = {};
config.code ={};


config.default_stuff =  ['red','green','blue','apple','yellow','orange','politics'];
config.twitter.user_name = process.env.TWITTER_USER || 'username';
config.twitter.password=  process.env.TWITTER_PASSWORD || 'password';
config.redis.uri = process.env.DUOSTACK_DB_REDIS;
config.redis.host = 'hostname';
config.redis.port = 6379;
config.web.port = process.env.WEB_PORT || 9980;


config.code.invalid_username ={};
config.code.invalid_username.code = 401;
config.code.invalid_username.description = "invalid credential provided";

config.code.incomplete_parameter ={};
config.code.incomplete_parameter.code = 402;
config.code.incomplete_parameter.description = "Incomplete parameter provided";

config.code.duplicate_entry ={};
config.code.duplicate_entry.code = 403;
config.code.duplicate_entry.description = "duplicate entry provided";



module.exports = config;