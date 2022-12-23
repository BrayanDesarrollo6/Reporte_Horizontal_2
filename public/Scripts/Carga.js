// $(function(){
//     $('#Report').on('submit',function(event){
//         event.preventDefault();
//         let entrada = $('#entrada');
//         let load = document.getElementById('load');
//         let Report = document.getElementById('Report');
//         load.style.display = "block";
//         Report.style.display = "none";
//         $.ajax({
//             url: '/procesar',
//             method: 'POST',
//             data: {
//                 id: entrada.val()
//             },
//             success: function(response){
//               console.log(response);
//               load.style.display = "none";
//               Report.style.display = "block";
//               const downloadInstance = document.createElement('a');
//                 // downloadInstance.href = "http://127.0.0.7:5000/download_file/"+response
//                 // downloadInstance.target = "_blank";
//                 // downloadInstance.download = 'Shape up';
//                 // document.body.appendChild(downloadInstance);
//                 // downloadInstance.click();
//                 // document.body.removeChild(downloadInstance);
//             }
//         });
//     });
// });
// $(function(){
//     // Peticion del txt
//     $('#txt').on('submit',function(event){
//         // event.preventDefault();
//         // let entrada = $('#entrada');
//         let load_2 = document.getElementById('load_2');
//         let txt = document.getElementById('txt');
//         load_2.style.display = "block";
//         txt.style.display = "none";
//         $.ajax({
//             url: '/procesarTXTSS',
//             method: 'POST',
//             // data: {
//             //     id: entrada.val()
//             // },
//             success: function(response){
//                 load_2.style.display = "none";
//                 txt.style.display = "block";
//             }
//         });
//     });
// });  

// function clicks(){
//     let load = document.getElementById('load');
//     let Report = document.getElementById('Report');
//     load.style.display = "block";
//     Report.style.display = "none";
//     // setTimeout(() => {
//     //     load.style.display = "none";
//     //     Report.style.display = "block";
//     //   }, 20000)
// }

// function clicks_2(){
//     let load_2 = document.getElementById('load_2');
//     let Txt = document.getElementById('txt');
//     load_2.style.display = "block";
//     Txt.style.display = "none";
//     // setTimeout(() => {
//     //     load_2.style.display = "none";
//     //     Txt.style.display = "block";
//     //   }, 7000)
// }

// function regresar(){
//   // let load_2 = document.getElementById('load_2');
//   // let Txt = document.getElementById('txt');
//   // load_2.style.display = "block";
//   // Txt.style.display = "none";
//   setTimeout(() => {
//     console.log("Hola");
//     $.ajax({
//       url: '/ReporteHorizontal',
//       method: 'GET'
//     });
//   }, 1000)
// }

// $(function(){
//   // Peticion del txt
//   $('#regresar').on('click',function(){
//     setTimeout(() => {
//       console.log("Hola");
//       $.ajax({
//         url: '/ReporteHorizontal',
//         method: 'GET'
//       });
//     }, 2000)  
//   });
// });  