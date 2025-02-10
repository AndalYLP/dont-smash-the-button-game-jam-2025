import { Service } from "@flamework/core";
import { Lighting, Workspace } from "@rbxts/services";
import Signal from "@rbxts/signal";
import { RiftService } from "server/services/game/rift-service";
import { RockService } from "server/services/game/rock/service";
import { CharacterService } from "server/services/player/character";
import { store } from "server/store";

@Service()
export class GameService {
	private started = false;
	public readonly changeFragmentSize = new Signal();

	constructor(
		private readonly rockService: RockService,
		private readonly characterService: CharacterService,
		private readonly riftService: RiftService,
	) {}

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
