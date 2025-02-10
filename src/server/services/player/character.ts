import { OnStart, Service } from "@flamework/core";
import { Logger } from "@rbxts/log";
import { setTimeout } from "@rbxts/set-timeout";
import { promiseTree } from "@rbxts/validate-tree";
import { ListenerData, setupLifecycle } from "utils/flamework";
import {
	CHARACTER_LOAD_TIMEOUT,
	CharacterRig,
	characterSchema,
	loadCharacter,
	onCharacterAdded,
} from "utils/player";

import type { OnPlayerJoin } from ".";

export interface OnCharacterAdded {
	onCharacterAdded(character: CharacterRig, player: Player): void;
}

@Service()
export class CharacterService implements OnStart, OnPlayerJoin {
	private readonly characterAddedEvents = new Array<ListenerData<OnCharacterAdded>>();
	private characterRig?: CharacterRig;

	constructor(private readonly logger: Logger) {}

	public getCharacterRig(): CharacterRig | undefined {
		return this.characterRig;
	}

	private async characterAdded(player: Player, character: Model): Promise<void> {
		const promise = promiseTree(character, characterSchema);

		const timeout = setTimeout(() => {
			promise.cancel();
			void this.retryCharacterLoad(player);
		}, CHARACTER_LOAD_TIMEOUT);

		const connection = character.AncestryChanged.Connect(() => {
			if (character.IsDescendantOf(game)) {
				return;
			}

			promise.cancel();
		});

		const [success, rig] = promise.await();
		timeout();
		connection.Disconnect();

		if (!success) {
			throw `Could not get character rig for ${player.UserId}`;
		}

		this.onRigLoaded(player, rig);
	}

	private async characterAppearanceLoaded(player: Player): Promise<void> {
		if (!player.HasAppearanceLoaded()) {
			await Promise.fromEvent(player.CharacterAppearanceLoaded).timeout(
				CHARACTER_LOAD_TIMEOUT,
			);
		}
	}

	private onRigLoaded(player: Player, rig: CharacterRig): void {
		this.characterRig = rig;

		for (const { id, event } of this.characterAddedEvents) {
			void Promise.defer(() => {
				debug.profilebegin(id);
				event.onCharacterAdded(rig, player);
			});
		}

		void this.characterAppearanceLoaded(player);
	}

	private async retryCharacterLoad(player: Player): Promise<void> {
		this.logger.Warn(`Getting full rig for ${player.UserId} timed out. Retrying...`);
		return loadCharacter(player);
	}

	/** @ignore */
	public onStart(): void {
		setupLifecycle<OnCharacterAdded>(this.characterAddedEvents);
	}

	/** @ignore */
	public onPlayerJoin(player: Player): void {
		onCharacterAdded(player, character => {
			void this.characterAdded(player, character);
		});
	}
}
