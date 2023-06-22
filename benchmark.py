filename = "benchmark.txt"  # Replace with the actual file name or path

total_time = 0.0

with open(filename, 'r') as file:
    lines = file.readlines()

for line in lines:
    line = line.strip()
    if line.startswith("NODE TOOK"):
        time = line.split()[2]
        total_time += float(time)

print("Total time:", total_time, "seconds")
