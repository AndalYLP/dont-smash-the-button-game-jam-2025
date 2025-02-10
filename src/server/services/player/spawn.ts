import { Service } from "@flamework/core";
import { TeleportService, Workspace } from "@rbxts/services";
import { OnCharacterAdded } from "server/services/player/character";
import { CharacterRig } from "utils/player";

@Service()
export class SpawnService implements OnCharacterAdded {
	onCharacterAdded(character: CharacterRig, player: Player): void {
		character.HumanoidRootPart.CFrame = Workspace.SpawnLocation.CFrame.mul(new CFrame(0, 5, 0));

		character.Humanoid.Died.Connect(() => {
			const screenGui = new Instance("ScreenGui");
			const frame = new Instance("Frame");
			frame.BackgroundColor3 = new Color3();
			frame.Size = UDim2.fromScale(1, 1);
			frame.Parent = screenGui;

			TeleportService.Teleport(game.PlaceId, player, undefined, screenGui);
		});
	}
}
