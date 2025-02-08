import { Networking } from "@flamework/networking";
import { BroadcastAction } from "@rbxts/reflex";
import { SerializedSharedState } from "shared/store";

interface ClientToServerEvents {
	store: {
		start: () => void;
	};
}

interface ServerToClientEvents {
	store: {
		dispatch: (actions: Array<BroadcastAction>) => void;
		hydrate: (state: SerializedSharedState) => void;
	};
}

export const globalEvents = Networking.createEvent<ClientToServerEvents, ServerToClientEvents>();
