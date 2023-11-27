import subprocess
from sys import platform
import os

import cv2
import pyvisa
import serial.tools.list_ports

from captain.types.devices import CameraDevice, SerialDevice, VISADevice
import traceback

__all__ = ["get_device_finder"]


class DefaultDeviceFinder:
    def get_cameras(self) -> list[CameraDevice]:
        """Returns a list of camera indices connected to the system."""
        env = os.getenv("ELECTRON_MODE", "dev")

        if env == "packaged" and "darwin" in platform:
            # TODO: Fix openCV permission issue on MacOS
            return []
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
        try:
            rm = pyvisa.ResourceManager("@py")
            devices = []
            used_addrs = set()

            for addr in rm.list_resources():
                if addr in used_addrs:
                    continue
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
                    used_addrs.add(addr)
                except pyvisa.VisaIOError:
                    pass

            return devices
        except Exception as e:
            print("exception in get_visa_devices: ", e, traceback.format_exec())
            return []


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


def get_device_finder():
    if platform in ["win32", "darwin"]:
        return DefaultDeviceFinder()
    return LinuxDeviceFinder()
