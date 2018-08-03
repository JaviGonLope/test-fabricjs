var canvas;

var white_rect;
var external_border;
var internal_border;

fabric.Object.prototype.objectCaching = false

function initCanvas() {

    canvas.setBackgroundColor('red', canvas.renderAll.bind(canvas))
    canvas.setHeight(570);
    canvas.setWidth(1080);
    canvas.preserveObjectStacking = true;

    //Rectángulo que representa la tarjeta (blanca)
    white_rect = new fabric.Rect({
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
    external_border = new fabric.Rect({
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
    internal_border = new fabric.Rect({
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

    canvas.on({
        'selection:created': getSelection,
        'selection:updated': getSelection
    })

    canvas.on('selection:cleared', function () {
        $('#info').text('No se ha seleccionado ningún elemento.')
        $('#object-controls').addClass('hidden')
        $('#txt-controls').addClass('hidden')
    })

    canvas.renderAll();
}

function getSelection(){
    var selected = canvas.getActiveObject();
    if (selected) {
        var type = selected.get('type');
        $('#object-controls').removeClass('hidden')
        if (type === 'activeSelection') {
            $('#info').text('Type: multiple selection')
            $('#txt-controls').addClass('hidden')
        } else {
            $('#info').text('Type: ' + type)
            if (type === 'i-text'){
                $('#txt-controls').removeClass('hidden')
            }else{
                $('#txt-controls').addClass('hidden')
            }
        }

    }
}

function copy() {
    canvas.getActiveObject().clone(function (cloned) {
        _clipboard = cloned;
    });
}

function paste() {
    // clone again, so you can do multiple copies.
    _clipboard.clone(function (clonedObj) {
        canvas.discardActiveObject();
        clonedObj.set({
            left: clonedObj.left + 10,
            top: clonedObj.top + 10,
            evented: true,
        });
        if (clonedObj.type === 'activeSelection') {
            // active selection needs a reference to the canvas.
            clonedObj.canvas = canvas;
            clonedObj.forEachObject(function (obj) {
                canvas.add(obj);
            });
            // this should solve the unselectability
            clonedObj.setCoords();
        } else {
            canvas.add(clonedObj);
        }
        _clipboard.top += 10;
        _clipboard.left += 10;
        canvas.setActiveObject(clonedObj);
        canvas.requestRenderAll();
    });
}

function deleteElement() {
    var selected = canvas.getActiveObjects();
    if (selected) {
        //if (confirm('¿Está seguro de que desea borrar el elemento seleccionado?')) {
        canvas.remove(...selected);
        //}
    }
    canvas.discardActiveObject().renderAll();
}

jQuery(document).ready(function () {
    canvas = new fabric.Canvas('canvas');
    $('#object-controls').addClass('hidden')
    $('#txt-controls').addClass('hidden')
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
            fontSize: 20,
            top: 400,
            left: 300
        });

        canvas.add(text);
        canvas.centerObject(text)
        text.setCoords();
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
        if ($(this).prop('checked') == true){
            canvas.getActiveObject().set("fontWeight", "bold");
        }else{
            canvas.getActiveObject().set("fontWeight", "");
        }
        
        canvas.renderAll();
    })

    jQuery("#italic-btn").click(function () {
        
        if ($(this).prop('checked') == true) {
            canvas.getActiveObject().set("fontStyle", "italic");
        } else {
            canvas.getActiveObject().set("fontStyle", "");
        }
        canvas.renderAll();
    })

    jQuery("#underline-btn").click(function () {
        
        if ($(this).prop('checked') == true) {
            canvas.getActiveObject().set("underline", true);
        } else {
            canvas.getActiveObject().set("underline", false);
        }
        canvas.renderAll();
    })

    jQuery('#color-picker').change(function () {
        canvas.getActiveObject().setFill(this.value);
        canvas.renderAll();
        jQuery(this).val("")
    })

    jQuery("#font-select").change(function(){
        canvas.getActiveObject().setFontFamily(this.value);
        canvas.renderAll();
    })

    jQuery("#size-select").change(function () {
        canvas.getActiveObject().setFontSize(this.value);
        canvas.renderAll();
    })

    jQuery("#copy-btn").click(function () {
        copy();
    })

    jQuery("#paste-btn").click(function () {
        paste();
    })

    jQuery("#delete-btn").click(function () {
        deleteElement();
    })

    jQuery("#send-back-btn").click(function () {
        canvas.getActiveObject().sendToBack();
        white_rect.sendToBack();
        canvas.renderAll();
    })

    jQuery("#bring-front-btn").click(function () {
        canvas.getActiveObject().bringToFront();
        external_border.bringToFront();
        internal_border.bringToFront();
        canvas.renderAll();
    })

    jQuery("#left-align-btn").click(function () {
        canvas.getActiveObject().setTextAlign("left");
        canvas.renderAll();
    })

    jQuery("#right-align-btn").click(function () {
        canvas.getActiveObject().setTextAlign("right");
        canvas.renderAll();
    })

    jQuery("#center-align-btn").click(function () {
        canvas.getActiveObject().setTextAlign("center");
        canvas.renderAll();
    })
})