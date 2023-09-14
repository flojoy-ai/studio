import serial.tools.list_ports
import cv2


def get_cameras():
    """Returns a list of camera indices connected to the system."""
    i = 0
    cameras = []

    while True:
        camera = cv2.VideoCapture(i)
        if not camera.read()[0]:
            break
        else:
            cameras.append(i)
        camera.release()
        i += 1

    return cameras


def get_serial_devices():
    """Returns a list of serial devices connected to the system."""

    ports = serial.tools.list_ports.comports()
    return sorted(ports)
