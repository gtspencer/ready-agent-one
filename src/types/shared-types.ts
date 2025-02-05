/**
 * Represents a player in the game.
 * Used in various events to track player actions like entering or exiting.
 */
export interface Player {
    userId: string;
    username: string;
}

/**
* A base interface for the world tick message, sent on some interval by the game.
* Contains a list of active players.
*/
export interface WorldTick {
    text: "WORLD_TICK";
    players: Player[];
    [key: string]: any;
}

/**
 * A collection of built-in event names
 * Can also be a custom string
 */
export const PLAYER_ENTER_EVENT = "PLAYER_ENTER";
export const PLAYER_EXIT_EVENT = "PLAYER_EXIT";
export const PLAYER_WON_EVENT = "PLAYER_WON";
export const GAME_COMPLETED_EVENT = "GAME_COMPLETED";

export type EventName =
    | typeof PLAYER_ENTER_EVENT
    | typeof PLAYER_EXIT_EVENT
    | typeof PLAYER_WON_EVENT
    | typeof GAME_COMPLETED_EVENT
    | string;

/**
* A base interface for all world event types.
* Each event type will have specific event data.
*/
export interface WorldEventBase {
    text: "WORLD_EVENT";
    event: EventName;
    eventData: object;
    [key: string]: any;
}

/**
 * An event where a player enters a zone specified by the game.
 * Includes basic information about the player and the entered zone
 */
export interface PlayerEnterEvent extends WorldEventBase {
    event: typeof PLAYER_ENTER_EVENT;
    eventData: PlayerEnterExitEventData;
}

/**
 * An event where a player exits a zone specified by the game.
 * Includes basic information about the player and the exited zone
 */
export interface PlayerExitEvent extends WorldEventBase {
    event: typeof PLAYER_EXIT_EVENT;
    eventData: PlayerEnterExitEventData;
}

export interface PlayerEnterExitEventData {
    player: Player,
    zoneId: string
}

/**
 * An event where a player won a specific game.
 * Includes basic information about the player and the game.
 */
export interface PlayerWonEvent extends WorldEventBase {
    event: typeof PLAYER_WON_EVENT;
    eventData: PlayerWonEventData;
}

export interface PlayerWonEventData {
    player: Player;
    score: number;
    game: string
}

/**
 * An event where a game has been completed by players.
 * Includes basic information about the ranking of players and the game.
 */
export interface GameCompletedEvent extends WorldEventBase {
    event: typeof GAME_COMPLETED_EVENT;
    eventData: GameCompletedEventData;
}

export interface GameCompletedEventData {
    rank: Player[];
    game: string;
}

/**
 * A custom event specified by the agent owner.
 * Can include any information the game sends it.
 */
export interface CustomWorldEvent extends WorldEventBase {
    event: string;
    eventData: object;
}

export type WorldEvent = PlayerEnterEvent | PlayerExitEvent | PlayerWonEvent | CustomWorldEvent;

export type WorldMessage = WorldTick | WorldEvent;
