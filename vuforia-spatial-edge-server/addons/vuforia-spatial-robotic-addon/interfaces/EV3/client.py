"""
A simple Python script to send messages to a server over Bluetooth
using PyBluez (with Python 3.7).
"""

import bluetooth
import time
import zerorpc

serverMACAddress = 'F0:45:DA:15:FB:C4' #change to your EV3 Bluetooth address
port = 3
s = bluetooth.BluetoothSocket(bluetooth.RFCOMM)
s.connect((serverMACAddress, port))

c = zerorpc.Client()
c.connect("tcp://127.0.0.1:4343")

while 1:
    text_A = c.messageA()
    text_B = c.messageB()
    text_C = c.messageC()
    text_D = c.messageD()
    text_L = c.messageL()
    text_R = c.messageR()
    text_S = c.messageS()
    text_U = c.messageU()
    text_T = c.messageT()
    text_G = c.messageG()
    text_Co = c.messageCo()
    
    if text_A == "quit":
        c.responseA("quit")
        break
    if text_B == "quit":
        c.responseB("quit")
        break
    if text_C == "quit":
        c.responseC("quit")
        break
    if text_D == "quit":
        c.responseD("quit")
        break
    if text_L == "quit":
        c.responseL("quit")
        break
    if text_R == "quit":
        c.responseR("quit")
        break
    if text_S == "quit":
        c.responseS("quit")
        break
    if text_U == "quit":
        c.responseU("quit")
        break
    if text_T == "quit":
        c.responseT("quit")
        break
    if text_Co == "quit":
        c.responseCo("quit")
        break
    if text_G == "quit":
        c.responseG("quit")
        break
        
    encodedMsg_A = text_A.encode('utf-8')
    encodedMsg_B = text_B.encode('utf-8')
    encodedMsg_C = text_C.encode('utf-8')
    encodedMsg_D = text_D.encode('utf-8')
    encodedMsg_L = text_L.encode('utf-8')
    encodedMsg_R = text_R.encode('utf-8')
    encodedMsg_S = text_S.encode('utf-8')
    encodedMsg_U = text_U.encode('utf-8')
    encodedMsg_T = text_T.encode('utf-8')
    encodedMsg_G = text_G.encode('utf-8')
    encodedMsg_Co = text_Co.encode('utf-8')
    
    # time.sleep(1)
    s.send(encodedMsg_A)
    data_A = s.recv(1024)
    # time.sleep(1)
    s.send(encodedMsg_B)
    data_B = s.recv(1024)
    # time.sleep(1)
    s.send(encodedMsg_C)
    data_C = s.recv(1024)
    # time.sleep(1)
    s.send(encodedMsg_D)
    data_D = s.recv(1024)
    # time.sleep(1)
    s.send(encodedMsg_L)
    data_L = s.recv(1024)
    # time.sleep(1)
    s.send(encodedMsg_R)
    data_R = s.recv(1024)
    # time.sleep(1)
    s.send(encodedMsg_S)
    data_S = s.recv(1024)
    # time.sleep(1)
    s.send(encodedMsg_U)
    data_U = s.recv(1024)
    # time.sleep(1)
    s.send(encodedMsg_T)
    data_T = s.recv(1024)
    # time.sleep(1)
    s.send(encodedMsg_G)
    data_G = s.recv(1024)
    # time.sleep(1)
    s.send(encodedMsg_Co)
    data_Co = s.recv(1024)
    
    #print(encodedMsg)
    
    c.responseA(data_A.decode())
    c.responseB(data_B.decode())
    c.responseC(data_C.decode())
    c.responseD(data_D.decode())
    c.responseL(data_L.decode())
    c.responseR(data_R.decode())
    c.responseS(data_S.decode())
    c.responseU(data_U.decode())
    c.responseT(data_T.decode())
    c.responseG(data_G.decode())
    c.responseCo(data_Co.decode())
 
s.close()