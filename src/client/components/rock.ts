import { BaseComponent, Component } from "@flamework/components";
import { ShakeController } from "client/controllers/shake";

@Component({
	tag: "Rock",
})
export class RockComponent extends BaseComponent<object, BasePart> {
	constructor(private readonly shakeController: ShakeController) {
		super();
	}

	destroy(): void {
		super.destroy();

		this.shakeController.shakeCamera();
	}
}
