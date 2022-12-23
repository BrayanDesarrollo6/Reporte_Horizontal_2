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
const { render } = require('ejs');
// Modulo path
const path = require('path');
// Modulo Python
const spawn = require("child_process").spawn;

// Motor de plantillas
app.set('view engine', 'ejs');
app.set('views', path.join(__dirname,'/views'));

// Peticion dinamica cuando tenga un hosting __dirname y para las renderizaciones globales
app.use(express.static(path.join(__dirname,'/public')));

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

var Nombre = "";

// Peticion quinta
app.post('/procesar', callName);

function callName(req, res) {
    var data = req.body.id;
    if(data != ""){
        var process = spawn('python',["./views/ReporteHorizontal.py",data]);
        // process.stdout.on('data', function(data) {
        process.stderr.on("data",(data)=>{
            console.error('stderr:',data.toString());
        });
        process.stdout.on('data', (data) => {
            Nombre = data.toString();
            Nombre = Nombre.split("\r\n").join("");
            Nombre = Nombre.split("\n").join("");
        });
        process.stdout.on('end', function(data) {
            if(Nombre == "No existe registro"){
                res.render('Result');
            }
            else{
                function leerexcel(req, res){
                    const workBook = XLSX.readFile('./public/'+Nombre);
                    const workbooksheet = workBook.SheetNames;
                    // console.log(workbooksheet);
                    const sheet = workbooksheet[0];
                    const dataExcel = XLSX.utils.sheet_to_json(workBook.Sheets[sheet]);
                }
                leerexcel();
                res.download('./public/'+Nombre);
                // res.render('Download');
                setTimeout(()=>{
                    fs.access('./public/'+Nombre, error => {
                        if (!error) {
                            fs.unlink('./public/'+Nombre,function(error){
                                if(error) 
                                console.error('Error Occured:', error);
                                console.log('File deleted!');
                            });
                        } 
                        else {
                            console.error('Error Occured:', error);
                        }
                    });
                }, "100");
            }
        });
    }
    else{
        res.render('ReporteHorizontal');
    }
}

// Petición sexta
app.post('/procesarTXTSS', callName2);

function callName2(req, res){
    data_1 = req.body.Empresa;
    data_2 = req.body.Anio;
    data_3 = req.body.Mes;
    // d = a.toString()+","+b.toString()+","+c.toString();
    // res.send(d);

    if(data_1 != "" && data_2 != "" && data_3 != ""){
        var spawn = require("child_process").spawn;
        var process = spawn('python',["./views/TXTSS.py",data_1,data_2,data_3]);
        var Nombre = "";
        // process.stdout.on('data', function(data) {
        process.stderr.on("data",(data)=>{
            console.error('stderr:',data.toString());
        })
        process.stdout.on('data', (data) => {
            Nombre = data.toString();
            Nombre = Nombre.split("\r\n").join("");
            Nombre = Nombre.split("\n").join("");
            // console.log(Nombre);
            if(Nombre == "No existe registro"){
                res.render('Result_Txt');
            }
            else{
                process.stdout.on('end', function(data) {
                    res.download('./public/'+Nombre); 
                    setTimeout(() => {
                        fs.unlinkSync('./public/'+Nombre);
                    }, "10")
                } )
            }
        });
    }
    else{
        res.render('Result_Txt');
    }
}

// Al final de todas las rutas si no la encuentra sale el error 404 - Peticion final error
app.use((req,res,next) => {
    res.status(404).render("404", {descripcion: "Error al direccionar"})
})

// Respuesta de que el puerto se encuentra corriendo
app.listen(port, ()=>{
    console.log("Corriendo",port);
})