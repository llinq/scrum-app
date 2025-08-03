import { RetroBoard, RetroCard, RetroColumn } from "@/types/retro";
import { useEffect, useRef } from "react";
import { io, Socket } from "socket.io-client";

interface WebSocketEvents {
  onCardCreated?: (card: RetroCard) => void;
  onCardUpdated?: (card: RetroCard) => void;
  onCardDeleted?: (cardId: string) => void;
  onCardVoted?: (cardId: string, voteCount: number) => void;
  onColumnCreated?: (column: RetroColumn) => void;
  onColumnUpdated?: (column: RetroColumn) => void;
  onColumnDeleted?: (columnId: string) => void;
  onColumnsReordered?: (columns: RetroColumn[]) => void;
  onBoardUpdated?: (board: RetroBoard) => void;
  onActiveUsersUpdated?: (userIds: string[]) => void;
}

function getAuthToken(): string | null {
  // Try to get token from cookie first
  if (typeof document !== "undefined") {
    const cookieValue = document.cookie
      .split("; ")
      .find((row) => row.startsWith("auth-token="))
      ?.split("=")[1];

    if (cookieValue) {
      return cookieValue;
    }
  }

  // Fallback to localStorage
  if (typeof window !== "undefined") {
    return localStorage.getItem("auth-token");
  }

  return null;
}

export function useRetroWebSocket(
  boardId: string | null,
  events: WebSocketEvents = {}
) {
  const socketRef = useRef<Socket | null>(null);
  const eventsRef = useRef(events);
  const currentBoardIdRef = useRef<string | null>(null);

  // Always keep the latest events
  eventsRef.current = events;

  useEffect(() => {
    // Skip if no boardId or if we're already connected to this board
    if (!boardId || currentBoardIdRef.current === boardId) {
      console.log(
        "Skipping connection - no boardId or already connected to this board"
      );
      return;
    }

    // Cleanup previous connection if exists
    if (socketRef.current) {
      console.log("Cleaning up previous connection");
      socketRef.current.removeAllListeners();
      socketRef.current.disconnect();
      socketRef.current = null;
    }

    console.log("Initializing new WebSocket connection for board:", boardId);
    currentBoardIdRef.current = boardId;

    const token = getAuthToken();
    if (!token) {
      console.warn("No auth token found for WebSocket connection");
      return;
    }

    const apiUrl = process.env.NEXT_PUBLIC_API_URL || "http://localhost:3001";
    console.log("Connecting to WebSocket at:", `${apiUrl}/retro`);

    const socket = io(`${apiUrl}/retro`, {
      auth: {
        token,
      },
      forceNew: true, // Force a new connection for each board
      timeout: 5000, // 5 second timeout
      transports: ["websocket", "polling"],
    });

    socketRef.current = socket;

    // Event listeners
    socket.on("connect", () => {
      console.log("Connected to retro websocket for board:", boardId);
      socket.emit("join-board", { boardId });
    });

    socket.on("disconnect", (reason) => {
      console.log("Disconnected from retro websocket:", reason);
      // Reset current board if disconnected
      if (currentBoardIdRef.current === boardId) {
        currentBoardIdRef.current = null;
      }
    });

    socket.on("connect_error", (error) => {
      console.error("WebSocket connection error:", error);
      // Reset current board on connection error
      currentBoardIdRef.current = null;
    });

    socket.on("card-created", ({ card }: { card: RetroCard }) => {
      console.log("Card created event received:", card);
      eventsRef.current.onCardCreated?.(card);
    });

    socket.on("card-updated", ({ card }: { card: RetroCard }) => {
      console.log("Card updated event received:", card);
      eventsRef.current.onCardUpdated?.(card);
    });

    socket.on("card-deleted", ({ cardId }: { cardId: string }) => {
      console.log("Card deleted event received:", cardId);
      eventsRef.current.onCardDeleted?.(cardId);
    });

    socket.on(
      "card-voted",
      ({ cardId, voteCount }: { cardId: string; voteCount: number }) => {
        console.log("Card voted event received:", cardId, voteCount);
        eventsRef.current.onCardVoted?.(cardId, voteCount);
      }
    );

    socket.on("column-created", ({ column }: { column: RetroColumn }) => {
      console.log("Column created event received:", column);
      eventsRef.current.onColumnCreated?.(column);
    });

    socket.on("column-updated", ({ column }: { column: RetroColumn }) => {
      console.log("Column updated event received:", column);
      eventsRef.current.onColumnUpdated?.(column);
    });

    socket.on("column-deleted", ({ columnId }: { columnId: string }) => {
      console.log("Column deleted event received:", columnId);
      eventsRef.current.onColumnDeleted?.(columnId);
    });

    socket.on(
      "columns-reordered",
      ({ columns }: { columns: RetroColumn[] }) => {
        console.log("Columns reordered event received:", columns);
        eventsRef.current.onColumnsReordered?.(columns);
      }
    );

    socket.on("board-updated", ({ board }: { board: RetroBoard }) => {
      console.log("Board updated event received:", board);
      eventsRef.current.onBoardUpdated?.(board);
    });

    socket.on("active-users-updated", ({ userIds }: { userIds: string[] }) => {
      console.log("Active users updated event received:", userIds);
      eventsRef.current.onActiveUsersUpdated?.(userIds);
    });

    return () => {
      console.log("WebSocket cleanup initiated for board:", boardId);
      if (socketRef.current && currentBoardIdRef.current === boardId) {
        console.log("Disconnecting WebSocket...");
        socketRef.current.removeAllListeners();
        socketRef.current.emit("leave-board", { boardId });
        socketRef.current.disconnect();
        socketRef.current = null;
        currentBoardIdRef.current = null;
        console.log("WebSocket connection closed");
      } else {
        console.log("WebSocket cleanup skipped - not current board connection");
      }
    };
  }, [boardId]); // Only depend on boardId

  return {
    socket: socketRef.current,
    isConnected: socketRef.current?.connected || false,
  };
}
