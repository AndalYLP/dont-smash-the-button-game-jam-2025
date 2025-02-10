import { Controller, OnStart } from "@flamework/core";
import { Logger } from "@rbxts/log";
import { LocalPlayer } from "client/constants/player";
import { events } from "client/network";
import { newDialog } from "client/ui/components/dialog";
import { onCharacterAdded } from "utils/player";

@Controller()
export class DialogController implements OnStart {
	constructor(private readonly logger: Logger) {}

	public sendDialogWait(dialogId: number, text: string, time: number, continues?: boolean): void {
		const amount = text.size() + 1;
		const totalTime = amount * time;

		newDialog.Fire(dialogId, text, time, continues);

		task.wait(totalTime);
	}

	private startDialog(): void {
		this.logger.Info("dialog started");

		this.sendDialogWait(
			1,
			`Hi ${LocalPlayer.Name}, I finally completed the world for you.`,
			0.02,
			true,
		);

		task.wait(3);

		this.sendDialogWait(1, "It's a bit small but im sure you like it.", 0.02, true);

		task.wait(3);

		this.sendDialogWait(1, "But if you don't...", 0.1, true);

		task.wait(5);

		this.sendDialogWait(1, "You can always press the red button to let me know 😊", 0.02);
	}

	public onStart(): void {
		onCharacterAdded(LocalPlayer, () => this.startDialog());

		events.game.dialog.connect((i, t, s, c) => {
			newDialog.Fire(i, t, s, c);
		});
	}
}
