/*
 * @file: index.js
 * @description: It's combine all customer routers.
 * @author: Sandip Vaghasiya
 */


import login from './login';
import workerdetail from './workerdetail';
import logout from './logout';
import add from './save';
import addevent from './addevent';
import getevent from './getevent';
import getsingleevent from './getsingleevent';
import deleteevent from './deleteevent';
import updateevent from './updateevent';

export default [login, workerdetail, logout, add, addevent, getevent, getsingleevent, deleteevent, updateevent];

