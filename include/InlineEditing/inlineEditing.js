/**
 * Created by lewis on 13/03/15.
 */

buildEditField();

function buildEditField(){
    $(".inlineEdit").dblclick(function() {
        var field = $(this).attr( "field" );
        var type = $(this).attr( "type" );
        var module = $("input[name=return_module]").val();
        var id = $(this).closest('tr').find('[type=checkbox]').attr( "value" );
        $(this).addClass("inlineEditActive");

        if(field && module && id){
            var validation = getValidationRules(field,module,id);
            var html = loadFieldHTML(field,module,id);
        }

        $(this).html(validation + "<form name='inline_edit_form'><div style='float:left;'>" + html + "</div><div style='margin-top:5px; float:left;'><a class='button' onclick='var valid_form = check_form(\"inline_edit_form\"); if(valid_form){handleSave(\"" + field + "\",\"" + id + "\",\"" + module + "\",\"" + type + "\")}else{return false};'>Save</a><a class='button' onclick='handleCancel(\"" + field + "\",\"" + id + "\",\"" + module + "\")'>Close</a></div></form>");
        $(".inlineEdit").off('dblclick');

    });
}

function getInputValue(field,type){

    if($('#'+ field).length > 0 && type){

        switch(type) {
            case 'phone':
            case 'name':
            case 'varchar':
                if($('#'+ field).val().length > 0) {
                    return $('#'+ field).val();
                }
                break;
            case 'enum':
                if($('#'+ field + ' :selected').text().length > 0){
                    return $('#'+ field + ' :selected').text();
                }
                break;
            case 'datetime':
            case 'datetimecombo':

                if($('#'+ field + '_date').val().length > 0){
                    var date = $('#'+ field + '_date').val();

                }
                if($('#'+ field + '_hours :selected').text().length > 0){
                    var hours = $('#'+ field + '_hours :selected').text();
                }
                if($('#'+ field + '_minutes :selected').text().length > 0){
                    var minutes = $('#'+ field + '_minutes :selected').text();
                }
                if($('#'+ field + '_meridiem :selected').text().length > 0){
                    var meridiem = $('#'+ field + '_meridiem :selected').text();
                }
                return date + " " + hours +":"+ minutes + meridiem;

                break;
            case 'date':
                if($('#'+ field + ' :selected').text().length > 0){
                    return $('#'+ field + ' :selected').text();
                }
                break;
            case 'multienum':
                if($('#'+ field + ' :selected').text().length > 0){
                    return $('select#'+field).val();
                }
                break;
            case 'bool':
                console.log('#'+ field);
                if($('#'+ field).is(':checked')){
                   return "on";
                }else{
                    return "off";
                }
                break;
            default:
                if($('#'+ field).val().length > 0) {
                    return $('#'+ field).val();
                }
        }
    }

}

function handleCancel(field,id,module){
    var output_value = loadFieldHTMLValue(field,id,module);
    var output = setValueClose(output_value);
}

function handleSave(field,id,module,type){
    var value = getInputValue(field,type);
    var output_value = saveFieldHTML(field,module,id,value);
    var output = setValueClose(output_value);
}

function setValueClose(value){
    $(".inlineEditActive").html();
    $(".inlineEditActive").html(value);
    $(".inlineEditActive").removeClass("inlineEditActive");
    buildEditField();
}

function saveFieldHTML(field,module,id,value) {
    $.ajaxSetup({"async": false});
    var result = $.getJSON('index.php',
        {
            'module': 'Home',
            'action': 'saveHTMLField',
            'field': field,
            'current_module': module,
            'id': id,
            'value': value,
            'to_pdf': true
        }
    );
    $.ajaxSetup({"async": true});
    return(result.responseText);

}


function loadFieldHTML(field,module,id) {
    $.ajaxSetup({"async": false});
    var result = $.getJSON('index.php',
        {
            'module': 'Home',
            'action': 'getEditFieldHTML',
            'field': field,
            'current_module': module,
            'id': id,
            'to_pdf': true
        }
    );
    $.ajaxSetup({"async": true});

    return(JSON.parse(result.responseText));
}

function loadFieldHTMLValue(field,id,module) {
    $.ajaxSetup({"async": false});
    var result = $.getJSON('index.php',
        {
            'module': 'Home',
            'action': 'getDisplayValue',
            'field': field,
            'current_module': module,
            'id': id,
            'to_pdf': true
        }
    );
    $.ajaxSetup({"async": true});

    return(result.responseText);
}

function getValidationRules(field,module,id){
    $.ajaxSetup({"async": false});
    var result = $.getJSON('index.php',
        {
            'module': 'Home',
            'action': 'getValidationRules',
            'field': field,
            'current_module': module,
            'id': id,
            'to_pdf': true
        }
    );
    $.ajaxSetup({"async": true});

    var validation = JSON.parse(result.responseText);

    console.log(validation);

    return "<script type='text/javascript'>addToValidate('inline_edit_form', \"" + field + "\", \"" + validation['type'] + "\", " + validation['required'] + ",\"" + validation['label'] + "\");</script>";
}
