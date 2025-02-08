import { defaultPlayerBalance, PlayerBalance } from "./balance/balance.types";

export interface PlayerData {
	readonly balance: PlayerBalance;
}

export const defaultPlayerData: Readonly<PlayerData> = {
	balance: defaultPlayerBalance,
};
