import { OnStart, Service } from "@flamework/core";
import { Logger } from "@rbxts/log";
import Object from "@rbxts/object-utils";
import Signal from "@rbxts/signal";
import { ListenerData, setupLifecycle } from "utils/flamework";
import { onPlayerAdded } from "utils/player";

export interface OnPlayerJoin {
	onPlayerJoin(player: Player): void;
}

@Service()
export class PlayerService implements OnStart {
	private readonly onEntityJoined = new Signal<(player: Player) => void>();
	private readonly playerEntities = new Map<Player, Player>();
	private readonly playerJoinEvents = new Array<ListenerData<OnPlayerJoin>>();

	constructor(private readonly logger: Logger) {}

	public getPlayerEntities(): Array<Player> {
		return Object.values(this.playerEntities);
	}

	public getPlayerEntity(player: Player): Player | undefined {
		return this.playerEntities.get(player);
	}

	/** @ignore */
	public onStart(): void {
		setupLifecycle<OnPlayerJoin>(this.playerJoinEvents);

		onPlayerAdded(player => {
			this.onPlayerJoin(player).catch(err => {
				this.logger.Error(`Failed to load player ${player.UserId}: ${err}`);
			});
		});
	}

	private async onPlayerJoin(player: Player): Promise<void> {
		this.playerEntities.set(player, player);

		for (const { id, event } of this.playerJoinEvents) {
			Promise.defer(() => {
				debug.profilebegin(id);
				event.onPlayerJoin(player);
			}).catch(err => {
				this.logger.Error(`Error in player lifecycle ${id}: ${err}`);
			});
		}

		this.logger.Info(`Player ${player.UserId} joined the game.`);
		this.onEntityJoined.Fire(player);
	}
}
