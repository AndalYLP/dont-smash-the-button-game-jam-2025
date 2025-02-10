import { Service } from "@flamework/core";
import { ServerStorage } from "@rbxts/services";
import { Rock } from "server/services/game/rock/class";

@Service()
export class RockService {
	private readonly rockFolder = ServerStorage.Rocks;

	public getRandomRock(targetPlayer: Player, target?: CFrame): Rock {
		const rockId = `Rock${math.random(1, this.rockFolder.GetChildren().size())}` as "Rock1";

		const instance = this.rockFolder[rockId].Clone();
		instance.Size = instance.Size.mul(
			target ? math.random(6, 14) / 10 : math.random(5, 11) / 10,
		);

		return new Rock(targetPlayer, instance, target);
	}
}
