import { IConnectionData } from "../classes/IConnectionData";
import { IChannelData } from "../classes/IChannelData";

export interface IConnectionManagerEvent {
    subjectInfo: SubjectInfo;
    eventType: EventType;
    error ?: any;
}

export enum EventType {
    CONN_ERROR = "Connection Error",

    CHAN_CLOSE = "Channel Closed (gracefully)",
    CHAN_ERROR = "Channel Error",
    CHAN_BLOCKED = "Channel Blocked",
    CHAN_UNBLOCKED = "Channel Unblocked",
};

export type SubjectInfo = ConnectionInfo | ChannelInfo;

export type ConnectionInfo = {
    type: "connection";
    data: IConnectionData;
};

export type ChannelInfo = {
    type: "channel";
    data: IChannelData;
};
