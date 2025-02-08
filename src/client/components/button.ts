import { BaseComponent, Component } from "@flamework/components";
import { OnStart } from "@flamework/core";
import { Logger } from "@rbxts/log";
import Signal from "@rbxts/signal";

interface ButtonModel extends Model {
	Button: MeshPart;
	HitBox: MeshPart & {
		ClickDetector: ClickDetector;
	};
	SFX: Sound;
}

export const blink = new Signal();

@Component({
	tag: "Button",
})
export class ButtonComponent
	extends BaseComponent<{ clicked: boolean }, ButtonModel>
	implements OnStart
{
	private readonly clicker!: ClickDetector;

	constructor(private readonly logger: Logger) {
		super();
		logger.Info("loaded");

		this.clicker = this.instance.HitBox.ClickDetector;
	}

	private onClick(): void {
		blink.Fire();
	}

	public onStart(): void {
		this.clicker.MouseClick.Connect(() => {
			// 1 player server no need to verify if its the local player
			if (this.attributes.clicked) return;

			this.logger.Info("clicked client side.");

			this.onClick();
		});
	}
}
