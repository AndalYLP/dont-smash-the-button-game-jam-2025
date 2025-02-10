import { useEventListener } from "@rbxts/pretty-react-hooks";
import React, { useState } from "@rbxts/react";
import { LocalPlayer } from "client/constants/player";

if (!LocalPlayer.Character) LocalPlayer.CharacterAdded.Wait();

const humanoid = LocalPlayer.Character?.FindFirstChildOfClass("Humanoid")!;

const diedMessages: Array<string> = [
	"You choosed this.",
	"My world looks great now right?",
	"I didn't want to do this.",
];

export function Died(): React.ReactNode {
	const [visible, setVisible] = useState(false);
	const [message, setMessage] = useState("");

	useEventListener(humanoid.Died, () => {
		setMessage(diedMessages[math.random(0, diedMessages.size() - 1)]);
		setVisible(true);
	});

	return (
		<textlabel
			Visible={visible}
			AnchorPoint={new Vector2(0.5, 0.5)}
			Position={UDim2.fromScale(0.5, 0.5)}
			Size={UDim2.fromScale(1, 1)}
			Text={message}
			TextScaled={true}
			BackgroundColor3={new Color3()}
		></textlabel>
	);
}
