import { Players, Workspace } from "@rbxts/services";
import { CharacterRig } from "utils/player";

export class Rock {
	private readonly totalSpawns!: number;
	private character!: CharacterRig;
	private throttle = false;

	constructor(
		private readonly player: Player,
		private readonly instance: BasePart,
		private readonly target?: CFrame,
	) {
		this.totalSpawns = Workspace.RockSpawns.GetChildren().size();
		this.character = player.Character as CharacterRig;

		instance.Touched.Connect(hit => {
			if (this.throttle) return;
			if (!Players.GetPlayerFromCharacter(hit.Parent)) return;
			this.character.Humanoid.TakeDamage(15);

			this.throttle = true;
		});
	}

	private getSpawnPoint(): CFrame {
		const index = tostring(math.random(1, this.totalSpawns)) as "1";

		return Workspace.RockSpawns[index].CFrame;
	}

	private moveToSpawn(): void {
		const spawn = this.getSpawnPoint();

		this.instance.CFrame = spawn;
	}

	public launch(): void {
		this.moveToSpawn();

		task.wait();

		this.instance.Parent = Workspace;

		const target =
			this.target ?? this.character.HumanoidRootPart.CFrame.mul(new CFrame(0, -5, -30));

		this.instance.CFrame = CFrame.lookAt(this.instance.Position, target.Position);

		const initialCFrame = this.instance.CFrame;

		for (let i = 0; i <= 150; i++) {
			this.instance.Position = initialCFrame.Lerp(target, i / 150).Position;
			task.wait();
		}

		task.wait(0.5);
		this.throttle = true;
		task.wait(0.5);

		this.instance.Destroy();
	}
}
