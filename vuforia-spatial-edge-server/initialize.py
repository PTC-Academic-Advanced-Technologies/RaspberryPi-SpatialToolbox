import hub, utime
from spike import Motor, DistanceSensor, ColorSensor, ForceSensor

# Get a list of what's connected to each port on the Spike Prime
ports = hub.status()["port"]

# Variables
portName = ["A", "B", "C", "D", "E", "F"]
colorSensor = forceSensor = distanceSensor = -1
lengths = [0,0,0,0,0,0]
portType = ["none", "none", "none", "none", "none", "none"]

# Each type of motor/sensor has a different array size, so we can figure out
# which port has what on it based on how long the array is
for i in range(6):
    lengths[i] = len(ports[portName[i]])
    if (lengths[i] == 1):
        exec(portName[i] + " = DistanceSensor(portName[i])")
        portType[i] = "distance"
        distanceSensor = i
    elif (lengths[i] == 3):
        exec(portName[i] + " = ForceSensor(portName[i])")
        portType[i] = "force"
        forceSensor = i
    elif (lengths[i] == 4):
        exec(portName[i] + " = Motor(portName[i])")
        portType[i] = "motor"
    elif (lengths[i] > 4):
        exec(portName[i] + " = ColorSensor(portName[i])")
        portType[i] = "color"
        colorSensor = i

#end