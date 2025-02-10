import { useEventListener, useMotion } from "@rbxts/pretty-react-hooks";
import React, { useState } from "@rbxts/react";
import { events } from "client/network";

export function End(): React.ReactNode {
	const [visible, setVisible] = useState(false);
	const [transparency, motion] = useMotion(1);
	const [record, setRecord] = useState(0);

	useEventListener(events.game.end, record => {
		setVisible(true);
		setRecord(record);
		motion.spring(0);
	});

	return (
		<frame
			Visible={visible}
			Size={UDim2.fromScale(1, 1)}
			Position={UDim2.fromScale(0.5, 0.5)}
			AnchorPoint={new Vector2(0.5, 0.5)}
			BackgroundColor3={new Color3()}
			Transparency={transparency}
		>
			<textlabel
				BackgroundTransparency={1}
				Position={UDim2.fromScale(0.5, 0.2)}
				Size={UDim2.fromScale(0.85, 0.2)}
				TextColor3={new Color3(1, 1, 1)}
				TextScaled={true}
				AnchorPoint={new Vector2(0.5, 0.5)}
				TextTransparency={transparency}
				Text={`Thanks for playing!\nThis game was part of the Roblox Developer Challenge 2025\n\nBest time: ${record}`}
			></textlabel>
			<frame
				Size={UDim2.fromScale(0.4, 0.6)}
				Position={UDim2.fromScale(0.5, 0.8)}
				AnchorPoint={new Vector2(0.5, 0.5)}
				BackgroundTransparency={1}
			>
				<textlabel
					BackgroundTransparency={1}
					Position={UDim2.fromScale(0.5, 0.2)}
					Size={UDim2.fromScale(0.85, 0.15)}
					TextColor3={new Color3(1, 1, 1)}
					TextTransparency={transparency}
					TextScaled={true}
					AnchorPoint={new Vector2(0.5, 0.5)}
					Text={"@andalYLP - Scripter"}
				></textlabel>
				<textlabel
					BackgroundTransparency={1}
					Position={UDim2.fromScale(0.5, 0.2)}
					Size={UDim2.fromScale(0.85, 0.15)}
					TextColor3={new Color3(1, 1, 1)}
					TextScaled={true}
					TextTransparency={transparency}
					AnchorPoint={new Vector2(0.5, 0.5)}
					Text={"@lenoob_z - Builder"}
				></textlabel>
				<textlabel
					BackgroundTransparency={1}
					Position={UDim2.fromScale(0.5, 0.2)}
					Size={UDim2.fromScale(0.85, 0.15)}
					TextColor3={new Color3(1, 1, 1)}
					TextTransparency={transparency}
					TextScaled={true}
					AnchorPoint={new Vector2(0.5, 0.5)}
					Text={"@1nofree - Builder"}
				></textlabel>
				<uilistlayout HorizontalAlignment={"Center"}></uilistlayout>
			</frame>
		</frame>
	);
}
