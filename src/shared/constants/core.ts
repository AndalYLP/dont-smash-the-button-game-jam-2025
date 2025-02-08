import { RunService } from "@rbxts/services";

export const IS_STUDIO = RunService.IsStudio();
export const IS_EDIT = RunService.IsStudio() && !RunService.IsRunning();
export const IS_CLIENT = RunService.IsClient();
