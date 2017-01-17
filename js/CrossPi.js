function Message(display, text, number) {

    if (display == 'show') {

        $('#message').html(
            '<b>ALERTE</b>'+
            '<br />'+
            '<span>'+text+'</span>'+
            '<br />'+
            '<span>'+number+'</span>'
        );
        $('#message').show();
    }
    else {

        $('#message').hide();
    }
}


function setUltrason(value) {

    if (value < 0){

        value = (1 * value) * - 1;
    }

    if (value > 100){

        value = 100 ;
    }

    value = parseInt(value);

    value = 100 - value ;

    left = $('#valUltrasonLeft');
    right = $('#valUltrasonRight');

    left.removeClass('close').removeClass('middle').removeClass('far');
    right.removeClass('close').removeClass('middle').removeClass('far');

    if (value <= 50) {

        left.addClass('far');
        right.addClass('far');
        Message('hide', '', '');
    }
    else if (value > 50 && value < 80) {

        left.addClass('middle');
        right.addClass('middle');
        Message('hide', '', '');
    }
    else if (value > 80) {

        left.addClass('close');
        right.addClass('close');
        Message('show', 'Proximité', Value+'cm');
    }

    left.css('width', value+'px');
    right.css('width', value+'px');
}


function setVolts(volt){

    $('#valVolt').html(volt+'v');
    $('#faVolt').removeClass('fa-battery-empty').removeClass('fa-battery-quarter').removeClass('fa-battery-half').removeClass('fa-battery-three-quarters').removeClass('fa-battery-full');

    if (volt < 7) {

        $('#faVolt').addClass('fa-battery-empty');
        $('#faVolt').css('color', 'red');
    }
    else if (volt >= 7 && volt <= 8) {

        $('#faVolt').addClass('fa-battery-quarter');
        $('#faVolt').css('color', 'red');
    }
    else if (volt > 8 && volt <= 10){

        $('#faVolt').addClass('fa-battery-half');
        $('#faVolt').css('color', 'yellow');
    }
    else if (volt > 10 && volt <= 12){

        $('#faVolt').addClass('fa-battery-three-quarters');
        $('#faVolt').css('color', 'green');
    }
    else if (volt > 12 && volt <=15){

        $('#faVolt').addClass('fa-battery-full');
        $('#faVolt').css('color', 'green');
    }
    else {

        $('#faVolt').addClass('fa-battery-empty');
        $('#faVolt').css('color', 'red');
    }
}


function setTemperature(temperature){

    gauge = new Gauge($('#temperature'), {
        values: {
            0 : '0',
            20: '20',
            40: '40',
            60: '60',
            80: '80',
            100: '100'
        },
        colors: {
            0 : '#000',
            50: '#ffa500',
            70: '#f00',
        },
        angles: [
            130,
            410
        ],
        lineWidth: 5,
        arrowWidth: 7,
        inset:true,
        value: temperature
    });
};


function setCompteur(vitesse){

    vitesse = vitesse / 255 * 100;

    gauge = new Gauge($('#vitesse'), {
        values: {
            0 : '0',
            20: '50',
            40: '100',
            60: '150',
            80: '200',
            100: '255',
        },
        colors: {
            0 : '#000',
            80: '#f00'
        },
        angles: [
            130,
            410
        ],
        lineWidth: 5,
        arrowWidth: 7,
        inset:true,
        value: vitesse
    });
};


function setCpu(cpu){

    $('#valCpu').html(cpu+'%');

    if (cpu < 60) {

        $('#faCpu').css('color', 'green');
    }
    else if (cpu >= 60 && cpu <= 80) {

        $('#faCpu').css('color', 'yellow');
    }
    else if (cpu > 80 && cpu <= 100){

        $('#faCpu').css('color', 'red');
    }
};


function onOpen(talk) {

    console.log("Connecté");
};


function onClose(talk) {

    console.log("Déconnecté");
};


function onError(talk) {
    console.log('error: ' + talk.data);
    websocket.close();
};


function CrossPiSay(talk) {

    iSplit = talk.data.split(' ');
    Module = iSplit[0];
    Value = iSplit[1];

    if (Module === 'Cpu'){

        setCpu(Value);
    }
    else if (Module === 'Temperature') {

        setTemperature(Value);
    }
    else if (Module === 'Ultrasons') {

        setUltrason(Value);
    }
    else if (Module === 'Volts') {

        setVolts(Value);
    }
    else if (Module === 'Collision') {

        if (Value == 0) {

            Message('show', 'Collision', Value);
        }
    }
    else if (Module === 'Leds') {

        if (Value == 'on') {

            $('#faLeds').addClass('light');
            leds = 'on';
        }
        else {

            $('#faLeds').removeClass('light');
            leds = 'off';
        }
    }
}


function CrossPiDo(that) {

    websocket.send(that);
};


$(function() {

    document.body.addEventListener('touchmove', function(event) {
        event.preventDefault();
    }, false);

    websocket = new WebSocket('ws://192.168.0.24:1234/');
    websocket.onopen = function(talk) {onOpen(talk)};
    websocket.onclose = function(talk) { onClose(talk) };
    websocket.onmessage = function(talk) { CrossPiSay(talk) };
    websocket.onerror = function(talk) { onError(talk) };

    var joystickLeft = document.getElementById('joystickLeft');
    var joystickRight = document.getElementById('joystickRight');
    var vitesseZero ;
    var directionZero ;
    var turnLeft ;
    var turnRight ;
    var move ;
    var JsLeft ;
    var JsRight ;
    var leds ;
    var AutoPilot ;

    setTemperature(0);
    setCompteur(0);
    setCpu(0);
    setVolts(0);
});


