import { assert as Assert } from "chai";
import {} from "mocha";
import {} from "node";
import * as sinon from "sinon";
import { ConnectionManager } from "../../src/classes/ConnectionManager";
import { IConnectionManagerEvent } from "../../src/interfaces/IConnectionManagerEvent";

describe(`ConnectionManager`, function(){
    describe(`addConnection`, function(){
        it(`should init connection and create channel based on supplied config`, async function(){
            const sut = new ConnectionManager();

            await sut.addConnection("test", {
                protocol: "amqp",
                hostname: "localhost"
            });

            const connData = sut.getConnectionData("test");
            Assert.isObject(connData.connection);
            Assert.equal(connData.isOpen, true);
            Assert.equal(connData.config.protocol, "amqp");
            Assert.equal(connData.config.hostname, "localhost");


            const chanData = sut.getChannelData("test");
            Assert.isObject(chanData.channel);
            Assert.equal(chanData.isOpen, true);
            Assert.equal(chanData.isBlocked, false);
            Assert.equal(chanData.isError, false);
            Assert.isObject(chanData.connectionData);
            Assert.isObject(chanData.connectionData.connection);


            await connData.connection.close();

            return Promise.resolve();
        });
    });
});
