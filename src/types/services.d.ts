interface ServerStorage {
	Rocks: Folder & {
		Rock1: BasePart;
		Rock2: BasePart;
		Rock3: BasePart;
		Rock4: BasePart;
		Rock5: BasePart;
		Rock6: BasePart;
		Rock7: BasePart;
		Rock8: BasePart;
		Rock9: BasePart;
		Rock10: BasePart;
	};
	Rift: Model;
}

interface Workspace {
	RockSpawns: Folder & {
		"1": BasePart;
		"2": BasePart;
		"3": BasePart;
		"4": BasePart;
		"5": BasePart;
		"6": BasePart;
	};
	SpawnLocation: SpawnLocation;
	FakeSky: BasePart & {
		Crack: BasePart;
		Crack1: BasePart;
	};
	Fragments: Folder;
}

interface Lighting {
	Atmosphere: Atmosphere & {
		"Purple Nebula": Sky;
	};
}

interface SoundService {
	pre: Sound;
	post: Sound;
}
