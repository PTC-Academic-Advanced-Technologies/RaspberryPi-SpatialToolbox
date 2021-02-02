# Define a read function that outputs the data of the accelerometer/gyroscope
# and any sensors that are connected to the Spike Prime
def read():
    if (colorSensor != -1):
        exec("print(" + portName[colorSensor] + ".get_color())")
    if (distanceSensor != -1):
        exec("print(" + portName[distanceSensor] + ".get_distance_cm())")
    if (forceSensor != -1):
        exec("print(" + portName[forceSensor] + ".get_force_percentage()/100)")
    exec("utime.sleep_ms(2)")
    exec("print(hub.motion.accelerometer() + hub.motion.gyroscope())")

# Define an FFT function that samples accelerometer data
def fft(axis, length):
    amp = [0] * (length + 1)
    start = utime.ticks_us()
    for i in range(length):
        amp[i] = hub.motion.accelerometer()[axis]
        utime.sleep_ms(20)
    end = utime.ticks_us()
    amp[length] = 1000000/((end - start)/length)
    printFFT(amp, length)

# Prints the FFT accelerometer data
def printFFT(amp, length):
    currLength = length
    while (currLength > 128):
        for i in range(5):
            print(amp[0:128])
            utime.sleep_ms(50)
        currLength -= 128
        del amp[0:128]
    for i in range(5):
        print(amp)
    del amp

# Print out the list of ports, so that the index.js file can see their locations
for i in range(10):
    print(portType)

#end