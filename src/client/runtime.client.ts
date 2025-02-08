import { Flamework, Modding } from "@flamework/core";
import Log, { Logger } from "@rbxts/log";
import { setupLogger } from "shared/functions/logger";

async function start() {
	setupLogger();

	Modding.registerDependency<Logger>(ctor => Log.ForContext(ctor));

	Flamework.addPaths("src/client/controllers");
	Flamework.addPaths("src/client/components");

	Log.Info("Starting Flamework...");
	Flamework.ignite();
}

start().catch(err => {
	Log.Fatal(`Error while running client: ${err}`);
});
