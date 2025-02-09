import { BaseComponent, Component } from "@flamework/components";
import { OnStart } from "@flamework/core";

@Component({
	tag: "Rotate",
	defaults: {
		speed: 2,
	},
})
export class RotateComponent extends BaseComponent<{ speed: number }, BasePart> implements OnStart {
	private running = true;

	public onStart(): void {
		while (this.running) {
			this.instance.CFrame = this.instance.CFrame.mul(
				CFrame.Angles(0, math.rad(this.attributes.speed), 0),
			);
			task.wait(0.03);
		}
	}

	public destroy(): void {
		super.destroy();

		this.running = false;
	}
}
