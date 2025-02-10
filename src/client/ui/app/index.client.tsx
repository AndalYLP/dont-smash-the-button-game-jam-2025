import React, { StrictMode } from "@rbxts/react";
import { createPortal, createRoot } from "@rbxts/react-roblox";
import { PLAYER_GUI } from "client/constants/player";
import { Blink } from "client/ui/components/blink";
import { DialogBox } from "client/ui/components/dialog";
import { Layer } from "client/ui/components/layer";

function App(): React.ReactNode {
	return (
		<>
			<Layer>
				<Blink />
				<DialogBox />
			</Layer>
		</>
	);
}

const root = createRoot(new Instance("Folder"));

root.render(<StrictMode>{createPortal(<App />, PLAYER_GUI)}</StrictMode>);
