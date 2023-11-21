import log from "electron-log/main";

export type CommandOptions =
  | {
      win32: string;
      darwin: string;
      linux: string;
    }
  | string;

export class Command {
  constructor(private readonly commands: CommandOptions) {}

  getCommand(): string {
    const platform: NodeJS.Platform = process.platform;
    if (typeof this.commands === "string") {
      return this.commands;
    }
    switch (platform) {
      case "darwin":
        return this.commands.darwin;
      case "win32":
        return this.commands.win32;
      case "linux":
        return this.commands.linux;
      default:
        log.error(`Unsupported platform: ${platform}`);
        throw new Error(`Unsupported platform: ${platform}`);
    }
  }
}
