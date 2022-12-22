$(function(){
    $('#Report').on('submit',function(event){
        // event.preventDefault();
        let entrada = $('#entrada');
        let load = document.getElementById('load');
        let Report = document.getElementById('Report');
        load.style.display = "block";
        Report.style.display = "none";
        $.ajax({
            url: '/procesar',
            method: 'POST',
            data: {
                id: entrada.val()
            },
            success: function(response){
                load.style.display = "none";
                Report.style.display = "block";
            }
        });
    });
});
$(function(){
    // Peticion del txt
    $('#txt').on('submit',function(event){
        // event.preventDefault();
        // let entrada = $('#entrada');
        let load_2 = document.getElementById('load_2');
        let txt = document.getElementById('txt');
        load_2.style.display = "block";
        txt.style.display = "none";
        $.ajax({
            url: '/procesarTXTSS',
            method: 'POST',
            // data: {
            //     id: entrada.val()
            // },
            success: function(response){
                load_2.style.display = "none";
                txt.style.display = "block";
            }
        });
    });
});