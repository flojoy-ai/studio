import nidaqmx


# Get system information
system = nidaqmx.system.System.local()
print(system.driver_version)

# Get connnected device
print("Connected devices")
for device in system.devices:
    print(f"|_{device}")
    for channel in device.ai_physical_chans:
        print(f"  |_{channel}")
        for source in channel.ai_input_srcs:
            print(f"    |_{source}")

    for line in device.di_lines:
        print(f"  |_{line}")
print("\n")


user_device = "cDAQ1Mod1"  # Target NI-9203
user_channel = "ai0"       # First channel

device = system.devices[user_device]
channel_1 = device.ai_physical_chans[user_channel]
print(channel_1.ai_term_cfgs)

print(f"Simultaneous sampling supported?: {device.ai_simultaneous_sampling_supported}")

with nidaqmx.Task() as task:
    task.ai_channels.add_ai_current_chan(
        f"{user_device}/{user_channel}"
    )
    print(task.read(number_of_samples_per_channel=2))


class CDAQ:

    def __init__(self):
        self.device = None
        self.anolog_channel = None

