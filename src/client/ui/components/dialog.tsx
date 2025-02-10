import { useDebounceCallback, useEventListener } from "@rbxts/pretty-react-hooks";
import React, { useRef, useState } from "@rbxts/react";
import Signal from "@rbxts/signal";

export const newDialog = new Signal<
	(dialogId: number, text: string, speed: number, continues?: boolean) => void
>();
export const ForceStop = new Signal<(dialogId: number) => void>();

const stopped: Array<number> = [];

export function DialogBox(): React.ReactNode {
	const [text, setText] = useState("");
	const sound = useRef<Sound>();
	const [enabled, _setEnabled] = useState(false);

	const setEnabled = useDebounceCallback(
		(value: boolean) => {
			_setEnabled(value);
		},
		{ trailing: true, wait: 1.5 },
	);

	useEventListener(newDialog, (id, eventText, speed, continues) => {
		if (id in stopped) return;

		setText("");

		setEnabled.run(true);
		setEnabled.flush();

		let text = "";
		for (const t of eventText.split("")) {
			text += t;
			setText(text);
			sound.current?.Play();
			task.wait(speed);
		}

		if (!continues) setEnabled.run(false);
	});

	useEventListener(ForceStop, id => {
		stopped.push(id);
		setEnabled.run(false);
		setEnabled.flush();
	});

	return (
		<frame
			Visible={enabled}
			Size={UDim2.fromScale(1, 0.35)}
			Position={UDim2.fromScale(0, 1)}
			AnchorPoint={new Vector2(0, 1)}
			BackgroundColor3={new Color3()}
		>
			<sound SoundId={"rbxassetid://5855422149"} ref={sound} Volume={0.2} />
			<textlabel
				TextColor3={new Color3(1, 1, 1)}
				TextScaled={true}
				Size={UDim2.fromScale(0.85, 0.7)}
				BackgroundTransparency={1}
				Text={text}
				AnchorPoint={new Vector2(0.5, 1)}
				Position={UDim2.fromScale(0.5, 1)}
			>
				<uitextsizeconstraint MaxTextSize={80} MinTextSize={16} />
				<uistroke></uistroke>
			</textlabel>
			<uigradient
				Rotation={90}
				Transparency={
					new NumberSequence([
						new NumberSequenceKeypoint(0, 1),
						new NumberSequenceKeypoint(0.3, 0.3),
						new NumberSequenceKeypoint(1, 0),
					])
				}
			></uigradient>
		</frame>
	);
}
