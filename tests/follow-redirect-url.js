'use strict';

const follower = require('../follow-redirect-url');
const chai = require('chai');
const expect = chai.expect;
const webserver = require('./webserver');

describe('follow-redirect-url', () => {

  before(() => {
    webserver.start();
  });

  it('should return an array with urls and status codes', () => {
    return follower.startFollowing('http://localhost:9000/3').then(visits => {
      expect(visits).to.deep.equal(expectedStatusCodesOnly);
    });
  });

  it('should cope with up to 20 (Default Limit) redirects', () => {
    return follower.startFollowing('http://localhost:9000/20').then(visits => {
      expect(visits.length).to.equal(20);
    });
  });

  it('should fail if more than 20 (Default Limit) redirects', () => {
    return follower.startFollowing('http://localhost:9000/21').then(visits => {
      expect().to.throw();
    }).catch(error => {
      expect(error).to.equal('Exceeded max redirect depth of 20');
    });
  });

  it('should cope with up to 5 (pass 5 in fn argument) redirects', () => {
    return follower.startFollowing('http://localhost:9000/5', 5).then(visits => {
      expect(visits.length).to.equal(5);
    });
  });

  it('should fail if more than 5 (pass 5 in fn argument)  redirects', () => {
    return follower.startFollowing('http://localhost:9000/6', 5).then(visits => {
      expect().to.throw();
    }).catch(error => {
      expect(error).to.equal('Exceeded max redirect depth of 5');
    });
  });

  it('should fail if status code redirect without location header', () => {
    return follower.startFollowing('http://localhost:9000/nolocation').then(visits => {
      expect(visits[0].redirect).to.equal(false);
      expect(visits[0].status).to.equal('Error: http://localhost:9000/nolocation responded with status 302 but no location header');
    });
  });

  it('should add missing http prefix in links', () => {
    return follower.startFollowing('localhost:9000/1').then(visits => {
      expect(visits[0].status).to.equal(200);
    });
  });

  it('should handle 200 + meta refresh tag', () => {
    return follower.startFollowing('localhost:9000/meta').then(visits => {
      return expect(visits).to.deep.equal(expectedWithMetaRefresh);
    });
  });

  it('should handle expected status codes only', () => {
    return follower.startFollowing('localhost:9000/3').then(visits => {
      return expect(visits).to.deep.equal(expectedStatusCodesOnly);
    });
  });

  // it('should reject invalid URLs', () => {//TODO: Do it later
  //   return follower.startFollowing('bogus://something').then(visits => {
  //     return expect(visits).to.eventually.be.rejected;
  //   });
  // });

  const expectedStatusCodesOnly = [
    {
      'redirect': true,
      'status': 302,
      'url': 'http://localhost:9000/3',
      'redirectUrl': 'http://localhost:9000/2'
    },
    {
      'redirect': true,
      'status': 302,
      'url': 'http://localhost:9000/2',
      'redirectUrl': 'http://localhost:9000/1'
    },
    {
      'redirect': false,
      'status': 200,
      'url': 'http://localhost:9000/1'
    }
  ];

  const expectedWithMetaRefresh = [
    {
      'redirect': true,
      'status': '200 + META REFRESH',
      'url': 'http://localhost:9000/meta',
      'redirectUrl': 'http://localhost:9000/1'
    },
    {
      'status': 200,
      'redirect': false,
      'url': 'http://localhost:9000/1'
    }
  ];

});