const proxy = [
    {
      context: '/*',
      target: 'http://localhost:808https://hotel-bernardi-service.herokuapp.com/'
    }
  ];
  module.exports = proxy;