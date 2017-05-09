import * as express from 'express';
import * as bodyParser from 'body-parser';
import { NestFactory } from 'nest.js';
import { AppModule } from './app.module';
import { ServerTerminationHandler } from './framework/server/server-termination.handler';

import * as dotnev from 'dotenv';
dotnev.config();

new ServerTerminationHandler().init();

const instance = express();
instance.use(bodyParser.urlencoded({ extended: true }));
instance.use(bodyParser.json());

const app = NestFactory.create(AppModule, instance);
app.listen(3333, () => console.log('Application is listening on port 3333'));