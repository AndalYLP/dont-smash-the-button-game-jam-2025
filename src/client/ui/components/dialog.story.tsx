import React from "@rbxts/react";
import ReactRoblox from "@rbxts/react-roblox";
import { DialogBox } from "client/ui/components/dialog";

const story = {
	react: React,
	reactRoblox: ReactRoblox,

	story: () => {
		return <DialogBox />;
	},
};

export = story;
