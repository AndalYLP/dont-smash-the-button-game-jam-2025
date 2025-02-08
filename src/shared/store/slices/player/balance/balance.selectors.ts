import { createSelector } from "@rbxts/reflex";
import { SharedState } from "shared/store";
import { selectPlayerData } from "../player.selectors";
import { BalanceState } from "./balance.slice";

export function selectPlayerBalance(
	player: Player,
): (state: SharedState) => BalanceState | undefined {
	return createSelector(selectPlayerData(player), state => state?.balance);
}
