import { lerpBinding, useEventListener, useMotion } from "@rbxts/pretty-react-hooks";
import React from "@rbxts/react";
import { SpringOptions } from "@rbxts/ripple";
import { blink } from "client/components/button";
import { Group } from "client/ui/components/group";

export function Blink(): React.ReactNode {
	const [position, motion] = useMotion(0);

	useEventListener(blink, () => {
		motion.spring(1, {
			frequency: 0.075,
		} satisfies SpringOptions);
	});

	return (
		<Group>
			<frame
				BorderSizePixel={0}
				Position={lerpBinding(position, UDim2.fromScale(0, 0), UDim2.fromScale(0, 0.5))} // decrease
				Size={UDim2.fromScale(1, 0.5)}
				BackgroundColor3={new Color3()}
				AnchorPoint={new Vector2(0, 1)}
			></frame>
			<frame
				BorderSizePixel={0}
				Position={lerpBinding(position, UDim2.fromScale(0, 1), UDim2.fromScale(0, 0.5))} // increase
				Size={UDim2.fromScale(1, 0.5)}
				BackgroundColor3={new Color3()}
			></frame>
		</Group>
	);
}
