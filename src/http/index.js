import { generate } from 'shortid';

const mockMessages = [
    'Lorem ipsum dolor sit amet, consectetur adipiscing elit.',
    'Nullam ultricies urna id sagittis fermentum.',
    'In non nunc congue, rutrum libero eget, ornare ipsum.',
    'Maecenas accumsan nisi in mauris varius, porttitor efficitur dui cursus.',
    'Vestibulum eleifend nunc iaculis commodo consequat.',
    'In gravida dolor ac felis suscipit, ac aliquet libero porta.',
    'In eget massa id eros viverra ultricies.',
    'Cras vitae ipsum a metus lacinia ullamcorper.',
    'Quisque interdum libero id magna blandit, ut fringilla nisl dignissim.'
];

export const get = (url, callback) => {
    const timeout = 200 + parseInt( Math.random() * 500 );
    const messageId = parseInt( Math.random() * (mockMessages.length-1) );
    const mock = () => {
        // callback({
        //     message: mockMessages[messageId]
        // });
        callback(generate());
    };

    setTimeout(mock, timeout);
}