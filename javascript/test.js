var canvas;

function initCanvas() {

    canvas.setBackgroundColor('red', canvas.renderAll.bind(canvas))
    canvas.setHeight(570);
    canvas.setWidth(1080);

    //Rectángulo que representa la tarjeta (blanca)
    var white_rect = new fabric.Rect({
        width: 636,
        height: 406,
        selectable: false,
        fill: 'white',
        evented: false,
        rx: 10,
        ry: 10
    });

    canvas.add(white_rect);
    canvas.centerObject(white_rect);

    //Borde de seguridad externo de la tarjeta
    var external_border = new fabric.Rect({
        width: 636,
        height: 406,
        selectable: false,
        fill: 'rgba(255, 255, 255, 0)',
        stroke: '#5e6462',
        strokeWidth: 1,
        rx: 10,
        ry: 10,
        evented: false
    });

    canvas.add(external_border);
    canvas.centerObject(external_border);

    //Borde de seguridad interno de la tarjeta
    var internal_border = new fabric.Rect({
        width: external_border.get('width') - 14.57 + 2,
        height: external_border.get('height') - 14.57 + 2,
        selectable: false,
        fill: 'rgba(255, 255, 255, 0)',
        stroke: 'black',
        strokeWidth: 0.5,
        strokeDashArray: [3, 2],
        rx: 10,
        ry: 10,
        evented: false
    });

    canvas.add(internal_border);
    canvas.centerObject(internal_border);

    canvas.on('object:added', function (e) {
        external_border.bringToFront();
        internal_border.bringToFront();
    })

    canvas.renderAll();
}

jQuery(document).ready(function () {
    canvas = new fabric.Canvas('canvas');
    initCanvas();

    /* ---------- AÑADIR UNA IMAGEN ---------- */
    jQuery('#select-file').on("change", function (e) {
        var fileType = e.target.files[0].type;
        var url = URL.createObjectURL(e.target.files[0]);

        if (fileType === 'image/png' || fileType === 'image/jpeg') { //check if png
            var reader = new FileReader();
            reader.onload = function (event) {
                var imgObj = new Image();
                imgObj.src = event.target.result;
                imgObj.onload = function () {
                    // start fabricJS stuff

                    var image = new fabric.Image(imgObj);
                    //image.scale(getRandomNum(0.1, 0.25)).setCoords();
                    image.scaleToWidth(180);
                    image.scaleToHeight(180);
                    canvas.add(image);

                    //Se centra la imagen
                    canvas.centerObject(image);
                    // end fabricJS stuff
                }

            }
            reader.readAsDataURL(e.target.files[0]);
        }
        jQuery(this).val("") //reiniciamos el valor del input para que nos permita añadir la misma imagen varias veces (en caso de no hacerlo, no se activaría el onchange al elegir la última imagen usada)
    });

    /* ------------ AÑADIR UN CAMPO DE TEXTO ------------ */
    jQuery('#add-text-btn').click(function () {

        var text = new fabric.IText('Tap and Type', {
            fontFamily: 'times new roman',
            fill: '#333',
            fontSize: 14,
            top: 400,
            left: 300
        });

        canvas.add(text);
    })

    jQuery('#add-ugly-text-btn').click(function () {

        var text = new fabric.Text('Tap and Type', {
            fontFamily: 'times new roman',
            fill: '#333',
            fontSize: 14,
            top: 400,
            left: 300
        });

        canvas.add(text);
        //canvas.centerObject(text);
        text.center();
        text.setCoords();
        canvas.renderAll();
    })

    jQuery('#json-customization-btn').click(function () {
        var json = canvas.toJSON(['selectable']);
        var a = document.createElement("a");
        var file = new Blob([JSON.stringify(json)], {
            type: 'text/plain'
        });
        a.href = URL.createObjectURL(file);
        a.download = 'json.txt';
        a.click();
    })

    jQuery("#bold-btn").click(function () {

    })

    jQuery("#italic-btn").click(function () {

    })

    jQuery("#underline-btn").click(function () {

    })

    jQuery("#copy-btn").click(function () {

    })

    jQuery("#paste-btn").click(function () {

    })

    jQuery("#delete-btn").click(function () {

    })

    jQuery("#send-back-btn").click(function () {

    })

    jQuery("#bring-front-btn").click(function () {

    })
})