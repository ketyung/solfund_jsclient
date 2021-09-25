import 'antd/dist/antd.css';
import { message } from 'antd';
import './css/Mesg.css';

export const success = (text : string, duration : number = 3 ) => {
    message.success({
        content: text,
        className: 'successDiv',
        style: {
        marginTop: '20vh',
        },
    }, duration);
};



export const error = ( text : string, duration : number = 3) => {
    message.error({
        content: text,
        className: 'errorDiv',
        style: {
        marginTop: '20vh',
        },
    }, duration);
};