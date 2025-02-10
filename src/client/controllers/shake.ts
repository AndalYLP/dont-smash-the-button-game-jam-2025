import { Controller } from "@flamework/core";
import { LocalPlayer } from "client/constants/player";

@Controller()
export class ShakeController {
	private readonly humanoid;
	private readonly originalOffset: Vector3;

	constructor() {
		LocalPlayer.CharacterAdded.Wait();

		this.humanoid = LocalPlayer.Character?.WaitForChild("Humanoid") as Humanoid;
		this.originalOffset = this.humanoid.CameraOffset;
	}

	private shake(intensity: number, duration: number) {
		const shakeOffset = new Vector3(
			math.random(-intensity, intensity),
			math.random(-intensity, intensity),
			math.random(-intensity, intensity),
		);

		const originalOffset = this.humanoid.CameraOffset;

		let currentTime = 0;
		while (currentTime < duration) {
			const delta = currentTime / duration;
			this.humanoid.CameraOffset = originalOffset.add(shakeOffset.mul(1 - delta));

			currentTime = currentTime + task.wait();
		}

		this.humanoid.CameraOffset = originalOffset;
	}

	public shakeCamera(intensity: number = 2.9, duration: number = 0.1, times: number = 4): void {
		for (let i = 0; i <= times; i++) this.shake(intensity, duration);

		this.humanoid.CameraOffset = this.originalOffset;
	}
}
