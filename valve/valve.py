import json
import sys
from PyQt6.QtWidgets import *
from PyQt6.QtGui import *
from PyQt6.QtCore import *
import paho.mqtt.client as mqtt

faucetTopic = 'lm/iot/faucet'


class MainWindow(QMainWindow):
    on = False
    client = mqtt.Client(clean_session=True)
    ePushtbtn = None

    def on_connect(self, client, userdata, flags, rc):
        print("Connected with result code "+str(rc))
        client.subscribe(faucetTopic)

    # The callback for when a PUBLISH message is received from the server.

    def on_message(self, client, userdata, msg):
        content = json.loads(str(msg.payload.decode()))
        self.on = content == 'on'
        self.setOn()
        self.client.unsubscribe(faucetTopic)

    def setOn(self):
        self.ePushtbtn.setText(f"Turn {'Off' if self.on else 'On'} Faucet")

        self.ePushtbtn.setStyleSheet(f"background-color: {'blue' if self.on else 'grey'}")

    def __init__(self, parent=None):
        QMainWindow.__init__(self, parent)

        # Init of Mqtt_client class
        # self.mc = Mqtt_client()

        # general GUI settings
        self.setUnifiedTitleAndToolBarOnMac(True)

        # set up main window
        self.setGeometry(30, 100, 300, 150)
        self.setWindowTitle("Faucet")

        def push_button_click():
            self.client.publish(faucetTopic, json.dumps(
                "off" if self.on else "on"), retain=True)
            self.on = not self.on
            self.setOn()

        self.ePushtbtn = QPushButton("")
        self.ePushtbtn.clicked.connect(push_button_click)

        widget = QWidget()
        formLayout = QFormLayout()
        formLayout.addRow("Toggle Faucet", self.ePushtbtn)
        widget.setLayout(formLayout)
        self.setCentralWidget(widget)

        self.client.on_message = self.on_message
        self.client.on_connect = self.on_connect
        self.client.connect("localhost", 1883, 60)
        self.client.loop_start()


app = QApplication(sys.argv)
mainwin = MainWindow()
mainwin.show()
app.exec()
