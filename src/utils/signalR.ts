import { IMessage } from "../models/IMessage";

const signalR = require("@microsoft/signalr");

let _signalRService: any = undefined;

export function initSignalRService(username: string): Promise<boolean> {
  return new Promise((resolve) => {
    try {
      let hub = new signalR.HubConnectionBuilder()
        .withUrl(`https://localhost:5001/chat?username=${username}`, {
          // skipNegotiation: true,
          transport: signalR.HttpTransportType.WebSockets,
        })
        .withAutomaticReconnect()
        .build();

      hub.onreconnecting((error: Error) => {
        console.error("onreconnecting", error);
        console.assert(hub.state === signalR.HubConnectionState.Reconnecting);
      });

      const restartHub = async () => {
        try {
          await hub.start();
          console.assert(hub.state === signalR.HubConnectionState.Connected);
          console.log("connected");
        } catch (err) {
          console.assert(hub.state === signalR.HubConnectionState.Disconnected);
          console.error("restart hub", err);
          setTimeout(() => restartHub(), 5000);
        }
      };

      hub.onclose(() => {
        console.assert(hub.state === signalR.HubConnectionState.Disconnected);
        console.log("connecition closed");
        restartHub();
      });

      hub.on("ReceiveChatMessage", (message: IMessage) => console.log(message));

      // const onEventSubscribers = new Map(); //contains all subscribers of onEvent

      // hub.on("onEvent", (channel: string, channelEvent: any) =>
      //   onEventSubscribers.forEach((p) => p.call(null, channel, channelEvent))
      // );

      hub
        .start()
        .then(() => {
          console.log("Connection succeeded!!!");
          resolve(true);
        })
        .catch(() => {
          resolve(false);
          console.error("Connection failed!!!");
        });
      _signalRService = hub;
    } catch (error) {
      console.error("signalR initialization", error);
      resolve(false);
    }
  });
}

export function getSignalRService() {
  return _signalRService;
}
