jest.setMock('AsyncStorage', {
    getItem: jest.fn(
        _item =>
            new Promise((resolve, _reject) => {
                resolve({
                    password: 'Password',
                    username: 'Username',
                });
            }),
    ),
});
