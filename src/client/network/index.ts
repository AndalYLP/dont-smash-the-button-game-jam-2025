import Log from "@rbxts/log";
import { IS_STUDIO } from "shared/constants/core";
import { globalEvents } from "shared/network";

export const events = globalEvents.createClient({
	warnOnInvalidGuards: IS_STUDIO,
});

if (IS_STUDIO) {
	globalEvents.registerHandler("onBadRequest", (player, message) => {
		Log.Warn(`Bad request from ${player.UserId}: ${message}`);
	});
}
