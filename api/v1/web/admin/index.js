/*
 * @file: index.js
 * @description: It's combine all customer routers.
 * @author: Sandip Vaghasiya
 */


import login from './login';
import admindetail from './admindetail';
import logout from './logout';

export default [login, admindetail, logout];

