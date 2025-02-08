export interface PlayerBalance {
	points: number;
}

export const defaultPlayerBalance: Readonly<PlayerBalance> = {
	points: 0,
};

export type PlayerBalanceType = keyof PlayerBalance;
