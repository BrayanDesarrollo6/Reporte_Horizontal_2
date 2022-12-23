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
//                 load.style.display = "none";
//                 Report.style.display = "block";
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

function clicks(){
    let load = document.getElementById('load');
    let Report = document.getElementById('Report');
    load.style.display = "block";
    Report.style.display = "none";
    setTimeout(() => {
        load.style.display = "none";
        Report.style.display = "block";
      }, 20000)
}

function clicks_2(){
    let load_2 = document.getElementById('load_2');
    let Txt = document.getElementById('txt');
    load_2.style.display = "block";
    Txt.style.display = "none";
    setTimeout(() => {
        load_2.style.display = "none";
        Txt.style.display = "block";
      }, 7000)
}