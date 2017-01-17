from SimpleWebSocketServer import SimpleWebSocketServer, WebSocket
from gopigo import *
import time
import sys
import subprocess
import os
import threading
import psutil

conns = []

class Leds:

    def __init__(self):
        print 'Leds Ready'

    def on(self):
        led_on(LED_L)
        led_on(LED_R)

    def off(self):
        led_off(LED_L)
        led_off(LED_R)


# Nécéssite le capteur "Ultrasonic Ranger" de chez DEXTERINDUSTRIES"
class Capteurs:

    def __init__(self):
        print 'Capteurs Ready'

    def ultrasonic(self):
        return us_dist(15)


# Nécéssite le capteur de collision de chez GROVE"
# à brancher sur le port D10
class Attitude:

    def __init__(self):
        print 'Attitude Ready'

    def collision(self):
        collision_sensor = 10
        pinMode(collision_sensor,"INPUT")
        return digitalRead(collision_sensor)
        #renvoi 1 si aucune collision de détecté, en cas de collision renvoi 0

class Monitor:

    def __init__(self):
        print 'Monitor Ready'

    def volts(self):
        return volt()

    def cpuSpeed(self):
        return psutil.cpu_percent(interval=0.1)

    def temperature(self):
        temp = os.popen('cat /sys/class/thermal/thermal_zone0/temp').readline()
        temp = float(temp) / 1000
        temp = round(temp,1)
        return temp


class Camera:

    cameraStreamerProcess = None

    def __init__(self):
        if self.cameraStreamerProcess == None or self.cameraStreamerProcess.poll() != None:
            self.cameraStreamerProcess = subprocess.Popen( [ "/usr/local/bin/raspberry_pi_camera_streamer" ] )
            print 'Camera Ready'

    def stop(self):
        if self.cameraStreamerProcess != None:
            self.cameraStreamerProcess.terminate()


# Nécéssite le Servo-moteur" de chez DEXTERINDUSTRIES"
class ServoMotor:

    def __init__(self):
        print 'ServoMotor Ready'
        servo(90)
        time.sleep(1)
        disable_servo()

    def rotate(self, angle):
        angle = 180 - angle
        servo(angle)
        time.sleep(1.2)
        disable_servo()


class Motors:

    def __init__(self):
        print 'Motors Ready'
        stop()

    def setBoth(self, left, right):
        set_left_speed(left)
        set_right_speed(right)


class AutoPilot(threading.Thread):

    def __init__(self):
        threading.Thread.__init__(self)
        self._etat = False
        self._pause = False

    def run(self):
        self._etat = True
        while self._etat:
            if self._pause:
                time.sleep(0.1)
                continue

            print 'AutoPilot actif'
            time.sleep(1)
        print "AutoPilot Stop"

    def on(self):
        self._pause = False

    def off(self):
        self._pause = True

    def stop(self):
        self._etat = False

# Renvoi les infomations système et les données recueilli par les capteurs sur l'interface
class System(threading.Thread):

    def __init__(self):
        threading.Thread.__init__(self)
        self._etat = False
        self._pause = False

    def run(self):
        self._etat = True
        while self._etat:
            if self._pause:
                time.sleep(0.1)
                continue

            for conn in conns:
                conn.sendMessage(u'Volts '+str(monitor.volts()))
                conn.sendMessage(u'Cpu '+str(monitor.cpuSpeed()))
                conn.sendMessage(u'Temperature '+str(monitor.temperature()))
                conn.sendMessage(u'Ultrasons '+str(capteurs.ultrasonic()))
#                conn.sendMessage(u'Collision '+str(attitude.collision()))
            time.sleep(.5)
        print "System Stop"

    def pause(self):
        self._pause = True

    def resume(self):
        self._pause = False

    def stop(self):
        self._etat = False


