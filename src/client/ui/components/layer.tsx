import React from "@rbxts/react";
import { IS_EDIT } from "shared/constants/core";
import { Group } from "./group";

export interface LayerProps extends React.PropsWithChildren {
	DisplayOrder?: number;
	enabled?: boolean;
}

export function Layer({
	DisplayOrder,
	enabled = true,
	children,
}: Readonly<LayerProps>): React.ReactNode {
	return IS_EDIT ? (
		<Group
			Native={{
				ZIndex: DisplayOrder,
			}}
		>
			{children}
		</Group>
	) : (
		<screengui
			DisplayOrder={DisplayOrder}
			Enabled={enabled}
			IgnoreGuiInset={true}
			ResetOnSpawn={false}
			ZIndexBehavior="Sibling"
		>
			{children}
		</screengui>
	);
}
