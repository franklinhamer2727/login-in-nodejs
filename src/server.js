//Librerias necesarias para poder conectame a uns sservidor en este caso em conecto mi puesto 3000
const express = require ('express');
const app = express();

const path = require('path');
const passport = require('passport');
const mongoose = require('mongoose');
const flash = require('connect-flash');
const morgan = require('morgan');
const cookieParser = require('cookie-parser');
const bodyparser = require('body-parser');
const session = require('express-session');


const {url} = require('./config/database.js');


//Esta partes para poder conectame a la base de datos
mongoose.connect(url,{
    useNewUrlParser :true,
    useUnifiedTopology : true,
});
require('./config/passport')(passport);
//setting
app.set('port',process.env.PORT|| 3000);
//configuro la parte de las vistas
app.set('views',path.join(__dirname,'views'));
//configuor el motor de plantilla
app.set('view engine','ejs');

//middlewares
//es una manera de ver los mensjaes cpor consola
app.use(morgan('dev'));
// es la manera de que nosotros vamos a poder administrar las cokies convertirals e interpretarlas
app.use(cookieParser());
// es una forma de decirle que las ordenes que reciba desde el formulario la voya poder interpretar desde la URL
app.use(bodyparser.urlencoded({extended:false}));
//esto es para poder manejar las secciones de express
app.use(session({
    secret:'franklinhamer',
    resave:false,
    saveUninitialized : false,
}));

app.use(passport.initialize());
//se auutentica un usuario no se va apedir siempre a la base de datos por eso se guarda en el navegador

app.use(passport.session());
//las paginas html se pasan mensajes con flash
app.use(flash());


//routes
require('./app/routes.js')(app,passport);
//static files

app.use(express.static(path.join(__dirname,'public')));
//start the server
app.listen(app.get('port'),() =>{
    console.log('sever on port', app.get('port'));
});