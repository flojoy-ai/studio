import { app } from "electron";
import * as fs from "fs";
import { join } from "path";

export class Logger {
  private readonly serviceName: string;
  private readonly logStream: fs.WriteStream;
  constructor(serviceName: string = "main") {
    if (serviceName) {
      this.serviceName = serviceName;
    }
    const logsFolderPath = join(app.getPath("home"), ".flojoy", "logs");
    const logFileName = `log_${serviceName}.txt`;
    // Append the formatted date and time to the log file name
    if (!fs.existsSync(logsFolderPath)) {
      fs.mkdirSync(logsFolderPath, { recursive: true });
    }
    this.logStream = fs.createWriteStream(join(logsFolderPath, logFileName), {
      flags: "a",
    });
  }
  log(...messages: string[]) {
    messages
      .join("")
      .split("\n")
      .forEach((line) => {
        const logLine = `[${new Date().toISOString()}] - ${
          this.serviceName
        } - ${line}\n`;

        try {
          // Write to the log stream
          this.logStream.write(logLine);
          // Log to the console
          process.stdout.write(logLine);
        } catch (e) {
          throw new Error(`Error in logToFile. Error looks like: ${e}`);
        }
      });
  }
}
