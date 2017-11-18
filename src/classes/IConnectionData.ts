import { Connection } from "amqplib";
import { IAddConnectionConfiguration } from "../interfaces/IAddConnectionConfiguration";

export interface IConnectionData {
    connection: Connection;
    config: IAddConnectionConfiguration;
    isOpen: boolean;
}
