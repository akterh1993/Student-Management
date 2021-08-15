const mongoose = require('mongoose');

mongoose.connect('mongodb://localhost:27017/Students',{
    useCreateIndex:true,
    useNewUrlParser:true,
    useUnifiedTopology:true
}).then(() => {
    console.log('Database Connection Successfull!')

}).catch((e) => {
    console.log('Database Connection failed....')

})