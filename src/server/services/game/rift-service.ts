import { Service } from "@flamework/core";
import { ServerStorage, Workspace } from "@rbxts/services";

@Service()
export class RiftService {
	private readonly Rifts = new Map<Model, boolean>();

	public isRealRift(rift: Model): boolean {
		return this.Rifts.get(rift) ?? false;
	}

	public destroyRift(rift: Model): void {
		this.Rifts.delete(rift);

		rift.Destroy();
	}

	public createRift(spawnPart: BasePart, real: boolean = false): Model {
		const rift = ServerStorage.Rift.Clone();
		rift.PivotTo(spawnPart.CFrame.mul(new CFrame(0, spawnPart.Size.Y / 2, 0)));

		spawnPart.GetPropertyChangedSignal("Size").Connect(() => {
			rift.PivotTo(spawnPart.CFrame.mul(new CFrame(0, spawnPart.Size.Y / 2, 0)));
		});

		this.Rifts.set(rift, real);

		rift.Parent = Workspace;

		return rift;
	}
}
