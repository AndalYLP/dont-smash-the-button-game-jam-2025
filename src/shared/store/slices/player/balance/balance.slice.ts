import { createProducer } from "@rbxts/reflex";
import { PlayerData } from "..";
import { defaultPlayerBalance, PlayerBalance } from "./balance.types";

export type BalanceState = Readonly<PlayerBalance>;

const initialState: BalanceState = defaultPlayerBalance;

export const balanceSlice = createProducer(initialState, {
	addPoints: (state, amount: number): BalanceState => {
		return {
			...state,
			points: state.points + amount,
		};
	},

	/** @ignore */
	loadPlayerData: (_state, data: PlayerData): BalanceState => data.balance,
});
