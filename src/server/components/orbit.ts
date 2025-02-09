import { BaseComponent, Component } from "@flamework/components";
import { OnStart } from "@flamework/core";

interface OrbitAttributes {
	/* NOTE: ignore Y axis */
	middle: Vector3;
	speed: number;
	distance?: number;
}

@Component({
	tag: "Orbit",
	defaults: {
		middle: Vector3.zero,
		speed: 0.15,
	},
})
export class OrbitComponent extends BaseComponent<OrbitAttributes, BasePart> implements OnStart {
	private running = true;
	private readonly distanceFromMiddle!: number;

	constructor() {
		super();

		const { X, Z } = this.attributes.middle;

		this.attributes.middle = new Vector3(X, this.instance.Position.Y, Z);
		this.distanceFromMiddle =
			this.attributes.distance ??
			this.attributes.middle.sub(this.instance.Position).Magnitude;
	}

	private getPosition(angle: number): Vector3 {
		const x = math.cos(angle) * this.distanceFromMiddle;
		const z = math.sin(angle) * this.distanceFromMiddle;

		return new Vector3(x, this.instance.Position.Y, z);
	}

	private getStartPosition(): number {
		const { X, Z } = this.instance.Position.sub(this.attributes.middle);

		return math.atan2(Z, X) * (180 / math.pi);
	}

	public onStart(): void {
		let currentAngle = this.getStartPosition();

		while (this.running) {
			this.instance.Position = this.getPosition(math.rad(currentAngle));

			currentAngle += this.attributes.speed;
			task.wait(0.03);
		}
	}

	public destroy(): void {
		super.destroy();

		this.running = false;
	}
}
