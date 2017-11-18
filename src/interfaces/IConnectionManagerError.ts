import { IConnectionData } from "../classes/IConnectionData";
import { IChannelData } from "../classes/IChannelData";

export interface IConnectionManagerError {
    subjectData: SubjectInfo;
    errorType: ErrorType;
    error: any;
}

export enum ErrorType {
    CONN_ERROR = "Connection Error",

    CHAN_CLOSE = "Channel Closed (gracefully)",

};

export type SubjectInfo = ConnectionInfo & ChannelInfo;

export type ConnectionInfo = {
    type: "connection",
    data: IConnectionData;
};

export type ChannelInfo = {
    type: "channel",
    data: IChannelData;
};
