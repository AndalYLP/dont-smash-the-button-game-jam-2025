import React from "@rbxts/react";
import ReactRoblox from "@rbxts/react-roblox";
import { End } from "client/ui/components/end";

const story = {
	react: React,
	reactRoblox: ReactRoblox,

	story: () => {
		return <End />;
	},
};

export = story;
