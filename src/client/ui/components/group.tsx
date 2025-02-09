import React, { forwardRef } from "@rbxts/react";

interface GroupProps extends React.PropsWithChildren {
	Native?: Partial<Omit<React.InstanceProps<Frame>, "BackgroundTransparency">>;
}

export const Group = forwardRef(
	({ Native, children }: Readonly<GroupProps>, ref: React.Ref<Frame>) => {
		return (
			<frame
				ref={ref}
				AnchorPoint={new Vector2(0.5, 0.5)}
				BackgroundTransparency={1}
				Position={new UDim2(0.5, 0, 0.5, 0)}
				Size={new UDim2(1, 0, 1, 0)}
				{...Native}
			>
				{children}
			</frame>
		);
	},
);
