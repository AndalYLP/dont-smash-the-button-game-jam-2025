import { Networking } from "@flamework/networking";
import { BroadcastAction } from "@rbxts/reflex";
import { SerializedSharedState } from "shared/store";

interface ClientToServerEvents {
	store: {
		start: () => void;
	};
	game: {
		ready: () => void;
	};
}

interface ServerToClientEvents {
	store: {
		dispatch: (actions: Array<BroadcastAction>) => void;
		hydrate: (state: SerializedSharedState) => void;
	};
	game: {
		dialog: (dialogId: number, text: string, speed: number, continues?: boolean) => void;
		end: (record: number) => void;
	};
}

export const globalEvents = Networking.createEvent<ClientToServerEvents, ServerToClientEvents>();
