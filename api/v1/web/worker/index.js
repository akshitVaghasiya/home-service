/*
 * @file: index.js
 * @description: It's combine all customer routers.
 * @author: Sandip Vaghasiya
 */


import login from './login';
import logout from './logout';
import add from './save';
import addevent from './addevent';
import getevent from './getevent';
import getsingleevent from './getsingleevent';
import deleteevent from './deleteevent';
import updateevent from './updateevent';
import updateworker from './updateworker';
import list from './list';
import single from './single';
import getrequest from './getrequest';
import updaterequest from './updaterequest';

export default [login, logout, add, addevent, getevent, getsingleevent, deleteevent, updateevent, updateworker, single, list, getrequest, updaterequest,];

