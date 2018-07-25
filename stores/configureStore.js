//jshint esversion:6

if(process.env.NODE_ENV==='production') {
    module.export = require('./configureStore.prod');
}
else {
    module.export = require('./configureStore.dev');
}