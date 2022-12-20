// Variables del servidor, importar modulo de trabajo y el puerto a escuchar
const express = require('express');
const app = express();
const port = 4000;
const XLSX = require('xlsx');
//Extrae información de la solicitud entrante.              
const bodyParser = require('body-parser');
//Recupera información en forma de texto unicamente.
app.use(bodyParser.urlencoded({extended: false}));
// importa el módulo de node `file-system`
const fs = require('fs');
// const { time } = require('console');

// Motor de plantillas
app.set('view engine', 'ejs');
app.set('views', __dirname + '/views');

// Peticion dinamica cuando tenga un hosting __dirname y para las renderizaciones globales
app.use(express.static(__dirname + "/public"))

// Peticion principal
app.get('/', (req,res) => {
    res.render("home")
})

// Peticion secundaria
app.get('/home', (req,res) => {
    res.render("home")
})

// Peticion terciaria
app.get('/ReporteHorizontal', (req,res) => {
    res.render("ReporteHorizontal")
})

// Peticion cuarta
app.get('/txtSS', (req,res) => {
    res.render("TXTSS")
})

// Peticion quinta
app.post('/procesar', callName);

function callName(req, res) {
    var data = req.body.id;
    
    if(data != ""){
        var spawn = require("child_process").spawn;
        var process = spawn('python',["./views/TXTSS.py",data]);
        var Nombre = "";
        // process.stdout.on('data', function(data) {
        process.stderr.on("data",(data)=>{
            console.error('stderr:',data.toString());
        })
        process.stdout.on('data', (data) => {
            Nombre = data.toString();
            // console.log(Nombre);
            Nombre = Nombre.split("\r\n").join("");
            Nombre = Nombre.split("\n").join("");
            if(Nombre == "No existe registro"){
                res.render('Result');
            }
            else{
                process.stdout.on('end', function(data) {
                    function leerexcel(req, res){
                        const workBook = XLSX.readFile('./public/'+Nombre);
                        const workbooksheet = workBook.SheetNames;
                        // console.log(workbooksheet);
                        const sheet = workbooksheet[0];
                        const dataExcel = XLSX.utils.sheet_to_json(workBook.Sheets[sheet]);
                    }
                    leerexcel();
                    res.download('./public/'+Nombre); 
                    setTimeout(() => {
                        fs.unlinkSync('./public/'+Nombre);
                    }, "100")
                } )
            }
        });
    }
    else{
        res.render('ReporteHorizontal');
    }
}

// Metodo de recibir el contenido del field con post
// app.post('/procesar', (req,res) => {
//     var a = req.body.id;
//     console.log(a);
// })

// Al final de todas las rutas si no la encuentra sale el error 404 - Peticion final error
app.use((req,res,next) => {
    res.status(404).render("404", {descripcion: "Error al direccionar"})
})

// Respuesta de que el puerto se encuentra corriendo
app.listen(port, ()=>{
    console.log("Corriendo",port);
})