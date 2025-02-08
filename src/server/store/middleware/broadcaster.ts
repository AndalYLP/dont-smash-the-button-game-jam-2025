import { BroadcastAction, createBroadcaster, ProducerMiddleware } from "@rbxts/reflex";
import { events } from "server/network";
import { IS_EDIT } from "shared/constants/core";
import { SerializedSharedState, SharedState, slices, stateSerDes } from "shared/store";

export function broadcasterMiddleware(): ProducerMiddleware {
	// Storybook support
	if (IS_EDIT) {
		return () => innerDispatch => innerDispatch;
	}

	const broadcaster = createBroadcaster({
		beforeDispatch,
		beforeHydrate,
		dispatch,
		hydrate,
		producers: slices,
	});

	events.store.start.connect(player => {
		broadcaster.start(player);
	});

	return broadcaster.middleware;
}

function beforeHydrate(player: Player, state: SharedState): SharedState {
	const playerState = {
		...state,
		players: new Map([[player, state.players.get(player)!]]),
	} satisfies SharedState;

	return stateSerDes.serialize(playerState) as unknown as SharedState;
}

function beforeDispatch(player: Player, action: BroadcastAction): BroadcastAction | undefined {
	if (action.name === "removePlayer") {
		return;
	}

	if (action.arguments[0] !== player) {
		return;
	}

	return action;
}

function dispatch(player: Player, actions: Array<BroadcastAction>): void {
	events.store.dispatch.fire(player, actions);
}

function hydrate(player: Player, state: SharedState): void {
	events.store.hydrate.fire(player, state as unknown as SerializedSharedState);
}
