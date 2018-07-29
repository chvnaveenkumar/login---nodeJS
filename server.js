const express = require('express');
const bodyParser = require('body-parser');
const app = express()

// parse body params and attache them to req.body
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
var cors = require('cors')
app.use(cors());

//custom routes
var userRoutes = require("./modules/user/user.route");
var adminRoutes = require("./modules/admin/admin.route");
var {tokencheck} = require("./middleware/tokencheck");
//set portport
app.set('port', (process.env.PORT || 3000));

app.use(tokencheck);
//app.use('/app/admin',adminRoutes);
app.use('/app/user', userRoutes);

//catch 404 and forward to error handler
app.use((req, res, next) => {
    res.redirect("/app/admin#/404");
});

app.listen(app.set('port'),()=>{
    console.log('Started up at port: '+ app.get('port'));
});
