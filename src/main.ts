import { Container } from "@freshgum/typedi";
import { DISCORD_RPC_APPLICATION_ID } from "./constants/discord-rpc-application-id.const.ts";
import { DISCORD_RPC_APPLICATION_SCOPES } from "./constants/discord-rpc-application-scopes.const.ts";
import { LISTENBRAINZ_HOST } from "./constants/listenbrainz-host.const.ts";
import { LISTENBRAINZ_POLL_INTERVAL } from "./constants/listenbrainz-poll-interval.const.ts";
import { LISTENBRAINZ_TOKEN } from "./constants/listenbrainz-token.const.ts";
import { RootService } from "./root.service.ts";
import { LogService } from "./log.service.ts";
import { DISCORD_RPC_TRANSPORT } from "./constants/discord-rpc-transport.const.ts";
import { addSecretsToContainer } from "./secrets.ts";

/** Create a new container for the app. */
const appContainer = Container.ofChild(Symbol('listenbrainz-discord'));

appContainer.setValue(DISCORD_RPC_APPLICATION_SCOPES, ['rpc', 'rpc.api', 'messages.read']);
appContainer.setValue(DISCORD_RPC_TRANSPORT, 'ipc');
appContainer.setValue(LISTENBRAINZ_HOST, 'https://api.listenbrainz.org/');
appContainer.setValue(LISTENBRAINZ_POLL_INTERVAL, 5 * 1000); // 15 seconds

addSecretsToContainer(appContainer);

const rootService = appContainer.get(RootService);
const logService = appContainer.get(LogService);

rootService.start().then(() => logService.log('Application started.'));
