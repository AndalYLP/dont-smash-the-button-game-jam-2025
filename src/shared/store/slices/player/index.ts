import { combineProducers } from "@rbxts/reflex";
import { withMultiplayer } from "shared/functions/with-multiplayer";
import { balanceSlice } from "shared/store/slices/player/balance/balance.slice";

export * from "./player.selectors";
export * from "./player.types";

export const playersSlices = combineProducers({
	balance: balanceSlice,
}).enhance(withMultiplayer);
