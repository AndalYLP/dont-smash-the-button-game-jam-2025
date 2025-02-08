import { BaseComponent, Component } from "@flamework/components";
import { OnStart } from "@flamework/core";
import { Logger } from "@rbxts/log";

interface ButtonModel extends Model {
	Button: MeshPart;
	HitBox: MeshPart;
	SFX: Sound;
}

@Component({
	tag: "Button",
	defaults: {
		clicked: false,
	},
})
export class ButtonComponent
	extends BaseComponent<{ clicked: boolean }, ButtonModel>
	implements OnStart
{
	private readonly clicker!: ClickDetector;

	constructor(private readonly logger: Logger) {
		super();
		logger.Info("loaded");

		this.clicker = new Instance("ClickDetector", this.instance.HitBox);
	}

	private moveButton(direction: "in" | "out"): void {
		this.attributes.clicked = direction === "in";

		const { HitBox, Button } = this.instance;

		const newLocation = Button.GetPivot().mul(
			new CFrame(0, 0, direction === "in" ? 0.25 : -0.25),
		);
		Button.PivotTo(newLocation);
		HitBox.PivotTo(newLocation);
	}

	private onClick(_player: Player): void {
		this.moveButton("in");
		this.instance.SFX.Play();

		task.wait(5);
		this.moveButton("out");
	}

	public onStart(): void {
		this.clicker.MouseClick.Connect(player => {
			if (this.attributes.clicked) return;

			this.logger.Info(`player ${player.UserId} clicked the button.`);

			this.onClick(player);
		});
	}
}
