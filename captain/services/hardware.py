import serial.tools.list_ports
import pyvisa
import cv2
import subprocess
from sys import platform
if platform in ["darwin"]:
    import AVFoundation

from captain.types.devices import CameraDevice, SerialDevice, VISADevice

__all__ = ["get_device_finder"]
class DefaultDeviceFinder:
    def get_cameras(self) -> list[CameraDevice]:
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

        return [CameraDevice(name=f"Camera {i}", id=i) for i in cameras]

    def get_serial_devices(self) -> list[SerialDevice]:
        """Returns a list of serial devices connected to the system."""
        ports = serial.tools.list_ports.comports()

        return [
            SerialDevice(
                port=p.device,
                description=p.description,
                hwid=p.hwid,
                manufacturer=p.manufacturer,
            )
            for p in ports
        ]

    def get_visa_devices(self) -> list[VISADevice]:
        """Returns a list of VISA devices connected to the system."""
        rm = pyvisa.ResourceManager("@py")
        devices = []
        for addr in rm.list_resources():
            try:
                device = rm.open_resource(addr)
                devices.append(
                    VISADevice(
                        name=addr.split("::")[0],
                        address=addr,
                        description=device.query("*IDN?"),
                    )
                )
                device.close()
            except pyvisa.VisaIOError:
                pass

        return devices


class LinuxDeviceFinder(DefaultDeviceFinder):
    def get_cameras(self) -> list[CameraDevice]:
        command = r"v4l2-ctl --list-devices | grep -A1 -P '^[^\s-][^:]+'"
        result = subprocess.run(command, shell=True, text=True, stdout=subprocess.PIPE)

        # fall back to OpenCV if v4l2-ctl is not installed
        if result.returncode != 0:
            return super().get_cameras()

        # filter out empty lines
        lines = list(filter(None, result.stdout.split("\n")))

        # output is formatted in groups of 2 lines
        # {camera name}
        # {port}
        cameras = [
            CameraDevice(name=lines[i].strip(), id=lines[i + 1].strip())
            for i in range(len(lines) // 2)
        ]

        return cameras




class MacDeviceFinder(LinuxDeviceFinder):
    def __init__(self):
        if platform not in ["darwin"]:
            raise Exception("MacDeviceFinder should only be used on macOS")

    def get_cameras(self) -> list[CameraDevice]:
        devices = AVFoundation.AVCaptureDevice.devices()
        video_devices = [device for device in devices if device.hasMediaType_(AVFoundation.AVMediaTypeVideo)]
        cameras = []
        for device in video_devices:
            cameras.append(CameraDevice(name=device.localizedName(), id=device.uniqueID()))
        return cameras


def get_device_finder():
    if platform in ["win32"]:
        return DefaultDeviceFinder()
    if platform in ["darwin"]:
        return MacDeviceFinder()
    return LinuxDeviceFinder()
