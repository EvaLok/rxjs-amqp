import { Connection, connect, Channel } from "amqplib";
import { IAddConnectionConfiguration } from "../interfaces/IAddConnectionConfiguration";
import { IConnectionData } from "./IConnectionData";
import { IChannelData } from "./IChannelData";
import { Subject } from "rxjs/Subject";
import {
    EventType,
    IConnectionManagerEvent
} from "../interfaces/IConnectionManagerEvent";

export class ConnectionManager {
    private connections: Map<string, IConnectionData> = new Map();
    private channels: Map<string, IChannelData> = new Map();

    private events: Subject<IConnectionManagerEvent> = new Subject();

    public async addConnection(
        alias: string,
        config: IAddConnectionConfiguration
    )
        : Promise<void>
    {
        // workaround for old typings (must provide url param)
        const url = `${config.protocol}://${config.hostname}`;

        const connection: Connection = await connect(url, config);
        const connectionData = {
            connection: connection,
            config: config,
            isOpen: true
        };
        this.addConnectionListeners(connectionData);
        this.connections.set(alias, connectionData);


        const channel: Channel = await connection.createChannel();
        const channelData = {
            channel: channel,
            connectionData: connectionData,
            isOpen: true,
            isError: false,
            isBlocked: false
        };
        this.addChannelListeners(channelData);
        this.channels.set(alias, channelData);
    }

    public getConnectionData( alias: string ): IConnectionData {
        if( ! this.connections.has(alias) ) {
            throw new Error(`connection of alias [${alias}] does not exist`);
        }

        return this.connections.get(alias);
    }

    public getChannelData( alias: string ): IChannelData {
        if( ! this.channels.has(alias) ) {
            throw new Error(`channel of alias [${alias}] does not exist`);
        }

        return this.channels.get(alias);
    }

    public getSubscription(): Subject<IConnectionManagerEvent> {
        return this.events;
    }

    private addConnectionListeners( connData: IConnectionData ): void {
        const connection = connData.connection;

        connection.on("error", ( err: any ) => {
            this.events.next({
                eventType: EventType.CONN_ERROR,
                subjectInfo: {
                    type: "connection",
                    data: connData
                },
                error: err
            });

            connData.isOpen = false;
        })
    }

    private addChannelListeners( chanData: IChannelData ): void {
        const channel = chanData.channel;

        channel.on("close", () => {
            chanData.isOpen = false;

            this.events.next({
                eventType: EventType.CHAN_CLOSE,
                subjectInfo: {
                    type: "channel",
                    data: chanData
                }
            });
        });

        channel.on("error", (err) => {
            chanData.isOpen = false;
            chanData.isError = true;

            this.events.next({
                eventType: EventType.CHAN_ERROR,
                subjectInfo: {
                    type: "channel",
                    data: chanData
                },
                error: err
            });
        });

        channel.on("blocked", () => {
            chanData.isBlocked = true;

            this.events.next({
                eventType: EventType.CHAN_BLOCKED,
                subjectInfo: {
                    type: "channel",
                    data: chanData
                },
            });
        });

        channel.on("unblocked", () => {
            chanData.isBlocked = false;

            this.events.next({
                eventType: EventType.CHAN_UNBLOCKED,
                subjectInfo: {
                    type: "channel",
                    data: chanData
                },
            });
        });
    }
}
