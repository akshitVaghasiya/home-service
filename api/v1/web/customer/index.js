/*
 * @file: index.js
 * @description: It's combine all customer routers.
 * @author: Sandip Vaghasiya
 */

import saveCustomer from './save';
import login from './login';
import list from './list';
import updatepassword from './updatepassword';
import forgotpassword from './forgotpassword';
import resetpassword from './resetpassword';


export default [saveCustomer, login, list, updatepassword, forgotpassword, resetpassword];