speedLeft = 0;
speedRight = 0;
turnLeft = 0;
turnRight = 0;
move = 'none';
JsLeft = 'off';
JsRight = 'off';
leds = 'off';
AutoPilot = 'off';


setInterval( function() {

    if ( websocket.readyState == websocket.OPEN ) {

        if (JsLeft == 'on' && JsRight == 'off') {

            MotorLeft = speedLeft ;
            MotorRight = speedRight ;
            turnLeft = 0 ;
            turnRight = 0 ;

            setCompteur(MotorLeft);
        }
        else if (JsLeft == 'on' && JsRight == 'on') {

            MotorLeft = speedLeft - turnLeft ;
            MotorRight = speedRight - turnRight ;

            if (MotorLeft < 0) {

                MotorLeft = 0;
            }

            if (MotorRight < 0) {

                MotorRight = 0;
            }

            if (MotorLeft >= MotorRight){

                setCompteur(MotorLeft);
            }
            else {

                setCompteur(MotorRight);
            }
        }
        else if (JsLeft == 'off' && JsRight == 'on') {

            if (turnLeft > turnRight) {

                move = 'rotateLeft';
                MotorLeft = turnLeft ;
                MotorRight = turnLeft ;
                setCompteur(MotorLeft);
            }
            else {

                move = 'rotateRight';
                MotorLeft = turnRight ;
                MotorRight = turnRight ;
                setCompteur(MotorRight);
            }
        }
        else {

            move = 'none';
            MotorLeft = 0 ;
            MotorRight = 0 ;
            speedLeft = 0 ;
            speedRight = 0 ;
            turnLeft = 0 ;
            turnRight = 0 ;
            setCompteur(0);
        }

        if (AutoPilot == 'off') {

            CrossPiDo('Motors '+move+' '+MotorLeft+' '+MotorRight);
        }
    }
    else {

        websocket = new WebSocket('ws://192.168.0.24:1234/');
    }
}, 250 );


$('#leds').click(function() {

    if (leds == 'off') {

        CrossPiDo('Leds on');
    }
    else {

        CrossPiDo('Leds off');
    }
});


joystickLeft.addEventListener('touchstart', function(event) {

    if (event.targetTouches.length == 1) {

        touch = event.targetTouches[0];
        vitesseZero = touch.pageY;
        $('#rotate').hide();
        JsLeft = 'on';
    }
}, false);


joystickLeft.addEventListener('touchmove', function(event) {

    if (event.targetTouches.length == 1) {

        touch = event.targetTouches[0];

        vitesse = touch.pageY - vitesseZero ;
        vitesse = vitesse / 75 * 255;
        vitesse = parseInt(vitesse);

        if (vitesse < 0) {

            vitesse = (1 * vitesse) * - 1;

            if (vitesse <= 255) {

                joystickLeft.style.top = touch.pageY + 'px';

                pointer = (255 - vitesse) / 5.1 ;
                $('#pointer').css('top', pointer+'%');
            }
            else {

                vitesse = 255 ;
            }

            speedLeft = vitesse ;
            speedRight = vitesse ;
            move = 'go' ;
            $('#back').hide();
        }
        else {

            if (vitesse <= 255) {

                joystickLeft.style.top = touch.pageY + 'px';

                pointer = vitesse / 5.1 ;
                pointer = (1 * pointer) + (1 * 50);
                $('#pointer').css('top', pointer+'%');
            }
            else {

                vitesse = 255 ;
            }

            speedLeft = vitesse ;
            speedRight = vitesse ;
            move = 'back' ;
            $('#back').show();
        }
    }
}, false);


joystickLeft.addEventListener('touchend', function() {

    joystickLeft.style.top = '70%';
    $('#pointer').css('top', '50%');
    $('#back').hide();
    $('#rotate').show();
    JsLeft = 'off';
}, false);


joystickRight.addEventListener('touchstart', function(event) {

    if (event.targetTouches.length == 1) {

        touch = event.targetTouches[0];
        directionZero = touch.pageX;
        JsRight = 'on';
    }
}, false);


joystickRight.addEventListener('touchmove', function(event) {

    if (event.targetTouches.length == 1) {

        touch = event.targetTouches[0];

        direction = touch.pageX - directionZero ;
        direction = direction / 75 * 255;
        direction = parseInt(direction);

        if (direction < 0) {

            direction = (1 * direction) * - 1;

            if (direction <= 255) {

                joystickRight.style.left = touch.pageX + 'px';

                pointer = (255 - direction) / 5.1 ;
                $('#pointer').css('left', pointer+'%');
            }
            else {

                direction = 255 ;
            }

            turnLeft = direction ;
            turnRight = 0 ;
        }
        else {

            if (direction <= 255) {

                joystickRight.style.left = touch.pageX + 'px';

                pointer = direction / 5.1 ;
                pointer = (1 * pointer) + (1 * 50);
                $('#pointer').css('left', pointer+'%');
            }
            else {

                direction = 255 ;
            }

            turnLeft = 0 ;
            turnRight = direction ;
        }
    }
}, false);


joystickRight.addEventListener('touchend', function(e) {

    joystickRight.style.left = '80%';
    $('#pointer').css('left', '50%');
    JsRight = 'off';
}, false);
