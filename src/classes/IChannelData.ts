import { Channel } from "amqplib";
import { IConnectionData } from "./IConnectionData";

export interface IChannelData {
    channel: Channel;
    connectionData: IConnectionData;
    isOpen: boolean;
    isError: boolean;
    isBlocked: boolean;
}
