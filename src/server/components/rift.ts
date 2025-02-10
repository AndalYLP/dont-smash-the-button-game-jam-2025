import { BaseComponent, Component } from "@flamework/components";
import { OnStart } from "@flamework/core";
import { Players, Workspace } from "@rbxts/services";
import { FragmentComponent } from "server/components/fragment";
import { GameService } from "server/services/game";
import { RiftService } from "server/services/game/rift-service";
import { PlayerService } from "server/services/player";
import { CharacterService } from "server/services/player/character";

interface RiftModel extends Model {
	HitBox: BasePart;
}

@Component({ tag: "Rift" })
export class RiftComponent extends BaseComponent<object, RiftModel> implements OnStart {
	private hitThrottle = false;
	private readonly isRealRift!: boolean;

	constructor(
		private readonly riftService: RiftService,
		private readonly characterService: CharacterService,
		private readonly playerService: PlayerService,
		private readonly gameService: GameService,
	) {
		super();

		this.isRealRift = this.riftService.isRealRift(this.instance);
	}

	onStart(): void {
		this.instance.HitBox.Touched.Connect(hit => {
			if (this.hitThrottle) return;
			if (!Players.GetPlayerFromCharacter(hit.Parent)) return;

			this.hitThrottle = true;

			const player = this.playerService.getPlayer()!;
			const { HumanoidRootPart, Humanoid } = this.characterService.getCharacterRig()!;

			if (this.isRealRift) {
				this.gameService.Stop(player);
				//player.Kick("You won, sorry no time to make a better final, thanks for playing!!!");
				return;
			}

			FragmentComponent.maxScale -= 0.4;
			FragmentComponent.minScale -= 0.1;

			Humanoid.WalkSpeed += 3;
			Humanoid.JumpHeight += 5;

			this.gameService.changeFragmentSize.Fire();
			Humanoid.TakeDamage(5);
			HumanoidRootPart.CFrame = Workspace.SpawnLocation.CFrame.mul(new CFrame(0, 50, 0));

			this.riftService.destroyRift(this.instance);
		});
	}
}
