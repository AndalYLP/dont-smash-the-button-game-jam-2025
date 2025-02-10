import { Service } from "@flamework/core";
import { DataStoreService, Lighting, Workspace } from "@rbxts/services";
import Signal from "@rbxts/signal";
import { events } from "server/network";
import { RiftService } from "server/services/game/rift-service";
import { RockService } from "server/services/game/rock/service";
import { CharacterService } from "server/services/player/character";
import { store } from "server/store";
import { selectPlayerBalance } from "shared/store/slices/player/balance/balance.selectors";

const dataStore = DataStoreService.GetDataStore("records");

@Service()
export class GameService {
	private started = false;
	public readonly changeFragmentSize = new Signal();

	constructor(
		private readonly rockService: RockService,
		private readonly characterService: CharacterService,
		private readonly riftService: RiftService,
	) {}

	public sendDialogWait(
		player: Player,
		dialogId: number,
		text: string,
		time: number,
		continues?: boolean,
	): void {
		const amount = text.size() + 1;
		const totalTime = amount * time;

		events.game.dialog(player, dialogId, text, time, continues);

		task.wait(totalTime);
	}

	private setupNewSpace(): void {
		this.changeFragmentSize.Fire();

		Workspace.FakeSky.Destroy();
		Lighting.Atmosphere["Purple Nebula"].Parent = Lighting;
		Workspace.Gravity = 30;
	}

	private async givePoints(player: Player): Promise<void> {
		while (task.wait(1)) {
			store.addPoints(player, 1);
		}
	}

	private setupPlayer(player: Player) {
		const { Humanoid } = this.characterService.getCharacterRig()!;

		void this.givePoints(player);

		Humanoid.WalkSpeed = 32;
		Humanoid.JumpHeight = 25;
	}

	private createRift(): Vector3 {
		const fragments = Workspace.Fragments.GetChildren() as Array<BasePart>;
		const maxIndex = fragments.size() - 1;

		let rift!: Model;
		for (let i = 0; i <= 10; i++) {
			const index = math.random(0, maxIndex);
			const spawnFragment = fragments[index];

			rift = this.riftService.createRift(spawnFragment, i === 10);
		}

		return rift.GetPivot().Position;
	}

	private async startRockAttacks(player: Player): Promise<void> {
		while (task.wait(math.random(30, 50) / 10)) {
			if (!this.started) break;
			task.defer(() => {
				this.rockService.getRandomRock(player).launch();
			});
		}
	}

	private async startRandomRockAttack(player: Player) {
		while (task.wait(math.random(20, 45) / 10)) {
			if (!this.started) break;
			task.defer(() => {
				this.rockService
					.getRandomRock(
						player,
						new CFrame(math.random(-700, 700), 5, math.random(-700, 700)),
					)
					.launch();
			});
		}
	}

	public Stop(player: Player): void {
		this.started = false;

		for (const part of Workspace.GetDescendants()) {
			task.defer(() => {
				if (part.IsA("BasePart")) {
					if (part.Name.find("Rock")[0] === 1) {
						part.Destroy();
					}

					part.Anchored = true;
					for (const tag of part.GetTags()) part.RemoveTag(tag);
				}
			});
		}

		this.sendDialogWait(player, 4, "...", 0.02, true);

		task.wait(2.5);

		this.sendDialogWait(player, 4, "You found it...", 0.03, true);

		task.wait(2.5);

		this.sendDialogWait(player, 4, "Just go...", 0.04, true);

		task.wait(1);

		const points = store.getState(selectPlayerBalance(player))?.points ?? 0;

		let result = dataStore.GetAsync(`${player.UserId}`)[0] as number | undefined;

		if (!result || result > points) {
			dataStore.SetAsync(`${player.UserId}`, points);
			result = points;
		}

		events.game.end(player, result);
	}

	public Start(player: Player): void {
		if (this.started) return;
		this.started = true;

		this.setupNewSpace();
		this.createRift();

		this.setupPlayer(player);

		void this.startRockAttacks(player);
		void this.startRockAttacks(player);
		void this.startRockAttacks(player);
		void this.startRandomRockAttack(player);
		void this.startRandomRockAttack(player);
		void this.startRandomRockAttack(player);
		void this.startRandomRockAttack(player);
		void this.startRandomRockAttack(player);
	}
}
