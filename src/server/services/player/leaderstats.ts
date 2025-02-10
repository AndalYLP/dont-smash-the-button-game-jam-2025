import { OnInit, Service } from "@flamework/core";
import { Logger } from "@rbxts/log";
import { t } from "@rbxts/t";
import { store } from "server/store";
import { PlayerData, selectPlayerData } from "shared/store/slices/player";
import { OnPlayerJoin } from ".";

interface LeaderstatValueTypes {
	IntValue: number;
	StringValue: string;
}

interface LeaderstatEntry<T extends keyof LeaderstatValueTypes = keyof LeaderstatValueTypes> {
	Name: Leaderstats;
	PlayerDataKey?: NestedKeyOf<PlayerData>;
	ValueType: T;
}

type Leaderstats = "Time" | "Test";

type LeaderstatValue = Instances[keyof LeaderstatValueTypes];

@Service()
export class LeaderstatsService implements OnInit, OnPlayerJoin {
	private readonly leaderstats = new Array<LeaderstatEntry>();
	private readonly playerToLeaderstatsMap = new Map<Player, Folder>();
	private readonly playerToValueMap = new Map<Player, Map<string, LeaderstatValue>>();

	constructor(private readonly logger: Logger) {}

	/** @ignore */
	public onInit(): void {
		this.registerStat("Time", "IntValue", "balance.points");
	}

	public getStatObject(player: Player, statName: Leaderstats): LeaderstatValue | undefined {
		const valueMap = this.playerToValueMap.get(player);
		if (!valueMap) {
			return;
		}

		const entry = this.leaderstats.find(leaderstatsEntry => leaderstatsEntry.Name === statName);
		if (!entry) {
			return;
		}

		return valueMap.get(entry.Name);
	}

	private getPlayerData(
		playerData: PlayerData,
		nestedKey: NestedKeyOf<PlayerData>,
	): ValueOf<LeaderstatValueTypes> {
		const keys = nestedKey.split(".");
		let value = playerData;
		for (const key of keys) {
			value = value[key as never];
		}

		assert(t.number(value) || t.string(value), `Value is not a number or string: ${value}`);

		return value;
	}

	private registerStat(
		statName: Leaderstats,
		valueType: keyof LeaderstatValueTypes,
		playerDataKey?: NestedKeyOf<PlayerData>,
	): void {
		assert(
			this.leaderstats.find(entry => entry.Name === statName) === undefined,
			`Stat provided already exists.`,
		);

		this.leaderstats.push({
			Name: statName,
			PlayerDataKey: playerDataKey,
			ValueType: valueType,
		});

		this.logger.Info(`Registered leaderboard stat ${statName}`);
	}

	private subscribeToPlayerData(
		player: Player,
		valueMap: Map<Leaderstats, LeaderstatValue>,
	): void {
		store.subscribe(selectPlayerData(player), save => {
			if (!save) {
				return;
			}

			for (const entry of this.leaderstats) {
				if (entry.PlayerDataKey === undefined) {
					continue;
				}

				const stat = valueMap.get(entry.Name);
				if (!stat) {
					continue;
				}

				stat.Value = this.getPlayerData(save, entry.PlayerDataKey);
			}
		});
	}

	/** @ignore */
	public onPlayerJoin(player: Player): void {
		const leaderstats = new Instance("Folder");
		leaderstats.Name = "leaderstats";
		leaderstats.Parent = player;

		this.playerToLeaderstatsMap.set(player, leaderstats);

		const playerData = store.getState(selectPlayerData(player));
		const valueMap = new Map<Leaderstats, LeaderstatValue>();

		for (const entry of this.leaderstats) {
			const stat = new Instance(entry.ValueType);
			stat.Name = entry.Name;
			stat.Parent = leaderstats;
			valueMap.set(entry.Name, stat);

			if (playerData === undefined || entry.PlayerDataKey === undefined) {
				stat.Value = entry.ValueType === "IntValue" ? 0 : "N/A";
				continue;
			}

			stat.Value = this.getPlayerData(playerData, entry.PlayerDataKey);
		}

		this.subscribeToPlayerData(player, valueMap);

		this.playerToValueMap.set(player, valueMap);
	}
}
