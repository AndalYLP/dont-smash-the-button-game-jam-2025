import Log, { Logger, LogLevel } from "@rbxts/log";
import type { ILogEventSink, LogEvent } from "@rbxts/log/out/Core";
import { MessageTemplateParser, PlainTextMessageTemplateRenderer } from "@rbxts/message-templates";

import { IS_CLIENT } from "shared/constants/core";

export const LOG_LEVEL: LogLevel = LogLevel.Debugging;

const environment = IS_CLIENT ? "Client" : "Server";

const STACK_TRACE_LEVEL_MODULE = 5;
const STACK_TRACE_LEVEL_FLAMEWORK = 4;

class LogEventSFTOutputSink implements ILogEventSink {
	private readonly logLevelString = {
		[LogLevel.Debugging]: "DEBUG",
		[LogLevel.Error]: "ERROR",
		[LogLevel.Fatal]: "FATAL",
		[LogLevel.Information]: "INFO",
		[LogLevel.Verbose]: "VERBOSE",
		[LogLevel.Warning]: "WARN",
	};

	public Emit(message: LogEvent): void {
		const template = new PlainTextMessageTemplateRenderer(
			MessageTemplateParser.GetTokens(message.Template),
		);

		const tag = this.getLogLevelString(message.Level);
		const context = message.SourceContext ?? "Game";
		const messageResult = template.Render(message);
		const fileInfo = this.getFileInformation(context);

		const formattedMessage =
			`[${tag}] ${context} (${environment}) - ${messageResult}` + fileInfo;

		if (message.Level >= LogLevel.Fatal) {
			error(formattedMessage);
		} else if (message.Level >= LogLevel.Warning) {
			warn(formattedMessage);
		} else {
			print(formattedMessage);
		}
	}

	private getLogLevelString(level: LogLevel): string {
		return this.logLevelString[level];
	}

	private getFileInformation(context: string): string {
		if (LOG_LEVEL > LogLevel.Verbose) {
			return "";
		}

		const source =
			context === "Game"
				? debug.info(STACK_TRACE_LEVEL_MODULE, "sl")
				: debug.info(STACK_TRACE_LEVEL_FLAMEWORK, "sl");
		const [file, line] = source;
		return ` (${file}:${line})`;
	}
}

/** Sets up the logger for the application, for both the client and server. */
export function setupLogger(): void {
	Log.SetLogger(
		Logger.configure().SetMinLogLevel(LOG_LEVEL).WriteTo(new LogEventSFTOutputSink()).Create(),
	);
}
