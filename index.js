// Variables del servidor, importar modulo de trabajo y el puerto a escuchar
const express = require('express');
const app = express();
const port = 4000;

// Motor de plantillas
app.set('view engine', 'ejs');
app.set('views', __dirname + '/views');

// Peticion dinamica cuando tenga un hosting __dirname y para las renderizaciones globales
app.use(express.static(__dirname + "/public"))

// Peticion principal
app.get('/', (req,res) => {
    res.render("index")
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
app.get('/procesar', callName);

var a = '';

function callName(req, res) {
    var spawn = require("child_process").spawn;
    var process = spawn('python',["./views/TXTSS.py"]);
    process.stdout.on('data', function(data) {
        a = data.toString();
        // b = JSON.parse(a);
        console.log(typeof(data));
        // console.log(a.toString());
        res.render("python");
        
        // const XLSX = require('xlsx')
        // const convertJsonToExcel = () => {
        //     const workSheet = XLSX.utils.json_to_sheet(b);
        //     const workBook = XLSX.utils.book_new();
        //     XLSX.utils.book_append_sheet(workBook, workSheet, "b")
        //     // Generate buffer
        //     XLSX.write(workBook, { bookType: 'xlsx', type: "buffer" })
        //     // Binary string
        //     XLSX.write(workBook, { bookType: "xlsx", type: "binary" })
        //     XLSX.writeFile(workBook, "bData.xlsx")
        // }
        // convertJsonToExcel()
    } )
}

// Peticion sexta
app.get('/procesar_2', callName2);

function callName2(req,res) {
        b = JSON.parse(a);
        const XLSX = require('xlsx')
        const convertJsonToExcel = () => {
            const workSheet = XLSX.utils.json_to_sheet(b);
            const workBook = XLSX.utils.book_new();
            XLSX.utils.book_append_sheet(workBook, workSheet, "b")
            // Generate buffer
            XLSX.write(workBook, { bookType: 'xlsx', type: "buffer" })
            // Binary string
            XLSX.write(workBook, { bookType: "xlsx", type: "binary" })
            XLSX.writeFile(workBook, "bData.xlsx")
        }
        convertJsonToExcel()
        res.send("ok");
}

// Al final de todas las rutas si no la encuentra sale el error 404 - Peticion final error
app.use((req,res,next) => {
    res.status(404).render("404", {descripcion: "Error al direccionar"})
})

// Respuesta de que el puerto se encuentra corriendo
app.listen(port, ()=>{
    console.log("Corriendo",port);
})