import {Container} from 'inversify';
import {Application} from './app';
import {DrawingRoute} from './controllers/drawing.route';
import {Server} from './server';
import {DataBaseService} from './services/database.service';
import Types from './types';
const container: Container = new Container();

container.bind(Types.Server).to(Server);
container.bind(Types.Application).to(Application);
container.bind(Types.DrawingRoute).to(DrawingRoute);
container.bind(Types.DataBaseService).to(DataBaseService);

export {container};
