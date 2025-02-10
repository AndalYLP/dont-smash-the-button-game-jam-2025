import { useEventListener, useMotion } from "@rbxts/pretty-react-hooks";
import React, { useState } from "@rbxts/react";
import { LocalPlayer } from "client/constants/player";

if (!LocalPlayer.Character) LocalPlayer.CharacterAdded.Wait();

const humanoid = LocalPlayer.Character?.FindFirstChildOfClass("Humanoid")!;

const diedMessages: Array<string> = [
	"You chose this.",
	"My world looks great now, doesn't it?",
	"I never wanted to do this...",
	"This is how it ends.",
	"Don't blame me for your choices.",
];

export function Died(): React.ReactNode {
	const [visible, setVisible] = useState(false);
	const [message, setMessage] = useState("");
	const [transparency, motion] = useMotion(1);

	useEventListener(humanoid.Died, () => {
		setMessage(diedMessages[math.random(0, diedMessages.size() - 1)]);
		setVisible(true);
		motion.spring(0);
	});

	return (
		<textlabel
			Transparency={transparency}
			Visible={visible}
			AnchorPoint={new Vector2(0.5, 0.5)}
			Position={UDim2.fromScale(0.5, 0.5)}
			Size={UDim2.fromScale(1, 1)}
			Text={message}
			TextColor3={new Color3(1, 1, 1)}
			TextScaled={true}
			BackgroundColor3={new Color3()}
		></textlabel>
	);
}
