import axios from 'axios';

export default axios.create({
    baseURL: 'http://localhost:4000/',

});


// headers: {
//     Authorization: `Bearer ${localStorage.getItem('token')}`,
//         'Content-Type': 'application/json',
//   },