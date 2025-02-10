import { BaseComponent, Component } from "@flamework/components";
import { OnStart } from "@flamework/core";
import { GameService } from "server/services/game";

@Component({
	tag: "Fragment",
})
export class FragmentComponent extends BaseComponent<object, BasePart> implements OnStart {
	public static maxScale = 7;
	public static minScale = 1.5;

	private readonly originalSize: Vector3;

	constructor(private readonly gameService: GameService) {
		super();

		this.originalSize = this.instance.Size;
	}

	private changeSize(): void {
		const { X, Y, Z } = this.originalSize;

		const scale = math.random(FragmentComponent.minScale, FragmentComponent.maxScale);

		this.instance.Size = new Vector3(X, Y * scale, Z);
	}

	public onStart(): void {
		this.gameService.changeFragmentSize.Connect(() => {
			this.changeSize();
		});
	}
}
