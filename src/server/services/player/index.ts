import { OnStart, Service } from "@flamework/core";
import { Logger } from "@rbxts/log";
import Signal from "@rbxts/signal";
import { ListenerData, setupLifecycle } from "utils/flamework";
import { onPlayerAdded } from "utils/player";

export interface OnPlayerJoin {
	onPlayerJoin(player: Player): void;
}

@Service()
export class PlayerService implements OnStart {
	private readonly onEntityJoined = new Signal<(player: Player) => void>();
	private player?: Player;
	private readonly playerJoinEvents = new Array<ListenerData<OnPlayerJoin>>();

	constructor(private readonly logger: Logger) {}

	public getPlayer(): Player {
		return this.player!;
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
		this.player = player;

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
