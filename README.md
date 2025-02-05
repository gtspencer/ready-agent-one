# ready-agent-one

`ready-agent-one` is a framework for giving AI agents a novel way to interact meaningfully in a game world. It provides a structure to handle world (server) ticks and world events, allowing you to easily manage, customize, and process game events involving players.

It's purpose is to define a standard (and provide necessary tooling to work within that standard) to intercept in-game world information and events with the purpose of controlling agent prompting and extending behavior beyond typical action schemas.

## Features
- World Ticks: Keep track of ongoing gameplay and player statuses.
- World Events: Trigger specific game actions such as player entry, exit, or winning events.
- Custom Events: Specify custom world events from the game.
- Customizable Callbacks: Easily register and trigger event handlers for various game actions.
- TypeScript Support: Fully typed API to ensure reliability and clarity

## Installation
To install ready-agent-one, run the following command:
```bash
npm install ready-agent-one
```

## Usage
1. Importing the library
```ts
import { tryParseWorldMessage, setOnWorldTickCallback, registerEventAction } from 'ready-agent-one';
import { PLAYER_ENTER_EVENT, PLAYER_EXIT_EVENT } from 'ready-agent-one/dist/types/sharedTypes';
```

2. Set up the world tick handler
```ts
setOnWorldTickCallback((message) => {
  const presentPlayers = message.players;

  agent.updateWorldInfo(`Present players: ${presentPlayers.map(player => player.username).join(', ');}`)
});
```

3. Register event actions
```ts
registerEventAction(PLAYER_ENTER_EVENT, (data) => {
  console.log('Player entered:', data.username);

  // handle agent response for player entering a zone (eg: award player with an NFT or a Superfluid stream)
  agent.promptSuperfluidStream(data.username, data.walletAddress);
});

registerEventAction(PLAYER_EXIT_EVENT, (data) => {
  console.log('Player exited:', data.username);

  // handle agent response for player exiting a zone (eg: stop a Superfluid stream)
});
```

4. Parse incoming game messages
You can parse game messages (either world ticks or events) using tryParseWorldMessage:
```ts
const messageFromGame = {
  text: 'WORLD_TICK',
  players: [{ userId: '1234', username: 'Player1' }],
};

const parseSuccessful = tryParseWorldMessage(messageFromGame); // Triggers onWorldTick callback

if (!parseSuccessful) {
    // if parse not successful, this is not a world message, and the agent can reply as they please
} else {
  agent.respond(messageFromGame);
}
```

## API
`tryParseWorldMessage(json: any): json is WorldMessage`
Parses an incoming game message and triggers the appropriate callbacks based on whether it's a `WORLD_TICK` or `WORLD_EVENT`.

Parameters:
- `json`: The incoming message (can be either a world tick or world event).
Returns:
- `true` if the message was successfully parsed and processed.
- `false` if the message does not match a valid `WORLD_TICK` or `WORLD_EVENT`.


`setOnWorldTickCallback(callback: (message: WorldTick) => void): void`
Sets a callback function that will be called whenever a `WORLD_TICK` message is received.

Parameters:
- `callback`: The function to call when a world tick message is received. It receives the parsed `WorldTick`.


`registerEventAction(eventName: EventName, callback: EventCallback): void`
Registers an action callback for a specific event.

Parameters:
- `eventName`: The name of the event to listen for (e.g., `PLAYER_ENTER`).
- `callback`: The function to call when the event is triggered. It receives the `eventData` associated with the event.

## Types
`WorldTick`
Represents a world tick message that contains player information.

```ts
{
  text: "WORLD_TICK";
  players: Player[];
}
```


`WorldEvent`
Represents a world event message. There are different types of events, such as `PLAYER_ENTER`, `PLAYER_EXIT`, and `PLAYER_WON`.  You can also specify a custom event and eventData.

```ts
{
  text: "WORLD_EVENT";
  event: EventName;
  eventData: object;
}
```


`Player`
Represents a player object with a `userId` and `username`.

```ts
{
  userId: string;
  username: string;
}
```

## Standard
The `ready-agent-one` standard supports 2 primary messages, defined as `WorldMessage`s:
- `WorldTick`
- `WorldEvent`

It boils down to defining a message and a callback to that method.  The event callback then decides if the message context is appropriate to pass to the agent.

### WorldTick
The `WorldTick` is a message sent from the game authority (usually the game server) on a specified interval to inform the agent of the current game state.  Currently it supports a list of active players, but its interface is extendible.

### WorldEvent
The `WorldEvent` message is sent whenever something noteworthy happens in game.  It contains a unique `EventName` that identifies the context of the event.  Furthermore, it contains an `eventData` object with additional context on the event.

Below are the currently supported events, with eventData contexts:
| Event    | Event Data |
| -------- | ------- |
| `PLAYER_ENTER`  |   `{ player: Player, zoneId: string }`  |
| `PLAYER_EXIT` | `{ player: Player, zoneId: string }`     |
| `PLAYER_WON`    | `{ player: Player, score: numer, game: string }`    |
| `GAME_COMPLETED_EVENT`    | `{ rank: Player[], game: string }`    |

While some events are standardized and included in this package, any event name can be manually added and configured (as long as the game supports it).

```ts
registerEventAction("CUSTOM_EVENT_NAME", OnCustomEventCallback)
```

## Testing
`npm test`

## Roadmap
- Python package
- Node/Python package for three.js and pygame game servers for easy message sending
- Extending functionality and events