import { Connection, connect, Channel } from "amqplib";
import { IAddConnectionConfiguration } from "../interfaces/IAddConnectionConfiguration";
import { IConnectionData } from "./IConnectionData";
import { IChannelData } from "./IChannelData";
import { Subject } from "rxjs/Subject";
import {
    ErrorType,
    IConnectionManagerError
} from "../interfaces/IConnectionManagerError";

export class ConnectionManager {
    private connections: Map<string, IConnectionData> = new Map();
    private channels: Map<string, IChannelData> = new Map();

    private errors: Subject<IConnectionManagerError> = new Subject();

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
        this.channels.set(alias, {
            channel: channel,
            connectionData: connectionData,
            isOpen: true,
            isError: false,
            isBlocked: false
        });
    }

    private addConnectionListeners( connData: IConnectionData ): void {
        const connection = connData.connection;

        connection.on("error", function( err: any ) {
            this.errors.next({
                errorType: ErrorType.CONN_ERROR,
                subjectData: connData,
                error: err
            });

            connData.isOpen = false;
        })
    }

    private addChannelListenesr( chanData: IChannelData ): void {
        const channel = chanData.channel;

        channel.on("close", function(){
            // @todo:  not sure this is really an error, maybe go somewhere else?
            this.errors.next({
                subjectType: ErrorType.CHAN_CLOSE,
                subjectData: chanData,
                error: ErrorType.CHAN_CLOSE
            })
        });
    }
}
