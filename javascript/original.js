jQuery(document).ready(function(){
    fabric.Object.prototype.getWidth = function(){
        return this.get('width');
    }

    var canvas = new fabric.Canvas('c');
    
    canvas.setBackgroundColor('#3a3c3c', canvas.renderAll.bind(canvas))

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

    var internal_border = new fabric.Rect({
        width: external_border.get('width') - 14.57 + 2,
        height: external_border.get('height') - 14.57 + 2,
        selectable: false,
        fill: 'rgba(255, 255, 255, 0)',
        stroke: 'black',
        strokeWidth: 0.5,
        strokeDashArray: [3,2],
        rx: 10,
        ry: 10,
        evented: false
    });

    var white_rect= new fabric.Rect({
        width: 636,
        height: 406,
        selectable: false,
        fill: 'white',
        evented: false,
        rx: 10,
        ry: 10
    });

    canvas.add(external_border);
    canvas.centerObject(external_border);
    external_border.bringToFront();

    canvas.add(internal_border);
    canvas.centerObject(internal_border);
    internal_border.bringToFront();


    canvas.add(white_rect);
    canvas.centerObject(white_rect);
    
    canvas.on('object:added', function(e){
        external_border.bringToFront();
        internal_border.bringToFront();
    })

    canvas.add(new fabric.Circle({radius: 20, fill:'blue'}));


/*         fabric.Image.fromURL('courier.png', function(oImg){
        oImg.set('top', 100)
        oImg.scale(0.1)
        canvas.add(oImg);
        
        oImg.animate('height', '200', {
            onChange: canvas.renderAll.bind(canvas),
            duration: 2200,
            easing: fabric.util.ease.easeOutElastic 
        }) 
    }) */

    // var text = new fabric.Text('ola Jesu', {
    //     left: 100,
    //     top: 100
    // })
    // canvas.add(text)

    jQuery('#add_size').click(function(){
        text.set('fontSize', text.get('fontSize')+1);
        canvas.renderAll();
    })

    
    jQuery('#reduce_size').click(function(){
        text.set('fontSize', text.get('fontSize')-1);
        canvas.renderAll();
    })

    jQuery('#select-file').on("change", function (e) {
        var fileType = e.target.files[0].type;
        var url = URL.createObjectURL(e.target.files[0]);

        if (fileType === 'image/png' || fileType === 'image/jpeg') { //check if png
            fabric.Image.fromURL(url, function(img) {
                img.scaleToWidth(180);
                img.scaleToHeight(180);
                canvas.add(img);
            });
        } else if (fileType === 'image/svg+xml') { //check if svg
            fabric.loadSVGFromURL(url, function(objects, options) {
                var svg = fabric.util.groupSVGElements(objects, options);
                svg.scaleToWidth(180);
                svg.scaleToHeight(180);
                canvas.add(svg);
            });
        }
        jQuery(this).val("")
    });

    


})