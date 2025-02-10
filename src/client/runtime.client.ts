import { Flamework, Modding } from "@flamework/core";
import Log, { Logger } from "@rbxts/log";
import { setupLogger } from "shared/functions/logger";
import coreCall from "utils/core-call";

async function start() {
	setupLogger();
	coreCall("SetCore", "ResetButtonCallback", false);
	coreCall("SetCoreGuiEnabled", Enum.CoreGuiType.Backpack, false);
	coreCall("SetCoreGuiEnabled", Enum.CoreGuiType.Chat, false);
	coreCall("SetCoreGuiEnabled", Enum.CoreGuiType.PlayerList, false);

	Modding.registerDependency<Logger>(ctor => Log.ForContext(ctor));

	Flamework.addPaths("src/client/controllers");
	Flamework.addPaths("src/client/components");

	Log.Info("Starting Flamework...");
	Flamework.ignite();
}

start().catch(err => {
	Log.Fatal(`Error while running client: ${err}`);
});
