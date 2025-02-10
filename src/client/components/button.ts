import { BaseComponent, Component } from "@flamework/components";
import { OnStart } from "@flamework/core";
import { Logger } from "@rbxts/log";
import Signal from "@rbxts/signal";
import { DialogController } from "client/controllers/dialog";
import { ShakeController } from "client/controllers/shake";
import { events } from "client/network";
import { ForceStop } from "client/ui/components/dialog";

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

	constructor(
		private readonly logger: Logger,
		private readonly shakeController: ShakeController,
		private readonly dialogController: DialogController,
	) {
		super();
		logger.Info("loaded");

		this.clicker = this.instance.HitBox.ClickDetector;
	}

	private dialog(): void {
		ForceStop.Fire(1);

		this.dialogController.sendDialogWait(2, "...", 0.3, true);

		task.wait(5);

		this.dialogController.sendDialogWait(
			2,
			'Alright, you can return to the "normal" world now.',
			0.02,
			true,
		);

		task.wait(2.5);

		this.dialogController.sendDialogWait(2, "Good luck... you're going to need it.", 0.03);
	}

	private onClick(): void {
		this.dialog();

		this.shakeController.shakeCamera(5, 0.1, 6);
		blink.Fire();

		events.game.ready();

		task.wait(10);

		this.dialogController.sendDialogWait(
			3,
			"Did you really think it would be that easy?",
			0.02,
			true,
		);

		task.wait(2);

		this.dialogController.sendDialogWait(3, "Good luck finding the real portal...", 0.03);
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
