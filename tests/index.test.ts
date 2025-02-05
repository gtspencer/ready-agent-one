import { 
    tryParseWorldMessage, 
    setOnWorldTickCallback, 
    registerEventAction 
  } from "../src/index";
  import { PLAYER_ENTER_EVENT, PLAYER_EXIT_EVENT, PLAYER_WON_EVENT } from "../src/types/shared-types";
  
  describe("tryParseWorldMessage", () => {
    test("should correctly identify and process a WorldTick", () => {
      const mockCallback = jest.fn();
  
      setOnWorldTickCallback(mockCallback);
  
      const tickMessage = {
        text: "WORLD_TICK",
        players: [{ userId: "1234-1234-1234-1234", username: "Player1" }],
      };
  
      const result = tryParseWorldMessage(tickMessage);
  
      expect(result).toBe(true);
      expect(mockCallback).toHaveBeenCalledWith(tickMessage);
    });
  
    test("should correctly identify and process a WorldEvent message", () => {
      const mockEventCallback = jest.fn();
  
      registerEventAction(PLAYER_ENTER_EVENT, mockEventCallback);
  
      const eventMessage = {
        text: "WORLD_EVENT",
        event: PLAYER_ENTER_EVENT,
        eventData: { userId: "5678-5678-5678-5678", username: "NewPlayer" },
      };
  
      const result = tryParseWorldMessage(eventMessage);
  
      expect(result).toBe(true);
      expect(mockEventCallback).toHaveBeenCalledWith(eventMessage.eventData);
    });

    test("should correctly identify and process a custom WorldEvent message", () => {
        const mockEventCallback = jest.fn();
    
        registerEventAction("CUSTOM_EVENT", mockEventCallback);
    
        const eventMessage = {
          text: "WORLD_EVENT",
          event: "CUSTOM_EVENT",
          eventData: { userId: "5678-5678-5678-5678", username: "NewPlayer" },
        };
    
        const result = tryParseWorldMessage(eventMessage);
    
        expect(result).toBe(true);
        expect(mockEventCallback).toHaveBeenCalledWith(eventMessage.eventData);
      });
  
    test("should return false for invalid message structures", () => {
      const invalidMessages = [
        { text: "INVALID_MESSAGE" },
        { text: "WORLD_TICK", players: "not an array" },
        { text: "WORLD_EVENT", event: "UNKNOWN_EVENT", eventData: {} },
      ];
  
      invalidMessages.forEach((msg) => {
        expect(tryParseWorldMessage(msg)).toBe(false);
      });
    });
  
    test("should not call event callbacks for unregistered events", () => {
      const mockCallback = jest.fn();
  
      const unregisteredEventMessage = {
        text: "WORLD_EVENT",
        event: PLAYER_WON_EVENT,
        eventData: { userId: "9999-9999-9999-9999", username: "Champion" },
      };
  
      const result = tryParseWorldMessage(unregisteredEventMessage);
  
      expect(result).toBe(true);
      expect(mockCallback).not.toHaveBeenCalled(); // No callback should have been triggered
    });
  });
  