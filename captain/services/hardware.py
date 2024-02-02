import subprocess
from sys import platform
import os
import nidaqmx
import nidmm
import cv2
import pyvisa
import serial.tools.list_ports
import logging
from captain.types.devices import CameraDevice, SerialDevice, VISADevice, NIDAQmxDevice, NIDMMDevice

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
            except (pyvisa.VisaIOError, serial.serialutil.SerialException):
                pass

        return devices

    def get_nidaqmx_devices(self) -> list[NIDAQmxDevice]:
        """Returns a list of NI-DAQmx devices connected to the system."""
        try:
            system = nidaqmx.system.System.local()
            devices = []

            def extract_device(channel, device) -> NIDAQmxDevice:
                return NIDAQmxDevice(
                    name=f"{device.product_type} - {channel.name.split('/')[-1]}",
                    address=channel.name,
                    description=f"{device.product_type} - {device.compact_daq_chassis_device}/{device.compact_daq_slot_num}",
                )

            for device in system.devices:
                devices += [
                    extract_device(chan, device) for chan in device.ai_physical_chans
                ]
                devices += [
                    extract_device(chan, device) for chan in device.ao_physical_chans
                ]
                devices += [extract_device(line, device) for line in device.di_lines]
                devices += [extract_device(line, device) for line in device.do_lines]
                devices += [
                    extract_device(chan, device) for chan in device.ci_physical_chans
                ]
                devices += [
                    extract_device(chan, device) for chan in device.co_physical_chans
                ]
                devices += [extract_device(line, device) for line in device.di_ports]
                devices += [extract_device(line, device) for line in device.do_ports]
            logging.info(f"Devices found are: {devices}")
            return devices
        except nidaqmx.errors.DaqNotFoundError as e:
            logging.warn(f"NI-DAQmx driver not installed - {e}")
        except Exception as e:
            logging.error(f"Error in get_nidaqmx_devices: {e}")
        return []
    

    def get_nidmm_devices(self) -> list[NIDMMDevice]:
        """Returns a list of NI-DAQmx devices connected to the system."""
        try:
            system = nidmm.system.System.local()
            devices = []

            def extract_device(channel, device) -> NIDMMDevice:
                return NIDMMDevice(
                    name=f"{device.product_type} - {channel.name.split('/')[-1]}",
                    address=channel.name,
                    description=f"{device.product_type} - {device.compact_daq_chassis_device}/{device.compact_daq_slot_num}",
                )

            for device in system.devices:
                devices += [
                    extract_device(chan, device) for chan in device.ai_physical_chans
                ]
                devices += [
                    extract_device(chan, device) for chan in device.ao_physical_chans
                ]
                devices += [extract_device(line, device) for line in device.di_lines]
                devices += [extract_device(line, device) for line in device.do_lines]
                devices += [
                    extract_device(chan, device) for chan in device.ci_physical_chans
                ]
                devices += [
                    extract_device(chan, device) for chan in device.co_physical_chans
                ]
                devices += [extract_device(line, device) for line in device.di_ports]
                devices += [extract_device(line, device) for line in device.do_ports]
            logging.info(f"Devices found are: {devices}")
            return devices
        except nidmm.errors.DaqNotFoundError as e:
            logging.warn(f"NI-DAQmx driver not installed - {e}")
        except Exception as e:
            logging.error(f"Error in get_nidmm_devices: {e}")
        return []


class MacDeviceFinder(DefaultDeviceFinder):
    def get_visa_devices(self) -> list[VISADevice]:
        rm = pyvisa.ResourceManager("@py")
        devices = []

        for device in os.popen("arp -a"):
            ip = device.split(maxsplit=4)[1].strip("()").split(".")
            valid_addr = (
                ip[0] == "169" and ip[1] == "254" and f"{ip[2]}.{ip[3]}" != "255.255"
            )
            if not valid_addr:
                continue

            addr = f"TCPIP::169.254.{ip[2]}.{ip[3]}::INSTR"
            try:
                inst = rm.open_resource(addr)
                devices.append(
                    VISADevice(
                        name=addr.split("::")[0],
                        address=addr,
                        description=inst.query("*IDN?"),
                    )
                )

                inst.close()
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


def get_device_finder():
    match platform:
        case "darwin":
            return MacDeviceFinder()
        case "linux":
            return LinuxDeviceFinder()
        case _:
            return DefaultDeviceFinder()