class CrossPi(WebSocket):

    def handleConnected(self):
        conns.append(self)
        print self.address, 'connected'

    def handleClose(self):
        conns.remove(self)
        print self.address, 'Disconnected'

    def handleMessage(self):

        print self.data

        module = None
        commande = None
        argument = None
        argument2 = None

        cmd = self.data
        x = cmd.split(' ')
        nb = len(x)

        if nb == 1:
            module = x[0]

        elif nb == 2:
            module = x[0]
            commande = x[1]

        elif nb == 3:
            module = x[0]
            commande = x[1]
            try:
                argument = int(x[2])
            except ValueError:
                argument = x[2]

        elif nb == 4:
            module = x[0]
            commande = x[1]
            try:
                argument = int(x[2])
            except ValueError:
                argument = x[2]
            try:
                argument2 = int(x[3])
            except ValueError:
                argument2 = x[3]
        else:
            pass

        if module == 'Leds':
            if commande != None:
                if commande == 'on':
                    leds.on()
                    self.sendMessage(u'Leds on')
                elif commande == 'off':
                    leds.off()
                    self.sendMessage(u'Leds off')
                else:
                    self.sendMessage(u' ' + commande + ' nest pas une commande de ' + module)
            else:
                self.sendMessage(u' ' + module + ' necessite une commande')

        elif module == 'Servo':
            if commande != None:
                if commande == 'Rotate':
                    if argument != None:
                        servomotor.rotate(argument)
                else:
                    self.sendMessage(u' ' + commande + ' nest pas une commande de ' + module)
            else:
                self.sendMessage(u' ' + module + ' necessite une commande')

        elif module == 'Motors':
            if commande != None:
                if commande == 'none':
                    if argument != None:
                        stop()
                elif commande == 'go':
                    if argument != None:
                        if argument2 != None:
                            motors.setBoth(argument, argument2)
                            bwd()
                elif commande == 'back':
                    if argument != None:
                        if argument2 != None:
                            motors.setBoth(argument, argument2)
                            fwd()
                elif commande == 'rotateLeft':
                    if argument != None:
                        if argument2 != None:
                            motors.setBoth(argument, argument)
                            right_rot()
                elif commande == 'rotateRight':
                    if argument != None:
                        if argument2 != None:
                            motors.setBoth(argument, argument)
                            left_rot()
                else:
                    self.sendMessage(u' ' + commande + ' nest pas une commande de ' + module)
            else:
                self.sendMessage(u' ' + module + ' necessite une commande')

        elif module == 'AutoPilot':
            if commande != None:
                if commande == 'on':
                    autopilot.on()
                    self.sendMessage(u'Autopilot on')
                elif commande == 'off':
                    autopilot.off()
                    self.sendMessage(u'Autopilot off')
                else:
                    self.sendMessage(u' ' + commande + ' nest pas une commande de ' + module)
            else:
                self.sendMessage(u' ' + commande + ' nest pas une commande de ' + module)

        elif module == 'System':
            if commande != None:
                if commande == 'pause':
                    system.pause()
                elif commande == 'resume':
                    system.resume()
                elif commande == 'stop':
                    autopilot.stop()
                    system.stop()
                    autopilot.join()
                    system.join()
                    time.sleep(0.5)
                    sys.exit(0)
                else:
                    self.sendMessage(u' ' + commande + ' nest pas une commande de ' + module)
            else:
                self.sendMessage(u' ' + module + ' necessite une commande')

        else:
            if module == None:
                module = ' '
            if commande == None:
                commande = ' '
            if argument == None:
                argument = ' '
            if argument2 == None:
                argument2 = ' '
            self.sendMessage(u' Commande introuvable : ' + module + ' ' + commande + ' ' + str(argument) + ' ' + str(argument2))


if __name__ == '__main__':
    leds = Leds()
    capteurs = Capteurs()
    attitude = Attitude()
    monitor = Monitor()
    camera = Camera()
    servomotor = ServoMotor()
    motors = Motors()
    autopilot = AutoPilot()
    system = System()
    
# Changez l'Ip par la votre
    server = SimpleWebSocketServer('192.168.0.24', 1234, CrossPi)
    socket = threading.Thread(target=server.serveforever)
    socket.start()
    system.start()
    autopilot.start()
    autopilot.off()
